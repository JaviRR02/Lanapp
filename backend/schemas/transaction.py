from pydantic import BaseModel

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