from pydantic import BaseModel, Field
from typing import List

# Modelos de solicitud y respuesta
class Point(BaseModel):
    lat: float = Field(..., description="Latitude of the point.")
    lng: float = Field(..., description="Longitude of the point.")

class PointsList(BaseModel):
    points: List[Point] = Field(..., min_items=1, description="List of geographical points.")

class Centroid(BaseModel):
    lat: float
    lng: float

class Bounds(BaseModel):
    north: float
    south: float
    east: float
    west: float

class GeoprocessedData(BaseModel):
    centroid: Centroid
    bounds: Bounds