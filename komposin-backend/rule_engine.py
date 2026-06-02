import json
import os

KB_PATH = os.path.join(os.path.dirname(__file__), 'knowledge_base.json')

with open(KB_PATH, 'r', encoding='utf-8') as f:
    KNOWLEDGE_BASE = json.load(f)


def get_material_info(material_name: str) -> dict | None:
    """Cari info bahan spesifik dari knowledge base."""
    for item in KNOWLEDGE_BASE:
        if item['name'].lower() == material_name.lower():
            return item
    return None


def generate_recommendation(waste_class: str) -> dict:
    """
    Generate rekomendasi berdasarkan kelas sampah.
    waste_class: 'O', 'N', atau 'R'
    """
    if waste_class == 'O':
        return {
            "can_compost":       True,
            "can_recycle":       False,
            "message":           "Sampah ini bisa dikomposter!",
            "composting_tips":   "Campurkan bahan Green dan Brown dengan rasio 1:3. "
                                 "Pastikan tumpukan kompos lembab seperti spons basah. "
                                 "Aduk setiap 3-4 hari agar sirkulasi udara baik.",
            "green_brown_ratio": "1:3"
        }

    elif waste_class == 'R':
        return {
            "can_compost":       False,
            "can_recycle":       True,
            "message":           "Sampah ini bisa didaur ulang.",
            "composting_tips":   None,
            "green_brown_ratio": None
        }

    elif waste_class == 'N':
        return {
            "can_compost":       False,
            "can_recycle":       False,
            "message":           "Sampah ini tidak bisa dikomposter maupun didaur ulang. Buang ke TPA.",
            "composting_tips":   None,
            "green_brown_ratio": None
        }

    else:
        return {
            "can_compost":       False,
            "can_recycle":       False,
            "message":           "Kelas sampah tidak dikenali.",
            "composting_tips":   None,
            "green_brown_ratio": None
        }