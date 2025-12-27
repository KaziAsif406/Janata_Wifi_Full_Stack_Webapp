import csv
import os
from sqlalchemy.orm import Session
from app import models
from app.database import SessionLocal

CSV_FILE_PATH = os.path.join(os.path.dirname(__file__), "../stock_market_data.csv")

def load_stock_data():
    """Load stock market data from CSV into database if table is empty"""
    db = SessionLocal()
    try:
        # Check if stocks table already has data
        stock_count = db.query(models.Stock).count()
        
        if stock_count > 0:
            print(f"✓ Database already populated with {stock_count} stocks. Skipping CSV load.")
            return
        
        # Check if CSV file exists
        if not os.path.exists(CSV_FILE_PATH):
            print(f"⚠ CSV file not found at {CSV_FILE_PATH}. Skipping data load.")
            print("   You can manually load data later by uploading the CSV file.")
            return
        
        # Read and insert CSV data
        with open(CSV_FILE_PATH, 'r') as f:
            reader = csv.DictReader(f)
            stocks = []
            
            for row in reader:
                try:
                    # Clean volume by removing commas
                    volume = int(row['volume'].replace(',', ''))
                    
                    stock = models.Stock(
                        trade_code=row['trade_code'],
                        date=row['date'],
                        open=float(row['open']),
                        high=float(row['high']),
                        low=float(row['low']),
                        close=float(row['close']),
                        volume=volume
                    )
                    stocks.append(stock)
                except KeyError as e:
                    print(f"⚠ Missing column in CSV: {e}. Skipping data load.")
                    db.rollback()
                    return
            
            # Batch insert
            db.add_all(stocks)
            db.commit()
            print(f"✓ Successfully loaded {len(stocks)} stock records from CSV")
    
    except FileNotFoundError:
        print(f"⚠ CSV file not found. Skipping data load.")
    except Exception as e:
        print(f"✗ Error loading CSV data: {e}")
        db.rollback()
    
    finally:
        db.close()
