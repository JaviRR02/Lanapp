from pydantic import BaseModel

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
