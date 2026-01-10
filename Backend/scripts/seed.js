/**
 * Database Seeder Script
 * Seeds initial data for Veterinary Hospitals and Admin User
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

// Load env vars
dotenv.config();

// Import models
const User = require('../models/User.model');
const VeterinaryHospital = require('../models/VeterinaryHospital.model');

// Connect to database
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bharat-pashudhan');

// Sample Admin User
const adminUser = {
  username: 'admin',
  email: 'admin@bharatpashudhan.gov.in',
  password: 'Admin@123',
  role: 'admin',
  department: 'Animal Husbandry',
  state: 'Delhi',
  district: 'New Delhi',
  isActive: true,
};

// Sample Government User
const govtUser = {
  username: 'govt_officer',
  email: 'officer@bharatpashudhan.gov.in',
  password: 'Govt@123',
  role: 'government',
  department: 'Department of Animal Husbandry',
  state: 'Gujarat',
  district: 'Ahmedabad',
  isActive: true,
};

// Sample FLW User
const flwUser = {
  username: 'flw_worker_001',
  email: 'flw001@bharatpashudhan.gov.in',
  password: 'Flw@123',
  role: 'flw',
  department: 'Field Operations',
  state: 'Gujarat',
  district: 'Vadodara',
  isActive: true,
};

// Sample Veterinary Hospitals
const veterinaryHospitals = [
  {
    name: 'District Veterinary Hospital Ahmedabad',
    type: 'government',
    address: {
      street: 'Civil Hospital Road, Asarwa',
      village: 'Asarwa',
      district: 'Ahmedabad',
      state: 'Gujarat',
      pincode: '380016',
    },
    location: {
      type: 'Point',
      coordinates: [72.5714, 23.0225],
    },
    contact: {
      phone: ['079-25507890', '079-25507891'],
      email: 'dvh.ahmedabad@gujarat.gov.in',
    },
    services: ['General Treatment', 'Surgery', 'Vaccination', 'AI Services', 'Laboratory'],
    timings: {
      weekdays: '9:00 AM - 5:00 PM',
      weekends: '9:00 AM - 1:00 PM',
      emergencyAvailable: true,
    },
    facilities: ['X-Ray', 'Ultrasound', 'Operation Theatre', 'Pharmacy'],
    incharge: {
      name: 'Dr. Rajesh Patel',
      designation: 'Chief Veterinary Officer',
      contact: '9876543210',
    },
    isActive: true,
  },
  {
    name: 'Veterinary Polyclinic Vadodara',
    type: 'government',
    address: {
      street: 'Sayajigunj',
      village: 'Sayajigunj',
      district: 'Vadodara',
      state: 'Gujarat',
      pincode: '390005',
    },
    location: {
      type: 'Point',
      coordinates: [73.1812, 22.3072],
    },
    contact: {
      phone: ['0265-2421234'],
      email: 'vpc.vadodara@gujarat.gov.in',
    },
    services: ['General Treatment', 'Vaccination', 'Deworming', 'First Aid'],
    timings: {
      weekdays: '10:00 AM - 4:00 PM',
      weekends: 'Closed',
      emergencyAvailable: false,
    },
    facilities: ['Examination Room', 'Pharmacy'],
    incharge: {
      name: 'Dr. Meena Shah',
      designation: 'Veterinary Officer',
      contact: '9876543211',
    },
    isActive: true,
  },
  {
    name: 'District Veterinary Hospital Rajkot',
    type: 'government',
    address: {
      street: 'Kalavad Road',
      village: 'Rajkot City',
      district: 'Rajkot',
      state: 'Gujarat',
      pincode: '360005',
    },
    location: {
      type: 'Point',
      coordinates: [70.8022, 22.3039],
    },
    contact: {
      phone: ['0281-2451234', '0281-2451235'],
      email: 'dvh.rajkot@gujarat.gov.in',
    },
    services: ['General Treatment', 'Surgery', 'Vaccination', 'AI Services', 'Laboratory', 'Mobile Veterinary Unit'],
    timings: {
      weekdays: '9:00 AM - 5:00 PM',
      weekends: '9:00 AM - 12:00 PM',
      emergencyAvailable: true,
    },
    facilities: ['X-Ray', 'Ultrasound', 'Operation Theatre', 'Pharmacy', 'Ambulance'],
    incharge: {
      name: 'Dr. Kishore Jadeja',
      designation: 'Chief Veterinary Officer',
      contact: '9876543212',
    },
    isActive: true,
  },
  {
    name: 'State Veterinary Hospital Jaipur',
    type: 'government',
    address: {
      street: 'Tonk Road',
      village: 'Lalkothi',
      district: 'Jaipur',
      state: 'Rajasthan',
      pincode: '302015',
    },
    location: {
      type: 'Point',
      coordinates: [75.7873, 26.9124],
    },
    contact: {
      phone: ['0141-2740100', '0141-2740101'],
      email: 'svh.jaipur@rajasthan.gov.in',
    },
    services: ['General Treatment', 'Surgery', 'Vaccination', 'AI Services', 'Laboratory', 'Research'],
    timings: {
      weekdays: '9:00 AM - 6:00 PM',
      weekends: '9:00 AM - 2:00 PM',
      emergencyAvailable: true,
    },
    facilities: ['X-Ray', 'Ultrasound', 'CT Scan', 'Operation Theatre', 'ICU', 'Pharmacy', 'Ambulance'],
    incharge: {
      name: 'Dr. Vikram Singh',
      designation: 'Director',
      contact: '9876543213',
    },
    isActive: true,
  },
  {
    name: 'District Veterinary Hospital Jodhpur',
    type: 'government',
    address: {
      street: 'Residency Road',
      village: 'Jodhpur City',
      district: 'Jodhpur',
      state: 'Rajasthan',
      pincode: '342001',
    },
    location: {
      type: 'Point',
      coordinates: [73.0243, 26.2389],
    },
    contact: {
      phone: ['0291-2650123'],
      email: 'dvh.jodhpur@rajasthan.gov.in',
    },
    services: ['General Treatment', 'Vaccination', 'AI Services', 'Deworming'],
    timings: {
      weekdays: '9:00 AM - 5:00 PM',
      weekends: 'Closed',
      emergencyAvailable: false,
    },
    facilities: ['Examination Room', 'Pharmacy'],
    incharge: {
      name: 'Dr. Hari Om Sharma',
      designation: 'Veterinary Officer',
      contact: '9876543214',
    },
    isActive: true,
  },
  {
    name: 'Maharashtra State Veterinary Hospital Mumbai',
    type: 'government',
    address: {
      street: 'Dr. E. Moses Road, Worli',
      village: 'Worli',
      district: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400018',
    },
    location: {
      type: 'Point',
      coordinates: [72.8179, 19.0144],
    },
    contact: {
      phone: ['022-24930100', '022-24930101'],
      email: 'svh.mumbai@maharashtra.gov.in',
    },
    services: ['General Treatment', 'Surgery', 'Vaccination', 'AI Services', 'Laboratory', 'Pet Care'],
    timings: {
      weekdays: '9:00 AM - 7:00 PM',
      weekends: '9:00 AM - 4:00 PM',
      emergencyAvailable: true,
    },
    facilities: ['X-Ray', 'Ultrasound', 'MRI', 'Operation Theatre', 'ICU', 'Pharmacy', 'Ambulance'],
    incharge: {
      name: 'Dr. Priya Deshmukh',
      designation: 'Chief Veterinary Officer',
      contact: '9876543215',
    },
    isActive: true,
  },
  {
    name: 'District Veterinary Hospital Pune',
    type: 'government',
    address: {
      street: 'Shivajinagar',
      village: 'Shivajinagar',
      district: 'Pune',
      state: 'Maharashtra',
      pincode: '411005',
    },
    location: {
      type: 'Point',
      coordinates: [73.8567, 18.5204],
    },
    contact: {
      phone: ['020-25512345'],
      email: 'dvh.pune@maharashtra.gov.in',
    },
    services: ['General Treatment', 'Vaccination', 'AI Services', 'Laboratory'],
    timings: {
      weekdays: '9:00 AM - 5:00 PM',
      weekends: '9:00 AM - 1:00 PM',
      emergencyAvailable: true,
    },
    facilities: ['X-Ray', 'Ultrasound', 'Operation Theatre', 'Pharmacy'],
    incharge: {
      name: 'Dr. Ashok Kulkarni',
      designation: 'Veterinary Officer',
      contact: '9876543216',
    },
    isActive: true,
  },
  {
    name: 'Tamil Nadu Veterinary University Hospital Chennai',
    type: 'government',
    address: {
      street: 'Vepery High Road',
      village: 'Vepery',
      district: 'Chennai',
      state: 'Tamil Nadu',
      pincode: '600007',
    },
    location: {
      type: 'Point',
      coordinates: [80.2707, 13.0827],
    },
    contact: {
      phone: ['044-25390100', '044-25390101'],
      email: 'tanuvas.hospital@tn.gov.in',
    },
    services: ['General Treatment', 'Surgery', 'Vaccination', 'AI Services', 'Laboratory', 'Research', 'Training'],
    timings: {
      weekdays: '8:00 AM - 8:00 PM',
      weekends: '8:00 AM - 2:00 PM',
      emergencyAvailable: true,
    },
    facilities: ['X-Ray', 'Ultrasound', 'CT Scan', 'MRI', 'Operation Theatre', 'ICU', 'Pharmacy', 'Ambulance', 'Blood Bank'],
    incharge: {
      name: 'Dr. Ravi Kumar',
      designation: 'Dean',
      contact: '9876543217',
    },
    isActive: true,
  },
  {
    name: 'Karnataka Veterinary Hospital Bangalore',
    type: 'government',
    address: {
      street: 'Hebbal',
      village: 'Hebbal',
      district: 'Bangalore Urban',
      state: 'Karnataka',
      pincode: '560024',
    },
    location: {
      type: 'Point',
      coordinates: [77.5946, 13.0358],
    },
    contact: {
      phone: ['080-23415678'],
      email: 'kvh.bangalore@karnataka.gov.in',
    },
    services: ['General Treatment', 'Surgery', 'Vaccination', 'AI Services', 'Laboratory'],
    timings: {
      weekdays: '9:00 AM - 5:00 PM',
      weekends: '9:00 AM - 1:00 PM',
      emergencyAvailable: true,
    },
    facilities: ['X-Ray', 'Ultrasound', 'Operation Theatre', 'Pharmacy'],
    incharge: {
      name: 'Dr. Suresh Gowda',
      designation: 'Chief Veterinary Officer',
      contact: '9876543218',
    },
    isActive: true,
  },
  {
    name: 'Andhra Pradesh State Veterinary Hospital Vijayawada',
    type: 'government',
    address: {
      street: 'Governorpet',
      village: 'Governorpet',
      district: 'NTR',
      state: 'Andhra Pradesh',
      pincode: '520002',
    },
    location: {
      type: 'Point',
      coordinates: [80.6480, 16.5062],
    },
    contact: {
      phone: ['0866-2571234'],
      email: 'svh.vijayawada@ap.gov.in',
    },
    services: ['General Treatment', 'Vaccination', 'AI Services', 'Laboratory'],
    timings: {
      weekdays: '9:00 AM - 5:00 PM',
      weekends: 'Closed',
      emergencyAvailable: false,
    },
    facilities: ['X-Ray', 'Operation Theatre', 'Pharmacy'],
    incharge: {
      name: 'Dr. Venkat Reddy',
      designation: 'Veterinary Officer',
      contact: '9876543219',
    },
    isActive: true,
  },
];

// Seed function
const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...\n');

    // Clear existing data
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await VeterinaryHospital.deleteMany({});
    console.log('✓ Cleared existing data\n');

    // Seed users
    console.log('Seeding users...');
    const createdAdmin = await User.create(adminUser);
    console.log(`  ✓ Created admin user: ${createdAdmin.email}`);

    const createdGovt = await User.create(govtUser);
    console.log(`  ✓ Created government user: ${createdGovt.email}`);

    const createdFLW = await User.create(flwUser);
    console.log(`  ✓ Created FLW user: ${createdFLW.email}`);
    console.log('');

    // Seed veterinary hospitals
    console.log('Seeding veterinary hospitals...');
    const createdHospitals = await VeterinaryHospital.insertMany(veterinaryHospitals);
    console.log(`  ✓ Created ${createdHospitals.length} veterinary hospitals\n`);

    console.log('='.repeat(50));
    console.log('✅ Database seeding completed successfully!');
    console.log('='.repeat(50));
    console.log('\nTest Credentials:');
    console.log('-'.repeat(50));
    console.log('Admin:');
    console.log(`  Email: ${adminUser.email}`);
    console.log(`  Password: ${adminUser.password}`);
    console.log('\nGovernment Officer:');
    console.log(`  Email: ${govtUser.email}`);
    console.log(`  Password: ${govtUser.password}`);
    console.log('\nFLW Worker:');
    console.log(`  Email: ${flwUser.email}`);
    console.log(`  Password: ${flwUser.password}`);
    console.log('-'.repeat(50));

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error.message);
    process.exit(1);
  }
};

// Run seeder
seedDatabase();
