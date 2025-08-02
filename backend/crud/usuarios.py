from sqlalchemy.orm import Session
from models import User
from schemas.user import UserCreate
from fastapi import HTTPException

def create_user(db: Session, user: UserCreate):
    db_user = User(
        nombre=user.nombre,
        apellido=user.apellido,
        email=user.email,
        telefono=user.telefono,
        password=user.password  # Recomendación: usar hash en producción
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def authenticate_user(db: Session, email: str, password: str) -> User | None:
    user = db.query(User).filter(User.email == email).first()
    if not user:
        return None
    # Aquí debes validar password (simple comparación o con hashing)
    if user.password != password:
        return None
    return user

def update_password(db: Session, email: str, new_password: str) -> bool:
    user = db.query(User).filter(User.email == email).first()
    if not user:
        return False
    user.password = new_password  # Recomendación: usar hash en producción
    db.commit()
    return True

def get_profile(db: Session, email: str) -> User | None:
    user = db.query(User).filter(User.email == email).first()
    return user

def update_profile(db: Session, email: str, updates: UserCreate) -> User | None:
    user = db.query(User).filter(User.email == email).first()
    if not user:
        return None
    user.nombre = updates.nombre
    user.apellido = updates.apellido
    user.telefono = updates.telefono
    db.commit()
    db.refresh(user)
    return user

def delete_user(db: Session, email: str) -> bool:
    user = db.query(User).filter(User.email == email).first()
    if not user:
        return False
    db.delete(user)
    db.commit()
    return True