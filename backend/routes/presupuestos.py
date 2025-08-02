from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from models import Budget
from schemas.budget import BudgetSchema
from database import get_db
from typing import List

router = APIRouter(prefix="/api/presupuestos", tags=["Presupuestos"])

@router.get("/", response_model=List[BudgetSchema])
def ver_presupuestos(email: str, db: Session = Depends(get_db)):
    return db.query(Budget).filter(Budget.email == email).all()

@router.post("/", response_model=BudgetSchema)
def crear_presupuesto(data: BudgetSchema, db: Session = Depends(get_db)):
    nuevo = Budget(**data.dict())
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo