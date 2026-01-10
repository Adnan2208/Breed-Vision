import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Bell, Search, Home } from 'lucide-react';

const AppLayout = ({ children }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const location = useLocation();

    const getPageTitle = () => {
        switch (location.pathname) {
            case '/analyze':
                return 'Breed Detection';
            case '/analytics':
                return 'Analytics Dashboard';
            case '/advisory':
                return 'Advisory Dashboard';
            default:
                return 'Dashboard';
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

            {/* Main Content */}
            <main
                className={`
          transition-all duration-300 ease-out min-h-screen
          ${isCollapsed ? 'ml-20' : 'ml-64'}
        `}
            >
                {/* Top Bar */}
                <header className="sticky top-0 z-30 bg-surface/80 backdrop-blur-lg border-b border-gray-100">
                    <div className="flex items-center justify-between h-20 px-8">
                        {/* Left - Breadcrumb & Title */}
                        <div>
                            <div className="flex items-center gap-2 text-sm text-text-muted mb-1">
                                <Link to="/" className="hover:text-primary transition-colors">
                                    <Home className="w-4 h-4" />
                                </Link>
                                <span>/</span>
                                <span className="text-text-secondary">{getPageTitle()}</span>
                            </div>
                            <h1 className="text-2xl font-bold text-text">{getPageTitle()}</h1>
                        </div>

                        {/* Right - Actions */}
                        <div className="flex items-center gap-4">
                            {/* Search */}
                            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-surface-hover rounded-xl">
                                <Search className="w-4 h-4 text-text-muted" />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="bg-transparent border-none outline-none text-sm w-40 placeholder-text-muted"
                                />
                            </div>

                            {/* Notifications */}
                            <button className="relative p-2 rounded-xl hover:bg-surface-hover transition-colors">
                                <Bell className="w-5 h-5 text-text-secondary" />
                                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-secondary rounded-full" />
                            </button>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default AppLayout;
