const express = require('express');
const {
  createReport,
  analyzeReport,
  getMyReports,
  getReportById,
  deleteReport
} = require('../controllers/reportController');
const { createReportValidation } = require('../validations/reportValidation');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

// Apply auth middleware to protect all routes in this file
router.use(protect);

// Create scam report (handles optional file evidence upload) & Fetch current user's history
router.post('/', upload.single('evidence'), createReportValidation, createReport);
router.get('/my', getMyReports);

// Get single details, Analyze & Delete (IDOR checked internally in controllers)
router.get('/:id', getReportById);
router.post('/:id/analyze', analyzeReport);
router.delete('/:id', deleteReport);

module.exports = router;
