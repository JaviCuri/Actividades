// src/components/Navbar.js
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('authenticated');  // Limpia la "sesión"
        navigate('/'); // Redirige al login
    };

    return (
        <nav className="navbar">
            <div className="navbar-logo">OfiPass</div>
            <ul className="navbar-links">
                <li><Link to="/dashboard">Inicio</Link></li>
                <li><Link to="/scan">Escanear Acceso</Link></li>
                <li><Link to="/history">Historial</Link></li>
                <li><Link to="/users">Usuarios</Link></li>
                <li><button className="navbar-link logout-button" onClick={handleLogout}>Cerrar sesión</button></li>
            </ul>
        </nav>
    );
};

export default Navbar;
