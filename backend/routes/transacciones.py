from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models import Transaction, User
from schemas.transaction import TransactionSchema, TransactionCreate, TransactionUpdate
from auth import get_current_user

router = APIRouter(prefix="/api/transacciones", tags=["Transacciones"])

# @router.get("/", response_model=List[TransactionSchema])
# def listar_transacciones(db: Session = Depends(get_db)):
#     return db.query(Transaction).all()

@router.post("/", response_model=TransactionSchema)
def crear_transaccion(tx: TransactionCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    tx_data = tx.dict()
    tx_data.pop("email", None)  # eliminar email que venga del cliente si existe
    nueva = Transaction(**tx_data, email=current_user.email)  # usar email del usuario autenticado
    db.add(nueva)
    db.commit()
    db.refresh(nueva)
    return nueva

@router.put("/{transaccion_id}", response_model=TransactionSchema)
def actualizar_transaccion(
    transaccion_id: int,
    actualizacion: TransactionUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)  # <-- protege la ruta
):
    tx = db.query(Transaction).filter(Transaction.id == transaccion_id, Transaction.email == current_user.email).first()
    if not tx:
        raise HTTPException(status_code=404, detail="Transacción no encontrada o no autorizada")

    for campo, valor in actualizacion.dict(exclude_unset=True).items():
        setattr(tx, campo, valor)

    db.commit()
    db.refresh(tx)
    return tx

@router.get("/buscar", response_model=List[TransactionSchema])
def buscar_por_descripcion(
    description: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)  # <-- protege la ruta
):
    transacciones = db.query(Transaction).filter(
        Transaction.email == current_user.email,
        Transaction.description.ilike(f"%{description}%")
    ).all()

    if not transacciones:
        raise HTTPException(status_code=404, detail="No se encontraron transacciones con esa descripción")

    return transacciones

@router.get("/filtros", response_model=List[TransactionSchema])
def filtrar_transacciones(
    categoria: str = "",
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)  # <-- protege la ruta
):
    query = db.query(Transaction).filter(Transaction.email == current_user.email)
    if categoria:
        query = query.filter(Transaction.category == categoria)
    return query.all()

@router.get("/historial", response_model=List[TransactionSchema])
def historial_transacciones(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)  # <-- protege la ruta
):
    return db.query(Transaction).filter(Transaction.email == current_user.email).order_by(Transaction.date.desc()).all()

@router.delete("/eliminar/{id}")
def eliminar_transaccion(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)  # <-- protege la ruta
):
    transaccion = db.query(Transaction).filter(Transaction.id == id, Transaction.email == current_user.email).first()

    if not transaccion:
        raise HTTPException(status_code=404, detail="Transacción no encontrada o no autorizada")

    db.delete(transaccion)
    db.commit()
    return {"message": "Transacción eliminada exitosamente"}
