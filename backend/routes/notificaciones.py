from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from pydantic import BaseModel

router = APIRouter(prefix="/api/notificaciones", tags=["notificaciones"])

# Simulación de preferencias de notificación
fake_notifications = {}

class NotificacionSchema(BaseModel):
    email: str
    preferencias: dict

@router.get("/{email}")
def ver_notificaciones(email: str, db: Session = Depends(get_db)):
    return fake_notifications.get(email, {"email": email, "preferencias": {}})

@router.put("/")
def configurar_notificaciones(noti: NotificacionSchema, db: Session = Depends(get_db)):
    fake_notifications[noti.email] = noti.dict()
    return {"message": "Preferencias de notificación actualizadas"}