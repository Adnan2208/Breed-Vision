// Mock data for Cattle Breed Recognition System

// Breed data with complete information
export const breeds = [
    {
        id: 'gir',
        name: 'Gir',
        origin: 'Gujarat, India',
        image: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=400&h=300&fit=crop',
        description: 'Famous dairy breed with high milk yield and heat tolerance',
        milkYield: '12-15 liters/day',
        purpose: 'Dairy',
        characteristics: [
            'Distinctive domed forehead',
            'Long pendulous ears',
            'High heat tolerance',
            'Disease resistant'
        ],
        adaptability: 'Tropical & Sub-tropical',
        color: 'Red with white spots'
    },
    {
        id: 'sahiwal',
        name: 'Sahiwal',
        origin: 'Punjab, India/Pakistan',
        image: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=400&h=300&fit=crop',
        description: 'Best indigenous dairy breed with excellent milk production',
        milkYield: '10-16 liters/day',
        purpose: 'Dairy',
        characteristics: [
            'Reddish-brown color',
            'Loose skin',
            'Excellent heat tolerance',
            'Good temperament'
        ],
        adaptability: 'Hot & Humid',
        color: 'Reddish brown'
    },
    {
        id: 'red_sindhi',
        name: 'Red Sindhi',
        origin: 'Sindh Region',
        image: 'https://images.unsplash.com/photo-1527153857715-3908f2bae5e8?w=400&h=300&fit=crop',
        description: 'Hardy breed adapted to harsh climatic conditions',
        milkYield: '8-12 liters/day',
        purpose: 'Dairy',
        characteristics: [
            'Deep red color',
            'Strong constitution',
            'High disease resistance',
            'Low maintenance'
        ],
        adaptability: 'Arid & Semi-arid',
        color: 'Deep red'
    },
    {
        id: 'tharparkar',
        name: 'Tharparkar',
        origin: 'Rajasthan, India',
        image: 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?w=400&h=300&fit=crop',
        description: 'Dual-purpose breed excellent for desert conditions',
        milkYield: '8-10 liters/day',
        purpose: 'Dual Purpose',
        characteristics: [
            'White/gray color',
            'Drought resistant',
            'Can survive on less water',
            'Good for arid zones'
        ],
        adaptability: 'Desert Climate',
        color: 'White to gray'
    },
    {
        id: 'kankrej',
        name: 'Kankrej',
        origin: 'Gujarat & Rajasthan',
        image: 'https://images.unsplash.com/photo-1595368593711-ee1f6b55b5f4?w=400&h=300&fit=crop',
        description: 'Largest Indian cattle breed, excellent for draft work',
        milkYield: '6-10 liters/day',
        purpose: 'Dual Purpose',
        characteristics: [
            'Large body size',
            'Long horns',
            'Strong and hardy',
            'Good for plowing'
        ],
        adaptability: 'All Climates',
        color: 'Silver-gray to iron-gray'
    },
    {
        id: 'ongole',
        name: 'Ongole',
        origin: 'Andhra Pradesh',
        image: 'https://images.unsplash.com/photo-1564466809058-bf4114d55352?w=400&h=300&fit=crop',
        description: 'Powerful draft breed with strong immunity',
        milkYield: '5-8 liters/day',
        purpose: 'Draft',
        characteristics: [
            'Muscular body',
            'Short horns',
            'Very strong immunity',
            'Excellent for agriculture'
        ],
        adaptability: 'Tropical',
        color: 'White'
    },
    {
        id: 'hariana',
        name: 'Hariana',
        origin: 'Haryana, India',
        image: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=400&h=300&fit=crop',
        description: 'Popular dual-purpose breed in Northern India',
        milkYield: '8-12 liters/day',
        purpose: 'Dual Purpose',
        characteristics: [
            'White color',
            'Good milk producer',
            'Suitable for draft work',
            'Well adapted to North India'
        ],
        adaptability: 'North Indian Climate',
        color: 'White'
    },
    {
        id: 'holstein_friesian',
        name: 'Holstein Friesian',
        origin: 'Netherlands/Germany',
        image: 'https://images.unsplash.com/photo-1527153857715-3908f2bae5e8?w=400&h=300&fit=crop',
        description: 'Highest milk producing breed in the world',
        milkYield: '25-40 liters/day',
        purpose: 'Dairy',
        characteristics: [
            'Black and white patches',
            'Very high milk yield',
            'Requires good management',
            'Needs climate control in tropics'
        ],
        adaptability: 'Temperate (needs AC in tropics)',
        color: 'Black and white'
    },
    {
        id: 'jersey',
        name: 'Jersey',
        origin: 'Jersey Island, UK',
        image: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=400&h=300&fit=crop',
        description: 'High butterfat content milk producer',
        milkYield: '15-25 liters/day',
        purpose: 'Dairy',
        characteristics: [
            'Small to medium size',
            'Fawn color',
            'High fat milk',
            'Good adaptability'
        ],
        adaptability: 'Moderate adaptability',
        color: 'Fawn to dark brown'
    },
    {
        id: 'murrah',
        name: 'Murrah Buffalo',
        origin: 'Haryana, India',
        image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop',
        description: 'Best buffalo breed for milk production',
        milkYield: '15-20 liters/day',
        purpose: 'Dairy',
        characteristics: [
            'Jet black color',
            'Curled horns',
            'High fat milk (7-8%)',
            'Needs wallowing'
        ],
        adaptability: 'North Indian Climate',
        color: 'Jet black'
    }
];

// Analytics mock data
export const analyticsData = {
    kpis: {
        totalImagesProcessed: 15420,
        mostDetectedBreed: 'Gir',
        avgConfidence: 87.5,
        modelAccuracy: 94.2
    },
    breedDistribution: [
        { breed: 'Gir', count: 4520, percentage: 29.3 },
        { breed: 'Sahiwal', count: 3210, percentage: 20.8 },
        { breed: 'Kankrej', count: 2890, percentage: 18.7 },
        { breed: 'Red Sindhi', count: 1956, percentage: 12.7 },
        { breed: 'Tharparkar', count: 1244, percentage: 8.1 },
        { breed: 'Others', count: 1600, percentage: 10.4 }
    ],
    accuracyOverTime: [
        { month: 'Jul', accuracy: 88.2 },
        { month: 'Aug', accuracy: 89.5 },
        { month: 'Sep', accuracy: 91.2 },
        { month: 'Oct', accuracy: 92.8 },
        { month: 'Nov', accuracy: 93.5 },
        { month: 'Dec', accuracy: 94.2 }
    ],
    regionalData: [
        { region: 'Gujarat', gir: 2800, sahiwal: 450, kankrej: 1200, others: 550 },
        { region: 'Punjab', gir: 320, sahiwal: 1800, kankrej: 280, others: 600 },
        { region: 'Rajasthan', gir: 680, sahiwal: 220, kankrej: 980, others: 420 },
        { region: 'Haryana', gir: 420, sahiwal: 540, kankrej: 320, others: 720 },
        { region: 'Maharashtra', gir: 300, sahiwal: 200, kankrej: 110, others: 380 }
    ],
    monthlyDetections: [
        { month: 'Jul', detections: 1850 },
        { month: 'Aug', detections: 2120 },
        { month: 'Sep', detections: 2450 },
        { month: 'Oct', detections: 2890 },
        { month: 'Nov', detections: 3210 },
        { month: 'Dec', detections: 2900 }
    ]
};

// Authority dashboard mock data
export const authorityData = {
    summary: {
        totalFLWRecords: 15420,
        totalDetections: 8756,
        totalHospitals: 342,
        activeFLWs: 234
    },
    recentActivity: [
        { id: 1, flwName: 'Ramesh Kumar', village: 'Vadodara', breed: 'Gir', date: '2026-01-10' },
        { id: 2, flwName: 'Suresh Patel', village: 'Ahmedabad', breed: 'Kankrej', date: '2026-01-10' },
        { id: 3, flwName: 'Mahesh Singh', village: 'Jaipur', breed: 'Tharparkar', date: '2026-01-09' },
        { id: 4, flwName: 'Dinesh Rao', village: 'Ludhiana', breed: 'Sahiwal', date: '2026-01-09' },
        { id: 5, flwName: 'Prakash Sharma', village: 'Hisar', breed: 'Hariana', date: '2026-01-08' }
    ],
    diseaseReports: [
        { disease: 'Mastitis', count: 1245, trend: 'down' },
        { disease: 'FMD', count: 567, trend: 'stable' },
        { disease: 'Theileriosis', count: 342, trend: 'up' },
        { disease: 'HS', count: 198, trend: 'down' }
    ],
    vaccinationCoverage: {
        fmd: 83.5,
        hs: 72.8,
        bq: 64.1
    }
};

// Detection simulation results
export const mockDetectionResults = [
    {
        breed: 'Gir',
        confidence: 0.94,
        allPredictions: [
            { breed: 'Gir', confidence: 0.94 },
            { breed: 'Sahiwal', confidence: 0.03 },
            { breed: 'Red Sindhi', confidence: 0.02 },
            { breed: 'Kankrej', confidence: 0.01 }
        ]
    },
    {
        breed: 'Sahiwal',
        confidence: 0.89,
        allPredictions: [
            { breed: 'Sahiwal', confidence: 0.89 },
            { breed: 'Red Sindhi', confidence: 0.06 },
            { breed: 'Gir', confidence: 0.03 },
            { breed: 'Crossbreed', confidence: 0.02 }
        ]
    },
    {
        breed: 'Kankrej',
        confidence: 0.91,
        allPredictions: [
            { breed: 'Kankrej', confidence: 0.91 },
            { breed: 'Tharparkar', confidence: 0.05 },
            { breed: 'Ongole', confidence: 0.03 },
            { breed: 'Hariana', confidence: 0.01 }
        ]
    }
];
