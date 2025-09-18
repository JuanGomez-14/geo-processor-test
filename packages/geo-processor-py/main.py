from fastapi import FastAPI
from src.api import router as api_router

# Creación de la aplicación FastAPI
app = FastAPI(
    title="Geo-Processor Service",
    description="A microservice to process geographical coordinates.",
    version="1.0.0"
)

# Incluimos el enrutador de la API
app.include_router(api_router)