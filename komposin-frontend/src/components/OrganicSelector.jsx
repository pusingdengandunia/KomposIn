import { useEffect, useState } from "react";
import { getOrganicOptions } from "../api";

// Fallback lokal jika API belum siap
const FALLBACK_OPTIONS = [
  { key: "sisa_sayur", name: "Sisa Sayuran", category: "Green", cn_ratio: 15, emoji: "🥦" },
  { key: "kulit_buah", name: "Kulit Buah", category: "Green", cn_ratio: 35, emoji: "🍌" },
  { key: "daun_kering", name: "Daun Kering", category: "Brown", cn_ratio: 60, emoji: "🍂" },
  { key: "ampas_kopi", name: "Ampas Kopi", category: "Green", cn_ratio: 20, emoji: "☕" },
  { key: "kulit_telur", name: "Kulit Telur", category: "Brown", cn_ratio: 15, emoji: "🥚" },
  { key: "sisa_nasi", name: "Sisa Nasi / Roti", category: "Green", cn_ratio: 15, emoji: "🍚" },
  { key: "rumput_segar", name: "Rumput / Gulma Segar", category: "Green", cn_ratio: 25, emoji: "🌿" },
  { key: "kardus", name: "Kardus / Kertas", category: "Brown", cn_ratio: 400, emoji: "📦" },
  { key: "serbuk_gergaji", name: "Serbuk Gergaji", category: "Brown", cn_ratio: 500, emoji: "🪵" },
  { key: "jerami", name: "Jerami / Sekam", category: "Brown", cn_ratio: 80, emoji: "🌾" },
];

export default function OrganicSelector({ onSelect, selected }) {
  const [options, setOptions] = useState(FALLBACK_OPTIONS);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    getOrganicOptions()
      .then((data) => { if (data?.length) setOptions(data); })
      .catch(() => {}); // tetap pakai fallback
  }, []);

  const filtered =
    filter === "all" ? options : options.filter((o) => o.category === filter);

  return (
    <div className="organic-selector">
      <div className="selector-header">
        <span className="eyebrow">Pilihan Komposisi</span>
        <h3 className="selector-title">Pilih jenis bahan organik</h3>
        <p className="selector-hint">Pilih yang paling mendekati sampahmu untuk menyeimbangkan karbon & nitrogen</p>
      </div>

      <div className="filter-tabs">
        {["all", "Green", "Brown"].map((f) => (
          <button
            key={f}
            className={`filter-tab ${filter === f ? "active" : ""} ${f !== "all" ? f.toLowerCase() : ""}`}
            onClick={() => setFilter(f)}
          >
            {f === "all" ? "Semua" : f === "Green" ? "🟢 Nitrogen (Green)" : "🟤 Karbon (Brown)"}
          </button>
        ))}
      </div>

      <div className="options-grid">
        {filtered.map((opt) => (
          <button
            key={opt.key}
            className={`option-card ${selected?.key === opt.key ? "selected" : ""} ${opt.category.toLowerCase()}`}
            onClick={() => onSelect(opt)}
          >
            <span className="option-emoji">{opt.emoji || "🌱"}</span>
            <span className="option-name">{opt.name}</span>
            <span className={`option-badge ${opt.category.toLowerCase()}`}>
              {opt.category === "Green" ? "Nitrogen" : "Karbon"}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
