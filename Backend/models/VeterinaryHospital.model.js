const mongoose = require('mongoose');

const veterinaryHospitalSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Hospital name is required']
  },
  type: {
    type: String,
    enum: ['government', 'private', 'ngo'],
    default: 'government'
  },
  address: {
    street: String,
    village: String,
    district: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    pincode: String
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  },
  contact: {
    phone: [String],
    email: String,
    website: String
  },
  services: [String],
  timings: {
    weekdays: String,
    weekends: String,
    emergencyAvailable: {
      type: Boolean,
      default: false
    }
  },
  facilities: [String],
  incharge: {
    name: String,
    designation: String,
    contact: String
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Geospatial index for location-based queries
veterinaryHospitalSchema.index({ location: '2dsphere' });
veterinaryHospitalSchema.index({ 'address.state': 1, 'address.district': 1 });

module.exports = mongoose.model('VeterinaryHospital', veterinaryHospitalSchema);
