const mongoose = require('mongoose');

const cattleImageSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  path: {
    type: String,
    required: true
  },
  mimetype: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  detectedBreed: {
    type: String,
    default: null
  },
  confidence: {
    type: Number,
    default: null
  },
  detectionResponse: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },
  uploadedBy: {
    type: String,
    default: 'anonymous'
  },
  flwDataId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FLWData',
    default: null
  }
}, {
  timestamps: true
});

// Index for faster queries
cattleImageSchema.index({ detectedBreed: 1 });
cattleImageSchema.index({ createdAt: -1 });

module.exports = mongoose.model('CattleImage', cattleImageSchema);
