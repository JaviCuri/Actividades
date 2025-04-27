// src/pages/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        // Aquí podrías validar usuario/contraseña si quieres
        if (username.trim() !== '' && password.trim() !== '') {
            localStorage.setItem('authenticated', 'true');
            localStorage.setItem('currentUser', JSON.stringify({ name: username }));

            navigate('/dashboard');
        } else {
            alert('Por favor ingresa un usuario y contraseña');
        }
    };

    return (
        <div className="login-container">
            <div className="login-info">
                <h1>Bienvenido a <span className="highlight">OfiPass</span></h1>
                <p>
                    OfiPass es un sistema moderno de control de accesos para oficinas,
                    que utiliza códigos QR o tarjetas RFID para mejorar la seguridad y
                    eliminar el uso de llaves físicas.
                </p>
                <p>
                    Registra ingresos y salidas de forma detallada, asegurando un entorno más profesional, organizado y seguro.
                </p>
            </div>
            <div className="login-form">
                <h2>Iniciar Sesión</h2>
                <input
                    type="text"
                    placeholder="Usuario"
                    className="input-field"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Contraseña"
                    className="input-field"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button onClick={handleLogin} className="login-button">Entrar</button>
            </div>
        </div>
    );
};

export default Login;
