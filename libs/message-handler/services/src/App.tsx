import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MediatorApp from './data-collection';

import MediatorCoordination from './components/MediatorCoordination';
import PickupComponent from './components/PickupRequest';
import ForwardComponent from './components/ForwardRequest';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MediatorApp />} />
        <Route path="/coordination" element={<MediatorCoordination />} />
        <Route path="/pickup" element={<PickupComponent />} />
        <Route path="/forward" element={<ForwardComponent />} />
      </Routes>
    </Router>
  );
};

export default App;
