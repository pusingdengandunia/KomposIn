import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
});

/**
 * Kirim gambar ke backend untuk diklasifikasikan.
 * @param {File} imageFile
 * @returns {Promise<{class: string, confidence: number, label_id: number}>}
 */
export async function classifyImage(imageFile) {
  const formData = new FormData();
  formData.append("file", imageFile);

  const { data } = await api.post("/classify", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

/**
 * Minta rekomendasi kompos berdasarkan pilihan bahan organik.
 * @param {string} organicType - key bahan organik dari knowledge base
 * @returns {Promise<{category: string, cn_ratio: number, recommendation: string, tips: string}>}
 */
export async function getCompostRecommendation(organicType) {
  const { data } = await api.post("/recommend", { organic_type: organicType });
  return data;
}

/**
 * Ambil daftar bahan organik yang tersedia dari knowledge base.
 * @returns {Promise<Array<{key: string, name: string, category: string, cn_ratio: number}>>}
 */
export async function getOrganicOptions() {
  const { data } = await api.get("/organic-options");
  return data;
}
