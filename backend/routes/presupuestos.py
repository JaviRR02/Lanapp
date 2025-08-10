from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from models import Budget
from schemas.budget import BudgetSchema
from database import get_db
from typing import List
from auth import get_current_user, User

router = APIRouter(prefix="/api/presupuestos", tags=["Presupuestos"])

@router.get("/", response_model=List[BudgetSchema])
def ver_presupuestos(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(Budget).filter(Budget.email == current_user.email).all()

@router.post("/", response_model=BudgetSchema)
def crear_presupuesto(
    data: BudgetSchema,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Aseguramos que el email sea el del usuario autenticado
    nuevo = Budget(**data.dict(exclude={"email"}), email=current_user.email)
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo

@router.put("/", response_model=BudgetSchema)
def editar_presupuesto(
    data: BudgetSchema,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    presupuesto = db.query(Budget).filter(
        Budget.email == current_user.email,
        Budget.category == data.category
    ).first()

    if not presupuesto:
        raise HTTPException(status_code=404, detail="Presupuesto no encontrado")

    presupuesto.limit = data.limit
    db.commit()
    db.refresh(presupuesto)
    return presupuesto

@router.get("/buscar", response_model=BudgetSchema)
def buscar_presupuesto(
    category: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    presupuesto = db.query(Budget).filter(
        Budget.email == current_user.email,
        Budget.category == category
    ).first()

    if not presupuesto:
        raise HTTPException(status_code=404, detail="Presupuesto no encontrado")

    return presupuesto

@router.delete("/eliminar")
def eliminar_presupuesto(
    category: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    presupuesto = db.query(Budget).filter(
        Budget.email == current_user.email,
        Budget.category == category
    ).first()

    if not presupuesto:
        raise HTTPException(status_code=404, detail="Presupuesto no encontrado")

    db.delete(presupuesto)
    db.commit()
    return {"message": "Presupuesto eliminado exitosamente"}
