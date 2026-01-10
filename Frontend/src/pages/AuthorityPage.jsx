import React, { useState, useMemo } from 'react';
import {
    Search,
    Filter,
    MapPin,
    Droplet,
    Leaf,
    Heart,
    Syringe,
    Info,
    X,
    ChevronRight,
    Grid3X3,
    List
} from 'lucide-react';
import { AppLayout } from '../components/layout';
import { Card, Badge, Button, Modal, Input } from '../components/ui';
import { breeds } from '../data/mockData';

const AuthorityPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPurpose, setSelectedPurpose] = useState('all');
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'
    const [selectedBreed, setSelectedBreed] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Get unique purposes for filter
    const purposes = useMemo(() => {
        const uniquePurposes = [...new Set(breeds.map(b => b.purpose))];
        return ['all', ...uniquePurposes];
    }, []);

    // Filter breeds based on search and purpose
    const filteredBreeds = useMemo(() => {
        return breeds.filter(breed => {
            const matchesSearch =
                breed.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                breed.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
                breed.description.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesPurpose = selectedPurpose === 'all' || breed.purpose === selectedPurpose;

            return matchesSearch && matchesPurpose;
        });
    }, [searchTerm, selectedPurpose]);

    const handleBreedClick = (breed) => {
        setSelectedBreed(breed);
        setIsModalOpen(true);
    };

    return (
        <AppLayout>
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h2 className="text-sm text-text-muted uppercase tracking-wide mb-2">
                        Breed Database
                    </h2>
                    <p className="text-text-secondary max-w-2xl">
                        Complete information on all cattle breeds recognized by our AI system.
                        Search, filter, and explore detailed breed characteristics.
                    </p>
                </div>

                {/* Filters & Search */}
                <Card padding="md" className="mb-6">
                    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                        {/* Search */}
                        <div className="flex-1 max-w-md">
                            <Input
                                placeholder="Search breeds by name, origin..."
                                icon={Search}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="flex items-center gap-4">
                            {/* Purpose Filter */}
                            <div className="flex items-center gap-2">
                                <Filter className="w-4 h-4 text-text-muted" />
                                <select
                                    value={selectedPurpose}
                                    onChange={(e) => setSelectedPurpose(e.target.value)}
                                    className="px-4 py-2 rounded-xl border border-gray-200 bg-surface text-text
                           focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                >
                                    {purposes.map(purpose => (
                                        <option key={purpose} value={purpose}>
                                            {purpose === 'all' ? 'All Purposes' : purpose}
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
                                className="group cursor-pointer overflow-hidden"
                                padding="none"
                                onClick={() => handleBreedClick(breed)}
                            >
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        src={breed.image}
                                        alt={breed.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                                    <div className="absolute bottom-4 left-4 right-4">
                                        <Badge variant="accent" size="sm" className="mb-2">
                                            {breed.purpose}
                                        </Badge>
                                        <h3 className="text-xl font-bold text-white">{breed.name}</h3>
                                        <p className="text-sm text-white/80 flex items-center gap-1 mt-1">
                                            <MapPin className="w-3 h-3" />
                                            {breed.origin}
                                        </p>
                                    </div>
                                </div>
                                <div className="p-5">
                                    <p className="text-sm text-text-secondary mb-4 line-clamp-2">
                                        {breed.description}
                                    </p>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="flex items-center gap-2 text-sm">
                                            <Droplet className="w-4 h-4 text-primary" />
                                            <span className="text-text-secondary truncate">{breed.milkYield}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <Leaf className="w-4 h-4 text-accent-dark" />
                                            <span className="text-text-secondary truncate">{breed.adaptability}</span>
                                        </div>
                                    </div>

                                    <button className="mt-4 w-full flex items-center justify-center gap-2 py-2 text-primary 
                                   font-medium hover:bg-primary/5 rounded-xl transition-colors">
                                        View Details
                                        <ChevronRight className="w-4 h-4" />
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
                                        <th className="text-left py-4 px-6 font-semibold text-text">Purpose</th>
                                        <th className="text-left py-4 px-6 font-semibold text-text">Milk Yield</th>
                                        <th className="text-left py-4 px-6 font-semibold text-text">Adaptability</th>
                                        <th className="text-left py-4 px-6 font-semibold text-text">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredBreeds.map((breed, index) => (
                                        <tr
                                            key={breed.id}
                                            className={`
                        border-b border-gray-50 hover:bg-surface-hover transition-colors cursor-pointer
                        ${index % 2 === 0 ? 'bg-surface' : 'bg-white'}
                      `}
                                            onClick={() => handleBreedClick(breed)}
                                        >
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={breed.image}
                                                        alt={breed.name}
                                                        className="w-12 h-12 rounded-xl object-cover"
                                                    />
                                                    <div>
                                                        <p className="font-medium text-text">{breed.name}</p>
                                                        <p className="text-sm text-text-muted">{breed.color}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className="text-text-secondary">{breed.origin}</span>
                                            </td>
                                            <td className="py-4 px-6">
                                                <Badge
                                                    variant={
                                                        breed.purpose === 'Dairy' ? 'primary' :
                                                            breed.purpose === 'Draft' ? 'secondary' : 'accent'
                                                    }
                                                    size="sm"
                                                >
                                                    {breed.purpose}
                                                </Badge>
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className="text-text-secondary">{breed.milkYield}</span>
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className="text-text-secondary text-sm">{breed.adaptability}</span>
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
                    size="lg"
                >
                    {selectedBreed && (
                        <div className="space-y-6">
                            {/* Header Image */}
                            <div className="relative h-48 rounded-xl overflow-hidden">
                                <img
                                    src={selectedBreed.image}
                                    alt={selectedBreed.name}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                <div className="absolute bottom-4 left-4">
                                    <Badge variant="accent" size="lg">{selectedBreed.purpose}</Badge>
                                </div>
                            </div>

                            {/* Basic Info */}
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div className="flex items-center gap-3 p-4 bg-surface-hover rounded-xl">
                                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                        <MapPin className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-text-muted">Origin</p>
                                        <p className="font-medium text-text">{selectedBreed.origin}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-4 bg-surface-hover rounded-xl">
                                    <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                                        <Droplet className="w-5 h-5 text-secondary" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-text-muted">Milk Yield</p>
                                        <p className="font-medium text-text">{selectedBreed.milkYield}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-4 bg-surface-hover rounded-xl">
                                    <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                                        <Leaf className="w-5 h-5 text-accent-dark" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-text-muted">Adaptability</p>
                                        <p className="font-medium text-text">{selectedBreed.adaptability}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-4 bg-surface-hover rounded-xl">
                                    <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                                        <Heart className="w-5 h-5 text-purple-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-text-muted">Color</p>
                                        <p className="font-medium text-text">{selectedBreed.color}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <h4 className="font-semibold text-text mb-2">Description</h4>
                                <p className="text-text-secondary">{selectedBreed.description}</p>
                            </div>

                            {/* Characteristics */}
                            <div>
                                <h4 className="font-semibold text-text mb-3">Key Characteristics</h4>
                                <div className="flex flex-wrap gap-2">
                                    {selectedBreed.characteristics?.map((char, index) => (
                                        <Badge key={index} variant="primary" size="md">
                                            {char}
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 pt-4 border-t border-gray-100">
                                <Button
                                    variant="primary"
                                    className="flex-1"
                                    onClick={() => setIsModalOpen(false)}
                                >
                                    Close
                                </Button>
                            </div>
                        </div>
                    )}
                </Modal>
            </div>
        </AppLayout>
    );
};

export default AuthorityPage;
