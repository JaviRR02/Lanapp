from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models import Transaction
from schemas.transaction import TransactionSchema, TransactionCreate, TransactionUpdate

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

@router.put("/{transaccion_id}", response_model=TransactionSchema)
def actualizar_transaccion(
    transaccion_id: int,
    actualizacion: TransactionUpdate,
    db: Session = Depends(get_db)
):
    tx = db.query(Transaction).filter(Transaction.id == transaccion_id).first()
    if not tx:
        raise HTTPException(status_code=404, detail="Transacción no encontrada")

    # Aquí es donde luego validaremos el dueño
    for campo, valor in actualizacion.dict(exclude_unset=True).items():
        setattr(tx, campo, valor)

    db.commit()
    db.refresh(tx)
    return tx

@router.get("/buscar", response_model=List[TransactionSchema])
def buscar_por_descripcion(
    email: str,
    description: str,
    db: Session = Depends(get_db)
):
    transacciones = db.query(Transaction).filter(
        Transaction.email == email,
        Transaction.description.ilike(f"%{description}%")
    ).all()

    if not transacciones:
        raise HTTPException(status_code=404, detail="No se encontraron transacciones con esa descripción")

    return transacciones

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

@router.delete("/eliminar/{id}")
def eliminar_transaccion(id: int, db: Session = Depends(get_db)):
    transaccion = db.query(Transaction).filter(Transaction.id == id).first()

    if not transaccion:
        raise HTTPException(status_code=404, detail="Transacción no encontrada")

    db.delete(transaccion)
    db.commit()
    return {"message": "Transacción eliminada exitosamente"}
