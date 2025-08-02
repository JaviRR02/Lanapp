from pydantic import BaseModel

class GraphDataSchema(BaseModel):
    category: str
    total: float

    class Config:
        orm_mode = True

class CategoryDetailSchema(BaseModel):
    category: str
    total_spent: float
    transaction_count: int
    average: float

    class Config:
        orm_mode = True