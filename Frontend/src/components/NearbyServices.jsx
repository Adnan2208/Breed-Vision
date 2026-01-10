import React, { useState, useEffect, useCallback } from 'react';
import {
  MapPin,
  Phone,
  ExternalLink,
  Navigation,
  Loader2,
  AlertCircle,
  Stethoscope,
  Heart,
  Clock,
  Globe,
  RefreshCw,
  MapPinOff,
  Building2,
} from 'lucide-react';
import { Card, Button, Badge } from './ui';
import { getUserLocation, getNearbyPlaces } from '../services/location.service';

/**
 * Place Card Component
 * Displays individual veterinarian or NGO card
 */
const PlaceCard = ({ place, type }) => {
  const isVet = type === 'veterinary';
  const Icon = isVet ? Stethoscope : Heart;
  const accentColor = isVet ? 'primary' : 'secondary';

  return (
    <Card 
      className="h-full flex flex-col" 
      hover={true}
      padding="none"
    >
      {/* Header */}
      <div className={`p-4 border-b border-gray-100 bg-gradient-to-r ${
        isVet 
          ? 'from-primary/5 to-primary/10' 
          : 'from-secondary/5 to-secondary/10'
      }`}>
        <div className="flex items-start gap-3">
          <div className={`p-2.5 rounded-xl ${
            isVet 
              ? 'bg-primary/10 text-primary' 
              : 'bg-secondary/10 text-secondary'
          }`}>
            <Icon size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-text text-base leading-tight line-clamp-2">
              {place.name}
            </h3>
            <Badge 
              variant={isVet ? 'primary' : 'secondary'} 
              size="sm" 
              className="mt-1.5"
            >
              {place.distance} km away
            </Badge>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 flex-1 flex flex-col gap-3">
        {/* Address */}
        <div className="flex items-start gap-2.5 text-sm">
          <MapPin size={16} className="text-text-secondary mt-0.5 flex-shrink-0" />
          <span className="text-text-secondary line-clamp-2">
            {place.address}
          </span>
        </div>

        {/* Phone */}
        {place.phone && (
          <div className="flex items-center gap-2.5 text-sm">
            <Phone size={16} className="text-text-secondary flex-shrink-0" />
            <a 
              href={`tel:${place.phone}`}
              className={`hover:text-${accentColor} transition-colors font-medium`}
            >
              {place.phone}
            </a>
          </div>
        )}

        {/* Opening Hours */}
        {place.openingHours && (
          <div className="flex items-start gap-2.5 text-sm">
            <Clock size={16} className="text-text-secondary mt-0.5 flex-shrink-0" />
            <span className="text-text-secondary text-xs">
              {place.openingHours}
            </span>
          </div>
        )}

        {/* Website */}
        {place.website && (
          <div className="flex items-center gap-2.5 text-sm">
            <Globe size={16} className="text-text-secondary flex-shrink-0" />
            <a 
              href={place.website}
              target="_blank"
              rel="noopener noreferrer"
              className={`hover:text-${accentColor} transition-colors truncate text-xs`}
            >
              Visit Website
            </a>
          </div>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Action Button */}
        <a
          href={place.googleMapsLink}
          target="_blank"
          rel="noopener noreferrer"
          className="block mt-2"
        >
          <Button
            variant={isVet ? 'primary' : 'secondary'}
            size="sm"
            className="w-full"
            icon={Navigation}
          >
            View on Map
          </Button>
        </a>
      </div>
    </Card>
  );
};

/**
 * Loading Skeleton Component
 */
const LoadingSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
    {[...Array(4)].map((_, i) => (
      <Card key={i} className="animate-pulse" padding="none">
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-gray-200 rounded-xl" />
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-5 bg-gray-200 rounded w-20" />
            </div>
          </div>
        </div>
        <div className="p-4 space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-200 rounded" />
            <div className="h-3 bg-gray-200 rounded flex-1" />
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-200 rounded" />
            <div className="h-3 bg-gray-200 rounded w-1/2" />
          </div>
          <div className="h-9 bg-gray-200 rounded-xl mt-4" />
        </div>
      </Card>
    ))}
  </div>
);

/**
 * Empty State Component
 */
const EmptyState = ({ type, onRetry }) => {
  const isVet = type === 'veterinary';
  const Icon = isVet ? Stethoscope : Heart;

  return (
    <div className="text-center py-12 px-4">
      <div className={`inline-flex p-4 rounded-2xl mb-4 ${
        isVet ? 'bg-primary/10' : 'bg-secondary/10'
      }`}>
        <Icon size={32} className={isVet ? 'text-primary' : 'text-secondary'} />
      </div>
      <h3 className="text-lg font-semibold text-text mb-2">
        No {isVet ? 'Veterinarians' : 'Animal NGOs'} Found Nearby
      </h3>
      <p className="text-text-secondary text-sm max-w-md mx-auto mb-4">
        We couldn't find any {isVet ? 'veterinary clinics' : 'animal shelters or NGOs'} within 
        the search radius. Try expanding your search area.
      </p>
      <Button variant="outline" size="sm" icon={RefreshCw} onClick={onRetry}>
        Search Again
      </Button>
    </div>
  );
};

/**
 * Location Error Component
 */
const LocationError = ({ error, onRetry }) => (
  <div className="text-center py-12 px-4">
    <div className="inline-flex p-4 rounded-2xl bg-red-50 mb-4">
      <MapPinOff size={32} className="text-red-500" />
    </div>
    <h3 className="text-lg font-semibold text-text mb-2">
      Location Access Required
    </h3>
    <p className="text-text-secondary text-sm max-w-md mx-auto mb-4">
      {error || 'Please enable location access to find nearby services.'}
    </p>
    <Button variant="primary" size="sm" icon={RefreshCw} onClick={onRetry}>
      Try Again
    </Button>
  </div>
);

/**
 * Section Header Component
 */
const SectionHeader = ({ title, icon: Icon, count, accentColor }) => (
  <div className="flex items-center justify-between mb-4">
    <div className="flex items-center gap-3">
      <div className={`p-2.5 rounded-xl bg-${accentColor}/10`}>
        <Icon size={22} className={`text-${accentColor}`} />
      </div>
      <div>
        <h2 className="text-xl font-bold text-text">{title}</h2>
        {count !== undefined && (
          <p className="text-sm text-text-secondary">
            {count} {count === 1 ? 'result' : 'results'} found
          </p>
        )}
      </div>
    </div>
  </div>
);

/**
 * NearbyServices Component
 * Main component for displaying nearby veterinarians and animal NGOs
 */
const NearbyServices = ({ radiusKm = 10, className = '' }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  /**
   * Fetch nearby places based on user location
   */
  const fetchNearbyPlaces = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Get user's location
      const location = await getUserLocation();
      setUserLocation(location);

      // Fetch nearby places from backend
      const placesData = await getNearbyPlaces(
        location.latitude,
        location.longitude,
        radiusKm
      );

      setData(placesData);
    } catch (err) {
      console.error('Error fetching nearby places:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [radiusKm]);

  // Fetch on mount
  useEffect(() => {
    fetchNearbyPlaces();
  }, [fetchNearbyPlaces]);

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Location Info Banner */}
      {data?.userLocation?.address && (
        <Card className="bg-gradient-to-r from-primary/5 via-transparent to-secondary/5" padding="sm">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <MapPin size={18} className="text-primary" />
              <span className="text-sm font-medium text-text">Your Location:</span>
            </div>
            <span className="text-sm text-text-secondary flex-1 min-w-[200px]">
              {data.userLocation.city && `${data.userLocation.city}, `}
              {data.userLocation.state && `${data.userLocation.state}, `}
              {data.userLocation.country || 'Unknown'}
            </span>
            <Button 
              variant="ghost" 
              size="sm" 
              icon={RefreshCw} 
              onClick={fetchNearbyPlaces}
              disabled={loading}
            >
              Refresh
            </Button>
          </div>
        </Card>
      )}

      {/* Error State */}
      {error && !loading && (
        <Card>
          <LocationError error={error} onRetry={fetchNearbyPlaces} />
        </Card>
      )}

      {/* Loading State */}
      {loading && (
        <>
          <div>
            <SectionHeader 
              title="Veterinarians Near You" 
              icon={Stethoscope} 
              accentColor="primary"
            />
            <LoadingSkeleton />
          </div>
          <div>
            <SectionHeader 
              title="Animal NGOs Near You" 
              icon={Heart} 
              accentColor="secondary"
            />
            <LoadingSkeleton />
          </div>
        </>
      )}

      {/* Data Loaded State */}
      {!loading && !error && data && (
        <>
          {/* Veterinarians Section */}
          <section>
            <SectionHeader 
              title="Veterinarians Near You" 
              icon={Stethoscope} 
              count={data.counts?.veterinarians}
              accentColor="primary"
            />
            
            {data.veterinarians?.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {data.veterinarians.map((vet) => (
                  <PlaceCard key={vet.id} place={vet} type="veterinary" />
                ))}
              </div>
            ) : (
              <Card>
                <EmptyState type="veterinary" onRetry={fetchNearbyPlaces} />
              </Card>
            )}
          </section>

          {/* Animal NGOs Section */}
          <section>
            <SectionHeader 
              title="Animal NGOs Near You" 
              icon={Heart} 
              count={data.counts?.ngos}
              accentColor="secondary"
            />
            
            {data.ngos?.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {data.ngos.map((ngo) => (
                  <PlaceCard key={ngo.id} place={ngo} type="ngo" />
                ))}
              </div>
            ) : (
              <Card>
                <EmptyState type="ngo" onRetry={fetchNearbyPlaces} />
              </Card>
            )}
          </section>
        </>
      )}
    </div>
  );
};

export default NearbyServices;
