from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
import os

app = FastAPI(title="Village Legends API")

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/")
async def root():
    return {"message": "Village Legends API is running", "authentication": "local-browser"}
