from sqlalchemy.orm import Session
from app import models, schemas

def get_stocks(db: Session, skip: int = 0, limit: int = 100):
    """Get all stocks with pagination"""
    return db.query(models.Stock).offset(skip).limit(limit).all()

def get_stock_by_id(db: Session, stock_id: int):
    """Get stock by ID"""
    return db.query(models.Stock).filter(models.Stock.id == stock_id).first()

def get_stock_by_trade_code(db: Session, trade_code: str):
    """Get stock by trade code"""
    return db.query(models.Stock).filter(models.Stock.trade_code == trade_code).first()

def create_stock(db: Session, stock: schemas.StockCreate):
    """Create a new stock record"""
    db_stock = models.Stock(**stock.dict())
    db.add(db_stock)
    db.commit()
    db.refresh(db_stock)
    return db_stock

def update_stock(db: Session, stock_id: int, stock: schemas.StockCreate):
    """Update stock by ID"""
    db_stock = db.query(models.Stock).filter(models.Stock.id == stock_id).first()
    if db_stock:
        for key, value in stock.dict().items():
            setattr(db_stock, key, value)
        db.commit()
        db.refresh(db_stock)
    return db_stock

def delete_stock(db: Session, stock_id: int):
    """Delete stock by ID"""
    db_stock = db.query(models.Stock).filter(models.Stock.id == stock_id).first()
    if db_stock:
        db.delete(db_stock)
        db.commit()
    return db_stock
