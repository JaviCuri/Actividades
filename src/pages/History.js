// src/pages/Historial.js
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

const Historial = () => {
  const [accessLogs, setAccessLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarHistorial = async () => {
      // Obtener todos los registros de historial
      const { data: historial, error: errorHistorial } = await supabase
        .from("historial_accesos")
        .select("*")
        .order("fecha_hora", { ascending: false });

      if (errorHistorial) {
        console.error("Error al obtener historial:", errorHistorial.message);
        setLoading(false);
        return;
      }

      if (!historial || historial.length === 0) {
        setAccessLogs([]);
        setLoading(false);
        return;
      }

      // Obtener IDs únicos de usuarios
      const userIds = [...new Set(historial.map((h) => h.usuario_id))];

      const { data: usuarios, error: errorUsuarios } = await supabase
        .from("usuarios")
        .select("id, nombre")
        .in("id", userIds);

      if (errorUsuarios) {
        console.error("Error al obtener usuarios:", errorUsuarios.message);
        setLoading(false);
        return;
      }

      // Unir datos manualmente
      const historialConNombres = historial.map((h) => {
        const usuario = usuarios.find((u) => u.id === h.usuario_id);
        return {
          ...h,
          nombre: usuario?.nombre || "Desconocido",
        };
      });

      setAccessLogs(historialConNombres);
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
              <p><strong>Usuario:</strong> {log.nombre}</p>
              <p><strong>Oficina:</strong> {log.oficina || 'Desconocida'}</p>
              <p><strong>Fecha y Hora:</strong> {new Date(log.fecha_hora).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Historial;
