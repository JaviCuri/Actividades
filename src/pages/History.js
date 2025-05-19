// src/pages/Historial.js
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

const Historial = () => {
  const [accessLogs, setAccessLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarHistorial = async () => {
      const { data, error } = await supabase
        .from("historial_accesos")
        .select(`
          *,
          usuarios ( nombre )
        `)
        .order("timestamp", { ascending: false });

      if (error) {
        console.error("Error al obtener historial:", error.message);
      } else {
        setAccessLogs(data);
      }
      setLoading(false);
    };

    cargarHistorial();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-blue-100 p-6">
      <h1 className="text-3xl font-bold text-blue-700 mb-8">Historial de Accesos</h1>

      {loading ? (
        <p className="text-gray-600">Cargando historial...</p>
      ) : accessLogs.length === 0 ? (
        <p>No hay registros de acceso.</p>
      ) : (
        <ul className="space-y-4 w-full max-w-2xl">
          {accessLogs.map((log, index) => (
            <li key={index} className="bg-white p-4 rounded-lg shadow-md">
              <p><strong>Usuario:</strong> {log.usuarios?.nombre || 'Desconocido'}</p>
              <p><strong>Oficina:</strong> {log.oficina || 'Desconocida'}</p>
              <p><strong>Fecha y Hora:</strong> {new Date(log.timestamp).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Historial;
