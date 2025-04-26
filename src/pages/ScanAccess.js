
import React, { useState } from 'react';
import { QrReader } from 'react-qr-reader';
import { Html5Qrcode } from 'html5-qrcode';

const ScanAccess = () => {
  const [scanMethod, setScanMethod] = useState(null); // cámara o subir imagen
  const [result, setResult] = useState('');

  const handleFileInput = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const imgDataUrl = e.target.result;
      const html5QrCode = new Html5Qrcode("reader");
      try {
        const decodedText = await html5QrCode.scanFile(file, true);
        setResult(`QR detectado: ${decodedText}`);
      } catch (error) {
        setResult('No se pudo leer el QR. Intenta otra imagen.');
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="scan-access-container">
      <h1>Escanear Acceso</h1>

      {!scanMethod && (
        <div className="scan-options">
          <button onClick={() => setScanMethod('camera')}>Escanear con Cámara</button>
          <button onClick={() => setScanMethod('upload')}>Subir Imagen del QR</button>
        </div>
      )}

      {scanMethod === 'camera' && (
        <div className="camera-scanner">
          <QrReader
            constraints={{ facingMode: 'environment' }}
            onResult={(result, error) => {
              if (!!result) {
                setResult(`QR detectado: ${result?.text}`);
              }
            }}
            style={{ width: '100%' }}
          />
          <button onClick={() => setScanMethod(null)}>Volver</button>
        </div>
      )}

      {scanMethod === 'upload' && (
        <div className="upload-scanner">
          <input type="file" accept="image/*" onChange={handleFileInput} />
          <div id="reader" style={{ display: 'none' }}></div>
          <button onClick={() => setScanMethod(null)}>Volver</button>
        </div>
      )}

      {result && (
        <div className="scan-result">
          <h3>{result}</h3>
        </div>
      )}
    </div>
  );
};

export default ScanAccess;
