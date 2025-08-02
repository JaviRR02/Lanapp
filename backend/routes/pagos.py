from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models
from schemas.fixed_payment import FixedPaymentSchema
from typing import List

router = APIRouter(prefix="/api/pagos", tags=["pagos fijos"])

@router.get("/", response_model=List[FixedPaymentSchema])
def listar_pagos(email: str, db: Session = Depends(get_db)):
    return db.query(models.FixedPayment).filter(models.FixedPayment.email == email).all()

@router.post("/")
def crear_pago(pago: FixedPaymentSchema, db: Session = Depends(get_db)):
    nuevo = models.FixedPayment(**pago.dict())
    db.add(nuevo)
    db.commit()
    return {"message": "Pago fijo añadido"}