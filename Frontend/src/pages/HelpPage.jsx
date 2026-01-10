import React from 'react';
import AppLayout from '../components/layout/AppLayout';
import { Card } from '../components/ui';
import {
    HelpCircle,
    Camera,
    Upload,
    Cpu,
    CheckCircle,
    BookOpen,
    Scan,
    Info,
    ArrowRight,
    Lightbulb
} from 'lucide-react';

const HelpPage = () => {
    const analysisSteps = [
        {
            step: 1,
            title: 'Capture or Upload Image',
            icon: Camera,
            description: 'Take a clear photo of the cattle or upload an existing image. Ensure the animal is visible from the side with good lighting.',
            tips: [
                'Use natural daylight for best results',
                'Capture the full body of the cattle',
                'Avoid blurry or dark images',
                'Side profile photos work best'
            ]
        },
        {
            step: 2,
            title: 'Navigate to Analyze Breed',
            icon: Scan,
            description: 'Click on "Analyze Breed" in the sidebar menu to access the breed detection feature.',
            tips: [
                'You can also access from the homepage',
                'The page supports drag & drop uploads'
            ]
        },
        {
            step: 3,
            title: 'Upload Your Image',
            icon: Upload,
            description: 'Drag and drop your cattle image or click to browse and select the file from your device.',
            tips: [
                'Supported formats: JPG, PNG, WEBP',
                'Maximum file size: 10MB',
                'Multi-image analysis coming soon'
            ]
        },
        {
            step: 4,
            title: 'AI Analysis',
            icon: Cpu,
            description: 'Our advanced AI model will analyze the image and identify the cattle breed based on physical characteristics.',
            tips: [
                'Analysis typically takes 2-5 seconds',
                'The model checks body shape, color, horn pattern, and more',
                'Trained on 56 Indian cattle breeds'
            ]
        },
        {
            step: 5,
            title: 'View Results',
            icon: CheckCircle,
            description: 'Get detailed breed information including milk yield, characteristics, origin, and care recommendations.',
            tips: [
                'Confidence score shows prediction accuracy',
                'Click on breed name for more details',
                'Save results for future reference'
            ]
        }
    ];

    const faqs = [
        {
            question: 'What cattle breeds can this system identify?',
            answer: 'Our system can identify 56 NBAGR registered Indian cattle breeds including Gir, Sahiwal, Tharparkar, Kankrej, Ongole, Hallikar, Kangayam, and many more.'
        },
        {
            question: 'How accurate is the breed detection?',
            answer: 'Our AI model has an average accuracy of 94.2% across all supported breeds. Accuracy may vary based on image quality and visibility of breed characteristics.'
        },
        {
            question: 'Can I analyze multiple images at once?',
            answer: 'Currently, single image analysis is supported. Multi-image batch processing feature is coming soon.'
        },
        {
            question: 'What image formats are supported?',
            answer: 'We support JPG, JPEG, PNG, and WEBP formats. Images should be less than 10MB in size.'
        },
        {
            question: 'Where can I learn more about cattle breeds?',
            answer: 'Visit the Advisory Dashboard to explore detailed information about all 56 Indian cattle breeds including their characteristics, milk yield, and care requirements.'
        }
    ];

    return (
        <AppLayout>
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                            <HelpCircle className="w-5 h-5 text-white" />
                        </div>
                        <h2 className="text-sm text-text-muted uppercase tracking-wide">
                            Help & Guide
                        </h2>
                    </div>
                    <h1 className="text-3xl font-bold text-text mb-2">How to Analyze Cattle Breed</h1>
                    <p className="text-text-secondary max-w-2xl">
                        Follow this step-by-step guide to accurately identify cattle breeds using our AI-powered system.
                    </p>
                </div>

                {/* Step-by-Step Guide */}
                <div className="mb-10">
                    <h2 className="text-xl font-bold text-text mb-6 flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-primary" />
                        Step-by-Step Breed Analysis Guide
                    </h2>

                    <div className="space-y-6">
                        {analysisSteps.map((item, index) => (
                            <Card key={item.step} padding="lg" className="relative overflow-hidden">
                                {/* Step Number Badge */}
                                <div className="absolute top-6 right-6 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                    <span className="text-xl font-bold text-primary">{item.step}</span>
                                </div>

                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                                        <item.icon className="w-6 h-6 text-primary" />
                                    </div>
                                    <div className="flex-1 pr-16">
                                        <h3 className="text-lg font-semibold text-text mb-2">
                                            {item.title}
                                        </h3>
                                        <p className="text-text-secondary mb-4">
                                            {item.description}
                                        </p>

                                        {/* Tips */}
                                        <div className="bg-surface-hover rounded-xl p-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Lightbulb className="w-4 h-4 text-accent-dark" />
                                                <span className="text-sm font-medium text-text">Tips</span>
                                            </div>
                                            <ul className="space-y-1">
                                                {item.tips.map((tip, tipIndex) => (
                                                    <li key={tipIndex} className="flex items-start gap-2 text-sm text-text-secondary">
                                                        <ArrowRight className="w-3 h-3 text-primary mt-1 flex-shrink-0" />
                                                        {tip}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                {/* Connector Line */}
                                {index < analysisSteps.length - 1 && (
                                    <div className="absolute -bottom-6 left-10 w-0.5 h-6 bg-primary/20" />
                                )}
                            </Card>
                        ))}
                    </div>
                </div>

                {/* FAQs */}
                <div className="mb-10">
                    <h2 className="text-xl font-bold text-text mb-6 flex items-center gap-2">
                        <Info className="w-5 h-5 text-primary" />
                        Frequently Asked Questions
                    </h2>

                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <Card key={index} padding="md">
                                <h3 className="font-semibold text-text mb-2">{faq.question}</h3>
                                <p className="text-text-secondary">{faq.answer}</p>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Contact Support */}
                <Card padding="lg" className="bg-primary/5 border-primary/20">
                    <div className="text-center">
                        <HelpCircle className="w-12 h-12 text-primary mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-text mb-2">Need More Help?</h3>
                        <p className="text-text-secondary mb-4">
                            Contact our support team for technical assistance or feedback.
                        </p>
                        <p className="text-primary font-medium">support@bharatpashudhan.com</p>
                    </div>
                </Card>
            </div>
        </AppLayout>
    );
};

export default HelpPage;
