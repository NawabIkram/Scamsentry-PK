const { check, validationResult } = require('express-validator');

// Validation runner helper
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((err) => ({
        field: err.path || err.param,
        message: err.msg
      }))
    });
  }
  next();
};

const createReportValidation = [
  check('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 100 })
    .withMessage('Title cannot exceed 100 characters'),
  check('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required'),
  check('reportType')
    .trim()
    .notEmpty()
    .withMessage('Report type is required')
    .isIn(['text', 'url', 'screenshot', 'qr'])
    .withMessage('Invalid report type'),

  // Conditional validators based on reportType
  check('textContent').custom((value, { req }) => {
    if (req.body.reportType === 'text' && (!value || !value.trim())) {
      throw new Error('Message text is required for text reports');
    }
    return true;
  }),

  check('url').custom((value, { req }) => {
    if (req.body.reportType === 'url') {
      if (!value || !value.trim()) {
        throw new Error('URL is required for URL reports');
      }
      // Validate URL format
      try {
        new URL(value);
      } catch (err) {
        throw new Error('Please enter a valid URL containing http:// or https://');
      }
    }
    return true;
  }),

  validate
];

module.exports = {
  createReportValidation
};
