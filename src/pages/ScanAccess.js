import { useState } from "react";
import { useNavigate } from "react-router-dom";
import QrScanner from 'react-qr-scanner';
import jsQR from "jsqr";

const ScanAccess = () => {
  const [scanned, setScanned] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [qrData, setQrData] = useState(null);
  const navigate = useNavigate();

  const handleScan = (result, error) => {
    if (result && result.text && !scanned) {
      const text = result.text;
      const idMatch = text.match(/\/acceso\/(\d+)/);

      if (idMatch) {
        const accessId = idMatch[1];
        const officeMatch = text.match(/oficina=([a-zA-Z\s]+)/); // Suponiendo que el código QR tiene un parámetro oficina

        if (officeMatch) {
          const office = officeMatch[1]; // Extraemos la oficina del código QR

          // Crear nuevo log sin el nombre de usuario
          const newLog = {
            id: accessId,
            office: office,
            timestamp: new Date().toISOString(),
          };

          // Guardar el log en el historial
          const existingLogs = JSON.parse(localStorage.getItem("accessLogs")) || [];
          existingLogs.push(newLog);
          localStorage.setItem("accessLogs", JSON.stringify(existingLogs));

          setScanned(true);
          navigate(`/acceso/${accessId}`);
        } else {
          console.error("No se encontró la oficina en el QR");
        }
      }
    }

    if (error) {
      console.error(error);
    }
  };

  const handleError = (error) => {
    console.error(error);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageSrc(reader.result);
        processQRCode(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const processQRCode = (imageData) => {
    const image = new Image();
    image.src = imageData;
    image.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.height = image.height;
      canvas.width = image.width;
      ctx.drawImage(image, 0, 0, image.width, image.height);

      const imageDataArray = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageDataArray.data, canvas.width, canvas.height);

      if (code) {
        const text = code.data;
        const idMatch = text.match(/\/acceso\/(\d+)/);
        if (idMatch) {
          const accessId = idMatch[1];

          const fakeAccessData = [
            { id: "1", office: "Recursos Humanos" },
            { id: "2", office: "Contabilidad" },
            { id: "3", office: "TI (Tecnologías de la Información)" },
          ];
          const accessInfo = fakeAccessData.find(item => item.id === accessId);

          const currentUser = JSON.parse(localStorage.getItem("currentUser"));

          if (currentUser && accessInfo) {
            const existingLogs = JSON.parse(localStorage.getItem("accessLogs")) || [];
            const newLog = {
              id: accessId,
              user: currentUser.name,
              office: accessInfo.office,
              timestamp: new Date().toISOString(),
            };
            existingLogs.push(newLog);
            localStorage.setItem("accessLogs", JSON.stringify(existingLogs));

            setQrData(`Acceso ID: ${accessId}`);
            navigate(`/acceso/${accessId}`);
          } else {
            console.error("Faltan datos de usuario o acceso");
          }
        }
      } else {
        setQrData("No se pudo leer el código QR.");
      }
    };
  };



  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-blue-100 p-6">
      <h1 className="text-3xl font-bold text-blue-700 mb-8 text-center">
        Escanear Código QR
      </h1>

      {/* Contenedor principal */}
      <div className="flex flex-col md:flex-row w-full max-w-6xl gap-6">

        {/* Sección cámara */}
        <div className="flex flex-col items-center w-full md:w-1/2 bg-white rounded-lg shadow-lg p-4">
          <h2 className="text-xl font-semibold text-blue-600 mb-4">📷 Cámara</h2>
          <div className="w-full aspect-square max-h-[400px] overflow-hidden rounded-lg border-4 border-blue-500 animate-pulse">
            <QrScanner
              delay={300}
              onScan={handleScan}
              onError={handleError}
              facingMode="environment" // Se asegura de usar la cámara trasera
              videoConstraints={{
                facingMode: "environment",
                width: 320,
                height: 240,
              }}
              style={{ width: "50%", height: "50%" }}
            />
          </div>
        </div>

        {/* Sección cargar imagen */}
        <div className="flex flex-col items-center w-full md:w-1/2 bg-white rounded-lg shadow-lg p-4">
          <h2 className="text-xl font-semibold text-blue-600 mb-4">🖼️ Subir Imagen</h2>
          {imageSrc && (
            <div className="w-full aspect-square max-h-[400px] mb-4 overflow-hidden rounded-lg border-2 border-blue-300">
              <img src={imageSrc} alt="QR cargado" className="object-cover w-full h-full" />
            </div>
          )}
          <label className="cursor-pointer inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition">
            Cargar Imagen
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
          {qrData && (
            <p className="text-sm text-gray-600 mt-4 text-center">{qrData}</p>
          )}
        </div>

      </div>
    </div>
  );
};

export default ScanAccess;
