import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import RealTime from './pages/RealTime';
import Reports from './pages/Reports';
import Clients from './pages/Clients';
import Performance from './pages/Performance';
import StoreOptimizer from './pages/StoreOptimizer';
import Settings from './pages/Settings';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="realtime" element={<RealTime />} />
          <Route path="performance" element={<Performance />} />
          <Route path="optimizer" element={<StoreOptimizer />} />
          <Route path="reports" element={<Reports />} />
          <Route path="clients" element={<Clients />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>

        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
