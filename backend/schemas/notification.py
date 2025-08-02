from pydantic import BaseModel
from typing import Optional

class NotificationSchema(BaseModel):
    id: Optional[int] = None
    email: str
    message: str
    seen: bool

    class Config:
        orm_mode = True

# Para editar preferencias
class NotificationUpdateSchema(BaseModel):
    email: str
    preferences: dict  # Puedes ajustar el tipo si tienes una estructura específica

    class Config:
        orm_mode = True

