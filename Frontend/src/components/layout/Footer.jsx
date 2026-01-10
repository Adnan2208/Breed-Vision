import React from 'react';
import { Link } from 'react-router-dom';
import { Scan, Mail, Phone, MapPin, Github, Twitter, Linkedin } from 'lucide-react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const footerLinks = {
        product: [
            { name: 'Analyze Breed', path: '/analyze' },
            { name: 'Analytics', path: '/analytics' },
            { name: 'Advisory Dashboard', path: '/advisory' },
        ],
        resources: [
            { name: 'Documentation', path: '#' },
            { name: 'API Reference', path: '#' },
            { name: 'Help Center', path: '#' },
        ],
        company: [
            { name: 'About Us', path: '#' },
            { name: 'Contact', path: '#' },
            { name: 'Privacy Policy', path: '#' },
        ],
    };

    return (
        <footer className="bg-text text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Main Footer */}
                <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
                    {/* Brand Section */}
                    <div className="lg:col-span-2">
                        <Link to="/" className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
                                <Scan className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <span className="text-xl font-bold">Bharat</span>
                                <span className="text-xl font-bold text-primary-light"> Pashudhan</span>
                            </div>
                        </Link>
                        <p className="text-gray-400 mb-6 max-w-sm">
                            AI-powered cattle breed recognition system empowering farmers and livestock
                            authorities across India with accurate breed identification and advisory.
                        </p>
                        <div className="flex items-center gap-4">
                            {[Github, Twitter, Linkedin].map((Icon, index) => (
                                <a
                                    key={index}
                                    href="#"
                                    className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center
                           hover:bg-primary transition-colors duration-200"
                                >
                                    <Icon className="w-5 h-5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Product Links */}
                    <div>
                        <h3 className="font-semibold text-lg mb-4">Product</h3>
                        <ul className="space-y-3">
                            {footerLinks.product.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        to={link.path}
                                        className="text-gray-400 hover:text-white transition-colors duration-200"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Resources Links */}
                    <div>
                        <h3 className="font-semibold text-lg mb-4">Resources</h3>
                        <ul className="space-y-3">
                            {footerLinks.resources.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        to={link.path}
                                        className="text-gray-400 hover:text-white transition-colors duration-200"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="font-semibold text-lg mb-4">Contact</h3>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-3 text-gray-400">
                                <Mail className="w-4 h-4" />
                                <span>support@bharatpashudhan.gov.in</span>
                            </li>
                            <li className="flex items-center gap-3 text-gray-400">
                                <Phone className="w-4 h-4" />
                                <span>1800-XXX-XXXX</span>
                            </li>
                            <li className="flex items-center gap-3 text-gray-400">
                                <MapPin className="w-4 h-4" />
                                <span>New Delhi, India</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="py-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-gray-400 text-sm">
                        © {currentYear} Bharat Pashudhan. All rights reserved.
                    </p>
                    <p className="text-gray-400 text-sm">
                        Made with ❤️ for Indian Farmers
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
