from sqlalchemy.orm import Session
from sqlalchemy import func, distinct
from app import models, schemas

def get_stocks(db: Session, skip: int = 0, limit: int = 500, search: str = None):
    """Get all stocks with pagination, total count, and optional search filter"""
    query = db.query(models.Stock)
    
    # Apply search filter if provided
    if search and search.strip():
        search_term = f"%{search.strip()}%"
        query = query.filter(models.Stock.trade_code.ilike(search_term))
    
    # Get total count after filtering
    total = query.count()
    
    # Apply pagination
    stocks = query.offset(skip).limit(limit).all()
    
    return {"data": stocks, "total": total, "skip": skip, "limit": limit}

def get_stocks_simple(db: Session, skip: int = 0, limit: int = 500):
    """Get all stocks with pagination (simple list)"""
    return db.query(models.Stock).offset(skip).limit(limit).all()

def get_unique_trade_codes(db: Session):
    """Get unique trade codes sorted alphabetically"""
    return db.query(distinct(models.Stock.trade_code)).order_by(models.Stock.trade_code.asc()).all()


def get_stock_by_id(db: Session, stock_id: int):
    """Get stock by ID"""
    return db.query(models.Stock).filter(models.Stock.id == stock_id).first()

def get_stock_by_trade_code(db: Session, trade_code: str):
    """Get stock by trade code"""
    return db.query(models.Stock).filter(models.Stock.trade_code == trade_code).first()

def get_stock_chart_data(db: Session, trade_code: str):
    """Get chart data for a trade code, sorted by date ascending"""
    return db.query(models.Stock).filter(
        models.Stock.trade_code == trade_code
    ).order_by(models.Stock.date.asc()).all()

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
