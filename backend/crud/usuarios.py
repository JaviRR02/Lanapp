from sqlalchemy.orm import Session
from models import User
from schemas.user import UserCreate
from fastapi import HTTPException
from passlib.context import CryptContext

# Configuración de hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_user(db: Session, user: UserCreate):
    # Hasheamos antes de guardar
    hashed_password = get_password_hash(user.password)
    db_user = User(
        nombre=user.nombre,
        apellido=user.apellido,
        email=user.email,
        telefono=user.telefono,
        password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def authenticate_user(db: Session, email: str, password: str) -> User | None:
    user = db.query(User).filter(User.email == email).first()
    if not user:
        return None
    if not verify_password(password, user.password):
        return None
    return user

def update_password(db: Session, email: str, new_password: str) -> bool:
    user = db.query(User).filter(User.email == email).first()
    if not user:
        return False
    hashed_password = get_password_hash(new_password)
    user.password = hashed_password
    db.commit()
    return True

def get_profile(db: Session, email: str) -> User | None:
    return db.query(User).filter(User.email == email).first()

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
