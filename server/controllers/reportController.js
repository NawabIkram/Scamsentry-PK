const ScamReport = require('../models/ScamReport');
const { uploadToCloudinary, deleteFromCloudinary } = require('../services/cloudinaryService');
const { analyzeThreat } = require('../services/aiService');
const { checkUrlSafety } = require('../services/safeBrowsingService');
const { findSimilarReports } = require('../services/vectorSearchService');

/**
 * @desc    Create a new scam report, run Safe Browsing & AI analysis
 * @route   POST /api/reports
 * @access  Private
 */
const createReport = async (req, res, next) => {
  try {
    const { title, description, reportType, textContent, url } = req.body;

    const reportData = {
      user: req.user._id,
      title,
      description,
      reportType
    };

    // Conditional payloads
    if (reportType === 'text') {
      reportData.textContent = textContent;
    } else if (reportType === 'url') {
      reportData.url = url;
    } else if (reportType === 'screenshot' || reportType === 'qr') {
      if (!req.file) {
        res.status(400);
        return next(new Error('Evidence image file upload is required for screenshot/QR reports'));
      }

      const uploadResult = await uploadToCloudinary(req.file.buffer);
      reportData.evidenceImage = {
        url: uploadResult.url,
        publicId: uploadResult.publicId
      };
    }

    // Run Google Safe Browsing URL Check if URL is present
    if (reportType === 'url' || url) {
      const safeBrowsing = await checkUrlSafety(url || reportData.url);
      reportData.safeBrowsing = safeBrowsing;
    }

    // Run AI Threat Analysis
    const aiAnalysis = await analyzeThreat(reportData);
    reportData.aiAnalysis = aiAnalysis;
    reportData.status = 'analyzed';

    const report = await ScamReport.create(reportData);

    // Check for duplicate scam pattern matches in background
    try {
      const matches = await findSimilarReports(report._id, 1);
      if (matches.length > 0 && matches[0].isDuplicateMatch) {
        report.isDuplicate = true;
        report.duplicateOf = matches[0].report._id;
        await report.save();
      }
    } catch (simErr) {
      console.error('Similarity check skipped:', simErr.message);
    }

    res.status(201).json({
      success: true,
      message: 'Report submitted and analyzed successfully',
      data: report
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get Public Community Threat Feed (Unauthenticated/Public)
 * @route   GET /api/reports/public
 * @access  Public
 */
const getPublicReports = async (req, res, next) => {
  try {
    const { search, type, riskLevel, limit = 20 } = req.query;
    const query = {};

    if (type) {
      query.reportType = type;
    }

    if (riskLevel) {
      query['aiAnalysis.riskLevel'] = riskLevel;
    }

    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { textContent: searchRegex },
        { url: searchRegex },
        { 'aiAnalysis.tactics': searchRegex },
        { 'aiAnalysis.indicatorsOfCompromise': searchRegex }
      ];
    }

    const reports = await ScamReport.find(query)
      .select('title description reportType url status aiAnalysis safeBrowsing isDuplicate createdAt')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      message: 'Public community threat feed retrieved successfully',
      data: reports
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get Similar Scam Reports for a given report
 * @route   GET /api/reports/:id/similar
 * @access  Private
 */
const getSimilarReports = async (req, res, next) => {
  try {
    const similarMatches = await findSimilarReports(req.params.id, 5);

    res.status(200).json({
      success: true,
      message: 'Similar threat reports retrieved successfully',
      data: similarMatches
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Trigger/Re-run AI threat analysis for a report
 * @route   POST /api/reports/:id/analyze
 * @access  Private
 */
const analyzeReport = async (req, res, next) => {
  try {
    const report = await ScamReport.findById(req.params.id);

    if (!report) {
      res.status(404);
      return next(new Error('Scam report not found'));
    }

    if (report.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(403);
      return next(new Error('Not authorized to analyze this report'));
    }

    // Re-check Safe Browsing if URL present
    if (report.reportType === 'url' || report.url) {
      report.safeBrowsing = await checkUrlSafety(report.url);
    }

    const aiAnalysis = await analyzeThreat(report);
    report.aiAnalysis = aiAnalysis;
    report.status = 'analyzed';
    await report.save();

    res.status(200).json({
      success: true,
      message: 'AI threat analysis completed successfully',
      data: report
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all reports submitted by the logged-in user
 * @route   GET /api/reports/my
 * @access  Private
 */
const getMyReports = async (req, res, next) => {
  try {
    const reports = await ScamReport.find({ user: req.user._id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'User reports retrieved successfully',
      data: reports
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get scam report by ID (IDOR Protected)
 * @route   GET /api/reports/:id
 * @access  Private
 */
const getReportById = async (req, res, next) => {
  try {
    let report = await ScamReport.findById(req.params.id);

    if (!report) {
      res.status(404);
      return next(new Error('Scam report not found'));
    }

    if (report.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(403);
      return next(new Error('Not authorized to access this report'));
    }

    if (!report.aiAnalysis || !report.aiAnalysis.riskScore) {
      const aiAnalysis = await analyzeThreat(report);
      report.aiAnalysis = aiAnalysis;
      report.status = 'analyzed';
      await report.save();
    }

    res.status(200).json({
      success: true,
      message: 'Report details retrieved successfully',
      data: report
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete scam report (IDOR Protected)
 * @route   DELETE /api/reports/:id
 * @access  Private
 */
const deleteReport = async (req, res, next) => {
  try {
    const report = await ScamReport.findById(req.params.id);

    if (!report) {
      res.status(404);
      return next(new Error('Scam report not found'));
    }

    if (report.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(403);
      return next(new Error('Not authorized to delete this report'));
    }

    if (
      report.evidenceImage &&
      report.evidenceImage.publicId &&
      (report.reportType === 'screenshot' || report.reportType === 'qr')
    ) {
      try {
        await deleteFromCloudinary(report.evidenceImage.publicId);
      } catch (err) {
        console.error('Failed to delete image from Cloudinary:', err.message);
      }
    }

    await ScamReport.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Report deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createReport,
  getPublicReports,
  getSimilarReports,
  analyzeReport,
  getMyReports,
  getReportById,
  deleteReport
};
