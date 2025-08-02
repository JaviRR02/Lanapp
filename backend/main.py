from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Base de datos
from database import Base, engine
from models import *  # Modelos SQLAlchemy

# Crear tablas
Base.metadata.create_all(bind=engine)

# Crear instancia principal de la app
app = FastAPI()

# Middleware CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers (importaciones después de definir app para evitar referencias circulares)
from routes import usuarios, transacciones, graficas, presupuestos, notificaciones, pagos, categorias

app.include_router(usuarios.router)
app.include_router(transacciones.router)
app.include_router(graficas.router)
app.include_router(presupuestos.router)
app.include_router(notificaciones.router)
app.include_router(pagos.router)
app.include_router(categorias.router)

@app.get("/")
def root():
    return {"message": "API de LanaApp funcionando correctamente."}
