import os
from typing import Optional
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from app import models, schemas, crud
from app.database import engine, get_db
from app.seed import load_stock_data

app = FastAPI(title="Stock Market API", version="1.0.0")

# Configure CORS from environment variable
# Default to localhost for development, can be overridden with CORS_ORIGINS env var
cors_origins = os.getenv("CORS_ORIGINS", "*").split(",")
cors_origins = [origin.strip() for origin in cors_origins]

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_event():
    """Create database tables and load initial data on startup"""
    try:
        # Create all tables if they don't exist
        models.Base.metadata.create_all(bind=engine)
        print("✓ Database tables created/verified")
    except Exception as e:
        print(f"⚠ Warning: Could not create tables at startup: {e}")
        print("  Tables will be created on first successful database connection")
    
    # Load stock data
    load_stock_data()

@app.get("/api/stocks", response_model=schemas.StocksPaginatedResponse)
def get_all_stocks(skip: int = 0, limit: int = 500, search: Optional[str] = None, db: Session = Depends(get_db)):
    """Get all stocks with pagination, optional search filter (default: skip=0, limit=500)"""
    return crud.get_stocks(db, skip=skip, limit=limit, search=search)

@app.get("/api/trade-codes", response_model=list[str])
def get_trade_codes(db: Session = Depends(get_db)):
    """Get list of unique trade codes sorted alphabetically"""
    trade_codes = crud.get_unique_trade_codes(db)
    return [code[0] for code in trade_codes]

@app.get("/api/stocks/{stock_id}", response_model=schemas.Stock)
def get_stock(stock_id: int, db: Session = Depends(get_db)):
    """Get stock by ID"""
    db_stock = crud.get_stock_by_id(db, stock_id)
    if not db_stock:
        raise HTTPException(status_code=404, detail="Stock not found")
    return db_stock

@app.get("/api/stocks/search/{trade_code}", response_model=schemas.Stock)
def search_stock_by_code(trade_code: str, db: Session = Depends(get_db)):
    """Search stock by trade code"""
    db_stock = crud.get_stock_by_trade_code(db, trade_code)
    if not db_stock:
        raise HTTPException(status_code=404, detail="Stock with trade code not found")
    return db_stock

@app.get("/api/stocks/chart/{trade_code}", response_model=list[schemas.StockChartData])
def get_stock_chart_data(trade_code: str, db: Session = Depends(get_db)):
    """Get chart data for a stock (date, close, volume) sorted by date ascending"""
    stocks = crud.get_stock_chart_data(db, trade_code)
    if not stocks:
        raise HTTPException(status_code=404, detail="No data found for this trade code")
    return stocks

@app.post("/api/stocks", response_model=schemas.Stock, status_code=201)
def create_stock(stock: schemas.StockCreate, db: Session = Depends(get_db)):
    """Create a new stock record"""
    return crud.create_stock(db, stock)

@app.put("/api/stocks/{stock_id}", response_model=schemas.Stock)
def update_stock(stock_id: int, stock: schemas.StockCreate, db: Session = Depends(get_db)):
    """Update a stock record by ID"""
    db_stock = crud.update_stock(db, stock_id, stock)
    if not db_stock:
        raise HTTPException(status_code=404, detail="Stock not found")
    return db_stock

@app.delete("/api/stocks/{stock_id}")
def delete_stock(stock_id: int, db: Session = Depends(get_db)):
    """Delete a stock record by ID"""
    db_stock = crud.delete_stock(db, stock_id)
    if not db_stock:
        raise HTTPException(status_code=404, detail="Stock not found")
    return {"detail": "Stock deleted successfully"}

@app.get("/api/health")
def health_check():
    """Health check endpoint"""
    return {"status": "ok"}
