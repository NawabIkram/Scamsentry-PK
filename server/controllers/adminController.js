const User = require('../models/User');
const ScamReport = require('../models/ScamReport');

/**
 * @desc    Get all scam reports (Admin Only)
 * @route   GET /api/admin/reports
 * @access  Private/Admin
 */
const getAdminReports = async (req, res, next) => {
  try {
    const reports = await ScamReport.find()
      .populate('user', 'name email role')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'All reports retrieved successfully',
      data: reports
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all registered users (Admin Only)
 * @route   GET /api/admin/users
 * @access  Private/Admin
 */
const getAdminUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'All users retrieved successfully',
      data: users
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get high-level dashboard stats (Admin Only)
 * @route   GET /api/admin/stats
 * @access  Private/Admin
 */
const getAdminStats = async (req, res, next) => {
  try {
    const totalReports = await ScamReport.countDocuments();
    const totalUsers = await User.countDocuments();
    
    // Status counts
    const pendingCount = await ScamReport.countDocuments({ status: 'pending' });
    const processingCount = await ScamReport.countDocuments({ status: 'processing' });
    const analyzedCount = await ScamReport.countDocuments({ status: 'analyzed' });
    const rejectedCount = await ScamReport.countDocuments({ status: 'rejected' });

    // Type counts
    const textCount = await ScamReport.countDocuments({ reportType: 'text' });
    const urlCount = await ScamReport.countDocuments({ reportType: 'url' });
    const screenshotCount = await ScamReport.countDocuments({ reportType: 'screenshot' });
    const qrCount = await ScamReport.countDocuments({ reportType: 'qr' });

    res.status(200).json({
      success: true,
      message: 'Admin stats retrieved successfully',
      data: {
        users: {
          total: totalUsers
        },
        reports: {
          total: totalReports,
          pending: pendingCount,
          processing: processingCount,
          analyzed: analyzedCount,
          rejected: rejectedCount,
          types: {
            text: textCount,
            url: urlCount,
            screenshot: screenshotCount,
            qr: qrCount
          }
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdminReports,
  getAdminUsers,
  getAdminStats
};
