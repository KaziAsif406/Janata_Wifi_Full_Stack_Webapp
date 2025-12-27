import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# Support both SQLite (local) and PostgreSQL (production)
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "sqlite:///./stock_market.db"
)

# Configure engine based on database type
if "postgresql" in DATABASE_URL:
    # PostgreSQL connection
    engine = create_engine(
        DATABASE_URL,
        echo=False,
        pool_pre_ping=True,  # Test connections before using
    )
else:
    # SQLite connection (local development)
    engine = create_engine(
        DATABASE_URL,
        connect_args={"check_same_thread": False},
        echo=False,
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    """Dependency to get database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
