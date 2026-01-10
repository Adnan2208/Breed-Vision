import React, { useState, useMemo } from 'react';
import {
    Search,
    Filter,
    MapPin,
    Droplet,
    Leaf,
    Heart,
    Scale,
    Clock,
    Beaker,
    Info,
    X,
    ChevronRight,
    Grid3X3,
    List,
    Sparkles,
    ThermometerSun,
    Target,
    Award,
    BookOpen
} from 'lucide-react';
import { AppLayout } from '../components/layout';
import { Card, Badge, Button, Modal, Input } from '../components/ui';
import { breeds } from '../data/mockData';

const AdvisoryPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedType, setSelectedType] = useState('all');
    const [viewMode, setViewMode] = useState('grid');
    const [selectedBreed, setSelectedBreed] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Get unique types for filter
    const types = useMemo(() => {
        const uniqueTypes = [...new Set(breeds.map(b => b.type))];
        return ['all', ...uniqueTypes];
    }, []);

    // Filter breeds based on search and type
    const filteredBreeds = useMemo(() => {
        return breeds.filter(breed => {
            const matchesSearch =
                breed.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                breed.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
                breed.characteristics.toLowerCase().includes(searchTerm.toLowerCase()) ||
                breed.bestFor.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesType = selectedType === 'all' || breed.type === selectedType;

            return matchesSearch && matchesType;
        });
    }, [searchTerm, selectedType]);

    const handleBreedClick = (breed) => {
        setSelectedBreed(breed);
        setIsModalOpen(true);
    };

    // Use unified premium white badge style for all breed types
    const getTypeColor = () => 'default';

    return (
        <AppLayout>
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                            <BookOpen className="w-5 h-5 text-white" />
                        </div>
                        <h2 className="text-sm text-text-muted uppercase tracking-wide">
                            Comprehensive Breed Database
                        </h2>
                    </div>
                    <p className="text-text-secondary max-w-2xl">
                        Explore detailed information on {breeds.length} cattle breeds including indigenous Indian breeds
                        and exotic varieties. Get advisory on milk yield, characteristics, and best practices.
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {[
                        { label: 'Total Breeds', value: breeds.length, icon: Target, color: 'primary' },
                        { label: 'Dairy Breeds', value: breeds.filter(b => b.type === 'Dairy').length, icon: Droplet, color: 'primary' },
                        { label: 'Dual Purpose', value: breeds.filter(b => b.type === 'Dual').length, icon: Award, color: 'primary' },
                        { label: 'Draft Breeds', value: breeds.filter(b => b.type.includes('Draft')).length, icon: Scale, color: 'primary' },
                    ].map((stat, index) => (
                        <Card key={index} padding="md" className="group relative overflow-hidden">
                            <div className={`absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity
                ${stat.color === 'primary' ? 'bg-primary' : ''}
                ${stat.color === 'secondary' ? 'bg-secondary' : ''}
                ${stat.color === 'accent' ? 'bg-accent' : ''}
              `} />
                            <div className="relative flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center
                  ${stat.color === 'primary' ? 'bg-primary/10' : ''}
                  ${stat.color === 'secondary' ? 'bg-secondary/10' : ''}
                  ${stat.color === 'accent' ? 'bg-accent/20' : ''}
                `}>
                                    <stat.icon className={`w-5 h-5
                    ${stat.color === 'primary' ? 'text-primary' : ''}
                    ${stat.color === 'secondary' ? 'text-secondary' : ''}
                    ${stat.color === 'accent' ? 'text-accent-dark' : ''}
                  `} />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-text">{stat.value}</p>
                                    <p className="text-sm text-text-muted">{stat.label}</p>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Filters & Search */}
                <Card padding="md" className="mb-6">
                    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                        {/* Search */}
                        <div className="flex-1 max-w-md">
                            <Input
                                placeholder="Search breeds by name, origin, characteristics..."
                                icon={Search}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="flex items-center gap-4">
                            {/* Type Filter */}
                            <div className="flex items-center gap-2">
                                <Filter className="w-4 h-4 text-text-muted" />
                                <select
                                    value={selectedType}
                                    onChange={(e) => setSelectedType(e.target.value)}
                                    className="px-4 py-2 rounded-xl border border-gray-200 bg-surface text-text
                           focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                >
                                    {types.map(type => (
                                        <option key={type} value={type}>
                                            {type === 'all' ? 'All Types' : type}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* View Toggle */}
                            <div className="flex items-center gap-1 p-1 bg-surface-hover rounded-xl">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2 rounded-lg transition-colors ${viewMode === 'grid'
                                        ? 'bg-primary text-white'
                                        : 'text-text-secondary hover:text-text'
                                        }`}
                                >
                                    <Grid3X3 className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setViewMode('table')}
                                    className={`p-2 rounded-lg transition-colors ${viewMode === 'table'
                                        ? 'bg-primary text-white'
                                        : 'text-text-secondary hover:text-text'
                                        }`}
                                >
                                    <List className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Results count */}
                    <div className="mt-4 pt-4 border-t border-gray-100">
                        <p className="text-sm text-text-secondary">
                            Showing <span className="font-medium text-text">{filteredBreeds.length}</span> of{' '}
                            <span className="font-medium text-text">{breeds.length}</span> breeds
                        </p>
                    </div>
                </Card>

                {/* Grid View */}
                {viewMode === 'grid' && (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredBreeds.map((breed) => (
                            <Card
                                key={breed.id}
                                className="group cursor-pointer overflow-hidden relative"
                                padding="none"
                                onClick={() => handleBreedClick(breed)}
                            >
                                {/* Shimmer effect on hover */}
                                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full 
                              bg-gradient-to-r from-transparent via-white/20 to-transparent
                              transition-transform duration-700 ease-in-out z-10" />

                                <div className="relative h-52 overflow-hidden">
                                    <img
                                        src={breed.image}
                                        alt={breed.name}
                                        className="w-full h-full object-cover group-hover:scale-110 
                             transition-transform duration-700 ease-out"
                                        onError={(e) => {
                                            e.target.src = 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=400&h=300&fit=crop';
                                        }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                                    {/* Type Badge */}
                                    <div className="absolute top-4 left-4">
                                        <Badge variant={getTypeColor(breed.type)} size="md" className="shadow-lg">
                                            {breed.type}
                                        </Badge>
                                    </div>

                                    {/* Quick Stats Overlay */}
                                    <div className="absolute bottom-0 left-0 right-0 p-4">
                                        <h3 className="text-xl font-bold text-white mb-1 group-hover:text-primary-light transition-colors">
                                            {breed.name}
                                        </h3>
                                        <p className="text-sm text-white/80 flex items-center gap-1">
                                            <MapPin className="w-3 h-3" />
                                            {breed.origin}
                                        </p>
                                    </div>
                                </div>

                                <div className="p-5 relative">
                                    {/* Characteristics */}
                                    <p className="text-sm text-text-secondary mb-4 line-clamp-2">
                                        {breed.characteristics}
                                    </p>

                                    {/* Key Metrics */}
                                    <div className="grid grid-cols-2 gap-3 mb-4">
                                        <div className="flex items-center gap-2 p-2 bg-primary/5 rounded-lg 
                                  group-hover:bg-primary/10 transition-colors">
                                            <Droplet className="w-4 h-4 text-primary" />
                                            <span className="text-xs text-text-secondary truncate">{breed.milkYield}</span>
                                        </div>
                                        <div className="flex items-center gap-2 p-2 bg-secondary/5 rounded-lg
                                  group-hover:bg-secondary/10 transition-colors">
                                            <Beaker className="w-4 h-4 text-secondary" />
                                            <span className="text-xs text-text-secondary truncate">{breed.fatContent}</span>
                                        </div>
                                        <div className="flex items-center gap-2 p-2 bg-accent/10 rounded-lg
                                  group-hover:bg-accent/20 transition-colors">
                                            <Scale className="w-4 h-4 text-accent-dark" />
                                            <span className="text-xs text-text-secondary truncate">{breed.avgWeight}</span>
                                        </div>
                                        <div className="flex items-center gap-2 p-2 bg-purple-50 rounded-lg
                                  group-hover:bg-purple-100 transition-colors">
                                            <Clock className="w-4 h-4 text-purple-500" />
                                            <span className="text-xs text-text-secondary truncate">{breed.lifespan}</span>
                                        </div>
                                    </div>

                                    {/* View Details Button */}
                                    <button className="w-full flex items-center justify-center gap-2 py-2.5 
                                   text-primary font-medium bg-primary/5 hover:bg-primary 
                                   hover:text-white rounded-xl transition-all duration-300
                                   group-hover:shadow-lg">
                                        <Sparkles className="w-4 h-4" />
                                        View Full Advisory
                                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Table View */}
                {viewMode === 'table' && (
                    <Card padding="none" className="overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-surface-hover border-b border-gray-100">
                                        <th className="text-left py-4 px-6 font-semibold text-text">Breed</th>
                                        <th className="text-left py-4 px-6 font-semibold text-text">Origin</th>
                                        <th className="text-left py-4 px-6 font-semibold text-text">Type</th>
                                        <th className="text-left py-4 px-6 font-semibold text-text">Milk Yield</th>
                                        <th className="text-left py-4 px-6 font-semibold text-text">Fat %</th>
                                        <th className="text-left py-4 px-6 font-semibold text-text">Weight</th>
                                        <th className="text-left py-4 px-6 font-semibold text-text">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredBreeds.map((breed, index) => (
                                        <tr
                                            key={breed.id}
                                            className={`
                        border-b border-gray-50 hover:bg-primary/5 transition-all duration-200 cursor-pointer
                        ${index % 2 === 0 ? 'bg-surface' : 'bg-white'}
                      `}
                                            onClick={() => handleBreedClick(breed)}
                                        >
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={breed.image}
                                                        alt={breed.name}
                                                        className="w-14 h-14 rounded-xl object-cover shadow-sm 
                                     hover:shadow-md transition-shadow"
                                                        onError={(e) => {
                                                            e.target.src = 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=100&h=100&fit=crop';
                                                        }}
                                                    />
                                                    <div>
                                                        <p className="font-semibold text-text">{breed.name}</p>
                                                        <p className="text-xs text-text-muted">{breed.color}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className="text-text-secondary">{breed.origin}</span>
                                            </td>
                                            <td className="py-4 px-6">
                                                <Badge variant={getTypeColor(breed.type)} size="sm">
                                                    {breed.type}
                                                </Badge>
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className="text-text-secondary font-medium">{breed.milkYield}</span>
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className="text-text-secondary">{breed.fatContent}</span>
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className="text-text-secondary">{breed.avgWeight}</span>
                                            </td>
                                            <td className="py-4 px-6">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleBreedClick(breed);
                                                    }}
                                                >
                                                    <Info className="w-4 h-4" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                )}

                {/* No Results */}
                {filteredBreeds.length === 0 && (
                    <Card padding="xl" className="text-center">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-100 flex items-center justify-center">
                            <Search className="w-8 h-8 text-text-muted" />
                        </div>
                        <h3 className="text-lg font-semibold text-text mb-2">No breeds found</h3>
                        <p className="text-text-secondary">
                            Try adjusting your search or filter criteria
                        </p>
                    </Card>
                )}

                {/* Breed Detail Modal */}
                <Modal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    title={selectedBreed?.name}
                    size="xl"
                >
                    {selectedBreed && (
                        <div className="space-y-6">
                            {/* Header Image */}
                            <div className="relative h-56 rounded-xl overflow-hidden">
                                <img
                                    src={selectedBreed.image}
                                    alt={selectedBreed.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.src = 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=800&h=400&fit=crop';
                                    }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                                    <div>
                                        <Badge variant={getTypeColor(selectedBreed.type)} size="lg" className="mb-2">
                                            {selectedBreed.type}
                                        </Badge>
                                        <p className="text-white/90 flex items-center gap-1">
                                            <MapPin className="w-4 h-4" />
                                            {selectedBreed.origin}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Key Metrics Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="p-4 bg-primary/5 rounded-xl text-center">
                                    <Droplet className="w-6 h-6 text-primary mx-auto mb-2" />
                                    <p className="text-xs text-text-muted mb-1">Milk Yield</p>
                                    <p className="font-bold text-text">{selectedBreed.milkYield}</p>
                                </div>
                                <div className="p-4 bg-secondary/5 rounded-xl text-center">
                                    <Beaker className="w-6 h-6 text-secondary mx-auto mb-2" />
                                    <p className="text-xs text-text-muted mb-1">Fat Content</p>
                                    <p className="font-bold text-text">{selectedBreed.fatContent}</p>
                                </div>
                                <div className="p-4 bg-accent/10 rounded-xl text-center">
                                    <Scale className="w-6 h-6 text-accent-dark mx-auto mb-2" />
                                    <p className="text-xs text-text-muted mb-1">Avg Weight</p>
                                    <p className="font-bold text-text">{selectedBreed.avgWeight}</p>
                                </div>
                                <div className="p-4 bg-purple-50 rounded-xl text-center">
                                    <Clock className="w-6 h-6 text-purple-500 mx-auto mb-2" />
                                    <p className="text-xs text-text-muted mb-1">Lifespan</p>
                                    <p className="font-bold text-text">{selectedBreed.lifespan}</p>
                                </div>
                            </div>

                            {/* Additional Details */}
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div className="flex items-start gap-3 p-4 bg-surface-hover rounded-xl">
                                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                        <Clock className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-text-muted">Lactation Period</p>
                                        <p className="font-medium text-text">{selectedBreed.lactationPeriod}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 p-4 bg-surface-hover rounded-xl">
                                    <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
                                        <ThermometerSun className="w-5 h-5 text-secondary" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-text-muted">Temperature Tolerance</p>
                                        <p className="font-medium text-text">{selectedBreed.temperatureTolerance}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 p-4 bg-surface-hover rounded-xl">
                                    <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0">
                                        <Leaf className="w-5 h-5 text-accent-dark" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-text-muted">Color</p>
                                        <p className="font-medium text-text">{selectedBreed.color}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 p-4 bg-surface-hover rounded-xl">
                                    <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                                        <Target className="w-5 h-5 text-purple-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-text-muted">Horn Type</p>
                                        <p className="font-medium text-text">{selectedBreed.hornType}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Characteristics */}
                            <div className="p-4 bg-primary/5 rounded-xl">
                                <h4 className="font-semibold text-text mb-2 flex items-center gap-2">
                                    <Heart className="w-4 h-4 text-primary" />
                                    Key Characteristics
                                </h4>
                                <p className="text-text-secondary">{selectedBreed.characteristics}</p>
                            </div>

                            {/* Best For */}
                            <div className="p-4 bg-secondary/5 rounded-xl">
                                <h4 className="font-semibold text-text mb-2 flex items-center gap-2">
                                    <Award className="w-4 h-4 text-secondary" />
                                    Best Suited For
                                </h4>
                                <p className="text-text-secondary">{selectedBreed.bestFor}</p>
                            </div>

                            {/* Special Notes */}
                            <div className="p-4 bg-accent/10 rounded-xl">
                                <h4 className="font-semibold text-text mb-2 flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-accent-dark" />
                                    Special Notes
                                </h4>
                                <p className="text-text-secondary">{selectedBreed.specialNotes}</p>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 pt-4 border-t border-gray-100">
                                <Button
                                    variant="primary"
                                    className="flex-1"
                                    onClick={() => setIsModalOpen(false)}
                                >
                                    Close Advisory
                                </Button>
                            </div>
                        </div>
                    )}
                </Modal>
            </div>
        </AppLayout>
    );
};

export default AdvisoryPage;
