import React from 'react';
import { AppLayout } from '../components/layout';
import NearbyServices from '../components/NearbyServices';

/**
 * NearbyServicesPage
 * Dashboard page for finding nearby veterinarians and animal NGOs
 */
const NearbyServicesPage = () => {
  return (
    <AppLayout>
      <div className="min-h-screen bg-background">
        {/* Page Header */}
        <div className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center sm:text-left">
              <h1 className="text-3xl sm:text-4xl font-bold text-text mb-2">
                Nearby Services
              </h1>
              <p className="text-text-secondary text-lg max-w-2xl">
                Find veterinarians, animal hospitals, and animal welfare NGOs near your location. 
                Get directions and contact information instantly.
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <NearbyServices radiusKm={15} />
        </div>
      </div>
    </AppLayout>
  );
};

export default NearbyServicesPage;
