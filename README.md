# Stock Market Data Viewer

A clean, modern React web application for visualizing stock market data.

## Features

- **Data Table Visualization**: Display stock market data in an interactive table
- **Search Functionality**: Filter data by trade code in real-time
- **Sortable Columns**: Click on any column header to sort data (ascending/descending)
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Clean UI**: Modern gradient design with smooth animations

## Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:3000`

## Build

To build for production:
```bash
npm run build
```

## Project Structure

```
src/
├── components/
│   └── StockTable.jsx      # Main table component
├── styles/
│   ├── index.css          # Global styles
│   ├── App.css            # App component styles
│   └── StockTable.css     # Table component styles
├── App.jsx                 # Main app component
└── main.jsx               # React entry point
```

## Data

The application loads stock market data from `stock_market_data.json` containing:
- Date
- Trade Code
- Open, High, Low, Close prices
- Trading Volume

## Technologies

- React 18
- Vite
- CSS3
