from .models import GeoprocessedData, Centroid, Bounds, PointsList

def calculate_geodata(data: PointsList) -> GeoprocessedData:
    """
    Calcula el centroide y los límites de una lista de puntos.
    Esta función contiene la lógica de negocio pura.
    """
    lats = [p.lat for p in data.points]
    lngs = [p.lng for p in data.points]

    # Bounding Box
    north = max(lats)
    south = min(lats)
    east = max(lngs)
    west = min(lngs)

    # Centroid
    centroid_lat = sum(lats) / len(lats)
    centroid_lng = sum(lngs) / len(lngs)

    return GeoprocessedData(
        centroid=Centroid(lat=centroid_lat, lng=centroid_lng),
        bounds=Bounds(north=north, south=south, east=east, west=west)
    )