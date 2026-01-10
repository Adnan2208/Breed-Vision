// Breed-specific advisory data
const breedAdvisory = {
  // Indian Indigenous Breeds
  'gir': {
    breed: 'Gir',
    origin: 'Gujarat, India',
    feedQuantity: '25-30 kg green fodder, 5-6 kg dry fodder, 2-3 kg concentrate per day',
    feedType: 'Green fodder (Lucerne, Berseem), Dry fodder (Wheat straw, Paddy straw), Concentrate mix with minerals',
    healthImmunity: 'High heat tolerance, resistant to tropical diseases, good immunity against tick-borne diseases',
    diseaseRisks: ['Mastitis', 'Foot and Mouth Disease', 'Brucellosis', 'Hemorrhagic Septicemia'],
    vaccines: [
      { name: 'FMD Vaccine', schedule: 'Every 6 months' },
      { name: 'HS Vaccine', schedule: 'Annually before monsoon' },
      { name: 'BQ Vaccine', schedule: 'Annually' },
      { name: 'Brucella Vaccine', schedule: 'Once at 4-8 months (female calves)' }
    ],
    rgmMedicines: [
      { name: 'Triphala Churna', use: 'Digestive health' },
      { name: 'Haridra (Turmeric)', use: 'Anti-inflammatory, wound healing' },
      { name: 'Jivanti', use: 'Galactagogue for milk production' }
    ],
    milkYield: '12-15 liters per day',
    specialCare: 'Regular grooming, provide shade during hot hours, ensure clean water availability'
  },
  
  'sahiwal': {
    breed: 'Sahiwal',
    origin: 'Punjab (India/Pakistan)',
    feedQuantity: '30-35 kg green fodder, 6-7 kg dry fodder, 3-4 kg concentrate per day',
    feedType: 'Berseem, Lucerne, Maize fodder, Wheat straw with urea-molasses treatment',
    healthImmunity: 'Excellent heat tolerance, resistant to many tropical parasites',
    diseaseRisks: ['Mastitis', 'Theileriosis', 'Foot and Mouth Disease', 'Tuberculosis'],
    vaccines: [
      { name: 'FMD Vaccine', schedule: 'Every 6 months' },
      { name: 'HS Vaccine', schedule: 'Annually' },
      { name: 'Anthrax Vaccine', schedule: 'Annually in endemic areas' },
      { name: 'Theileria Vaccine', schedule: 'As per veterinary advice' }
    ],
    rgmMedicines: [
      { name: 'Shatavari', use: 'Enhances milk production' },
      { name: 'Ashwagandha', use: 'Improves immunity and strength' },
      { name: 'Methi (Fenugreek)', use: 'Galactagogue' }
    ],
    milkYield: '10-16 liters per day',
    specialCare: 'Regular milking schedule, maintain hygiene, balanced nutrition during lactation'
  },
  
  'red sindhi': {
    breed: 'Red Sindhi',
    origin: 'Sindh region',
    feedQuantity: '20-25 kg green fodder, 4-5 kg dry fodder, 2-3 kg concentrate per day',
    feedType: 'Sorghum fodder, Napier grass, Groundnut hay, Concentrate with mineral mixture',
    healthImmunity: 'High disease resistance, adapted to harsh climatic conditions',
    diseaseRisks: ['Foot and Mouth Disease', 'Black Quarter', 'Mastitis'],
    vaccines: [
      { name: 'FMD Vaccine', schedule: 'Every 6 months' },
      { name: 'BQ Vaccine', schedule: 'Annually' },
      { name: 'HS Vaccine', schedule: 'Annually before monsoon' }
    ],
    rgmMedicines: [
      { name: 'Aloe Vera', use: 'Digestive health and immunity' },
      { name: 'Neem leaves', use: 'Natural dewormer and skin health' },
      { name: 'Guduchi', use: 'Immunomodulator' }
    ],
    milkYield: '8-12 liters per day',
    specialCare: 'Suitable for semi-arid regions, minimal management required'
  },
  
  'tharparkar': {
    breed: 'Tharparkar',
    origin: 'Thar desert region (Rajasthan)',
    feedQuantity: '20-25 kg green fodder, 5-6 kg dry fodder, 2 kg concentrate per day',
    feedType: 'Desert grasses, Khejri leaves, Prosopis pods, Moth churi',
    healthImmunity: 'Excellent drought resistance, tolerant to water scarcity',
    diseaseRisks: ['FMD', 'Trypanosomiasis', 'Tick-borne diseases'],
    vaccines: [
      { name: 'FMD Vaccine', schedule: 'Every 6 months' },
      { name: 'HS Vaccine', schedule: 'Annually' },
      { name: 'Trypanosomiasis treatment', schedule: 'As needed' }
    ],
    rgmMedicines: [
      { name: 'Amla', use: 'Vitamin C supplement, immunity booster' },
      { name: 'Bael leaves', use: 'Digestive disorders' },
      { name: 'Karela', use: 'Blood purifier' }
    ],
    milkYield: '8-10 liters per day',
    specialCare: 'Can survive on less water, ideal for arid zones'
  },
  
  'kankrej': {
    breed: 'Kankrej',
    origin: 'Gujarat and Rajasthan',
    feedQuantity: '30-35 kg green fodder, 6-8 kg dry fodder, 3 kg concentrate per day',
    feedType: 'Jowar fodder, Bajra straw, Cotton seed cake, Groundnut cake',
    healthImmunity: 'Strong and hardy, good disease resistance',
    diseaseRisks: ['FMD', 'HS', 'Mastitis', 'Parasitic infections'],
    vaccines: [
      { name: 'FMD Vaccine', schedule: 'Every 6 months' },
      { name: 'HS Vaccine', schedule: 'Annually' },
      { name: 'BQ Vaccine', schedule: 'Annually' },
      { name: 'Deworming', schedule: 'Every 3-4 months' }
    ],
    rgmMedicines: [
      { name: 'Punarnava', use: 'Kidney health and diuretic' },
      { name: 'Brahmi', use: 'Stress relief' },
      { name: 'Tulsi', use: 'Respiratory health and immunity' }
    ],
    milkYield: '6-10 liters per day (dual purpose - milk and draft)',
    specialCare: 'Good for draft work, requires adequate exercise'
  },
  
  'ongole': {
    breed: 'Ongole',
    origin: 'Andhra Pradesh',
    feedQuantity: '30-40 kg green fodder, 7-8 kg dry fodder, 3-4 kg concentrate per day',
    feedType: 'Subabul, Gliricidia, Paddy straw, Rice bran, Concentrate mix',
    healthImmunity: 'Very strong immunity, heat tolerant',
    diseaseRisks: ['FMD', 'Surra', 'Tick fever', 'Ephemeral fever'],
    vaccines: [
      { name: 'FMD Vaccine', schedule: 'Every 6 months' },
      { name: 'HS Vaccine', schedule: 'Annually' },
      { name: 'Anthrax Vaccine', schedule: 'In endemic areas' }
    ],
    rgmMedicines: [
      { name: 'Kaalmegha', use: 'Liver tonic' },
      { name: 'Chitrak', use: 'Digestive stimulant' },
      { name: 'Vidanga', use: 'Anthelmintic' }
    ],
    milkYield: '5-8 liters per day',
    specialCare: 'Primarily draft breed, excellent for agricultural work'
  },
  
  'hariana': {
    breed: 'Hariana',
    origin: 'Haryana',
    feedQuantity: '25-30 kg green fodder, 5-6 kg dry fodder, 2-3 kg concentrate per day',
    feedType: 'Berseem, Oat fodder, Wheat bhusa, Mustard cake',
    healthImmunity: 'Good resistance to common diseases',
    diseaseRisks: ['FMD', 'HS', 'Theileriosis', 'Anaplasmosis'],
    vaccines: [
      { name: 'FMD Vaccine', schedule: 'Every 6 months' },
      { name: 'HS Vaccine', schedule: 'Annually' },
      { name: 'BQ Vaccine', schedule: 'Annually' }
    ],
    rgmMedicines: [
      { name: 'Yashtimadhu', use: 'Respiratory health' },
      { name: 'Bilva', use: 'Digestive disorders' },
      { name: 'Amalaki', use: 'General tonic' }
    ],
    milkYield: '8-12 liters per day',
    specialCare: 'Dual purpose breed, good for milk and draft'
  },

  // Exotic/Crossbreed
  'holstein friesian': {
    breed: 'Holstein Friesian',
    origin: 'Netherlands/Germany',
    feedQuantity: '50-60 kg green fodder, 10-12 kg dry fodder, 6-8 kg concentrate per day',
    feedType: 'High-quality Lucerne, Maize silage, TMR (Total Mixed Ration), High-energy concentrate',
    healthImmunity: 'Susceptible to heat stress, requires good management',
    diseaseRisks: ['Mastitis', 'Milk Fever', 'Ketosis', 'Lameness', 'Reproductive disorders'],
    vaccines: [
      { name: 'FMD Vaccine', schedule: 'Every 6 months' },
      { name: 'IBR Vaccine', schedule: 'As per schedule' },
      { name: 'BVD Vaccine', schedule: 'Before breeding' },
      { name: 'Leptospirosis Vaccine', schedule: 'Annually' }
    ],
    rgmMedicines: [
      { name: 'Calcium supplements', use: 'Prevent milk fever' },
      { name: 'Liver tonics', use: 'Metabolic health' },
      { name: 'Probiotics', use: 'Rumen health' }
    ],
    milkYield: '25-40 liters per day',
    specialCare: 'Requires air-conditioned housing in hot climate, high-quality feed essential'
  },
  
  'jersey': {
    breed: 'Jersey',
    origin: 'Jersey Island, UK',
    feedQuantity: '40-45 kg green fodder, 8-10 kg dry fodder, 4-5 kg concentrate per day',
    feedType: 'Berseem, Maize fodder, Concentrate with bypass protein, Mineral mixture',
    healthImmunity: 'Moderate heat tolerance, adaptable',
    diseaseRisks: ['Mastitis', 'Hypocalcemia', 'Ketosis', 'Retained placenta'],
    vaccines: [
      { name: 'FMD Vaccine', schedule: 'Every 6 months' },
      { name: 'HS Vaccine', schedule: 'Annually' },
      { name: 'Brucella Vaccine', schedule: 'Heifer calves at 4-8 months' }
    ],
    rgmMedicines: [
      { name: 'Shatapushpa', use: 'Reproductive health' },
      { name: 'Dashmool', use: 'Post-partum care' },
      { name: 'Jeerak', use: 'Digestive health' }
    ],
    milkYield: '15-25 liters per day (high fat content)',
    specialCare: 'High butterfat milk, needs balanced nutrition, prone to calving difficulties'
  },
  
  'crossbreed': {
    breed: 'Crossbreed (HF/Jersey x Indigenous)',
    origin: 'India (Crossbreeding program)',
    feedQuantity: '35-45 kg green fodder, 7-9 kg dry fodder, 4-5 kg concentrate per day',
    feedType: 'Mixed fodder, Silage, Concentrate with area-specific mineral mixture',
    healthImmunity: 'Moderate - better than exotic but less than indigenous',
    diseaseRisks: ['FMD', 'Mastitis', 'Theileriosis', 'Reproductive issues'],
    vaccines: [
      { name: 'FMD Vaccine', schedule: 'Every 6 months' },
      { name: 'HS Vaccine', schedule: 'Annually' },
      { name: 'BQ Vaccine', schedule: 'Annually' },
      { name: 'Theileria Vaccine', schedule: 'Where prevalent' }
    ],
    rgmMedicines: [
      { name: 'Triphala', use: 'General health' },
      { name: 'Ajwain', use: 'Digestive stimulant' },
      { name: 'Giloy', use: 'Immunity booster' }
    ],
    milkYield: '12-20 liters per day',
    specialCare: 'Requires moderate care, adapt management based on exotic blood level'
  },

  // Buffalo breeds
  'murrah': {
    breed: 'Murrah Buffalo',
    origin: 'Haryana, India',
    feedQuantity: '40-50 kg green fodder, 8-10 kg dry fodder, 4-5 kg concentrate per day',
    feedType: 'Berseem, Jowar fodder, Wheat straw treated with urea, Mustard cake, Cotton seed',
    healthImmunity: 'Good immunity, requires wallowing for thermoregulation',
    diseaseRisks: ['FMD', 'HS', 'Mastitis', 'Parasitic infections', 'Reproductive disorders'],
    vaccines: [
      { name: 'FMD Vaccine', schedule: 'Every 6 months' },
      { name: 'HS Vaccine', schedule: 'Annually before monsoon' },
      { name: 'BQ Vaccine', schedule: 'Annually' },
      { name: 'Brucella Vaccine', schedule: 'Female calves 4-8 months' }
    ],
    rgmMedicines: [
      { name: 'Kalonji (Nigella)', use: 'Milk production enhancement' },
      { name: 'Jeera water', use: 'Digestive health' },
      { name: 'Haldi-Methi mix', use: 'Post-calving care' }
    ],
    milkYield: '15-20 liters per day (high fat 7-8%)',
    specialCare: 'Needs wallowing facility, clean water for bathing, shade essential'
  },

  // Default advisory for unknown breeds
  'default': {
    breed: 'General Cattle',
    origin: 'Various',
    feedQuantity: '25-35 kg green fodder, 5-7 kg dry fodder, 2-4 kg concentrate per day',
    feedType: 'Locally available green fodder, Dry fodder, Balanced concentrate with minerals',
    healthImmunity: 'Varies based on breed and management',
    diseaseRisks: ['Foot and Mouth Disease', 'Hemorrhagic Septicemia', 'Black Quarter', 'Mastitis'],
    vaccines: [
      { name: 'FMD Vaccine', schedule: 'Every 6 months' },
      { name: 'HS Vaccine', schedule: 'Annually before monsoon' },
      { name: 'BQ Vaccine', schedule: 'Annually' },
      { name: 'Deworming', schedule: 'Every 3-4 months' }
    ],
    rgmMedicines: [
      { name: 'Triphala', use: 'Digestive health' },
      { name: 'Haldi (Turmeric)', use: 'Anti-inflammatory' },
      { name: 'Tulsi', use: 'Immunity booster' }
    ],
    milkYield: 'Varies based on breed',
    specialCare: 'Regular health checkups, clean housing, adequate water supply, balanced nutrition'
  }
};

// Language translations for advisory
const translations = {
  en: {
    feedQuantity: 'Feed Quantity',
    feedType: 'Feed Type',
    healthImmunity: 'Health & Immunity',
    diseaseRisks: 'Disease Risks',
    vaccines: 'Recommended Vaccines',
    rgmMedicines: 'RGM (Ethno-veterinary) Medicines',
    milkYield: 'Expected Milk Yield',
    specialCare: 'Special Care Instructions',
    origin: 'Origin',
    schedule: 'Schedule',
    use: 'Use'
  },
  hi: {
    feedQuantity: 'चारे की मात्रा',
    feedType: 'चारे का प्रकार',
    healthImmunity: 'स्वास्थ्य और प्रतिरक्षा',
    diseaseRisks: 'रोग का खतरा',
    vaccines: 'अनुशंसित टीके',
    rgmMedicines: 'आरजीएम (देशी पशु चिकित्सा) दवाइयां',
    milkYield: 'अपेक्षित दूध उत्पादन',
    specialCare: 'विशेष देखभाल निर्देश',
    origin: 'उत्पत्ति',
    schedule: 'अनुसूची',
    use: 'उपयोग'
  },
  te: {
    feedQuantity: 'మేత పరిమాణం',
    feedType: 'మేత రకం',
    healthImmunity: 'ఆరోగ్యం & రోగనిరోధక శక్తి',
    diseaseRisks: 'వ్యాధి ప్రమాదాలు',
    vaccines: 'సిఫార్సు చేసిన టీకాలు',
    rgmMedicines: 'ఆర్జీఎం (జానపద పశువైద్య) మందులు',
    milkYield: 'ఆశించిన పాల దిగుబడి',
    specialCare: 'ప్రత్యేక సంరక్షణ సూచనలు',
    origin: 'మూలం',
    schedule: 'షెడ్యూల్',
    use: 'ఉపయోగం'
  },
  ta: {
    feedQuantity: 'தீவன அளவு',
    feedType: 'தீவன வகை',
    healthImmunity: 'ஆரோக்கியம் & நோய் எதிர்ப்பு சக்தி',
    diseaseRisks: 'நோய் அபாயங்கள்',
    vaccines: 'பரிந்துரைக்கப்பட்ட தடுப்பூசிகள்',
    rgmMedicines: 'ஆர்ஜிஎம் (நாட்டு கால்நடை மருத்துவம்) மருந்துகள்',
    milkYield: 'எதிர்பார்க்கப்படும் பால் உற்பத்தி',
    specialCare: 'சிறப்பு பராமரிப்பு அறிவுறுத்தல்கள்',
    origin: 'தோற்றம்',
    schedule: 'அட்டவணை',
    use: 'பயன்பாடு'
  },
  mr: {
    feedQuantity: 'चाऱ्याचे प्रमाण',
    feedType: 'चाऱ्याचा प्रकार',
    healthImmunity: 'आरोग्य आणि प्रतिकारशक्ती',
    diseaseRisks: 'रोगाचे धोके',
    vaccines: 'शिफारस केलेल्या लसी',
    rgmMedicines: 'आरजीएम (देशी पशुवैद्यकीय) औषधे',
    milkYield: 'अपेक्षित दूध उत्पादन',
    specialCare: 'विशेष काळजी सूचना',
    origin: 'मूळ',
    schedule: 'वेळापत्रक',
    use: 'वापर'
  },
  gu: {
    feedQuantity: 'ઘાસચારાની માત્રા',
    feedType: 'ઘાસચારાનો પ્રકાર',
    healthImmunity: 'આરોગ્ય અને રોગપ્રતિકારક શક્તિ',
    diseaseRisks: 'રોગના જોખમો',
    vaccines: 'ભલામણ કરેલ રસીઓ',
    rgmMedicines: 'આરજીએમ (દેશી પશુ ચિકિત્સા) દવાઓ',
    milkYield: 'અપેક્ષિત દૂધ ઉત્પાદન',
    specialCare: 'વિશેષ સંભાળ સૂચનાઓ',
    origin: 'મૂળ',
    schedule: 'સમયપત્રક',
    use: 'ઉપયોગ'
  },
  pa: {
    feedQuantity: 'ਚਾਰੇ ਦੀ ਮਾਤਰਾ',
    feedType: 'ਚਾਰੇ ਦੀ ਕਿਸਮ',
    healthImmunity: 'ਸਿਹਤ ਅਤੇ ਇਮਿਊਨਿਟੀ',
    diseaseRisks: 'ਬਿਮਾਰੀ ਦੇ ਖ਼ਤਰੇ',
    vaccines: 'ਸਿਫ਼ਾਰਿਸ਼ ਕੀਤੇ ਟੀਕੇ',
    rgmMedicines: 'ਆਰਜੀਐਮ (ਦੇਸੀ ਪਸ਼ੂ ਚਿਕਿਤਸਾ) ਦਵਾਈਆਂ',
    milkYield: 'ਅਨੁਮਾਨਿਤ ਦੁੱਧ ਉਤਪਾਦਨ',
    specialCare: 'ਵਿਸ਼ੇਸ਼ ਦੇਖਭਾਲ ਹਦਾਇਤਾਂ',
    origin: 'ਮੂਲ',
    schedule: 'ਸਮਾਂ-ਸਾਰਣੀ',
    use: 'ਵਰਤੋਂ'
  },
  kn: {
    feedQuantity: 'ಮೇವಿನ ಪ್ರಮಾಣ',
    feedType: 'ಮೇವಿನ ಪ್ರಕಾರ',
    healthImmunity: 'ಆರೋಗ್ಯ ಮತ್ತು ರೋಗ ನಿರೋಧಕ ಶಕ್ತಿ',
    diseaseRisks: 'ರೋಗದ ಅಪಾಯಗಳು',
    vaccines: 'ಶಿಫಾರಸು ಮಾಡಿದ ಲಸಿಕೆಗಳು',
    rgmMedicines: 'ಆರ್‌ಜಿಎಂ (ಜಾನಪದ ಪಶುವೈದ್ಯ) ಔಷಧಗಳು',
    milkYield: 'ನಿರೀಕ್ಷಿತ ಹಾಲು ಉತ್ಪಾದನೆ',
    specialCare: 'ವಿಶೇಷ ಆರೈಕೆ ಸೂಚನೆಗಳು',
    origin: 'ಮೂಲ',
    schedule: 'ವೇಳಾಪಟ್ಟಿ',
    use: 'ಬಳಕೆ'
  }
};

const getAdvisory = (breedName) => {
  const normalizedBreed = breedName.toLowerCase().trim();
  return breedAdvisory[normalizedBreed] || breedAdvisory['default'];
};

const getTranslation = (lang) => {
  return translations[lang] || translations['en'];
};

module.exports = {
  breedAdvisory,
  translations,
  getAdvisory,
  getTranslation
};
