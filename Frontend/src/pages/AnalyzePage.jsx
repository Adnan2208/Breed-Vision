import React, { useState, useRef } from 'react';
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
    Star
} from 'lucide-react';
import { AppLayout } from '../components/layout';
import { Button, Card, Badge } from '../components/ui';
import { breeds, mockDetectionResults } from '../data/mockData';

const AnalyzePage = () => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [detectionResult, setDetectionResult] = useState(null);
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef(null);

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

        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleAnalyze = async () => {
        if (!selectedImage) return;

        setIsAnalyzing(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2500));

        // Get random mock result
        const randomResult = mockDetectionResults[Math.floor(Math.random() * mockDetectionResults.length)];
        const breedInfo = breeds.find(b => b.name === randomResult.breed) || breeds[0];

        setDetectionResult({
            ...randomResult,
            breedInfo
        });

        setIsAnalyzing(false);
    };

    const handleClear = () => {
        setSelectedImage(null);
        setImagePreview(null);
        setDetectionResult(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <AppLayout>
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h2 className="text-sm text-text-muted uppercase tracking-wide mb-2">
                        AI-Powered Analysis
                    </h2>
                    <p className="text-text-secondary max-w-2xl">
                        Upload an image of cattle to identify its breed using our advanced AI model.
                        Get instant results with confidence scores and breed-specific advisory.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Upload Section */}
                    <div>
                        <Card padding="lg">
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

                            {/* Analyze Button */}
                            <div className="mt-6">
                                <Button
                                    variant="primary"
                                    size="lg"
                                    className="w-full"
                                    icon={isAnalyzing ? Loader2 : Scan}
                                    disabled={!selectedImage || isAnalyzing}
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
                                    <div>
                                        <p className="text-sm font-medium text-text mb-3">All Predictions</p>
                                        <div className="space-y-2">
                                            {detectionResult.allPredictions.map((pred, index) => (
                                                <div
                                                    key={pred.breed}
                                                    className="flex items-center justify-between p-3 bg-surface-hover rounded-xl"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <span className={`
                              w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium
                              ${index === 0 ? 'bg-primary text-white' : 'bg-gray-200 text-text-secondary'}
                            `}>
                                                            {index + 1}
                                                        </span>
                                                        <span className="font-medium text-text">{pred.breed}</span>
                                                    </div>
                                                    <span className="text-text-secondary">
                                                        {Math.round(pred.confidence * 100)}%
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
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
                                                    {detectionResult.breedInfo?.milkYield}
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
                                        <div className="p-3 bg-surface-hover rounded-xl">
                                            <p className="text-sm text-text-muted mb-2">Key Characteristics</p>
                                            <div className="flex flex-wrap gap-2">
                                                {detectionResult.breedInfo?.characteristics?.map((char, index) => (
                                                    <Badge key={index} variant="primary" size="sm">
                                                        {char}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        ) : (
                            <Card padding="lg" className="h-full flex flex-col items-center justify-center text-center min-h-[400px]">
                                <div className="w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center mb-6">
                                    <Scan className="w-10 h-10 text-text-muted" />
                                </div>
                                <h3 className="text-xl font-semibold text-text mb-2">
                                    No Analysis Yet
                                </h3>
                                <p className="text-text-secondary max-w-sm">
                                    Upload an image of cattle and click "Analyze Breed" to get
                                    instant breed identification and advisory.
                                </p>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default AnalyzePage;
