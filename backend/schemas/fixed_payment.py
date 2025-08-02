from pydantic import BaseModel
from typing import Optional

class FixedPaymentSchema(BaseModel):
    id: Optional[int] = None
    email: str
    name: str
    amount: float
    day: int  # Día del mes

    class Config:
        orm_mode = True