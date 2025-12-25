from sqlalchemy.orm import Session
from app import models, schemas

def get_stocks(db: Session):
    return db.query(models.Stock).all()

def get_stock(db: Session, symbol: str):
    return db.query(models.Stock).filter(models.Stock.symbol == symbol).first()

def create_stock(db: Session, stock: schemas.StockCreate):
    db_stock = models.Stock(**stock.dict())
    db.add(db_stock)
    db.commit()
    db.refresh(db_stock)
    return db_stock

def update_stock(db: Session, symbol: str, stock: schemas.StockCreate):
    db_stock = db.query(models.Stock).filter(models.Stock.symbol == symbol).first()
    if db_stock:
        for key, value in stock.dict().items():
            setattr(db_stock, key, value)
        db.commit()
        db.refresh(db_stock)
    return db_stock

def delete_stock(db: Session, symbol: str):
    db_stock = db.query(models.Stock).filter(models.Stock.symbol == symbol).first()
    if db_stock:
        db.delete(db_stock)
        db.commit()
    return db_stock
