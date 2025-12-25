from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from app import models, schemas, crud
from app.database import engine, get_db

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Stock Market API")

@app.get("/api/stocks", response_model=list[schemas.Stock])
def get_stocks(db: Session = Depends(get_db)):
    return crud.get_stocks(db)

@app.get("/api/stocks/{symbol}", response_model=schemas.Stock)
def get_stock(symbol: str, db: Session = Depends(get_db)):
    db_stock = crud.get_stock(db, symbol)
    if not db_stock:
        raise HTTPException(status_code=404, detail="Stock not found")
    return db_stock

@app.post("/api/stocks", response_model=schemas.Stock)
def create_stock(stock: schemas.StockCreate, db: Session = Depends(get_db)):
    return crud.create_stock(db, stock)

@app.put("/api/stocks/{symbol}", response_model=schemas.Stock)
def update_stock(symbol: str, stock: schemas.StockCreate, db: Session = Depends(get_db)):
    db_stock = crud.update_stock(db, symbol, stock)
    if not db_stock:
        raise HTTPException(status_code=404, detail="Stock not found")
    return db_stock

@app.delete("/api/stocks/{symbol}")
def delete_stock(symbol: str, db: Session = Depends(get_db)):
    db_stock = crud.delete_stock(db, symbol)
    if not db_stock:
        raise HTTPException(status_code=404, detail="Stock not found")
    return {"detail": "Stock deleted"}

@app.get("/api/health")
def health_check():
    return {"status": "ok"}
