import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from "html5-qrcode";
import { useNavigate } from 'react-router-dom';

const ScanAccess = () => {
  const qrCodeRegionId = "reader";
  const html5QrCodeRef = useRef(null);
  const [result, setResult] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    html5QrCodeRef.current = new Html5Qrcode(qrCodeRegionId);

    Html5Qrcode.getCameras()
      .then((devices) => {
        if (devices && devices.length) {
          // Buscar la cámara trasera
          const backCamera = devices.find(device =>
            device.label.toLowerCase().includes('back') ||
            device.label.toLowerCase().includes('rear')
          );

          const cameraId = backCamera ? backCamera.id : devices[0].id;

          html5QrCodeRef.current.start(
            cameraId,
            {
              fps: 10,
              qrbox: { width: 250, height: 250 },
            },
            (decodedText) => {
              setResult(decodedText);
              html5QrCodeRef.current.stop();
            },
            (errorMessage) => {
              // Puedes mostrar errores si quieres
            }
          );
        } else {
          console.log("No cameras found, enable file upload mode.");
        }
      })
      .catch((err) => {
        console.error("Error getting cameras:", err);
      });

    return () => {
      if (html5QrCodeRef.current) {
        html5QrCodeRef.current.stop().then(() => {
          html5QrCodeRef.current.clear();
          navigate('/'); // Redirige al home al desmontar
        }).catch((error) => {
          console.error("Error stopping camera:", error);
          navigate('/'); // Igual redirige al home si falla
        });
      }
    };
  }, [navigate]);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const result = await html5QrCodeRef.current.scanFile(file, true);
      setResult(result);
    } catch (err) {
      console.error("Error reading QR code from file:", err);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "2rem" }}>
      <h2>Escanea tu Código QR de Acceso</h2>
      <div id={qrCodeRegionId} style={{ width: "300px", margin: "auto" }}></div>

      <div style={{ marginTop: "1rem" }}>
        <label style={{ fontSize: "1rem" }}>
          ¿No tienes cámara? Sube una imagen:
          <input type="file" accept="image/*" onChange={handleUpload} style={{ display: "block", margin: "1rem auto" }} />
        </label>
      </div>

      {result && (
        <div style={{ marginTop: "2rem" }}>
          <h3>Resultado:</h3>
          <p>{result}</p>
        </div>
      )}
    </div>
  );
};

export default ScanAccess;
