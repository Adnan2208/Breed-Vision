import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
    Upload,
    Image as ImageIcon,
    Scan,
    CheckCircle,
    AlertCircle,
    X,
    Loader2,
    Info,
    Droplet,
    Leaf,
    Heart,
    Syringe,
    Star,
    Camera,
    Video,
    VideoOff,
    SwitchCamera,
    Circle,
    Save,
    MapPin,
    User,
    Phone,
    Calendar,
    ChevronDown
} from 'lucide-react';
import { AppLayout } from '../components/layout';
import { Button, Card, Badge, Input } from '../components/ui';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

// Breed data for display purposes
const breeds = {
    'Gir': {
        origin: 'Gujarat, India',
        purpose: 'Dairy',
        milkYield: '12-15 liters/day',
        adaptability: 'Tropical & Sub-tropical',
        characteristics: ['Distinctive domed forehead', 'Long pendulous ears', 'High heat tolerance', 'Disease resistant']
    },
    'Sahiwal': {
        origin: 'Punjab, India/Pakistan',
        purpose: 'Dairy',
        milkYield: '10-16 liters/day',
        adaptability: 'Hot & Humid',
        characteristics: ['Reddish-brown color', 'Loose skin', 'Excellent heat tolerance', 'Good temperament']
    },
    'Red Sindhi': {
        origin: 'Sindh Region',
        purpose: 'Dairy',
        milkYield: '8-12 liters/day',
        adaptability: 'Arid & Semi-arid',
        characteristics: ['Deep red color', 'Strong constitution', 'High disease resistance', 'Low maintenance']
    },
    'Tharparkar': {
        origin: 'Rajasthan, India',
        purpose: 'Dual Purpose',
        milkYield: '8-10 liters/day',
        adaptability: 'Desert Climate',
        characteristics: ['White/gray color', 'Drought resistant', 'Can survive on less water', 'Good for arid zones']
    },
    'Kankrej': {
        origin: 'Gujarat & Rajasthan',
        purpose: 'Dual Purpose',
        milkYield: '6-10 liters/day',
        adaptability: 'All Climates',
        characteristics: ['Large body size', 'Long horns', 'Strong and hardy', 'Good for plowing']
    },
    'Ongole': {
        origin: 'Andhra Pradesh',
        purpose: 'Draft',
        milkYield: '5-8 liters/day',
        adaptability: 'Tropical',
        characteristics: ['Muscular body', 'Short horns', 'Very strong immunity', 'Excellent for agriculture']
    },
    'Hariana': {
        origin: 'Haryana, India',
        purpose: 'Dual Purpose',
        milkYield: '8-12 liters/day',
        adaptability: 'North Indian Climate',
        characteristics: ['White color', 'Good milk producer', 'Suitable for draft work', 'Well adapted to North India']
    },
    'Holstein Friesian': {
        origin: 'Netherlands/Germany',
        purpose: 'Dairy',
        milkYield: '25-40 liters/day',
        adaptability: 'Temperate (needs AC in tropics)',
        characteristics: ['Black and white patches', 'Very high milk yield', 'Requires good management', 'Needs climate control in tropics']
    },
    'Jersey': {
        origin: 'Jersey Island, UK',
        purpose: 'Dairy',
        milkYield: '15-25 liters/day',
        adaptability: 'Moderate adaptability',
        characteristics: ['Small to medium size', 'Fawn color', 'High fat milk', 'Good adaptability']
    }
};

const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
];

const healthIssueOptions = [
    'Mastitis', 'Foot and Mouth Disease', 'Brucellosis', 'Theileriosis',
    'Black Quarter', 'Hemorrhagic Septicemia', 'Tuberculosis', 'Parasitic Infection',
    'Skin Disease', 'Respiratory Issues', 'Digestive Problems', 'Other'
];

const AnalyzePage = () => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [detectionResult, setDetectionResult] = useState(null);
    const [dragActive, setDragActive] = useState(false);
    const [activeTab, setActiveTab] = useState('upload'); // 'upload' or 'camera'
    const [isCameraActive, setIsCameraActive] = useState(false);
    const [cameraError, setCameraError] = useState(null);
    const [facingMode, setFacingMode] = useState('environment'); // 'user' or 'environment'
    const [showCattleForm, setShowCattleForm] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [submitError, setSubmitError] = useState(null);
    const fileInputRef = useRef(null);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const streamRef = useRef(null);

    // Start camera
    const startCamera = useCallback(async () => {
        setCameraError(null);
        try {
            const constraints = {
                video: {
                    facingMode: facingMode,
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                }
            };

            const stream = await navigator.mediaDevices.getUserMedia(constraints);

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                streamRef.current = stream;
                setIsCameraActive(true);
            }
        } catch (err) {
            console.error('Camera error:', err);
            setCameraError(
                err.name === 'NotAllowedError'
                    ? 'Camera access denied. Please allow camera access in your browser settings.'
                    : err.name === 'NotFoundError'
                        ? 'No camera found on this device.'
                        : 'Failed to access camera. Please try again.'
            );
            setIsCameraActive(false);
        }
    }, [facingMode]);

    // Stop camera
    const stopCamera = useCallback(() => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
        setIsCameraActive(false);
    }, []);

    // Toggle camera facing mode
    const toggleFacingMode = useCallback(() => {
        stopCamera();
        setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
    }, [stopCamera]);

    // Capture photo from camera
    const capturePhoto = useCallback(() => {
        if (!videoRef.current || !canvasRef.current) return;

        const video = videoRef.current;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        // Set canvas size to video size
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Draw video frame to canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Convert to blob
        canvas.toBlob((blob) => {
            if (blob) {
                const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' });
                setSelectedImage(file);
                setImagePreview(canvas.toDataURL('image/jpeg'));
                setDetectionResult(null);
                stopCamera();
            }
        }, 'image/jpeg', 0.9);
    }, [stopCamera]);

    // Effect to restart camera when facing mode changes
    useEffect(() => {
        if (activeTab === 'camera' && !imagePreview) {
            startCamera();
        }
        return () => {
            if (activeTab !== 'camera') {
                stopCamera();
            }
        };
    }, [facingMode, activeTab, imagePreview, startCamera, stopCamera]);

    // Handle tab change
    const handleTabChange = (tab) => {
        setActiveTab(tab);
        if (tab === 'camera' && !imagePreview) {
            startCamera();
        } else if (tab === 'upload') {
            stopCamera();
        }
    };

    // Cattle form data
    const [cattleFormData, setCattleFormData] = useState({
        flwId: '',
        flwName: '',
        village: '',
        district: '',
        state: '',
        farmerName: '',
        farmerContact: '',
        cattleAge: '',
        ageUnit: 'years',
        gender: 'female',
        lactationStatus: 'not-applicable',
        healthIssuesObserved: [],
        healthNotes: '',
        vaccinationFmd: false,
        vaccinationHs: false,
        vaccinationBq: false,
        vaccinationBrucella: false
    });

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleFileSelect = (e) => {
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleFile = (file) => {
        if (!file.type.startsWith('image/')) {
            alert('Please upload an image file');
            return;
        }

        setSelectedImage(file);
        setDetectionResult(null);
        setShowCattleForm(false);
        setSubmitSuccess(false);
        setSubmitError(null);

        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleAnalyze = async () => {
        if (!selectedImage && !imagePreview) return;

        setIsAnalyzing(true);
        setSubmitError(null);

        try {
            const formData = new FormData();
            formData.append('image', selectedImage);

            const response = await fetch(`${API_BASE_URL}/breed/detect`, {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (result.success) {
                const breedName = result.data.detection.breed;
                const breedInfo = breeds[breedName] || breeds['Gir'];
                
                setDetectionResult({
                    imageId: result.data.imageId,
                    breed: breedName,
                    confidence: result.data.detection.confidence,
                    allPredictions: result.data.detection.allPredictions || [],
                    breedInfo,
                    advisory: result.data.advisory
                });
                setShowCattleForm(true);
            } else {
                setSubmitError(result.message || 'Failed to detect breed');
            }
        } catch (error) {
            console.error('Error detecting breed:', error);
            setSubmitError('Failed to connect to the server. Please try again.');
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleClear = () => {
        setSelectedImage(null);
        setImagePreview(null);
        setDetectionResult(null);
        setShowCattleForm(false);
        setSubmitSuccess(false);
        setSubmitError(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        if (activeTab === 'camera') {
            startCamera();
        }
    };

    const handleFormChange = (e) => {
        const { name, value, type, checked } = e.target;
        
        if (type === 'checkbox') {
            setCattleFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            setCattleFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleHealthIssueToggle = (issue) => {
        setCattleFormData(prev => {
            const issues = prev.healthIssuesObserved.includes(issue)
                ? prev.healthIssuesObserved.filter(i => i !== issue)
                : [...prev.healthIssuesObserved, issue];
            return { ...prev, healthIssuesObserved: issues };
        });
    };

    const handleCattleSubmit = async (e) => {
        e.preventDefault();
        
        if (!cattleFormData.flwId || !cattleFormData.flwName || !cattleFormData.village || 
            !cattleFormData.district || !cattleFormData.state || !cattleFormData.cattleAge) {
            setSubmitError('Please fill in all required fields');
            return;
        }

        setIsSubmitting(true);
        setSubmitError(null);

        try {
            const submitData = {
                flwId: cattleFormData.flwId,
                flwName: cattleFormData.flwName,
                village: cattleFormData.village,
                district: cattleFormData.district,
                state: cattleFormData.state,
                farmerName: cattleFormData.farmerName,
                farmerContact: cattleFormData.farmerContact,
                cattleBreed: detectionResult.breed,
                cattleAge: {
                    value: parseInt(cattleFormData.cattleAge),
                    unit: cattleFormData.ageUnit
                },
                gender: cattleFormData.gender,
                lactationStatus: cattleFormData.lactationStatus,
                healthIssuesObserved: cattleFormData.healthIssuesObserved,
                healthNotes: cattleFormData.healthNotes,
                vaccinationStatus: {
                    fmd: { done: cattleFormData.vaccinationFmd },
                    hs: { done: cattleFormData.vaccinationHs },
                    bq: { done: cattleFormData.vaccinationBq },
                    brucella: { done: cattleFormData.vaccinationBrucella }
                },
                cattleImageId: detectionResult.imageId,
                dateOfVisit: new Date().toISOString()
            };

            const response = await fetch(`${API_BASE_URL}/flw/submit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(submitData)
            });

            const result = await response.json();

            if (result.success) {
                setSubmitSuccess(true);
                setShowCattleForm(false);
                // Reset form for next entry
                setCattleFormData({
                    flwId: cattleFormData.flwId, // Keep FLW info
                    flwName: cattleFormData.flwName,
                    village: '',
                    district: '',
                    state: cattleFormData.state,
                    farmerName: '',
                    farmerContact: '',
                    cattleAge: '',
                    ageUnit: 'years',
                    gender: 'female',
                    lactationStatus: 'not-applicable',
                    healthIssuesObserved: [],
                    healthNotes: '',
                    vaccinationFmd: false,
                    vaccinationHs: false,
                    vaccinationBq: false,
                    vaccinationBrucella: false
                });
            } else {
                setSubmitError(result.message || 'Failed to submit cattle data');
            }
        } catch (error) {
            console.error('Error submitting cattle data:', error);
            setSubmitError('Failed to submit cattle data. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AppLayout>
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h2 className="text-sm text-text-muted uppercase tracking-wide mb-2">
                        AI-Powered Analysis
                    </h2>
                    <p className="text-text-secondary max-w-2xl">
                        Upload an image or use your camera to capture cattle for instant breed identification.
                        Get results with confidence scores, breed-specific advisory, and add cattle details to the database.
                    </p>
                </div>

                {submitError && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                        <p className="text-red-700">{submitError}</p>
                        <button 
                            onClick={() => setSubmitError(null)}
                            className="ml-auto text-red-500 hover:text-red-700"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                )}

                {submitSuccess && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <p className="text-green-700">Cattle data submitted successfully! The information has been added to the database.</p>
                        <button 
                            onClick={() => setSubmitSuccess(false)}
                            className="ml-auto text-green-500 hover:text-green-700"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                )}

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Input Section */}
                    <div>
                        <Card padding="lg">
                            {/* Tab Switcher */}
                            <div className="flex gap-2 mb-6 p-1 bg-surface-hover rounded-xl">
                                <button
                                    onClick={() => handleTabChange('upload')}
                                    className={`
                    flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium
                    transition-all duration-200
                    ${activeTab === 'upload'
                                            ? 'bg-primary text-white shadow-md'
                                            : 'text-text-secondary hover:text-text'
                                        }
                  `}
                                >
                                    <Upload className="w-4 h-4" />
                                    Upload Image
                                </button>
                                <button
                                    onClick={() => handleTabChange('camera')}
                                    className={`
                    flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium
                    transition-all duration-200
                    ${activeTab === 'camera'
                                            ? 'bg-primary text-white shadow-md'
                                            : 'text-text-secondary hover:text-text'
                                        }
                  `}
                                >
                                    <Camera className="w-4 h-4" />
                                    Live Camera
                                </button>
                            </div>

                            {/* Upload Tab */}
                            {activeTab === 'upload' && (
                                <>
                                    <h3 className="text-lg font-semibold text-text mb-4 flex items-center gap-2">
                                        <ImageIcon className="w-5 h-5 text-primary" />
                                        Upload Image
                                    </h3>

                                    {/* Dropzone */}
                                    <div
                                        className={`
                      relative border-2 border-dashed rounded-2xl p-8 text-center
                      transition-all duration-300 cursor-pointer
                      ${dragActive
                                                ? 'border-primary bg-primary/5'
                                                : 'border-gray-200 hover:border-primary/50 hover:bg-surface-hover'
                                            }
                      ${imagePreview ? 'border-primary' : ''}
                    `}
                                        onDragEnter={handleDrag}
                                        onDragLeave={handleDrag}
                                        onDragOver={handleDrag}
                                        onDrop={handleDrop}
                                        onClick={() => !imagePreview && fileInputRef.current?.click()}
                                    >
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleFileSelect}
                                        />

                                        {imagePreview ? (
                                            <div className="relative">
                                                <img
                                                    src={imagePreview}
                                                    alt="Preview"
                                                    className="max-h-64 mx-auto rounded-xl shadow-lg"
                                                />
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleClear();
                                                    }}
                                                    className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md 
                                     hover:bg-red-50 transition-colors"
                                                >
                                                    <X className="w-4 h-4 text-red-500" />
                                                </button>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
                                                    <Upload className="w-8 h-8 text-primary" />
                                                </div>
                                                <p className="text-text font-medium mb-2">
                                                    Drag & drop your image here
                                                </p>
                                                <p className="text-sm text-text-muted mb-4">
                                                    or click to browse files
                                                </p>
                                                <Badge variant="default">Supports: JPG, PNG, WEBP</Badge>
                                            </>
                                        )}
                                    </div>
                                </>
                            )}

                            {/* Camera Tab */}
                            {activeTab === 'camera' && (
                                <>
                                    <h3 className="text-lg font-semibold text-text mb-4 flex items-center gap-2">
                                        <Video className="w-5 h-5 text-secondary" />
                                        Live Camera Detection
                                    </h3>

                                    <div className="relative rounded-2xl overflow-hidden bg-gray-900">
                                        {/* Camera Error */}
                                        {cameraError && (
                                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 p-6 text-center">
                                                <div className="w-16 h-16 mb-4 rounded-2xl bg-red-500/20 flex items-center justify-center">
                                                    <VideoOff className="w-8 h-8 text-red-400" />
                                                </div>
                                                <p className="text-white font-medium mb-2">Camera Error</p>
                                                <p className="text-gray-400 text-sm mb-4">{cameraError}</p>
                                                <Button variant="secondary" size="sm" onClick={startCamera}>
                                                    Try Again
                                                </Button>
                                            </div>
                                        )}

                                        {/* Captured Image Preview */}
                                        {imagePreview && activeTab === 'camera' ? (
                                            <div className="relative">
                                                <img
                                                    src={imagePreview}
                                                    alt="Captured"
                                                    className="w-full h-64 object-cover"
                                                />
                                                <button
                                                    onClick={handleClear}
                                                    className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md 
                                     hover:bg-red-50 transition-colors"
                                                >
                                                    <X className="w-4 h-4 text-red-500" />
                                                </button>
                                                <Badge
                                                    variant="success"
                                                    className="absolute bottom-3 left-3"
                                                >
                                                    <CheckCircle className="w-3 h-3 mr-1" />
                                                    Photo Captured
                                                </Badge>
                                            </div>
                                        ) : (
                                            <>
                                                {/* Video Feed */}
                                                <video
                                                    ref={videoRef}
                                                    autoPlay
                                                    playsInline
                                                    muted
                                                    className={`w-full h-64 object-cover ${!isCameraActive || cameraError ? 'hidden' : ''}`}
                                                />

                                                {/* Loading State */}
                                                {!isCameraActive && !cameraError && (
                                                    <div className="w-full h-64 flex items-center justify-center">
                                                        <Loader2 className="w-8 h-8 text-white animate-spin" />
                                                    </div>
                                                )}

                                                {/* Camera Controls Overlay */}
                                                {isCameraActive && !cameraError && (
                                                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                                                        <div className="flex items-center justify-center gap-4">
                                                            {/* Switch Camera */}
                                                            <button
                                                                onClick={toggleFacingMode}
                                                                className="p-3 bg-white/20 backdrop-blur-sm rounded-full 
                                         hover:bg-white/30 transition-colors"
                                                                title="Switch Camera"
                                                            >
                                                                <SwitchCamera className="w-5 h-5 text-white" />
                                                            </button>

                                                            {/* Capture Button */}
                                                            <button
                                                                onClick={capturePhoto}
                                                                className="p-4 bg-white rounded-full shadow-lg 
                                         hover:scale-105 active:scale-95 transition-transform"
                                                                title="Capture Photo"
                                                            >
                                                                <Circle className="w-8 h-8 text-secondary fill-secondary" />
                                                            </button>

                                                            {/* Stop Camera */}
                                                            <button
                                                                onClick={stopCamera}
                                                                className="p-3 bg-white/20 backdrop-blur-sm rounded-full 
                                         hover:bg-red-500/50 transition-colors"
                                                                title="Stop Camera"
                                                            >
                                                                <VideoOff className="w-5 h-5 text-white" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </>
                                        )}

                                        {/* Hidden canvas for capturing */}
                                        <canvas ref={canvasRef} className="hidden" />
                                    </div>

                                    {/* Camera Instructions */}
                                    {!imagePreview && (
                                        <div className="mt-4 p-3 bg-secondary/10 rounded-xl">
                                            <p className="text-sm text-secondary-dark text-center">
                                                📸 Position your camera to capture the cattle clearly, then click the capture button
                                            </p>
                                        </div>
                                    )}
                                </>
                            )}

                            {/* Analyze Button */}
                            <div className="mt-6">
                                <Button
                                    variant="primary"
                                    size="lg"
                                    className="w-full"
                                    icon={isAnalyzing ? Loader2 : Scan}
                                    disabled={!imagePreview || isAnalyzing}
                                    onClick={handleAnalyze}
                                >
                                    {isAnalyzing ? (
                                        <span className="flex items-center gap-2">
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Analyzing...
                                        </span>
                                    ) : (
                                        'Analyze Breed'
                                    )}
                                </Button>
                            </div>

                            {/* Tips */}
                            <div className="mt-6 p-4 bg-accent/10 rounded-xl">
                                <div className="flex items-start gap-3">
                                    <Info className="w-5 h-5 text-accent-dark flex-shrink-0 mt-0.5" />
                                    <div className="text-sm">
                                        <p className="font-medium text-accent-dark mb-1">Tips for best results:</p>
                                        <ul className="text-text-secondary space-y-1">
                                            <li>• Use well-lit, clear images</li>
                                            <li>• Capture the full body if possible</li>
                                            <li>• Avoid blurry or dark images</li>
                                            {activeTab === 'camera' && (
                                                <li>• Hold your device steady while capturing</li>
                                            )}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Results Section */}
                    <div>
                        {detectionResult ? (
                            <div className="space-y-6 animate-slide-up">
                                {/* Detection Result Card */}
                                <Card padding="lg" className="relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-full h-1 gradient-primary" />

                                    <div className="flex items-start justify-between mb-6">
                                        <div>
                                            <Badge variant="success" className="mb-2">
                                                <CheckCircle className="w-3 h-3 mr-1" />
                                                Breed Detected
                                            </Badge>
                                            <h3 className="text-2xl font-bold text-text">
                                                {detectionResult.breed}
                                            </h3>
                                            <p className="text-text-muted">
                                                {detectionResult.breedInfo?.origin}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-3xl font-bold text-primary">
                                                {Math.round(detectionResult.confidence * 100)}%
                                            </p>
                                            <p className="text-sm text-text-muted">Confidence</p>
                                        </div>
                                    </div>

                                    {/* Confidence Bar */}
                                    <div className="mb-6">
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="text-text-secondary">Detection Confidence</span>
                                            <span className="font-medium text-primary">
                                                {Math.round(detectionResult.confidence * 100)}%
                                            </span>
                                        </div>
                                        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full gradient-primary rounded-full transition-all duration-1000"
                                                style={{ width: `${detectionResult.confidence * 100}%` }}
                                            />
                                        </div>
                                    </div>

                                    {/* All Predictions */}
                                    {detectionResult.allPredictions.length > 0 && (
                                        <div>
                                            <p className="text-sm font-medium text-text mb-3">All Predictions</p>
                                            <div className="space-y-2">
                                                {detectionResult.allPredictions.slice(0, 4).map((pred, index) => (
                                                    <div
                                                        key={pred.class || pred.breed || index}
                                                        className="flex items-center justify-between p-3 bg-surface-hover rounded-xl"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <span className={`
                                                                w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium
                                                                ${index === 0 ? 'bg-primary text-white' : 'bg-gray-200 text-text-secondary'}
                                                            `}>
                                                                {index + 1}
                                                            </span>
                                                            <span className="font-medium text-text">{pred.class || pred.breed}</span>
                                                        </div>
                                                        <span className="text-text-secondary">
                                                            {Math.round((pred.confidence || 0) * 100)}%
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </Card>

                                {/* Breed Advisory Card */}
                                <Card padding="lg">
                                    <h3 className="text-lg font-semibold text-text mb-4 flex items-center gap-2">
                                        <Star className="w-5 h-5 text-accent" />
                                        Breed Advisory
                                    </h3>

                                    <div className="space-y-4">
                                        {/* Purpose */}
                                        <div className="flex items-center gap-3 p-3 bg-surface-hover rounded-xl">
                                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                                <Heart className="w-5 h-5 text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-text-muted">Purpose</p>
                                                <p className="font-medium text-text">
                                                    {detectionResult.breedInfo?.purpose}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Milk Yield */}
                                        <div className="flex items-center gap-3 p-3 bg-surface-hover rounded-xl">
                                            <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                                                <Droplet className="w-5 h-5 text-secondary" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-text-muted">Expected Milk Yield</p>
                                                <p className="font-medium text-text">
                                                    {detectionResult.breedInfo?.milkYield || detectionResult.advisory?.milkYield}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Adaptability */}
                                        <div className="flex items-center gap-3 p-3 bg-surface-hover rounded-xl">
                                            <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                                                <Leaf className="w-5 h-5 text-accent-dark" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-text-muted">Adaptability</p>
                                                <p className="font-medium text-text">
                                                    {detectionResult.breedInfo?.adaptability}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Characteristics */}
                                        {detectionResult.breedInfo?.characteristics && (
                                            <div className="p-3 bg-surface-hover rounded-xl">
                                                <p className="text-sm text-text-muted mb-2">Key Characteristics</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {detectionResult.breedInfo.characteristics.map((char, index) => (
                                                        <Badge key={index} variant="primary" size="sm">
                                                            {char}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </Card>
                            </div>
                        ) : (
                            <Card padding="lg" className="h-full flex flex-col items-center justify-center text-center min-h-[400px]">
                                <div className="w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center mb-6">
                                    <img src="/favicon.jpg" alt="Logo" className="w-12 h-12 rounded-xl object-cover" />
                                </div>
                                <h3 className="text-xl font-semibold text-text mb-2">
                                    No Analysis Yet
                                </h3>
                                <p className="text-text-secondary max-w-sm">
                                    {activeTab === 'camera'
                                        ? 'Capture a photo using your camera and click "Analyze Breed" to get instant breed identification.'
                                        : 'Upload an image of cattle and click "Analyze Breed" to get instant breed identification and advisory.'
                                    }
                                </p>
                            </Card>
                        )}
                    </div>
                </div>

                {/* Cattle Data Form */}
                {showCattleForm && detectionResult && (
                    <Card padding="lg" className="mt-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                                <Save className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-text">Add Cattle Details</h3>
                                <p className="text-text-muted">Fill in the details to save this cattle record to the database</p>
                            </div>
                        </div>

                        <form onSubmit={handleCattleSubmit}>
                            {/* FLW Information */}
                            <div className="mb-8">
                                <h4 className="text-lg font-medium text-text mb-4 flex items-center gap-2">
                                    <User className="w-5 h-5 text-primary" />
                                    Field Worker Information
                                </h4>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-text mb-2">
                                            FLW ID <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="flwId"
                                            value={cattleFormData.flwId}
                                            onChange={handleFormChange}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                            placeholder="Enter FLW ID"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-text mb-2">
                                            FLW Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="flwName"
                                            value={cattleFormData.flwName}
                                            onChange={handleFormChange}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                            placeholder="Enter FLW Name"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Location Information */}
                            <div className="mb-8">
                                <h4 className="text-lg font-medium text-text mb-4 flex items-center gap-2">
                                    <MapPin className="w-5 h-5 text-primary" />
                                    Location Information
                                </h4>
                                <div className="grid md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-text mb-2">
                                            Village <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="village"
                                            value={cattleFormData.village}
                                            onChange={handleFormChange}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                            placeholder="Enter Village"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-text mb-2">
                                            District <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="district"
                                            value={cattleFormData.district}
                                            onChange={handleFormChange}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                            placeholder="Enter District"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-text mb-2">
                                            State <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            name="state"
                                            value={cattleFormData.state}
                                            onChange={handleFormChange}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-white"
                                            required
                                        >
                                            <option value="">Select State</option>
                                            {indianStates.map(state => (
                                                <option key={state} value={state}>{state}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Farmer Information */}
                            <div className="mb-8">
                                <h4 className="text-lg font-medium text-text mb-4 flex items-center gap-2">
                                    <User className="w-5 h-5 text-primary" />
                                    Farmer Information (Optional)
                                </h4>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-text mb-2">
                                            Farmer Name
                                        </label>
                                        <input
                                            type="text"
                                            name="farmerName"
                                            value={cattleFormData.farmerName}
                                            onChange={handleFormChange}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                            placeholder="Enter Farmer Name"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-text mb-2">
                                            Farmer Contact
                                        </label>
                                        <input
                                            type="tel"
                                            name="farmerContact"
                                            value={cattleFormData.farmerContact}
                                            onChange={handleFormChange}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                            placeholder="Enter Phone Number"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Cattle Information */}
                            <div className="mb-8">
                                <h4 className="text-lg font-medium text-text mb-4 flex items-center gap-2">
                                    <Heart className="w-5 h-5 text-primary" />
                                    Cattle Information
                                </h4>
                                <div className="grid md:grid-cols-4 gap-4 mb-4">
                                    <div>
                                        <label className="block text-sm font-medium text-text mb-2">
                                            Detected Breed
                                        </label>
                                        <input
                                            type="text"
                                            value={detectionResult.breed}
                                            disabled
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-text-secondary"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-text mb-2">
                                            Age <span className="text-red-500">*</span>
                                        </label>
                                        <div className="flex gap-2">
                                            <input
                                                type="number"
                                                name="cattleAge"
                                                value={cattleFormData.cattleAge}
                                                onChange={handleFormChange}
                                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                                placeholder="Age"
                                                min="0"
                                                required
                                            />
                                            <select
                                                name="ageUnit"
                                                value={cattleFormData.ageUnit}
                                                onChange={handleFormChange}
                                                className="px-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-white"
                                            >
                                                <option value="months">Months</option>
                                                <option value="years">Years</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-text mb-2">
                                            Gender <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            name="gender"
                                            value={cattleFormData.gender}
                                            onChange={handleFormChange}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-white"
                                            required
                                        >
                                            <option value="female">Female</option>
                                            <option value="male">Male</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-text mb-2">
                                            Lactation Status
                                        </label>
                                        <select
                                            name="lactationStatus"
                                            value={cattleFormData.lactationStatus}
                                            onChange={handleFormChange}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-white"
                                        >
                                            <option value="not-applicable">Not Applicable</option>
                                            <option value="lactating">Lactating</option>
                                            <option value="dry">Dry</option>
                                            <option value="pregnant">Pregnant</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Health Information */}
                            <div className="mb-8">
                                <h4 className="text-lg font-medium text-text mb-4 flex items-center gap-2">
                                    <Syringe className="w-5 h-5 text-primary" />
                                    Health Information
                                </h4>
                                
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-text mb-3">
                                        Health Issues Observed
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {healthIssueOptions.map(issue => (
                                            <button
                                                key={issue}
                                                type="button"
                                                onClick={() => handleHealthIssueToggle(issue)}
                                                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                                                    cattleFormData.healthIssuesObserved.includes(issue)
                                                        ? 'bg-primary text-white'
                                                        : 'bg-gray-100 text-text-secondary hover:bg-gray-200'
                                                }`}
                                            >
                                                {issue}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-text mb-2">
                                        Health Notes
                                    </label>
                                    <textarea
                                        name="healthNotes"
                                        value={cattleFormData.healthNotes}
                                        onChange={handleFormChange}
                                        rows="3"
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                                        placeholder="Any additional health observations..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-text mb-3">
                                        Vaccination Status
                                    </label>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {[
                                            { name: 'vaccinationFmd', label: 'FMD' },
                                            { name: 'vaccinationHs', label: 'HS' },
                                            { name: 'vaccinationBq', label: 'BQ' },
                                            { name: 'vaccinationBrucella', label: 'Brucella' }
                                        ].map(vaccine => (
                                            <label
                                                key={vaccine.name}
                                                className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                                                    cattleFormData[vaccine.name]
                                                        ? 'border-primary bg-primary/5'
                                                        : 'border-gray-200 hover:border-primary/50'
                                                }`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    name={vaccine.name}
                                                    checked={cattleFormData[vaccine.name]}
                                                    onChange={handleFormChange}
                                                    className="w-5 h-5 text-primary rounded focus:ring-primary"
                                                />
                                                <span className="font-medium text-text">{vaccine.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="flex justify-end gap-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setShowCattleForm(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant="primary"
                                    disabled={isSubmitting}
                                    icon={isSubmitting ? Loader2 : Save}
                                >
                                    {isSubmitting ? (
                                        <span className="flex items-center gap-2">
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Submitting...
                                        </span>
                                    ) : (
                                        'Submit Cattle Data'
                                    )}
                                </Button>
                            </div>
                        </form>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
};

export default AnalyzePage;
