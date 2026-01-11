import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Scan } from 'lucide-react';
import Button from '../ui/Button';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Analyze Breed', path: '/analyze' },
        { name: 'Analytics', path: '/analytics' },
        { name: 'Advisory Dashboard', path: '/advisory' },
        { name: 'Vet & NGO Services', path: '/nearby-services' },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-surface/80 backdrop-blur-xl border-b border-gray-100/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 group">
                        <img 
                            src="/favicon.jpg" 
                            alt="Breed Vision Logo" 
                            className="w-12 h-12 rounded-xl shadow-lg object-cover
                              group-hover:shadow-[0_10px_30px_rgba(15,118,110,0.3)] 
                              group-hover:-translate-y-0.5
                              transition-all duration-300 ease-out"
                        />
                        <div>
                            <span className="text-xl font-bold text-text">Breed</span>
                            <span className="text-xl font-bold text-primary"> Vision</span>
                        </div>
                    </Link>

                    {/* Desktop Navigation - Animated Nav Links */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`
                  nav-link-animated text-sm font-medium
                  ${isActive(link.path) ? 'active' : ''}
                `}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    {/* CTA Button with Shimmer */}
                    <div className="hidden md:block">
                        <Link to="/analyze">
                            <Button variant="primary" size="md" icon={Scan} shimmer>
                                Analyze Breed
                            </Button>
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 rounded-lg hover:bg-surface-hover transition-all duration-300"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? (
                            <X className="w-6 h-6 text-text" />
                        ) : (
                            <Menu className="w-6 h-6 text-text" />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-surface/95 backdrop-blur-xl border-t border-gray-100 animate-slide-up">
                    <div className="px-4 py-4 space-y-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                onClick={() => setIsMenuOpen(false)}
                                className={`
                  block px-4 py-3 rounded-xl text-sm font-medium 
                  transition-all duration-300 ease-out
                  ${isActive(link.path)
                                        ? 'bg-primary/10 text-primary border-l-4 border-primary'
                                        : 'text-text-secondary hover:bg-surface-hover hover:translate-x-1'
                                    }
                `}
                            >
                                {link.name}
                            </Link>
                        ))}
                        <div className="pt-2">
                            <Link to="/analyze" onClick={() => setIsMenuOpen(false)}>
                                <Button variant="primary" size="md" className="w-full" icon={Scan} shimmer>
                                    Analyze Breed
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
