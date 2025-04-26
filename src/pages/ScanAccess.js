import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from "html5-qrcode";

const ScanAccess = () => {
  const qrCodeRegionId = "reader";
  const html5QrCodeRef = useRef(null);
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (!html5QrCodeRef.current) {
      html5QrCodeRef.current = new Html5Qrcode(qrCodeRegionId);
    }

    Html5Qrcode.getCameras().then((devices) => {
      if (devices && devices.length) {
        const cameraId = devices[0].id;
        html5QrCodeRef.current.start(
          cameraId,
          {
            fps: 10,    // Frames per second
            qrbox: { width: 250, height: 250 },  // Size of the scanning box
          },
          (decodedText) => {
            setResult(decodedText);
            html5QrCodeRef.current.stop();
          },
          (errorMessage) => {
            // console.error(errorMessage);
          }
        );
      }
    }).catch((err) => {
      console.error("Error getting cameras:", err);
    });

    return () => {
      if (html5QrCodeRef.current) {
        html5QrCodeRef.current.stop().then(() => {
          html5QrCodeRef.current.clear();
        });
      }
    };
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "2rem" }}>
      <h2>Escanea tu Código QR de Acceso</h2>
      <div id={qrCodeRegionId} style={{ width: "300px", margin: "auto" }}></div>
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
