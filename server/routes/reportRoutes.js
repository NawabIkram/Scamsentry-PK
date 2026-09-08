const express = require('express');
const {
  createReport,
  getPublicReports,
  getSimilarReports,
  analyzeReport,
  getMyReports,
  getReportById,
  deleteReport
} = require('../controllers/reportController');
const { createReportValidation } = require('../validations/reportValidation');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

// Public threat intelligence feed (No auth required)
router.get('/public', getPublicReports);

// Apply auth middleware to protect user endpoints below
router.use(protect);

// Create scam report (handles optional file evidence upload) & Fetch current user's history
router.post('/', upload.single('evidence'), createReportValidation, createReport);
router.get('/my', getMyReports);

// Get single details, Similar match, Analyze & Delete
router.get('/:id', getReportById);
router.get('/:id/similar', getSimilarReports);
router.post('/:id/analyze', analyzeReport);
router.delete('/:id', deleteReport);

module.exports = router;
