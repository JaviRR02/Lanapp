from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from collections import defaultdict
from database import get_db
from models import Transaction

router = APIRouter(prefix="/api/graficas", tags=["Gráficas"])

@router.get("/ingresos-por-categoria")
def grafica_ingresos_por_categoria(email: str, db: Session = Depends(get_db)):
    transacciones = db.query(Transaction).filter(Transaction.email == email, Transaction.type == "ingreso").all()

    if not transacciones:
        raise HTTPException(status_code=404, detail="No hay ingresos para este usuario")

    ingresos = defaultdict(float)
    for trans in transacciones:
        ingresos[trans.category] += trans.amount

    return {"ingresos_por_categoria": ingresos}


@router.get("/egresos-por-categoria")
def grafica_egresos_por_categoria(email: str, db: Session = Depends(get_db)):
    transacciones = db.query(Transaction).filter(Transaction.email == email, Transaction.type == "egreso").all()

    if not transacciones:
        raise HTTPException(status_code=404, detail="No hay egresos para este usuario")

    egresos = defaultdict(float)
    for trans in transacciones:
        egresos[trans.category] += trans.amount

    return {"egresos_por_categoria": egresos}


@router.get("/ingresos-vs-egresos")
def grafica_ingresos_vs_egresos(email: str, db: Session = Depends(get_db)):
    transacciones = db.query(Transaction).filter(Transaction.email == email).all()

    if not transacciones:
        raise HTTPException(status_code=404, detail="No hay transacciones para este usuario")

    ingresos = sum(t.amount for t in transacciones if t.type == "ingreso")
    egresos = sum(t.amount for t in transacciones if t.type == "egreso")

    return {"ingresos_vs_egresos": {"ingresos": ingresos, "egresos": egresos}}
