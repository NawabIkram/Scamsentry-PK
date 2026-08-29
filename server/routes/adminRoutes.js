const express = require('express');
const {
  getAdminReports,
  getAdminUsers,
  getAdminStats
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

const router = express.Router();

// Apply auth protection and restrict strictly to admin roles
router.use(protect);
router.use(authorizeRoles('admin'));

// Admin endpoints
router.get('/reports', getAdminReports);
router.get('/users', getAdminUsers);
router.get('/stats', getAdminStats);

module.exports = router;
