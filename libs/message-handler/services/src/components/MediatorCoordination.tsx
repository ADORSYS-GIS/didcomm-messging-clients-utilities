import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import QueryComponent from './Mediation-components/Query';
import RequestComponent from './Mediation-components/Request';

const MediatorCoordination: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="mediator-app">
      <header className="app-header">Mediator Coordination</header>
      <nav className="sidebar">
        <button onClick={() => navigate('/query')}>Query key</button>
        <button onClick={() => navigate('/mediateRequest')}>
          Mediate request
        </button>
      </nav>
      <main className="content">
        <Routes>
          <Route path="keklistQuery" element={<QueryComponent />} />
          <Route path="mediateRequest" element={<RequestComponent />} />
        </Routes>
      </main>
    </div>
  );
};

export default MediatorCoordination;
