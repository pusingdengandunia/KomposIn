import tensorflow as tf
import numpy as np

IMG_SIZE    = (224, 224)
CLASS_NAMES = ['N', 'O', 'R']

# Load model sekali saat module di-import
try:
    model = tf.keras.models.load_model('model/mobilenetv2_kompos.h5')
    print("✅ Model loaded successfully")
except Exception as e:
    print(f"❌ Gagal load model: {e}")
    model = None


def preprocess_image(image_bytes: bytes) -> tf.Tensor:
    """
    Preprocessing gambar dari raw bytes.
    HARUS identik dengan preprocessing saat training.
    """
    image = tf.image.decode_image(image_bytes, channels=3, expand_animations=False)
    image = tf.image.resize(image, IMG_SIZE)
    image = tf.cast(image, tf.float32)
    image = tf.keras.applications.mobilenet_v2.preprocess_input(image)
    image = tf.expand_dims(image, axis=0)
    return image


def predict(image_bytes: bytes) -> dict:
    """
    Prediksi kelas sampah dari raw bytes gambar.
    Return: dict berisi class, confidence, all_scores
    """
    if model is None:
        raise RuntimeError("Model belum berhasil di-load")

    try:
        image = preprocess_image(image_bytes)
        predictions = model.predict(image, verbose=0)
        idx        = int(np.argmax(predictions[0]))
        confidence = float(predictions[0][idx])

        return {
            "class":      CLASS_NAMES[idx],
            "confidence": confidence,
            "all_scores": dict(zip(CLASS_NAMES, predictions[0].tolist()))
        }

    except Exception as e:
        raise ValueError(f"Gagal memproses gambar: {e}")