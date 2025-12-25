import React, { useState, useEffect } from 'react';
import StockTable from './components/StockTable';
import stockAPI from './services/stockAPI';
import './styles/App.css';

export default function App() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        {!loading && <StockTable data={filteredData} />}
      </main>
    </div>
  );
}
