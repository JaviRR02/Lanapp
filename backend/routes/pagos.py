from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models
from schemas.fixed_payment import FixedPaymentSchema, FixedPaymentEditSchema
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

@router.put("/editar/{id}", response_model=FixedPaymentSchema)
def editar_pago_por_id(id: int, cambios: FixedPaymentEditSchema, db: Session = Depends(get_db)):
    pago = db.query(models.FixedPayment).filter(models.FixedPayment.id == id).first()

    if not pago:
        raise HTTPException(status_code=404, detail="Pago fijo no encontrado")

    if cambios.name is not None:
        pago.name = cambios.name
    if cambios.amount is not None:
        pago.amount = cambios.amount
    if cambios.day is not None:
        pago.day = cambios.day

    db.commit()
    db.refresh(pago)
    return pago

@router.get("/buscar", response_model=FixedPaymentSchema)
def buscar_pago(email: str, name: str, db: Session = Depends(get_db)):
    pago = db.query(models.FixedPayment).filter(
        models.FixedPayment.email == email,
        models.FixedPayment.name == name
    ).first()

    if not pago:
        raise HTTPException(status_code=404, detail="Pago fijo no encontrado")

    return pago

@router.delete("/eliminar/{id}")
def eliminar_pago(id: int, db: Session = Depends(get_db)):
    pago = db.query(models.FixedPayment).filter(models.FixedPayment.id == id).first()

    if not pago:
        raise HTTPException(status_code=404, detail="Pago fijo no encontrado")

    db.delete(pago)
    db.commit()
    return {"message": "Pago fijo eliminado exitosamente"}
