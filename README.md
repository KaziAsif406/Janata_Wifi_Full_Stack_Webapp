# Stock Market Data Visualization Platform
## 🎯 Project Overview

This application provides a comprehensive platform for exploring and analyzing stock market data with:
- **Real-time data table** with 15,933+ stock records
- **Advanced filtering & search** with server-side optimization
- **Interactive visualizations** including multi-axis charts, price ranges, and KPI metrics
- **Full CRUD operations** with persistent database storage
- **Responsive design** optimized for desktop and mobile devices
- **Performance optimization** with caching strategies and memoization

**Live Demo**
- Without Docker: https://stock-market-viewer.onrender.com
- With Docker: https://stock-market-frontend-with-docker.onrender.com

> **⚠️ Note on Render Free Tier**: These instances automatically spin down after 15 minutes of inactivity. If you experience a loading delay or connection timeout, please refresh the website after 60-90 seconds. This allows the service to wake up from sleep mode.

---

## Git Branches

The repository includes two distinct implementation versions:

### `jsonModel` Branch
**Frontend-only implementation with a given JSON data**
- React + Vite + JavaScript
- Static data from `stock_market_data.json`
- No backend required
- Basic table and filtering functionality

### `sqlModel` Branch (Current - Main Development)
**Complete full-stack implementation with backend & database**
- React + Vite + JavaScript (Frontend)
- FastAPI + SQLAlchemy (Backend)
- SQLite database(Local - Docker Compose) (15,933 stock records)
- PostgreSQL database(Production - Render) (15,933 stock records)
- Full CRUD API with pagination & search
- Advanced data visualizations
- Performance optimization techniques

---

## Technology Stack

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
- **Local Development**: SQLite (`stock_market.db`) with auto-initialization
- **Production**: PostgreSQL (Render managed database)
- **Records**: 15,933 stock market entries
- **Schema**: Stock model with trade_code, date, close, volume, high, low
- **Indexing**: Optimized for search and pagination queries

### Docker & Deployment
- **Containerization**: Multi-stage Docker builds for both frontend and backend
- **Orchestration**: Docker Compose for local development
- **Frontend Image**: Node 18-Alpine (builder) → Nginx-Alpine (production)
- **Backend Image**: Python 3.11-Slim (multi-stage build)
- **Deployment**: Render (Docker-based deployment platform)

---

## Key Features Implemented

### 1. **Data Management**
-   Display 15,933+ stock records in interactive table
-   Inline row editing with real-time updates
-   Persistent changes to SQLite database
-   Full CRUD operations by REST API
-   Clean data validation with Pydantic schemas

### 2. **Search & Filtering**
-   Real-time search by trade code
-   Server-side filtering
-   Non-blocking search (no page freeze)
-   Reset functionality
-   Instant visual feedback

### 3. **Pagination**
-   Server-side pagination (500 records per page)
-   Smart page number display (max 5 visible buttons)
-   Dynamic pagination range
-   Total records count
-   Responsive navigation controls

### 4. **Data Visualizations**
-   **ComposedChart**: Dual-axis chart showing closing prices (line) and trading volume (bar)
-   **AreaChart**: Daily high-low price range visualization with gradient fills
-   **KPI Summary Cards**: 
    - Highest close price
    - Lowest close price
    - Average daily trading volume
-   Interactive tooltips and legends
-   Responsive chart sizing

### 5. **Performance Optimization**
-   **Chart Data Caching**: Faster chart switching with in-memory Map-based cache
-   **Component Memoization**: React.memo prevents unnecessary re-renders
-   **Callback Optimization**: useCallback for stable function references
-   **Computation Memoization**: useMemo for expensive KPI calculations
-   **Efficient API Design**: Minimal data transfer, pagination-based loading

### 6. **User Experience**
-   Responsive design (mobile, tablet, desktop)
-   Smooth animations and transitions
-   Loading states and error handling
-   Intuitive UI with clear visual hierarchy
-   Accessible color scheme and typography
-   Compact header layout (text left, controls right)

### 7. **Trade Code Selector**
-   Dropdown menu with all unique trade codes
-   Alphabetically sorted list
-   Quick chart and KPI filtering
-   Visual feedback for selected item

---

## API Endpoints

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

## Getting Started

### Prerequisites
- **Option 1 (Docker)**: Docker Desktop (includes Docker Compose)
- **Option 2 (Manual)**: Node.js 16+, Python 3.8+, npm, pip, Git

### Quick Start with Docker (Recommended)

```bash
# Clone the repository
git clone https://github.com/KaziAsif406/Janata_Wifi_Full_Stack_Webapp.git
cd Janata_Wifi_Full_Stack_Webapp

# Start all services (backend, frontend, database)
docker-compose up --build

# Access the application
# Frontend: http://localhost:8080
# Backend API: http://localhost:8000
# API Docs: http://localhost:8000/docs
# Database: PostgreSQL on localhost:5432
```

### Manual Setup (Without Docker)

#### Frontend Setup

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

#### Backend Setup

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

### Docker Compose Services

The `docker-compose.yml` provides:

```yaml
Services:
  - backend: FastAPI on port 8000
  - frontend: Nginx serving React on port 8080
  - db: PostgreSQL on port 5432

Volumes:
  - postgres_data: Persistent database storage

Networks:
  - app-network: Internal Docker network for service communication
```

**Stop services**:
```bash
docker-compose down
```

**View logs**:
```bash
docker-compose logs -f [service_name]
# Examples:
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db
```

---

## Project Structure

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
│   ├── package-lock.json
│   ├── Dockerfile                         # Multi-stage build (Node → Nginx)
│   ├── nginx.template.conf                # Nginx config with dynamic PORT
│   ├── .dockerignore
│   └── .env.production
│
├── backend/
│   ├── app/
│   │   ├── models.py                      # SQLAlchemy Stock model
│   │   ├── schemas.py                     # Pydantic request/response schemas
│   │   ├── crud.py                        # CRUD operations
│   │   ├── database.py                    # Database connection & session
│   │   ├── seed.py                        # Data seeding from CSV
│   │   ├── __init__.py
│   │   ├── __pycache__/
│   │   └── main.py                        # FastAPI application
│   ├── stock_market_data.csv              # 15,933 stock records
│   ├── requirements.txt                   # Python dependencies
│   ├── Dockerfile                         # Multi-stage build (Python slim)
│   ├── .dockerignore
│   └── venv/                              # Virtual environment
│
├── docker-compose.yml                     # Orchestrate backend, frontend, db
├── .git/                                  # Git repository
├── .gitignore
├── README.md                              # This file
```

---

## Docker Configuration Files

### `Dockerfile` (Frontend)
- **Build Stage**: Node 18-Alpine compiles React + Vite
- **Runtime Stage**: Nginx Alpine serves static files
- **Features**:
  - Multi-stage build to minimize image size
  - Environment variable substitution for dynamic PORT
  - Health check endpoint at `/health`
  - Gzip compression and cache optimization

### `Dockerfile` (Backend)
- **Build Stage**: Python 3.11-Slim installs dependencies
- **Runtime Stage**: Python 3.11-Slim runs FastAPI with Uvicorn
- **Features**:
  - Multi-stage build to reduce image size
  - Supports dynamic PORT from environment
  - Health check using Python's urllib
  - Optimized package installation

### `docker-compose.yml`
- **Services**:
  - `backend`: FastAPI on port 8000 (internal), connects to `db`
  - `frontend`: Nginx on port 8080 (internal), connects to `backend`
  - `db`: PostgreSQL 15-Alpine on port 5432
- **Networks**: Internal `app-network` for service communication
- **Volumes**: `postgres_data` for persistent database
- **Health Checks**: All services monitored for readiness
- **Environment Variables**: Configured for local development

### `nginx.template.conf` (Frontend)
- **Dynamic Port**: Supports `${PORT}` environment variable
- **SPA Routing**: Falls back to `/index.html` for React Router
- **Compression**: Gzip enabled for text assets
- **Caching**: 1-year cache for versioned assets
- **Headers**: Proper Cache-Control headers for production

---

### Live Deployments(Without Docker)
- **Frontend**: https://stock-market-viewer.onrender.com
- **Backend API**: https://stock-market-api-1llr.onrender.com

### Live Deployments(With Docker)
- **Frontend**: https://stock-market-frontend-with-docker.onrender.com
- **Backend API**: https://stock-market-api-with-docker.onrender.com

---


## Learning Outcomes

- Acquired practical experience in designing and implementing a full-stack web application using a   FastAPI backend and a containerized frontend served through Nginx.

- Developed a clear understanding of Docker and Docker Compose, including multi-stage builds, service orchestration, container networking, and dependency management.

- Learned to configure and debug container health checks, and understood their role in service availability and startup sequencing within Docker Compose.

- Gained experience in frontend–backend integration inside a containerized environment, including reverse proxy configuration and API request routing.

- Understood the differences between local development environments and cloud deployment platforms, particularly when deploying Dockerized services to Render.

- Learned to manage environment variables, dynamic ports, and platform-specific constraints required for successful cloud deployment.

- Gained insight into database persistence challenges in cloud environments and evaluated the limitations of SQLite versus PostgreSQL in production scenarios.

- Developed skills in deployment verification, including reading build logs, monitoring application health, and validating service readiness.

- Improved version control practices by understanding the implications of deploying specific Git commits versus automatic deployment from the latest branch.

- Gained experience with Nginx configuration for serving Single Page Applications (SPAs), including proper routing fallbacks and static file caching strategies.

- Understood container networking and service discovery, learning how services communicate internally using service names while requiring different URLs for external/production access.

- Learned how to optimize Docker images using multi-stage builds, significantly reducing final image sizes by discarding build dependencies in the runtime stage.

- Developed understanding of CORS configuration complexity when services run on different domains and how to properly configure it for both local and production environments.

---

## Challenges Faced

- Encountered issues with Docker health checks, where services appeared functional but were marked as unhealthy due to incorrect endpoint configuration or HTTP response expectations.

- Faced difficulties in service dependency management, particularly when frontend services depended on backend health status, causing startup delays or warnings.

- Experienced challenges related to database behavior in cloud environments, especially the non-persistent nature of SQLite on Render and the need to consider alternative database solutions.

- Required careful debugging of deployment logs to distinguish between non-critical warnings and actual runtime errors during the build and deployment process.

- Encountered issues related to HTTP status codes (e.g., 405 Method Not Allowed) due to mismatched route definitions.

- Faced complexity in coordinating multiple services (frontend, backend, and database) within a single Docker Compose setup.

- Addressed challenges related to maintaining deployment stability by understanding how Render handles commit-based deployments and automatic updates.

- Encountered the problem of determining whether API URLs should be relative (`/api`) or absolute (`https://backend-url/api`), and how this changes between local Docker Compose (internal networking) and Render (separate services on different domains).

- Discovered that API proxy configurations with hardcoded service names (e.g., `http://backend:8000`) fail on production platforms where those internal DNS names don't exist, requiring removal of unnecessary proxies.

- Dealt with complex frontend build configuration, learning that environment variables set at runtime don't affect Vite-built static assets, necessitating build-time variable injection.

- Encountered CORS configuration challenges when frontend and backend services are deployed as separate services on different domains, requiring careful origin whitelisting.

- Navigated the complexity of deploying separate frontend and backend services on Render, understanding that each service requires its own Web Service configuration and cannot easily share internal networking like Docker Compose does.

---

## Contact & Author

**Name**: Kazi Asif Raihan
**Email**: kaziasif2k03@gmail.com  
**Phone**: +880 1609948068
**GitHub Repository**: https://github.com/KaziAsif406/Janata_Wifi_Full_Stack_Webapp
