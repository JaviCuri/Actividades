import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './Login.css';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const handleLogin = async () => {
        if (!email || !password) {
            setErrorMsg('Por favor ingresa email y contraseña');
            return;
        }

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setErrorMsg('Credenciales inválidas o error al iniciar sesión');
            console.error(error.message);
        } else {
            const user = data.user;
            localStorage.setItem('authenticated', 'true');
            localStorage.setItem('currentUser', JSON.stringify({ email: user.email }));
            navigate('/dashboard');
        }
    };

    return (
        <div className="login-container">
            <div className="login-info">
                <h1>Bienvenido a <span className="highlight">OfiPass</span></h1>
                <p>
                    OfiPass es un sistema moderno de control de accesos para oficinas, que
                    utiliza códigos QR o tarjetas RFID para mejorar la seguridad y eliminar el
                    uso de llaves físicas.
                </p>
                <p>
                    Registra ingresos y salidas de forma detallada, asegurando un entorno más
                    profesional, organizado y seguro.
                </p>
            </div>

            <div className="login-form">
                <h2>Iniciar Sesión</h2>
                <input
                    type="email"
                    placeholder="Correo electrónico"
                    className="input-field"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Contraseña"
                    className="input-field"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button onClick={handleLogin} className="login-button">Entrar</button>
                {errorMsg && <p className="error-message">{errorMsg}</p>}

                <p className="register-text">
                    ¿No tienes cuenta?{' '}
                    <Link to="/register" className="register-link">Regístrate aquí</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
