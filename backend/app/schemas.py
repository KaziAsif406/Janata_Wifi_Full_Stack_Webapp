from pydantic import BaseModel

class StockCreate(BaseModel):
    trade_code: str
    date: str
    open: float
    high: float
    low: float
    close: float
    volume: int

class Stock(BaseModel):
    id: int
    trade_code: str
    date: str
    open: float
    high: float
    low: float
    close: float
    volume: int
    
    class Config:
        from_attributes = True
