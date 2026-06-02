const CLASS_CONFIG = {
  Organic: {
    color: "organic",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 3.5 0 8.5C17 15 15 18 11 20z" />
        <path d="M19 2c-2.26 4.33-5.27 7.14-8 10" />
      </svg>
    ),
    label: "Sampah Organik",
    desc: "Sampah ini dapat diolah menjadi kompos berkualitas tinggi untuk menyuburkan tanah.",
  },
  Recyclable: {
    color: "recyclable",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
      </svg>
    ),
    label: "Daur Ulang",
    desc: "Pisahkan sampah ini dan setor ke bank sampah terdekat atau petugas pengepul daur ulang.",
  },
  "Non-Recyclable": {
    color: "nonrecyclable",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2M10 11v6M14 11v6" />
      </svg>
    ),
    label: "Residu (Non-Daur Ulang)",
    desc: "Sampah residu yang tidak bisa diolah kembali. Buang ke tempat sampah residu untuk TPA.",
  },
};

const RECYCLING_TIPS = {
  Recyclable: [
    "Bersihkan sisa makanan atau cairan sebelum memilah sampah.",
    "Pisahkan wadah berdasarkan jenis bahan: plastik, kardus/kertas, logam, kaca.",
    "Ratakan atau kempeskan botol plastik dan kardus untuk menghemat ruang penyimpanan.",
    "Setorkan ke bank sampah digital atau pengepul resmi di wilayah Anda.",
  ],
  "Non-Recyclable": [
    "Minimalkan penggunaan barang sekali pakai non-recyclable ke depan.",
    "Cek apakah barang memiliki program khusus Extended Producer Responsibility (EPR).",
    "Gunakan wadah isi ulang untuk menghindari timbulan sampah plastik multilayer (saset).",
  ],
};

export default function ResultCard({ classification, recommendation, selectedOrganic }) {
  const { predicted_class, confidence } = classification;
  const config = CLASS_CONFIG[predicted_class] || CLASS_CONFIG["Non-Recyclable"];
  const confidencePct = Math.round(confidence * 100);

  // Mapped theme classes for styling: green-theme (Nomad Green) vs brown-theme (Vault Yellow)
  const isOrganic = predicted_class === "Organic";
  const themeColorClass = selectedOrganic?.category === "Green" ? "green-theme" : "brown-theme";
  const finalCardClass = `result-card ${config.color} ${isOrganic ? themeColorClass : ""}`;
  const finalIconClass = `result-icon ${config.color} ${isOrganic ? themeColorClass : ""}`;
  const finalFillClass = `confidence-bar-fill ${config.color} ${isOrganic ? themeColorClass : ""}`;

  return (
    <div className={finalCardClass}>
      {/* Header */}
      <div className="result-header">
        <div className={finalIconClass}>{config.icon}</div>
        <div>
          <p className="result-meta">Hasil Analisis Model AI</p>
          <h2 className="result-class">{config.label}</h2>
        </div>
        <div className="confidence-badge">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>
          </svg>
          Confidence {confidencePct}%
        </div>
      </div>

      {/* Confidence bar */}
      <div className="confidence-bar-wrap">
        <div className="confidence-bar-label">
          <span>Tingkat Akurasi Model AI</span>
          <span>{confidencePct}%</span>
        </div>
        <div className="confidence-bar-bg">
          <div
            className={finalFillClass}
            style={{ width: `${confidencePct}%` }}
          />
        </div>
      </div>

      {/* Organic recommendation details */}
      {isOrganic && recommendation && (
        <div className="compost-section">
          <div className="compost-material">
            <span className="material-emoji">{selectedOrganic?.emoji}</span>
            <div>
              <p className="material-name">{selectedOrganic?.name}</p>
              <span className={`option-badge ${selectedOrganic?.category?.toLowerCase()}`}>
                {selectedOrganic?.category === "Green" ? "Nitrogen (Green)" : "Karbon (Brown)"}
              </span>
            </div>
            <div className="cn-chip">
              Rasio C/N ~{recommendation.cn_ratio}:1
            </div>
          </div>

          <div className="recommendation-box">
            <h4 className="rec-title">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>
              </svg>
              Rekomendasi Pembuatan Kompos
            </h4>
            <p className="rec-text">{recommendation.recommendation}</p>
          </div>

          {recommendation.tips && (
            <div className="tips-box">
              <p className="tips-label">💡 Tips Pengolahan</p>
              <p className="tips-text">{recommendation.tips}</p>
            </div>
          )}

          {/* Visual comparison bar */}
          <div className="ratio-visual">
            <p className="ratio-title">Rasio Campuran Komposter</p>
            <div className="ratio-bars">
              <div className="ratio-item green">
                <div className="ratio-bar" style={{ height: `${Math.max(recommendation.green_parts * 35, 24)}px` }} />
                <span>Nitrogen<br/>{recommendation.green_parts} bagian</span>
              </div>
              <div className="ratio-divider">:</div>
              <div className="ratio-item brown">
                <div className="ratio-bar" style={{ height: `${Math.max(recommendation.brown_parts * 35, 24)}px` }} />
                <span>Karbon<br/>{recommendation.brown_parts} bagian</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Non-organic tips list */}
      {!isOrganic && (
        <div className="nonorganic-section">
          <p className="nonorganic-desc">{config.desc}</p>
          <span className="eyebrow" style={{ fontSize: "11px", marginBottom: "var(--spacing-sm)" }}>PANDUAN PEMILAHAN</span>
          <ul className="tips-list">
            {(RECYCLING_TIPS[predicted_class] || []).map((tip, i) => (
              <li key={i} className="tip-item">
                <span className="tip-dot" />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
