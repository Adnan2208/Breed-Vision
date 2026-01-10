import React from 'react';
import { Link } from 'react-router-dom';
import {
    Scan,
    Target,
    Lightbulb,
    ArrowRight,
    CheckCircle,
    TrendingUp,
    Shield,
    Zap
} from 'lucide-react';
import { Navbar, Footer } from '../components/layout';
import { Button, Card, Badge } from '../components/ui';
import { breeds } from '../data/mockData';

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Left Content */}
                        <div className="animate-slide-up">
                            <Badge variant="primary" size="lg" className="mb-6">
                                🇮🇳 Made for Indian Farmers
                            </Badge>

                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-text leading-tight mb-6">
                                AI-Powered{' '}
                                <span className="text-gradient">Cattle Breed</span>{' '}
                                Recognition System
                            </h1>

                            <p className="text-lg text-text-secondary mb-8 max-w-xl">
                                Difficulty in identifying cattle breeds leads to poor breeding decisions
                                and reduced productivity. Our AI system provides instant, accurate breed
                                detection to empower farmers and livestock authorities.
                            </p>

                            <div className="flex flex-wrap gap-4 mb-10">
                                <Link to="/analyze">
                                    <Button variant="primary" size="lg" icon={Scan}>
                                        Analyze Breed
                                    </Button>
                                </Link>
                                <Link to="/analytics">
                                    <Button variant="outline" size="lg" icon={TrendingUp}>
                                        View Analytics
                                    </Button>
                                </Link>
                            </div>

                            {/* Stats */}
                            <div className="flex flex-wrap gap-8">
                                <div>
                                    <p className="text-3xl font-bold text-primary">94.2%</p>
                                    <p className="text-sm text-text-muted">Model Accuracy</p>
                                </div>
                                <div>
                                    <p className="text-3xl font-bold text-accent-dark">40+</p>
                                    <p className="text-sm text-text-muted">Breeds Supported</p>
                                </div>
                            </div>
                        </div>

                        {/* Right - Hero Image */}
                        <div className="relative flex justify-center lg:justify-end">
                            <div className="relative w-full max-w-lg">
                                {/* Glow effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-3xl blur-3xl" />

                                {/* Main image container */}
                                <div className="relative bg-gradient-to-br from-primary/10 to-secondary/10 rounded-3xl p-8 animate-float">
                                    <img
                                        src="https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=500&h=400&fit=crop"
                                        alt="Indian Cattle"
                                        className="w-full h-auto rounded-2xl shadow-2xl"
                                    />

                                    {/* Floating badge */}
                                    <div className="absolute -bottom-4 -left-4 bg-surface rounded-xl p-4 shadow-card">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
                                                <CheckCircle className="w-5 h-5 text-white" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-text">Gir Breed</p>
                                                <p className="text-sm text-text-muted">94% Confidence</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Floating stats */}
                                    <div className="absolute -top-4 -right-4 bg-surface rounded-xl p-3 shadow-card">
                                        <div className="flex items-center gap-2">
                                            <Zap className="w-5 h-5 text-accent" />
                                            <span className="font-semibold text-text">Instant Results</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Problem & Solution Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 bg-surface">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <Badge variant="accent" className="mb-4">The Challenge</Badge>
                        <h2 className="text-3xl sm:text-4xl font-bold text-text mb-4">
                            Why Breed Identification Matters
                        </h2>
                        <p className="text-lg text-text-secondary max-w-2xl mx-auto">
                            Accurate breed identification is crucial for better livestock management,
                            breeding programs, and agricultural productivity.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Problem Card */}
                        <Card className="group relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-secondary to-secondary-light" />
                            <div className="flex items-start gap-4">
                                <div className="w-14 h-14 rounded-xl bg-secondary/10 flex items-center justify-center flex-shrink-0">
                                    <Target className="w-7 h-7 text-secondary" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-text mb-3">The Problem</h3>
                                    <ul className="space-y-3">
                                        {[
                                            'Difficulty in accurate breed identification',
                                            'Lack of accessible tools for farmers',
                                            'Poor breeding decisions affecting productivity',
                                            'Limited knowledge of breed-specific care'
                                        ].map((item, index) => (
                                            <li key={index} className="flex items-start gap-2 text-text-secondary">
                                                <span className="w-1.5 h-1.5 rounded-full bg-secondary mt-2 flex-shrink-0" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </Card>

                        {/* Solution Card */}
                        <Card className="group relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-primary-light" />
                            <div className="flex items-start gap-4">
                                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                                    <Lightbulb className="w-7 h-7 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-text mb-3">Our Solution</h3>
                                    <ul className="space-y-3">
                                        {[
                                            'AI-based image analysis for instant recognition',
                                            'Support for 12+ indigenous cattle breeds',
                                            'Breed-specific advisory and care guidelines',
                                            'Multi-language support for all farmers'
                                        ].map((item, index) => (
                                            <li key={index} className="flex items-start gap-2 text-text-secondary">
                                                <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Breed Overview Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <Badge variant="primary" className="mb-4">Breed Database</Badge>
                        <h2 className="text-3xl sm:text-4xl font-bold text-text mb-4">
                            Supported Cattle Breeds
                        </h2>
                        <p className="text-lg text-text-secondary max-w-2xl mx-auto">
                            Our AI model is trained to recognize all major indigenous and exotic cattle
                            breeds found across India.
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {breeds.slice(0, 8).map((breed) => (
                            <Card
                                key={breed.id}
                                className="group overflow-hidden cursor-pointer"
                                padding="none"
                                premium
                            >
                                {/* Image with zoom effect */}
                                <div className="relative h-48 overflow-hidden card-image-zoom">
                                    <img
                                        src={breed.image}
                                        alt={breed.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.src = 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=400&h=300&fit=crop';
                                        }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                                    <div className="absolute bottom-4 left-4 right-4">
                                        <Badge variant="accent" size="sm">{breed.type}</Badge>
                                    </div>
                                </div>
                                <div className="p-5">
                                    <h3 className="text-lg font-bold text-text mb-1 group-hover:text-primary transition-colors duration-300">
                                        {breed.name}
                                    </h3>
                                    <p className="text-sm text-text-muted mb-3">{breed.origin}</p>
                                    <p className="text-sm text-text-secondary line-clamp-2">
                                        {breed.characteristics}
                                    </p>
                                </div>
                            </Card>
                        ))}
                    </div>

                    <div className="text-center mt-10">
                        <Link to="/advisory">
                            <Button variant="outline" size="lg" icon={ArrowRight} iconPosition="right">
                                View All Breeds
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 bg-surface">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <Badge variant="secondary" className="mb-4">Features</Badge>
                        <h2 className="text-3xl sm:text-4xl font-bold text-text mb-4">
                            Powerful Capabilities
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Scan,
                                title: 'Instant Detection',
                                description: 'Upload an image and get breed identification in seconds with our advanced AI model.',
                                color: 'primary'
                            },
                            {
                                icon: Shield,
                                title: 'Authority Dashboard',
                                description: 'Comprehensive dashboard for livestock authorities to manage breed data and analytics.',
                                color: 'secondary'
                            },
                            {
                                icon: TrendingUp,
                                title: 'Analytics & Insights',
                                description: 'Track detection statistics, breed distribution, and model performance over time.',
                                color: 'accent'
                            }
                        ].map((feature, index) => (
                            <Card key={index} className="text-center group">
                                <div className={`
                  w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center
                  ${feature.color === 'primary' ? 'bg-primary/10 group-hover:bg-primary' : ''}
                  ${feature.color === 'secondary' ? 'bg-secondary/10 group-hover:bg-secondary' : ''}
                  ${feature.color === 'accent' ? 'bg-accent/20 group-hover:bg-accent' : ''}
                  transition-colors duration-300
                `}>
                                    <feature.icon className={`
                    w-8 h-8 transition-colors duration-300
                    ${feature.color === 'primary' ? 'text-primary group-hover:text-white' : ''}
                    ${feature.color === 'secondary' ? 'text-secondary group-hover:text-white' : ''}
                    ${feature.color === 'accent' ? 'text-accent-dark group-hover:text-white' : ''}
                  `} />
                                </div>
                                <h3 className="text-xl font-bold text-text mb-3">{feature.title}</h3>
                                <p className="text-text-secondary">{feature.description}</p>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <Card
                        className="text-center relative overflow-hidden"
                        padding="xl"
                    >
                        {/* Background decoration */}
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5" />
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl" />

                        <div className="relative">
                            <Badge variant="accent" className="mb-6">Get Started Today</Badge>
                            <h2 className="text-3xl sm:text-4xl font-bold text-text mb-4">
                                Ready to Identify Your Cattle Breed?
                            </h2>
                            <p className="text-lg text-text-secondary mb-8 max-w-xl mx-auto">
                                Upload an image of your cattle and get instant breed identification
                                along with breed-specific advisory and care guidelines.
                            </p>
                            <div className="flex flex-wrap justify-center gap-4">
                                <Link to="/analyze">
                                    <Button variant="primary" size="lg" icon={Scan}>
                                        Start Analyzing
                                    </Button>
                                </Link>
                                <Link to="/advisory">
                                    <Button variant="ghost" size="lg" icon={ArrowRight} iconPosition="right">
                                        Explore Breeds
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </Card>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default LandingPage;
