// src/pages/UserManagement.js
import { useEffect, useState } from "react";

const UserManagement = () => {
  const [accessLogs, setAccessLogs] = useState([]);

  useEffect(() => {
    const storedLogs = JSON.parse(localStorage.getItem("accessLogs")) || [];
    setAccessLogs(storedLogs);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-blue-100 p-6">
      <h1 className="text-3xl font-bold text-blue-700 mb-8">Usuarios y Oficinas</h1>

      {accessLogs.length === 0 ? (
        <p>No hay usuarios registrados aún.</p>
      ) : (
        <ul className="space-y-4">
          {accessLogs.map((log, index) => (
            <li key={index} className="bg-white p-4 rounded-lg shadow-md">
              <p><strong>Nombre del Usuario:</strong> {log.user ? log.user : 'Usuario desconocido'}</p>
              <p><strong>Oficina:</strong> {log.office}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserManagement;
