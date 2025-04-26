import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ScanAccess from './pages/ScanAccess';
import History from './pages/History';
import Users from './pages/UserManagement';
import Navbar from './Navbar';
import PrivateRoute from './PrivateRoute';
import AccessInfo from './pages/AccessInfo';

import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta pública */}
        <Route path="/" element={<Login />} />

        {/* Rutas protegidas */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <>
                <Navbar />
                <Dashboard />
              </>
            </PrivateRoute>
          }
        />
        <Route path="/scan" element={<PrivateRoute><ScanAccess /></PrivateRoute>} />

        <Route
          path="/history"
          element={
            <PrivateRoute>
              <>
                <Navbar />
                <History />
              </>
            </PrivateRoute>
          }
        />
        <Route
          path="/Users"
          element={
            <PrivateRoute>
              <>
                <Navbar />
                <Users />
              </>
            </PrivateRoute>
          }
        />
        <Route path="/acceso/:id" element={<AccessInfo />} />
      </Routes>
    </Router>
  );
}

export default App;
