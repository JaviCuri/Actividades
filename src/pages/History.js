// src/pages/Historial.js
import { useEffect, useState } from "react";

const Historial = () => {
  const [accessLogs, setAccessLogs] = useState([]);

  useEffect(() => {
    const storedLogs = JSON.parse(localStorage.getItem("accessLogs")) || [];
    setAccessLogs(storedLogs);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-blue-100 p-6">
      <h1 className="text-3xl font-bold text-blue-700 mb-8">Historial de Accesos</h1>

      {accessLogs.length === 0 ? (
        <p>No hay registros de acceso.</p>
      ) : (
        <ul className="space-y-4 w-full max-w-2xl">
          {accessLogs.map((log, index) => (
            <li key={index} className="bg-white p-4 rounded-lg shadow-md">
              <p><strong>Oficina:</strong> {log.office ? log.office : 'Desconocida'}</p>
              <p><strong>Fecha y Hora:</strong> {new Date(log.timestamp).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Historial;
