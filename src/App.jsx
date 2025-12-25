import React, { useState } from 'react';
import StockTable from './components/StockTable';
import data from '../stock_market_data.json';
import './styles/App.css';

export default function App() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = data.filter((item) =>
    item.trade_code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="app">
      <header className="header">
        <h1>Stock Market Data Viewer</h1>
        <p className="subtitle">Real-time stock market information</p>
      </header>

      <div className="search-container">
        <input
          type="text"
          placeholder="Search by trade code..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <main className="main-content">
        <StockTable data={filteredData} />
      </main>
    </div>
  );
}
