// src/pages/UserManagement.js
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

const UserManagement = () => {
  const [accessLogs, setAccessLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAccessLogs = async () => {
      const { data, error } = await supabase
        .from("ingresos_usuarios")
        .select(`
          id,
          oficina,
          created_at,
          usuarios (
            nombre,
            email
          )
        `)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error al obtener registros:", error.message);
      } else {
        setAccessLogs(data);
      }
      setLoading(false);
    };

    fetchAccessLogs();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-blue-100 p-6">
      <h1 className="text-3xl font-bold text-blue-700 mb-8">Usuarios y Oficinas</h1>

      {loading ? (
        <p className="text-gray-600">Cargando registros...</p>
      ) : accessLogs.length === 0 ? (
        <p>No hay usuarios registrados aún.</p>
      ) : (
        <ul className="space-y-4 w-full max-w-2xl">
          {accessLogs.map((log, index) => (
            <li key={index} className="bg-white p-4 rounded-lg shadow-md">
              <p><strong>Nombre del Usuario:</strong> {log.usuarios?.nombre || 'Desconocido'}</p>
              <p><strong>Oficina:</strong> {log.oficina}</p>
              {log.created_at && (
                <p><strong>Fecha:</strong> {new Date(log.created_at).toLocaleString()}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserManagement;
