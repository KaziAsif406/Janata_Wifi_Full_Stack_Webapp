from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class StockCreate(BaseModel):
    symbol: str
    name: str
    price: float
    change: float
    change_percent: float

class Stock(BaseModel):
    id: int
    symbol: str
    name: str
    price: float
    change: float
    change_percent: float
    updated_at: datetime
    
    class Config:
        from_attributes = True
