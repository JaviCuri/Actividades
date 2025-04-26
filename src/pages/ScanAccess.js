import { useState } from "react";
import { useNavigate } from "react-router-dom";
import QrScanner from 'react-qr-scanner';

const ScanAccess = () => {
  const [scanned, setScanned] = useState(false);
  const [imageSrc, setImageSrc] = useState(null); // Guardar la imagen cargada
  const navigate = useNavigate();

  const handleScan = (result, error) => {
    if (result && result.text && !scanned) {
      const text = result.text;
      const idMatch = text.match(/\/acceso\/(\d+)/);

      if (idMatch) {
        const accessId = idMatch[1];

        // Guardar en LocalStorage
        const existingLogs = JSON.parse(localStorage.getItem("accessLogs")) || [];
        const newLog = {
          id: accessId,
          timestamp: new Date().toISOString(),
        };
        existingLogs.push(newLog);
        localStorage.setItem("accessLogs", JSON.stringify(existingLogs));

        setScanned(true); // Evitar múltiples escaneos
        navigate(`/acceso/${accessId}`);
      }
    }

    if (error) {
      console.error(error);
    }
  };

  // Función para manejar la carga de la imagen
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageSrc(reader.result); // Cargar la imagen en el estado
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl mb-4">Escanear Código QR</h1>

      <div className="w-80 h-80 mb-4">
        {/* Mostrar el QR de la imagen cargada */}
        {imageSrc && <img src={imageSrc} alt="QR Code" style={{ width: "100%" }} />}
      </div>

      <div className="w-80 h-80 mb-4">
        {/* Configuración del escáner QR */}
        <QrScanner
          delay={300}
          onScan={handleScan}
          onError={(error) => console.error(error)}
        />
      </div>

      <div>
        {/* Botón para cargar imagen */}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="mb-4"
        />
      </div>
    </div>
  );
};

export default ScanAccess;
