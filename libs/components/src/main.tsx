import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './components/main'
import { BrowserRouter, Route } from 'react-router'
import { Routes } from 'react-router'
import { SignupForm } from './components/mediationrequestForm'
import RoutingForm from './components/routingForm'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/mediation_coordination" element={<SignupForm />} />
        <Route path="/routing" element={<RoutingForm />} />

      </Routes>
    </BrowserRouter>

  </StrictMode>,
)
