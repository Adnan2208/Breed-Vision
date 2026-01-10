# Bharat Pashudhan API Documentation

## Base URL
```
http://localhost:5000/api/v1
```

## Authentication

All protected routes require a Bearer token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## 1. Authentication APIs

### Register User
```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "username": "flw_worker_001",
  "email": "worker@example.com",
  "password": "password123",
  "role": "flw",
  "department": "Animal Husbandry",
  "state": "Gujarat",
  "district": "Ahmedabad"
}

Response (201):
{
  "success": true,
  "statusCode": 201,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "65abc123def456",
      "username": "flw_worker_001",
      "email": "worker@example.com",
      "role": "flw"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Login
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "worker@example.com",
  "password": "password123"
}

Response (200):
{
  "success": true,
  "statusCode": 200,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "65abc123def456",
      "username": "flw_worker_001",
      "email": "worker@example.com",
      "role": "flw",
      "lastLogin": "2026-01-10T10:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Get Profile
```http
GET /api/v1/auth/me
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "statusCode": 200,
  "message": "Profile retrieved successfully",
  "data": {
    "user": {
      "id": "65abc123def456",
      "username": "flw_worker_001",
      "email": "worker@example.com",
      "role": "flw",
      "state": "Gujarat",
      "district": "Ahmedabad"
    }
  }
}
```

---

## 2. Breed Detection APIs

### Detect Breed from Image
```http
POST /api/v1/breed/detect
Content-Type: multipart/form-data

Form Data:
- image: <cattle_image.jpg>

Response (200):
{
  "success": true,
  "statusCode": 200,
  "message": "Breed detection completed",
  "data": {
    "imageId": "65def789abc123",
    "filename": "a1b2c3d4-uuid.jpg",
    "detection": {
      "detected": true,
      "breed": "Gir",
      "confidence": 0.94,
      "allPredictions": [
        { "breed": "Gir", "confidence": 0.94 },
        { "breed": "Sahiwal", "confidence": 0.03 }
      ]
    },
    "advisory": {
      "breed": "Gir",
      "origin": "Gujarat, India",
      "milkYield": "12-15 liters per day"
    }
  }
}
```

### Get Breed Advisory
```http
GET /api/v1/breed/advisory/gir?lang=hi

Response (200):
{
  "success": true,
  "statusCode": 200,
  "message": "Advisory retrieved successfully",
  "data": {
    "breed": "Gir",
    "origin": "गुजरात, भारत",
    "feedQuantity": "25-30 किलो हरा चारा, 5-6 किलो सूखा चारा, 2-3 किलो दाना प्रतिदिन",
    "feedType": "हरा चारा (लूसर्न, बरसीम), सूखा चारा (गेहूं का भूसा, धान का पुआल)",
    "healthImmunity": "उच्च गर्मी सहनशीलता, उष्णकटिबंधीय रोगों के प्रति प्रतिरोधी",
    "diseaseRisks": ["मास्टिटिस", "खुरपका-मुंहपका", "ब्रुसेलोसिस"],
    "vaccines": [
      { "name": "एफएमडी टीका", "schedule": "हर 6 महीने" },
      { "name": "एचएस टीका", "schedule": "मानसून से पहले वार्षिक" }
    ],
    "rgmMedicines": [
      { "name": "त्रिफला चूर्ण", "use": "पाचन स्वास्थ्य" },
      { "name": "हल्दी", "use": "सूजन रोधी, घाव भरने" }
    ],
    "milkYield": "प्रतिदिन 12-15 लीटर",
    "specialCare": "नियमित ग्रूमिंग, गर्म समय में छाया प्रदान करें",
    "language": "hi"
  }
}
```

### Get All Breeds
```http
GET /api/v1/breed/list

Response (200):
{
  "success": true,
  "statusCode": 200,
  "message": "Breeds list retrieved successfully",
  "data": {
    "breeds": [
      { "id": "gir", "name": "Gir", "origin": "Gujarat, India" },
      { "id": "sahiwal", "name": "Sahiwal", "origin": "Punjab" },
      { "id": "red_sindhi", "name": "Red Sindhi", "origin": "Sindh region" },
      { "id": "tharparkar", "name": "Tharparkar", "origin": "Rajasthan" },
      { "id": "kankrej", "name": "Kankrej", "origin": "Gujarat and Rajasthan" }
    ]
  }
}
```

### Get Supported Languages
```http
GET /api/v1/breed/languages

Response (200):
{
  "success": true,
  "statusCode": 200,
  "message": "Supported languages retrieved",
  "data": {
    "languages": {
      "en": "English",
      "hi": "हिन्दी (Hindi)",
      "ta": "தமிழ் (Tamil)",
      "te": "తెలుగు (Telugu)",
      "mr": "मराठी (Marathi)",
      "gu": "ગુજરાતી (Gujarati)"
    }
  }
}
```

---

## 3. FLW Data Collection APIs

### Submit FLW Data
```http
POST /api/v1/flw/submit
Content-Type: application/json

{
  "flwId": "FLW-GJ-001",
  "flwName": "Ramesh Kumar",
  "village": "Vadodara",
  "district": "Vadodara",
  "state": "Gujarat",
  "geoLocation": {
    "latitude": 22.3072,
    "longitude": 73.1812
  },
  "farmerName": "Suresh Patel",
  "farmerContact": "9876543210",
  "cattleBreed": "Gir",
  "cattleAge": {
    "value": 4,
    "unit": "years"
  },
  "gender": "female",
  "lactationStatus": "lactating",
  "healthIssuesObserved": ["mastitis"],
  "healthNotes": "Mild swelling in udder",
  "vaccinationStatus": {
    "fmd": { "done": true, "lastDate": "2025-07-15" },
    "hs": { "done": true, "lastDate": "2025-06-01" },
    "bq": { "done": false }
  },
  "dateOfVisit": "2026-01-10",
  "cattleImageId": "65def789abc123"
}

Response (201):
{
  "success": true,
  "statusCode": 201,
  "message": "FLW data submitted successfully",
  "data": {
    "id": "65xyz987uvw654",
    "flwId": "FLW-GJ-001",
    "cattleBreed": "Gir",
    "dateOfVisit": "2026-01-10T00:00:00.000Z",
    "submittedAt": "2026-01-10T11:45:00.000Z"
  }
}
```

### Get FLW Submissions
```http
GET /api/v1/flw/submissions/FLW-GJ-001?page=1&limit=10
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "statusCode": 200,
  "message": "FLW submissions retrieved",
  "data": {
    "submissions": [...],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 45,
      "pages": 5
    }
  }
}
```

### Search FLW Data
```http
GET /api/v1/flw/search?state=Gujarat&breed=Gir&healthIssue=mastitis
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "statusCode": 200,
  "message": "Search completed",
  "data": {
    "results": [...],
    "pagination": {...}
  }
}
```

---

## 4. Veterinary Hospital APIs

### Get All Hospitals
```http
GET /api/v1/veterinary/hospitals?state=Gujarat&type=government

Response (200):
{
  "success": true,
  "statusCode": 200,
  "message": "Hospitals retrieved successfully",
  "data": {
    "hospitals": [
      {
        "_id": "65hos123pit456",
        "name": "District Veterinary Hospital Ahmedabad",
        "type": "government",
        "address": {
          "street": "Civil Hospital Road",
          "district": "Ahmedabad",
          "state": "Gujarat",
          "pincode": "380006"
        },
        "contact": {
          "phone": ["079-25507890", "079-25507891"],
          "email": "dvh.ahmedabad@gujarat.gov.in"
        },
        "timings": {
          "weekdays": "9:00 AM - 5:00 PM",
          "emergencyAvailable": true
        }
      }
    ],
    "pagination": {...}
  }
}
```

### Get Nearby Hospitals
```http
GET /api/v1/veterinary/nearby?latitude=22.3072&longitude=73.1812&radius=25

Response (200):
{
  "success": true,
  "statusCode": 200,
  "message": "Nearby hospitals retrieved",
  "data": {
    "hospitals": [
      {
        "name": "Veterinary Polyclinic Vadodara",
        "distance": 5.2,
        ...
      }
    ],
    "searchLocation": { "latitude": "22.3072", "longitude": "73.1812" },
    "searchRadius": "25 km"
  }
}
```

### Get Emergency Services
```http
GET /api/v1/veterinary/emergency?state=Gujarat

Response (200):
{
  "success": true,
  "statusCode": 200,
  "message": "Emergency services retrieved",
  "data": {
    "emergencyServices": [...],
    "helpline": "1962"
  }
}
```

---

## 5. Government Dashboard APIs (Protected)

### Get Dashboard Overview
```http
GET /api/v1/dashboard/overview?state=Gujarat&startDate=2026-01-01
Authorization: Bearer <admin_token>

Response (200):
{
  "success": true,
  "statusCode": 200,
  "message": "Dashboard overview retrieved",
  "data": {
    "summary": {
      "totalFLWRecords": 15420,
      "totalDetections": 8756,
      "totalHospitals": 342,
      "totalUsers": 567
    },
    "recentActivity": [...]
  }
}
```

### Get Breed Distribution
```http
GET /api/v1/dashboard/breed-distribution?state=Gujarat
Authorization: Bearer <admin_token>

Response (200):
{
  "success": true,
  "statusCode": 200,
  "message": "Breed distribution retrieved",
  "data": {
    "summary": {
      "totalBreeds": 12,
      "totalRecords": 15420
    },
    "distribution": [
      { "breed": "Gir", "count": 4520, "avgConfidence": 0.89 },
      { "breed": "Kankrej", "count": 3210, "avgConfidence": 0.85 },
      { "breed": "Crossbreed", "count": 2890, "avgConfidence": 0.78 }
    ],
    "byState": [...]
  }
}
```

### Get Disease Reports
```http
GET /api/v1/dashboard/disease-reports
Authorization: Bearer <admin_token>

Response (200):
{
  "success": true,
  "statusCode": 200,
  "message": "Disease reports retrieved",
  "data": {
    "diseaseFrequency": [
      { "disease": "mastitis", "count": 1245, "affectedDistrictsCount": 34 },
      { "disease": "foot_and_mouth", "count": 567, "affectedDistrictsCount": 28 }
    ],
    "diseaseByBreed": [...],
    "hotspots": [
      { "state": "Gujarat", "district": "Ahmedabad", "totalCases": 156 }
    ]
  }
}
```

### Get Vaccination Coverage
```http
GET /api/v1/dashboard/vaccination-coverage?state=Gujarat
Authorization: Bearer <admin_token>

Response (200):
{
  "success": true,
  "statusCode": 200,
  "message": "Vaccination coverage retrieved",
  "data": {
    "overall": {
      "fmd": { "total": 15420, "vaccinated": 12890, "percentage": 83.59 },
      "hs": { "total": 15420, "vaccinated": 11234, "percentage": 72.85 },
      "bq": { "total": 15420, "vaccinated": 9876, "percentage": 64.05 }
    },
    "byState": [...]
  }
}
```

### Get FLW Activity
```http
GET /api/v1/dashboard/flw-activity
Authorization: Bearer <admin_token>

Response (200):
{
  "success": true,
  "statusCode": 200,
  "message": "FLW activity retrieved",
  "data": {
    "summary": {
      "totalUniqueFLWs": 234
    },
    "topPerformers": [
      { "flwId": "FLW-GJ-001", "flwName": "Ramesh Kumar", "totalVisits": 456 }
    ],
    "dailyTrend": [
      { "date": "2026-01-10", "submissions": 45, "activeFLWs": 23 }
    ]
  }
}
```

### Export Report
```http
GET /api/v1/dashboard/export?type=breed&format=csv&state=Gujarat
Authorization: Bearer <admin_token>

Response: CSV file download
```

---

## Error Responses

### Validation Error (400)
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Validation failed",
  "errors": ["FLW ID is required", "Village is required"]
}
```

### Unauthorized (401)
```json
{
  "success": false,
  "statusCode": 401,
  "message": "Access denied. No token provided."
}
```

### Forbidden (403)
```json
{
  "success": false,
  "statusCode": 403,
  "message": "User role 'flw' is not authorized to access this route."
}
```

### Not Found (404)
```json
{
  "success": false,
  "statusCode": 404,
  "message": "Resource not found"
}
```

### Rate Limited (429)
```json
{
  "success": false,
  "statusCode": 429,
  "message": "Too many requests, please try again after 15 minutes."
}
```

### Server Error (500)
```json
{
  "success": false,
  "statusCode": 500,
  "message": "Internal Server Error"
}
```

---

## User Roles

| Role | Access Level |
|------|--------------|
| `admin` | Full access to all endpoints |
| `government` | Dashboard, FLW data, Veterinary management |
| `flw` | FLW submissions, Breed detection |
| `user` | Breed detection, Public endpoints |
