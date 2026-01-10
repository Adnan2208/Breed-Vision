import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AnalyzePage from './pages/AnalyzePage';
import AnalyticsPage from './pages/AnalyticsPage';
import AdvisoryPage from './pages/AdvisoryPage';
import HelpPage from './pages/HelpPage';
import NearbyServicesPage from './pages/NearbyServicesPage';
import AuthorityPage from './pages/AuthorityPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/analyze" element={<AnalyzePage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/advisory" element={<AdvisoryPage />} />
        <Route path="/help" element={<HelpPage />} />
        <Route path="/nearby-services" element={<NearbyServicesPage />} />
      </Routes>
    </Router>
  );
}

export default App;
