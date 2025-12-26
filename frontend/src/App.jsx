import React, { useState, useEffect } from 'react';
import StockTable from './components/StockTable';
import ChartView from './components/ChartView';
import stockAPI from './services/stockAPI';
import './styles/App.css';

export default function App() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tradeCodes, setTradeCodes] = useState([]);
  const [selectedTradeCode, setSelectedTradeCode] = useState(null);

  // Fetch trade codes on component mount
  useEffect(() => {
    const fetchTradeCodes = async () => {
      try {
        const response = await stockAPI.getTradeCodeList();
        const codes = response.data;
        setTradeCodes(codes);
        // Set default selection to first trade code
        if (codes.length > 0) {
          setSelectedTradeCode(codes[0]);
        }
      } catch (err) {
        console.error('Error fetching trade codes:', err);
      }
    };

    fetchTradeCodes();
  }, []);

  // Fetch stocks from API on component mount
  useEffect(() => {
    const fetchStocks = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await stockAPI.getAllStocks(0, 20000);
        setData(response.data);
      } catch (err) {
        const errorMessage = err.response?.data?.detail || 
                           err.message || 
                           'Failed to fetch stock data';
        setError(errorMessage);
        console.error('Error fetching stocks:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStocks();
  }, []);

  // Filter data based on search term
  useEffect(() => {
    const filtered = data.filter((item) =>
      item.trade_code.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(filtered);
  }, [data, searchTerm]);

  // Handle updated stock data
  const handleDataUpdate = (updatedStock) => {
    setData((prevData) =>
      prevData.map((stock) =>
        stock.id === updatedStock.id ? updatedStock : stock
      )
    );
  };

  return (
    <div className="app">
      <header className="header">
        <h1>Stock Market Data Viewer</h1>
        <p className="subtitle">Real-time stock market information</p>
      </header>

      {error && (
        <div className="error-banner">
          <span>⚠️ {error}</span>
        </div>
      )}

      <div className="search-container">
        <div className="dropdown-wrapper">
          <label htmlFor="trade-code-select" className="dropdown-label">
            Select Trade Code:
          </label>
          <select
            id="trade-code-select"
            value={selectedTradeCode || ''}
            onChange={(e) => setSelectedTradeCode(e.target.value)}
            className="trade-code-dropdown"
            disabled={loading || tradeCodes.length === 0}
          >
            {tradeCodes.map((code) => (
              <option key={code} value={code}>
                {code}
              </option>
            ))}
          </select>
        </div>

        <input
          type="text"
          placeholder="Search by trade code..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
          disabled={loading}
        />
      </div>

      <main className="main-content">
        {loading && <div className="loading">Loading stock data...</div>}
        {!loading && (
          <>
            <ChartView selectedTradeCode={selectedTradeCode} />
            <StockTable data={filteredData} onDataUpdate={handleDataUpdate} />
          </>
        )}
      </main>
    </div>
  );
}
