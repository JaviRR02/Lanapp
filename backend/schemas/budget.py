from pydantic import BaseModel

class BudgetSchema(BaseModel):
    email: str
    category: str
    limit: float

    class Config:
        orm_mode = True