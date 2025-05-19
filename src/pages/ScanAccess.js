import { useState } from "react";
import { useNavigate } from "react-router-dom";
import QrScanner from 'react-qr-scanner';
import jsQR from "jsqr";
import { supabase } from "../supabaseClient";

const ScanAccess = () => {
  const [scanned, setScanned] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [qrData, setQrData] = useState(null);
  const navigate = useNavigate();

  const registrarAcceso = async (userEmail, oficina) => {
    const { error } = await supabase.from("historial_accesos").insert([
      {
        email: userEmail,
        oficina: oficina,
        timestamp: new Date().toISOString(),
      },
    ]);
    if (error) {
      console.error("Error al guardar acceso:", error.message);
    }
  };

  const handleScan = async (result) => {
    if (result && result.text && !scanned) {
      const text = result.text;
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
          await registrarAcceso(currentUser.email, accessInfo.office);
          setScanned(true);
          setQrData(`Acceso ID: ${accessId}`);
          navigate(`/acceso/${accessId}`);
        } else {
          console.error("Faltan datos de usuario o acceso");
        }
      }
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

  const processQRCode = async (imageData) => {
    const image = new Image();
    image.src = imageData;
    image.onload = async () => {
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
            await registrarAcceso(currentUser.email, accessInfo.office);
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
              constraints={{
                audio: false,
                video: {
                  facingMode: { exact: "environment" },
                  width: { ideal: 320 },
                  height: { ideal: 240 },
                },
              }}
              style={{ width: "100%", height: "100%" }}
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
