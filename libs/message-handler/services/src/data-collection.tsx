import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import './data-collection.css';
import MediatorCoordination from './components/MediatorCoordination';
import PickupComponent from './components/PickupRequest';
import ForwardComponent from './components/ForwardRequest';

const MediatorApp: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="mediator-app">
      <header className="app-header">DIDComm Mediator</header>
      <nav className="sidebar">
        <button onClick={() => navigate('/coordination')}>
          Mediator Coordination
        </button>
        <button onClick={() => navigate('/pickup')}>Pickup mesage</button>
        <button onClick={() => navigate('/forward')}>Forward message</button>
      </nav>
      <main className="content">
        <Routes>
          <Route path="/coordination" element={<MediatorCoordination />} />
          <Route path="/pickup" element={<PickupComponent />} />
          <Route path="/forward" element={<ForwardComponent />} />
        </Routes>
      </main>
    </div>
  );
};

export default MediatorApp;
