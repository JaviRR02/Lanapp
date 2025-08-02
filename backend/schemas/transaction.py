from pydantic import BaseModel
from typing import Optional

# -------------------
# Transacciones
# -------------------
# Esquema para crear una transacción (entrada)
class TransactionCreate(BaseModel):
    email: str
    amount: float
    category: str
    date: str  # o datetime si quieres usarlo como fecha real
    description: str
    type: str  # "ingreso" o "egreso"

    class Config:
        orm_mode = True

# Esquema para mostrar una transacción (salida)
class TransactionSchema(TransactionCreate):
    id: int

# Esquema para actualizar una transacción

class TransactionUpdate(BaseModel):
    amount: Optional[float] = None
    category: Optional[str] = None
    date: Optional[str] = None
    description: Optional[str] = None
    type: Optional[str] = None

    class Config:
        orm_mode = True
