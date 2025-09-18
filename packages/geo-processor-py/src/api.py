from fastapi import APIRouter
from .models import PointsList, GeoprocessedData
from .service import calculate_geodata

# Usamos APIRouter para modularizar los endpoints
router = APIRouter()

@router.post("/process", response_model=GeoprocessedData, status_code=200)
def process_points(data: PointsList):
    """
    Procesa una lista de puntos geográficos para encontrar su centroide y recuadro delimitador.
    """
    result = calculate_geodata(data)
    return result