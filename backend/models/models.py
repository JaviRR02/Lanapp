from sqlalchemy import Column, Integer, String, Float
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100))
    apellido = Column(String(100))
    email = Column(String(100), unique=True, index=True)
    telefono = Column(String(100))
    password = Column(String(100))

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(100), index=True)
    amount = Column(Float)
    category = Column(String(100))
    type = Column(String(10))  # "ingreso" o "egreso"
    date = Column(String(50))
    description = Column(String(255))

class Budget(Base):
    __tablename__ = "budgets"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(100), index=True)
    category = Column(String(100))
    limit = Column(Float)

class FixedPayment(Base):
    __tablename__ = "fixed_payments"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(100), index=True)
    name = Column(String(100))
    amount = Column(Float)
    day = Column(Integer)

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(100), index=True)
    message = Column(String(255))
    seen = Column(Integer, default=0)  # o usa Boolean si prefieres

# Opcionales
class CategoryDetail(Base):
    __tablename__ = "category_details"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(100), index=True)
    category = Column(String(100))
    total_spent = Column(Float)
    transaction_count = Column(Integer)
    average = Column(Float)

class GraphData(Base):
    __tablename__ = "graph_data"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(100), index=True)
    category = Column(String(100))
    total = Column(Float)
