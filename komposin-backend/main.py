from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from classifier  import predict
from rule_engine import generate_recommendation

app = FastAPI(title="Kompos.In API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"status": "ok", "message": "Kompos.In API"}


@app.post("/predict")
async def predict_waste(file: UploadFile = File(...)):
    # Validasi tipe file
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File harus berupa gambar")

    try:
        image_bytes    = await file.read()
        result         = predict(image_bytes)
        recommendation = generate_recommendation(result["class"])

        return {
            "class":          result["class"],
            "confidence":     result["confidence"],
            "all_scores":     result["all_scores"],
            "recommendation": recommendation
        }

    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal error: {e}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)