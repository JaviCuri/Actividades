import { useState } from "react";
import { useNavigate } from "react-router-dom";
import QrScanner from 'react-qr-scanner';
import jsQR from "jsqr";  // Importamos la librería jsQR

const ScanAccess = () => {
  const [scanned, setScanned] = useState(false);
  const [imageSrc, setImageSrc] = useState(null); // Guardar la imagen cargada
  const [qrData, setQrData] = useState(null); // Guardar el resultado del QR
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
        processQRCode(reader.result); // Procesar el QR de la imagen cargada
      };
      reader.readAsDataURL(file);
    }
  };

  // Función para procesar el código QR desde la imagen cargada
  const processQRCode = (imageData) => {
    const image = new Image();
    image.src = imageData;
    image.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.height = image.height;
      canvas.width = image.width;
      ctx.drawImage(image, 0, 0, image.width, image.height);

      // Obtener los datos de la imagen en forma de píxeles
      const imageDataArray = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageDataArray.data, canvas.width, canvas.height); // Leer el QR de la imagen

      if (code) {
        const text = code.data;
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

          setQrData(`Acceso ID: ${accessId}`); // Mostrar el ID de acceso en el estado
          navigate(`/acceso/${accessId}`);
        }
      } else {
        setQrData("No se pudo leer el código QR.");
      }
    };
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl mb-4">Escanear Código QR</h1>

      {/* Mostrar el QR de la imagen cargada (solo si hay imagen) */}
      {imageSrc && (
        <div className="w-80 h-80 mb-4">
          <img src={imageSrc} alt="QR Code" style={{ width: "100%" }} />
        </div>
      )}

      {/* Configuración del escáner QR */}
      <div className="w-80 h-80 mb-4">
        <QrScanner
          delay={300}
          facingMode="environment"  // Asegura que se use la cámara trasera
          onScan={handleScan}
          onError={(error) => console.error(error)}
        />
      </div>

      {/* Mostrar el resultado del QR procesado */}
      {qrData && <p>{qrData}</p>}

      {/* Botón para cargar imagen */}
      <div>
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
