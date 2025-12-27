import React, { useState, useEffect } from 'react';
import StockTable from './components/StockTable';
import ChartView from './components/ChartView';
import PriceRangeChart from './components/PriceRangeChart';
import KPISummary from './components/KPISummary';
import stockAPI from './services/stockAPI';
import './styles/App.css';

export default function App() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tradeCodes, setTradeCodes] = useState([]);
  const [selectedTradeCode, setSelectedTradeCode] = useState(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const ITEMS_PER_PAGE = 500;

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

  // Fetch stocks from API with pagination and search filter
  useEffect(() => {
    const fetchStocks = async () => {
      try {
        setLoading(true);
        setError(null);
        const skip = (currentPage - 1) * ITEMS_PER_PAGE;
        // Pass search term to backend
        const response = await stockAPI.getAllStocks(skip, ITEMS_PER_PAGE, searchTerm || null);
        // Handle new paginated response format
        setData(response.data.data || response.data);
        // Use total from backend (already filtered by search)
        setTotalRecords(response.data.total || response.data.length);
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
  }, [currentPage, searchTerm]);

  // Update filtered data when raw data changes (client-side filtering no longer needed)
  useEffect(() => {
    setFilteredData(data);
  }, [data]);

  // Reset to page 1 when search term changes
  useEffect(() => {
    if (searchTerm && currentPage > 1) {
      setCurrentPage(1);
    }
  }, [searchTerm]);

  // Handle updated stock data
  const handleDataUpdate = (updatedStock) => {
    setData((prevData) =>
      prevData.map((stock) =>
        stock.id === updatedStock.id ? updatedStock : stock
      )
    );
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    // Scroll to top of page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Calculate total pages
  const totalPages = Math.ceil(totalRecords / ITEMS_PER_PAGE);

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    
    // Exclude page 1 if we're showing it separately (when currentPage > 1)
    const startMin = currentPage > 1 ? 2 : 1;
    let startPage = Math.max(startMin, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    
    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(startMin, endPage - maxPagesToShow + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  return (
    <div className="app">
      <div className="header-search-wrapper">
        <header className="header">
          <h1>Stock Market Data Viewer</h1>
          <p className="subtitle">Real-time stock market information</p>
        </header>

        <div className="search-container">
          <div className="dropdown-wrapper">
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
          />
        </div>
      </div>

      {error && (
        <div className="error-banner">
          <span>⚠️ {error}</span>
        </div>
      )}

      <main className="main-content">
        {loading && data.length === 0 && <div className="loading">Loading stock data...</div>}
        {(!loading || data.length > 0) && (
          <>
            <KPISummary data={data} selectedTradeCode={selectedTradeCode} />
            <ChartView selectedTradeCode={selectedTradeCode} />
            <PriceRangeChart selectedTradeCode={selectedTradeCode} />
            <StockTable data={filteredData} onDataUpdate={handleDataUpdate} loading={loading && data.length > 0} />
            
            {totalRecords > 0 && (
              <div className="pagination-container">
                {totalPages > 1 ? (
                  <>
                    <button
                      className="pagination-btn pagination-nav"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      ← Previous
                    </button>
                    
                    <div className="pagination-numbers">
                      {currentPage > 1 && (
                        <>
                          <button
                            className="pagination-btn"
                            onClick={() => handlePageChange(1)}
                          >
                            1
                          </button>
                          {currentPage > 3 && <span className="pagination-dots">...</span>}
                        </>
                      )}
                      
                      {getPageNumbers().map((pageNum) => (
                        <button
                          key={pageNum}
                          className={`pagination-btn ${pageNum === currentPage ? 'active' : ''}`}
                          onClick={() => handlePageChange(pageNum)}
                        >
                          {pageNum}
                        </button>
                      ))}
                      
                      {currentPage < totalPages && (
                        <>
                          {currentPage < totalPages - 2 && <span className="pagination-dots">...</span>}
                          {totalPages > 1 && (
                            <button
                              className="pagination-btn"
                              onClick={() => handlePageChange(totalPages)}
                            >
                              {totalPages}
                            </button>
                          )}
                        </>
                      )}
                    </div>
                    
                    <button
                      className="pagination-btn pagination-nav"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage >= totalPages}
                    >
                      Next →
                    </button>
                  </>
                ) : null}
                
                <span className="pagination-info">
                  Page {currentPage} of {totalPages} ({totalRecords} total records)
                </span>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
