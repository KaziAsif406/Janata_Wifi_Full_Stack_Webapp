from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from app import models, schemas, crud
from app.database import engine, get_db
from app.seed import load_stock_data

# Create all tables on startup
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Stock Market API", version="1.0.0")

@app.on_event("startup")
def startup_event():
    """Load initial data on application startup"""
    load_stock_data()

@app.get("/api/stocks", response_model=list[schemas.Stock])
def get_stocks(db: Session = Depends(get_db)):
    """Get all stocks"""
    return crud.get_stocks(db)

@app.get("/api/stocks/{trade_code}", response_model=schemas.Stock)
def get_stock(trade_code: str, db: Session = Depends(get_db)):
    """Get stock by trade code"""
    db_stock = crud.get_stock(db, trade_code)
    if not db_stock:
        raise HTTPException(status_code=404, detail="Stock not found")
    return db_stock

@app.post("/api/stocks", response_model=schemas.Stock, status_code=201)
def create_stock(stock: schemas.StockCreate, db: Session = Depends(get_db)):
    """Create a new stock record"""
    return crud.create_stock(db, stock)

@app.put("/api/stocks/{trade_code}", response_model=schemas.Stock)
def update_stock(trade_code: str, stock: schemas.StockCreate, db: Session = Depends(get_db)):
    """Update a stock record"""
    db_stock = crud.update_stock(db, trade_code, stock)
    if not db_stock:
        raise HTTPException(status_code=404, detail="Stock not found")
    return db_stock

@app.delete("/api/stocks/{trade_code}")
def delete_stock(trade_code: str, db: Session = Depends(get_db)):
    """Delete a stock record"""
    db_stock = crud.delete_stock(db, trade_code)
    if not db_stock:
        raise HTTPException(status_code=404, detail="Stock not found")
    return {"detail": "Stock deleted"}

@app.get("/api/health")
def health_check():
    """Health check endpoint"""
    return {"status": "ok"}
