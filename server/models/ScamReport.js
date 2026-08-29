const mongoose = require('mongoose');

const scamReportSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required']
    },
    title: {
      type: String,
      required: [true, 'Please add a title for this report'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters']
    },
    description: {
      type: String,
      required: [true, 'Please add a description of the scam'],
      trim: true
    },
    reportType: {
      type: String,
      enum: ['text', 'url', 'screenshot', 'qr'],
      required: [true, 'Report type is required']
    },
    textContent: {
      type: String,
      required: [
        function () {
          return this.reportType === 'text';
        },
        'Text message content is required for text reports'
      ]
    },
    url: {
      type: String,
      trim: true,
      required: [
        function () {
          return this.reportType === 'url';
        },
        'URL is required for URL reports'
      ]
    },
    evidenceImage: {
      url: {
        type: String,
        required: [
          function () {
            return this.reportType === 'screenshot' || this.reportType === 'qr';
          },
          'Evidence image URL is required for screenshot/QR reports'
        ]
      },
      publicId: {
        type: String,
        required: [
          function () {
            return this.reportType === 'screenshot' || this.reportType === 'qr';
          },
          'Cloudinary public ID is required for screenshot/QR reports'
        ]
      }
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'analyzed', 'rejected'],
      default: 'pending'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('ScamReport', scamReportSchema);
