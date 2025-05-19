import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './Login.css';

const RegisterUser = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [nombre, setNombre] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = async () => {
        if (!email || !password || !nombre) {
            alert('Por favor completa todos los campos');
            return;
        }

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            console.error('Error al registrar:', error.message);
            alert('Error al registrar: ' + error.message);
            return;
        }

        const user = data.user;
        const userId = user?.id;

        if (userId) {
            const { error: insertError } = await supabase.from('usuarios').insert([
                {
                    id: userId,
                    nombre: nombre,
                    email: user.email, // 👈 Se añade el email requerido
                },
            ]);

            if (insertError) {
                console.error('Error al guardar nombre:', insertError.message);
                alert('Usuario creado, pero falló guardar el nombre.');
            } else {
                alert('Registro exitoso. Ahora puedes iniciar sesión.');
                navigate('/login');
            }
        }
    };

    return (
        <div className="login-container">
            <div className="login-info">
                <h1>Crea tu cuenta en <span className="highlight">OfiPass</span></h1>
                <p>
                    Controla accesos a oficinas de forma segura con códigos QR o tarjetas RFID.
                </p>
            </div>
            <div className="login-form">
                <h2>Registrarse</h2>
                <input
                    type="text"
                    placeholder="Nombre"
                    className="input-field"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                />
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
                <button onClick={handleRegister} className="login-button">
                    Registrarse
                </button>
            </div>
        </div>
    );
};

export default RegisterUser;
