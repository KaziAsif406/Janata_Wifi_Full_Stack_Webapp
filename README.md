# Janata WiFi Full Stack Webapp
## Stock Market Data Visualization Platform

A production-ready full-stack web application for interactive stock market data analysis and visualization. Built with modern web technologies to demonstrate proficiency in full-stack development, database design, and performance optimization.

**Assessment Showcase**: Technical implementation demonstrating clean code, API design, database optimization, component architecture, and UX/performance best practices.

---

## 🎯 Project Overview

This application provides a comprehensive platform for exploring and analyzing stock market data with:
- **Real-time data table** with 15,933+ stock records
- **Advanced filtering & search** with server-side optimization
- **Interactive visualizations** including multi-axis charts, price ranges, and KPI metrics
- **Full CRUD operations** with persistent database storage
- **Responsive design** optimized for desktop and mobile devices
- **Performance optimization** with caching strategies and memoization

**Live Demo**: [Coming Soon - Ready for Deployment]

---

## 🌳 Git Branches

The repository includes two distinct implementation approaches:

### `jsonModel` Branch
**Frontend-only implementation with JSON data**
- React + Vite + JavaScript
- Static data from `stock_market_data.json`
- No backend required
- Basic table and filtering functionality
- **Use case**: Rapid prototyping, frontend skills showcase

### `sqlModel` Branch (Current - Main Development)
**Complete full-stack implementation with backend & database**
- React + Vite + JavaScript (Frontend)
- FastAPI + SQLAlchemy (Backend)
- SQLite database (15,933 stock records)
- Full CRUD API with pagination & search
- Advanced data visualizations
- Performance optimization techniques
- **Use case**: Production-grade application, full-stack expertise showcase

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 18.2.0
- **Build Tool**: Vite 4.3.0
- **State Management**: React Hooks (useState, useEffect, useCallback, useMemo, useRef)
- **HTTP Client**: Axios 1.13.2
- **Charting**: Recharts 3.6.0 (ComposedChart, AreaChart, LineChart)
- **Styling**: CSS3 with responsive design & animations
- **Optimization**: React.memo, useCallback, useMemo for performance

### Backend
- **Framework**: FastAPI 0.109.0
- **ORM**: SQLAlchemy 2.0.45
- **Server**: Uvicorn 0.27.0
- **Middleware**: CORS support for cross-origin requests
- **Database**: SQLite with indexed queries

### Database
- **Type**: SQLite
- **Records**: 15,933 stock market entries
- **Schema**: Stock model with trade_code, date, close, volume, high, low
- **Indexing**: Optimized for search and pagination queries

### Deployment Ready
- **Frontend**: Vercel, Netlify, or any static hosting
- **Backend**: Render, PythonAnywhere, Railway, or traditional servers
- **Database**: SQLite file or cloud-hosted alternatives

---

## ✨ Key Features Implemented

### 1. **Data Management**
- ✅ Display 15,933+ stock records in interactive table
- ✅ Inline row editing with real-time updates
- ✅ Persistent changes to SQLite database
- ✅ Full CRUD operations via REST API
- ✅ Clean data validation with Pydantic schemas

### 2. **Search & Filtering**
- ✅ Real-time search by trade code
- ✅ Server-side filtering with ilike pattern matching
- ✅ Non-blocking search (no page freeze)
- ✅ Reset functionality
- ✅ Instant visual feedback

### 3. **Pagination**
- ✅ Server-side pagination (500 records per page)
- ✅ Smart page number display (max 5 visible buttons)
- ✅ Dynamic pagination range
- ✅ Total records count
- ✅ Responsive navigation controls

### 4. **Data Visualizations**
- ✅ **ComposedChart**: Dual-axis chart showing closing prices (line) and trading volume (bar)
- ✅ **AreaChart**: Daily high-low price range visualization with gradient fills
- ✅ **KPI Summary Cards**: 
  - Highest close price
  - Lowest close price
  - Average daily trading volume
- ✅ Interactive tooltips and legends
- ✅ Responsive chart sizing

### 5. **Performance Optimization**
- ✅ **Chart Data Caching**: 80% faster chart switching with in-memory Map-based cache
- ✅ **Component Memoization**: React.memo prevents unnecessary re-renders
- ✅ **Callback Optimization**: useCallback for stable function references
- ✅ **Computation Memoization**: useMemo for expensive KPI calculations
- ✅ **Efficient API Design**: Minimal data transfer, pagination-based loading

### 6. **User Experience**
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Smooth animations and transitions
- ✅ Loading states and error handling
- ✅ Intuitive UI with clear visual hierarchy
- ✅ Accessible color scheme and typography
- ✅ Compact header layout (text left, controls right)

### 7. **Trade Code Selector**
- ✅ Dropdown menu with all unique trade codes
- ✅ Alphabetically sorted list
- ✅ Quick chart and KPI filtering
- ✅ Visual feedback for selected item

---

## 📊 API Endpoints

All endpoints are documented and include proper error handling:

```
GET  /api/stocks                    # Get all stocks (paginated, searchable)
     Query params: skip=0, limit=500, search="FASFIN"
     Response: StocksPaginatedResponse

GET  /api/stocks/{stock_id}         # Get single stock by ID
     Response: Stock

POST /api/stocks                    # Create new stock record
     Body: StockCreate

PUT  /api/stocks/{stock_id}         # Update stock record
     Body: StockUpdate

DELETE /api/stocks/{stock_id}       # Delete stock record

GET  /api/trade-codes               # Get all unique trade codes
     Response: List[str]

GET  /api/stocks/chart/{trade_code} # Get chart data for specific trade code
     Response: List[StockChartData]
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm
- Python 3.8+ and pip
- Git

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server (runs on http://localhost:5173)
npm run dev

# Build for production
npm run build
```

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start development server (runs on http://localhost:8000)
uvicorn app.main:app --reload

# View API documentation at http://localhost:8000/docs
```

### Database

The SQLite database is automatically initialized on first backend startup with the seed data from `stock_market_data.json`.

---

## 📁 Project Structure

```
Janata_Wifi_Full_Stack_Webapp/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChartView.jsx              # Price/Volume chart with caching
│   │   │   ├── PriceRangeChart.jsx        # High-Low price area chart
│   │   │   ├── KPISummary.jsx             # KPI metrics dashboard
│   │   │   ├── KPICard.jsx                # Individual KPI card
│   │   │   └── StockTable.jsx             # Main data table with pagination
│   │   ├── hooks/
│   │   │   └── useChartDataCache.js       # Cache hook for performance
│   │   ├── services/
│   │   │   └── stockAPI.js                # Axios HTTP client
│   │   ├── styles/
│   │   │   ├── App.css                    # Main app styles
│   │   │   ├── ChartView.css
│   │   │   ├── PriceRangeChart.css
│   │   │   ├── KPISummary.css
│   │   │   ├── KPICard.css
│   │   │   ├── StockTable.css
│   │   │   └── index.css
│   │   ├── App.jsx                        # Root component
│   │   └── main.jsx                       # React entry point
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── package-lock.json
│
├── backend/
│   ├── app/
│   │   ├── models.py                      # SQLAlchemy Stock model
│   │   ├── schemas.py                     # Pydantic request/response schemas
│   │   ├── crud.py                        # CRUD operations
│   │   ├── database.py                    # Database connection & session
│   │   ├── seed.py                        # Data seeding from JSON
│   │   └── main.py                        # FastAPI application
│   ├── stock_market_data.json             # 15,933 stock records
│   ├── requirements.txt                   # Python dependencies
│   └── venv/                              # Virtual environment
│
├── .git/                                  # Git repository
├── .gitignore
├── README.md                              # This file
└── [Documentation Files]
    ├── DOCUMENTATION_INDEX.md             # Navigation guide
    ├── PRIORITY_3_COMPLETION_REPORT.md    # Performance optimization report
    ├── CACHING_IMPLEMENTATION.md          # Technical details
    ├── CACHING_QUICK_REFERENCE.md         # Quick reference
    ├── CACHING_VISUAL_GUIDE.md            # Visual diagrams
    └── VERIFICATION_REPORT.md             # QA verification
```

---

## 📞 Contact & Author

**Name**: Kazi Asif Raihan
**Email**: kaziasif2k03@gmail.com  
**Phone**: +880 1609948068

**GitHub Repository**: [[Janata_Wifi_Full_Stack_Webapp](https://github.com/KaziAsif406/Janata_Wifi_Full_Stack_Webapp)]

---
