import { useState, useEffect } from "react";
import ImageUploader from "./components/ImageUploader";
import OrganicSelector from "./components/OrganicSelector";
import ResultCard from "./components/ResultCard";
import { classifyImage, getCompostRecommendation } from "./api";

function TypedLogo() {
  const fullText = "Kompos.In";
  const [displayed, setDisplayed] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const handleTyping = () => {
      if (!isDeleting) {
        // Sedang mengetik
        if (displayed.length < fullText.length) {
          setDisplayed(fullText.slice(0, displayed.length + 1));
        } else {
          // Selesai mengetik, tunggu sebentar lalu mulai hapus
          setTimeout(() => setIsDeleting(true), 1500);
        }
      } else {
        // Sedang menghapus
        if (displayed.length > 0) {
          setDisplayed(fullText.slice(0, displayed.length - 1));
        } else {
          // Selesai menghapus, mulai ketik lagi
          setIsDeleting(false);
        }
      }
    };

    // Kecepatan animasi
    const speed = isDeleting ? 60 : 120;
    const id = setTimeout(handleTyping, speed);

    return () => clearTimeout(id);
  }, [displayed, isDeleting, fullText]);

  // Split into "Kompos" and ".In" for accent coloring
  const mainPart = displayed.length <= 6 ? displayed : displayed.slice(0, 6);
  const dotPart = displayed.length > 6 ? displayed.slice(6) : "";

  return (
    <span className="logo-text">
      {mainPart}
      {dotPart && <span className="logo-dot">{dotPart}</span>}
      <span className="logo-cursor" aria-hidden="true">|</span>
    </span>
  );
}

const STEPS = { UPLOAD: 0, SELECT_ORGANIC: 1, RESULT: 2 };

// Mock untuk development sebelum backend siap
const MOCK_CLASSIFY = async () => {
  await new Promise((r) => setTimeout(r, 1800));
  return { predicted_class: "Organic", confidence: 0.91 };
};

const MOCK_RECOMMEND = async (key) => {
  await new Promise((r) => setTimeout(r, 800));
  const map = {
    sisa_sayur: { cn_ratio: 15, recommendation: "Tambahkan 2 bagian bahan Brown (daun kering/kardus) untuk menyeimbangkan rasio C/N menjadi 25–30:1. Aduk tumpukan setiap 3–4 hari.", tips: "Cacah kecil (<5cm) agar dekomposisi lebih cepat.", green_parts: 1, brown_parts: 2 },
    kulit_buah: { cn_ratio: 35, recommendation: "Tambahkan 1–2 bagian Brown. Hindari kulit buah sitrus berlebihan karena bersifat asam.", tips: "Kulit pisang sangat bagus — kaya kalium untuk tanaman.", green_parts: 1, brown_parts: 2 },
    daun_kering: { cn_ratio: 60, recommendation: "Tambahkan 1 bagian bahan Green (sisa sayur/rumput segar) untuk menurunkan rasio C/N.", tips: "Remukkan daun kering sebelum ditumpuk agar lebih cepat terurai.", green_parts: 2, brown_parts: 1 },
    ampas_kopi: { cn_ratio: 20, recommendation: "Sangat baik sebagai aktivator kompos. Tambahkan 2 bagian Brown.", tips: "Filter kertas kopi juga bisa ikut dikomposkan.", green_parts: 1, brown_parts: 2 },
    default: { cn_ratio: 30, recommendation: "Tambahkan bahan pelengkap sesuai kategori untuk menyeimbangkan C/N ratio.", tips: "Jaga kelembapan setara spons basah, tidak terlalu kering atau terlalu basah.", green_parts: 1, brown_parts: 2 },
  };
  return map[key] || map.default;
};

export default function App() {
  const [step, setStep] = useState(STEPS.UPLOAD);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [classification, setClassification] = useState(null);
  const [selectedOrganic, setSelectedOrganic] = useState(null);
  const [recommendation, setRecommendation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [useMock] = useState(true); // ganti false jika backend sudah aktif

  // Theme state: dark by default, persists in localStorage, checks OS preferences
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "light" || saved === "dark") return saved;
    const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
    return prefersLight ? "light" : "dark";
  });

  // Sync theme selection to document element attribute
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const handleImageSelect = async (file) => {
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setError(null);
    setIsLoading(true);
    try {
      const result = useMock ? await MOCK_CLASSIFY() : await classifyImage(file);
      setClassification(result);
      if (result.predicted_class === "Organic") {
        setStep(STEPS.SELECT_ORGANIC);
      } else {
        setRecommendation(null);
        setStep(STEPS.RESULT);
      }
    } catch {
      setError("Gagal menghubungi server. Pastikan backend sudah berjalan.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOrganicSelect = async (organic) => {
    setSelectedOrganic(organic);
    setError(null);
    setIsLoading(true);
    try {
      const rec = useMock
        ? await MOCK_RECOMMEND(organic.key)
        : await getCompostRecommendation(organic.key);
      setRecommendation(rec);
      setStep(STEPS.RESULT);
    } catch {
      setError("Gagal mengambil rekomendasi. Coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setStep(STEPS.UPLOAD);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setClassification(null);
    setSelectedOrganic(null);
    setRecommendation(null);
    setError(null);
  };

  return (
    <div className="app">
      {/* Dynamic background lighting */}
      <div className="bg-texture" aria-hidden="true" />

      {/* Sticky top-nav */}
      <header className="app-header">
        <div className="header-container">
          <div className="logo">
            <div className="logo-mark">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <TypedLogo />
          </div>

          <div className="header-actions">
            <p className="header-tagline" style={{ marginRight: "var(--spacing-sm)" }}>Klasifikasi Sampah AI</p>
            <button className="theme-toggle-btn" onClick={toggleTheme} aria-label="Toggle theme">
              {theme === "dark" ? (
                // Sun icon for switching to light mode
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                </svg>
              ) : (
                // Moon icon for switching to dark mode
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main body */}
      <main className="app-main">
        {/* Step indicator */}
        <div className="step-indicator">
          {["Unggah", "Pilih Bahan", "Hasil"].map((label, i) => (
            <div key={i} className={`step-item ${step === i ? "active" : step > i ? "done" : ""}`}>
              <div className="step-dot">
                {step > i ? (
                  <svg width="9" height="9" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="2 6 5 9 10 3" />
                  </svg>
                ) : i + 1}
              </div>
              <span className="step-label">{label}</span>
              {i < 2 && <div className={`step-line ${step > i ? "done" : ""}`} />}
            </div>
          ))}
        </div>

        {error && (
          <div className="error-banner" role="alert">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {error}
          </div>
        )}

        {/* STEP 0: UPLOAD PAGE */}
        {step === STEPS.UPLOAD && (
          <section className="section-card fade-in" style={{ maxWidth: "600px", margin: "0 auto", width: "100%" }}>
            <span className="eyebrow">Deteksi Sampah</span>
            <h2 className="section-title">Foto sampahmu</h2>
            <p className="section-desc">Unggah foto sampah Anda agar model AI dapat membedakan kategori organik atau anorganik.</p>

            <ImageUploader onImageSelect={handleImageSelect} isLoading={isLoading} />

            {isLoading && (
              <div className="loading-state">
                <div className="spinner" />
                <p>Menganalisis citra sampah<span className="dots">...</span></p>
              </div>
            )}
          </section>
        )}

        {/* DASHBOARD LAYOUT FOR STEPS 1 & 2 */}
        {step !== STEPS.UPLOAD && (
          <div className="dashboard-layout fade-in">
            {/* STICKY SIDEBAR */}
            <aside className="dashboard-sidebar">
              <div className="section-card">
                <span className="eyebrow">Gambar Terunggah</span>
                {previewUrl && (
                  <img
                    src={previewUrl}
                    alt="Sampah terunggah"
                    className="preview-img"
                    style={{
                      width: "100%",
                      height: "220px",
                      objectFit: "cover",
                      borderRadius: "var(--radius-md)",
                      border: "1px solid var(--c-hairline-soft)",
                      marginBottom: "var(--spacing-md)"
                    }}
                  />
                )}

                {step === STEPS.SELECT_ORGANIC && (
                  <div className="classified-badge organic" style={{ width: "100%", justifyContent: "center" }}>
                    Terdeteksi Organik ({Math.round(classification?.confidence * 100)}%)
                  </div>
                )}

                {step === STEPS.RESULT && classification && (
                  <div style={{ marginTop: "var(--spacing-xs)" }}>
                    <span className="eyebrow" style={{ fontSize: "10px" }}>STATUS SELESAI</span>
                    <p className="body-sm" style={{ color: "var(--c-ink-muted)" }}>
                      Hasil pengolahan data sampah dan rekomendasi komposter.
                    </p>
                  </div>
                )}
              </div>
            </aside>

            {/* CONTENT AREA */}
            <div className="dashboard-content">
              {step === STEPS.SELECT_ORGANIC && (
                <section className="section-card">
                  <OrganicSelector onSelect={handleOrganicSelect} selected={selectedOrganic} />
                  {isLoading && (
                    <div className="loading-state" style={{ marginTop: "var(--spacing-lg)" }}>
                      <div className="spinner" />
                      <p>Mengkalkulasi rekomendasi kompos<span className="dots">...</span></p>
                    </div>
                  )}
                </section>
              )}

              {step === STEPS.RESULT && classification && (
                <div>
                  <ResultCard
                    classification={classification}
                    recommendation={recommendation}
                    selectedOrganic={selectedOrganic}
                  />
                  <button className="reset-btn" onClick={handleReset}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="1 4 1 10 7 10" />
                      <path d="M3.51 15a9 9 0 1 0 .49-4.5" />
                    </svg>
                    Klasifikasi Sampah Lain
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <p>© {new Date().getFullYear()} Kompos.In · Dashboard System · Built with HashiCorp Design Spec</p>
      </footer>
    </div>
  );
}
