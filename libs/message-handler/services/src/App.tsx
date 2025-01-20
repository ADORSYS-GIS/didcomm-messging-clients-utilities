import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MediatorApp from './data-collection';

import MediatorCoordination from './components/MediatorCoordination';
import PickupComponent from './components/PickupRequest';
import ForwardComponent from './components/ForwardRequest';
import QueryComponent from './components/MEDIATION-COMPONENTS/Query';
import RequestComponent from './components/MEDIATION-COMPONENTS/Request';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MediatorApp />} />
        <Route path="/coordination/*" element={<MediatorCoordination />} />
        <Route path="/pickup" element={<PickupComponent />} />
        <Route path="/forward" element={<ForwardComponent />} />
        <Route path="/query" element={<QueryComponent />} />
        <Route path="/mediateRequest" element={<RequestComponent />} />
        <Route path="*" element={<div>404 - Page Not Found</div>} />
      </Routes>
    </Router>
  );
};

export default App;
