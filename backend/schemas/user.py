from pydantic import BaseModel, Field

class UserCreate(BaseModel):
    nombre: str
    apellido: str
    email: str
    telefono: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class UserProfileUpdate(BaseModel):
    nombre: str
    apellido: str
    telefono: str

class PasswordChangeRequest(BaseModel):
    password_actual: str = Field(..., min_length=6)
    password_nuevo: str = Field(..., min_length=8)