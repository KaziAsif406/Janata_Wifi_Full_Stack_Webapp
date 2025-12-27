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

class StockChartData(BaseModel):
    """Lightweight schema for chart visualization (includes price range data)"""
    date: str
    close: float
    volume: int
    high: float
    low: float

class StocksPaginatedResponse(BaseModel):
    """Response model for paginated stock list"""
    data: list[Stock]
    total: int
    skip: int
    limit: int
    
    class Config:
        from_attributes = True
