from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db

router = APIRouter(prefix="/api/categorias", tags=["categorías"])

@router.get("/{categoria_id}/detalle")
def detalle_categoria(categoria_id: int, db: Session = Depends(get_db)):
    # Simulación de estadística
    return {
        "categoria_id": categoria_id,
        "gastos_totales": 500.0,
        "transacciones": [
            {"id": 1, "monto": 250, "fecha": "2025-07-01"},
            {"id": 2, "monto": 250, "fecha": "2025-07-05"}
        ]
    }