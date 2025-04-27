import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import fakeAccessData from '../data/fakeAccessData';

const AccessInfo = () => {
    const { id } = useParams();
    const navigate = useNavigate(); // Para la navegación programática

    // Verificar si el usuario está autenticado
    const isAuthenticated = localStorage.getItem('authenticated') === 'true';
    if (!isAuthenticated) {
        // Redirigir al login si no está autenticado
        navigate('/login');
    }

    // Obtener el nombre del usuario desde localStorage y parsear el JSON
    const userData = JSON.parse(localStorage.getItem('currentUser'));
    const userName = userData ? userData.name : null;

    const accessInfo = fakeAccessData.find(item => item.id === String(id));

    return (
        <div>
            <h2>Detalles de acceso</h2>

            {userName ? (
                <p>Bienvenido, {userName}</p>
            ) : (
                <p>No se encontró el nombre del usuario.</p>
            )}

            {accessInfo ? (
                <div>
                    <p>ID de acceso: {accessInfo.id}</p>
                    <p>Oficina: {accessInfo.office}</p>
                </div>
            ) : (
                <p>No se encontró el acceso.</p>
            )}

            <button onClick={() => navigate('/dashboard')}>Volver al inicio</button>
        </div>
    );
};

export default AccessInfo;
