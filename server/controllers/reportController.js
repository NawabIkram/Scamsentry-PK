const ScamReport = require('../models/ScamReport');
const { uploadToCloudinary, deleteFromCloudinary } = require('../services/cloudinaryService');

/**
 * @desc    Create a new scam report
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
      // Validate that evidence image is provided
      if (!req.file) {
        res.status(400);
        return next(new Error('Evidence image file upload is required for screenshot/QR reports'));
      }

      // Stream upload to Cloudinary
      const uploadResult = await uploadToCloudinary(req.file.buffer);
      reportData.evidenceImage = {
        url: uploadResult.url,
        publicId: uploadResult.publicId
      };
    }

    const report = await ScamReport.create(reportData);

    res.status(201).json({
      success: true,
      message: 'Report submitted successfully',
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
    const report = await ScamReport.findById(req.params.id);

    if (!report) {
      res.status(404);
      return next(new Error('Scam report not found'));
    }

    // IDOR Protection: Allow access only to owner OR admin
    if (report.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(403);
      return next(new Error('Not authorized to access this report'));
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
 * @desc    Delete scam report (IDOR Protected, handles Cloudinary deletion in Stage 5)
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

    // IDOR Protection: Only the owner OR admin can delete a report
    if (report.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(403);
      return next(new Error('Not authorized to delete this report'));
    }

    // Cloudinary Image Cleanup
    if (
      report.evidenceImage &&
      report.evidenceImage.publicId &&
      (report.reportType === 'screenshot' || report.reportType === 'qr')
    ) {
      try {
        await deleteFromCloudinary(report.evidenceImage.publicId);
      } catch (err) {
        console.error('Failed to delete image from Cloudinary:', err.message);
        // We do not block database deletion if Cloudinary deletion fails
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
  getMyReports,
  getReportById,
  deleteReport
};
