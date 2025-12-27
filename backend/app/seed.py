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
        with open(CSV_FILE_PATH, 'r', encoding='utf-8-sig') as f:
            reader = csv.DictReader(f)
            stocks = []
            
            for row in reader:
                try:
                    # Clean volume by removing commas
                    volume = int(row['volume'].replace(',', ''))
                    
                    # Helper function to clean float values with commas
                    def clean_float(val):
                        return float(str(val).replace(',', ''))
                    
                    stock = models.Stock(
                        trade_code=row.get('trade_code') or row.get('Trade Code'),
                        date=row.get('date') or row.get('Date'),
                        open=clean_float(row.get('open') or row.get('Open')),
                        high=clean_float(row.get('high') or row.get('High')),
                        low=clean_float(row.get('low') or row.get('Low')),
                        close=clean_float(row.get('close') or row.get('Close')),
                        volume=volume
                    )
                    stocks.append(stock)
                except (KeyError, ValueError, TypeError) as e:
                    print(f"⚠ Error processing CSV row: {e}. Skipping data load.")
                    print(f"   CSV columns found: {list(row.keys())}")
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
