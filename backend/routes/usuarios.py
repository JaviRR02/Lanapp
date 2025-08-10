from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from schemas.user import UserCreate, UserLogin, UserProfileUpdate
from crud import usuarios as crud
from models import User
from auth import get_current_user

router = APIRouter(prefix="/api/usuarios", tags=["Usuarios"])

@router.post("/recuperar")
def recuperar_contraseña(email: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    # Aquí deberías implementar la lógica para enviar un email de recuperación
    return {"message": "Instrucciones de recuperación enviadas al correo electrónico"}

@router.put("/cambiarpassword")
def cambiar_password(
    data: UserLogin,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # El usuario autenticado cambia su propia contraseña
    if crud.update_password(db, current_user.email, data.password):
        return {"message": "Contraseña actualizada correctamente"}
    raise HTTPException(status_code=404, detail="Usuario no encontrado")

@router.get("/perfil")
def ver_perfil(current_user: User = Depends(get_current_user)):
    return current_user

@router.put("/perfil")
def editar_perfil(
    updates: UserProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    user = crud.update_profile(db, current_user.email, updates)
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return user

@router.post("/logout")
def logout(current_user: User = Depends(get_current_user)):
    # Solo ejemplo, porque logout con JWT suele manejarse en frontend borrando el token
    return {"message": f"Sesión cerrada exitosamente para {current_user.email}"}

@router.delete("/eliminar")
def eliminar_usuario(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if crud.delete_user(db, current_user.email):
        return {"message": "Usuario eliminado exitosamente"}
    raise HTTPException(status_code=404, detail="Usuario no encontrado")
