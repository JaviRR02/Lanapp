from database import SessionLocal
from models import User
from auth import get_password_hash

def migrate_passwords():
    db = SessionLocal()
    try:
        users = db.query(User).all()
        for user in users:
            # Si la contraseña ya tiene formato hash (empieza con $2b$ o similar), la saltamos
            if user.password.startswith("$2b$"):
                print(f"Usuario {user.email} ya tiene password hasheada, se omite")
                continue
            
            # Hasheamos la contraseña antigua en texto plano
            hashed = get_password_hash(user.password)
            user.password = hashed
            print(f"Contraseña hasheada para usuario: {user.email}")
        
        db.commit()
        print("Migración de contraseñas completada.")
    finally:
        db.close()

if __name__ == "__main__":
    migrate_passwords()
