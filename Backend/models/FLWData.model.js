const mongoose = require('mongoose');

const flwDataSchema = new mongoose.Schema({
  // FLW Information
  flwId: {
    type: String,
    required: [true, 'FLW ID is required']
  },
  flwName: {
    type: String,
    required: [true, 'FLW Name is required']
  },
  
  // Location Information
  village: {
    type: String,
    required: [true, 'Village is required']
  },
  district: {
    type: String,
    required: [true, 'District is required']
  },
  state: {
    type: String,
    required: [true, 'State is required']
  },
  geoLocation: {
    latitude: {
      type: Number,
      default: null
    },
    longitude: {
      type: Number,
      default: null
    }
  },
  
  // Farmer Information
  farmerName: {
    type: String,
    default: ''
  },
  farmerContact: {
    type: String,
    default: ''
  },
  
  // Cattle Information
  cattleBreed: {
    type: String,
    required: [true, 'Cattle breed is required']
  },
  cattleAge: {
    value: {
      type: Number,
      required: true
    },
    unit: {
      type: String,
      enum: ['months', 'years'],
      default: 'years'
    }
  },
  gender: {
    type: String,
    enum: ['male', 'female'],
    required: [true, 'Gender is required']
  },
  lactationStatus: {
    type: String,
    enum: ['lactating', 'dry', 'pregnant', 'not-applicable'],
    default: 'not-applicable'
  },
  
  // Health Information
  healthIssuesObserved: {
    type: [String],
    default: []
  },
  healthNotes: {
    type: String,
    default: ''
  },
  vaccinationStatus: {
    fmd: {
      done: { type: Boolean, default: false },
      lastDate: { type: Date, default: null }
    },
    hs: {
      done: { type: Boolean, default: false },
      lastDate: { type: Date, default: null }
    },
    bq: {
      done: { type: Boolean, default: false },
      lastDate: { type: Date, default: null }
    },
    brucella: {
      done: { type: Boolean, default: false },
      lastDate: { type: Date, default: null }
    },
    others: [{
      name: String,
      date: Date
    }]
  },
  
  // Visit Information
  dateOfVisit: {
    type: Date,
    required: [true, 'Date of visit is required'],
    default: Date.now
  },
  
  // Linked Detection
  cattleImageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CattleImage',
    default: null
  },
  breedDetectionConfidence: {
    type: Number,
    default: null
  },
  
  // Metadata
  submittedAt: {
    type: Date,
    default: Date.now
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for analytics and queries
flwDataSchema.index({ state: 1, district: 1 });
flwDataSchema.index({ cattleBreed: 1 });
flwDataSchema.index({ flwId: 1 });
flwDataSchema.index({ dateOfVisit: -1 });
flwDataSchema.index({ createdAt: -1 });

// Update lastUpdated on save
flwDataSchema.pre('save', function(next) {
  this.lastUpdated = new Date();
  next();
});

module.exports = mongoose.model('FLWData', flwDataSchema);
