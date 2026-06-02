# Kompos.In — Frontend

PWA React + Vite untuk klasifikasi sampah berbasis AI.

## Setup

```bash
cp .env.example .env
npm install
npm run dev
```

## Struktur

```
src/
├── components/
│   ├── ImageUploader.jsx   # Upload & preview foto (drag-drop + kamera HP)
│   ├── OrganicSelector.jsx # Pilih jenis bahan organik
│   └── ResultCard.jsx      # Tampilkan hasil klasifikasi & rekomendasi
├── api.js                  # Axios calls ke FastAPI backend
├── App.jsx                 # State machine utama (3 langkah)
└── index.css               # Design system & komponen styles
```

## Mode Development (tanpa backend)

App secara default menggunakan mock data. Ubah `useMock = false` di `App.jsx`
setelah backend FastAPI siap berjalan.

## Deploy

```bash
npm run build       # output ke dist/
# Upload dist/ ke Vercel / Netlify
```
