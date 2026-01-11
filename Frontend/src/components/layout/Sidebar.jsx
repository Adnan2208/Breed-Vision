import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Scan,
    BarChart3,
    Shield,
    HelpCircle,
    ChevronLeft,
    ChevronRight,
    MapPin,
    Building2
} from 'lucide-react';

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
    const location = useLocation();

    const menuItems = [
        {
            name: 'Analyze Breed',
            path: '/analyze',
            icon: Scan,
            description: 'Detect cattle breed'
        },
        {
            name: 'Analytics',
            path: '/analytics',
            icon: BarChart3,
            description: 'View statistics'
        },
        {
            name: 'Advisory Dashboard',
            path: '/advisory',
            icon: Shield,
            description: 'Breed information'
        },
        {
            name: 'Nearby Services',
            path: '/nearby-services',
            icon: MapPin,
            description: 'Find vets & NGOs'
        },
    ];

    const bottomItems = [
        { name: 'Help', path: '/help', icon: HelpCircle },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <aside
            className={`
        fixed left-0 top-0 h-screen bg-surface border-r border-gray-100
        transition-all duration-300 ease-out z-40 flex flex-col
        ${isCollapsed ? 'w-20' : 'w-64'}
      `}
        >
            {/* Logo */}
            <div className="h-20 flex items-center justify-center border-b border-gray-100 px-4">
                <NavLink to="/" className="flex items-center gap-3">
                    <img 
                        src="/favicon.jpg" 
                        alt="Logo" 
                        className="w-10 h-10 rounded-xl shadow-md flex-shrink-0 object-cover"
                    />
                    {!isCollapsed && (
                        <span className="font-bold text-text whitespace-nowrap">
                            Breed<span className="text-primary"> Vision</span>
                        </span>
                    )}
                </NavLink>
            </div>

            {/* Main Navigation */}
            <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={`
              flex items-center gap-3 px-4 py-3 rounded-xl
              transition-all duration-200 group
              ${isActive(item.path)
                                ? 'bg-primary text-white shadow-lg'
                                : 'text-text-secondary hover:bg-surface-hover hover:text-text'
                            }
            `}
                    >
                        <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive(item.path) ? '' : 'group-hover:text-primary'}`} />
                        {!isCollapsed && (
                            <div className="min-w-0">
                                <p className="font-medium truncate">{item.name}</p>
                                <p className={`text-xs truncate ${isActive(item.path) ? 'text-white/70' : 'text-text-muted'}`}>
                                    {item.description}
                                </p>
                            </div>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* Bottom Navigation */}
            <div className="py-4 px-3 border-t border-gray-100 space-y-1">
                {bottomItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={`
              flex items-center gap-3 px-4 py-2.5 rounded-xl
              transition-all duration-200 text-text-secondary
              hover:bg-surface-hover hover:text-text
            `}
                    >
                        <item.icon className="w-5 h-5 flex-shrink-0" />
                        {!isCollapsed && (
                            <span className="font-medium truncate">{item.name}</span>
                        )}
                    </NavLink>
                ))}
            </div>

            {/* Collapse Toggle */}
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="absolute -right-3 top-24 w-6 h-6 bg-surface border border-gray-200 rounded-full 
                   flex items-center justify-center shadow-sm hover:shadow-md transition-all
                   hover:bg-primary hover:text-white hover:border-primary"
            >
                {isCollapsed ? (
                    <ChevronRight className="w-4 h-4" />
                ) : (
                    <ChevronLeft className="w-4 h-4" />
                )}
            </button>
        </aside>
    );
};

export default Sidebar;
