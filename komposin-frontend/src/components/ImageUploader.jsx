import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

export default function ImageUploader({ onImageSelect, isLoading }) {
  const [preview, setPreview] = useState(null);

  const onDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (!file) return;
      setPreview(URL.createObjectURL(file));
      onImageSelect(file);
    },
    [onImageSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
    disabled: isLoading,
  });

  const handleCameraCapture = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    onImageSelect(file);
  };

  return (
    <div className="uploader-wrapper">
      <div
        {...getRootProps()}
        className={`dropzone ${isDragActive ? "drag-active" : ""} ${isLoading ? "disabled" : ""}`}
      >
        <input {...getInputProps()} />

        {preview ? (
          <div className="preview-container">
            <img src={preview} alt="Preview sampah" className="preview-img" />
            {!isLoading && (
              <div className="preview-overlay">
                <span>Ganti foto</span>
              </div>
            )}
          </div>
        ) : (
          <div className="dropzone-content">
            <div className="upload-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <p className="dropzone-title">
              {isDragActive ? "Lepaskan foto di sini" : "Unggah foto sampah"}
            </p>
            <p className="dropzone-hint">Seret & lepas berkas, atau klik untuk memilih</p>
          </div>
        )}
      </div>

      {/* Tombol kamera khusus mobile */}
      <label className={`camera-btn ${isLoading ? "disabled" : ""}`} style={{ pointerEvents: isLoading ? "none" : "auto", opacity: isLoading ? 0.5 : 1 }}>
        <input
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleCameraCapture}
          disabled={isLoading}
          style={{ display: "none" }}
        />
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
          <circle cx="12" cy="13" r="4"/>
        </svg>
        Ambil Foto dari Kamera
      </label>
    </div>
  );
}
