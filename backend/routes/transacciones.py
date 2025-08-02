from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models import Transaction
from schemas.transaction import TransactionSchema, TransactionCreate

router = APIRouter(prefix="/api/transacciones", tags=["Transacciones"])

# @router.get("/", response_model=List[TransactionSchema])
# def listar_transacciones(db: Session = Depends(get_db)):
#     return db.query(Transaction).all()

@router.post("/", response_model=TransactionSchema)
def crear_transaccion(tx: TransactionCreate, db: Session = Depends(get_db)):
    nueva = Transaction(**tx.dict())
    db.add(nueva)
    db.commit()
    db.refresh(nueva)
    return nueva

@router.get("/filtros")
def filtrar_transacciones(email: str = "", categoria: str = "", db: Session = Depends(get_db)):
    query = db.query(Transaction)
    if email:
        query = query.filter(Transaction.email == email)
    if categoria:
        query = query.filter(Transaction.category == categoria)
    return query.all()

@router.get("/historial", response_model=List[TransactionSchema])
def historial_transacciones(email: str, db: Session = Depends(get_db)):
    return db.query(Transaction).filter(Transaction.email == email).order_by(Transaction.date.desc()).all()