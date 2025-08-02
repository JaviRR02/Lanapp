from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from schemas.user import UserCreate, UserLogin, UserProfileUpdate
from crud import usuarios as crud
from models import User

router = APIRouter(prefix="/api/usuarios", tags=["usuarios"])

@router.post("/registro")
def registrar(user: UserCreate, db: Session = Depends(get_db)):
    return crud.create_user(db, user)

@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    authenticated_user = crud.authenticate_user(db, user.email, user.password)
    if not authenticated_user:
        raise HTTPException(status_code=400, detail="Email o contraseña incorrectos")
    return {"message": "Login exitoso"}

@router.post("/recuperar")
def recuperar_contraseña(email: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    # Aquí deberías implementar la lógica para enviar un email de recuperación
    return {"message": "Instrucciones de recuperación enviadas al correo electrónico"}

@router.put("/cambiarpassword")
def cambiar_password(data: UserLogin, db: Session = Depends(get_db)):
    if crud.update_password(db, data.email, data.password):
        return {"message": "Contraseña actualizada correctamente"}
    raise HTTPException(status_code=404, detail="Usuario no encontrado")

@router.get("/perfil")
def ver_perfil(email: str, db: Session = Depends(get_db)):
    user = crud.get_profile(db, email)
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return user

@router.put("/perfil")
def editar_perfil(email: str, updates: UserProfileUpdate, db: Session = Depends(get_db)):
    user = crud.update_profile(db, email, updates)
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return user

@router.post("/logout")
def logout():
    return {"message": "Sesión cerrada exitosamente"}

@router.delete("/eliminar")
def eliminar_usuario(email: str, db: Session = Depends(get_db)):
    if crud.delete_user(db, email):
        return {"message": "Usuario eliminado exitosamente"}
    raise HTTPException(status_code=404, detail="Usuario no encontrado")