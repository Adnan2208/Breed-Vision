import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AnalyzePage from './pages/AnalyzePage';
import AnalyticsPage from './pages/AnalyticsPage';
import AdvisoryPage from './pages/AdvisoryPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/analyze" element={<AnalyzePage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/advisory" element={<AdvisoryPage />} />
      </Routes>
    </Router>
  );
}

export default App;
