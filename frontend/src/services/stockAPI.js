import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const stockAPI = {
  /**
   * Get all stocks with optional pagination and search filter
   * @param {number} skip - Number of records to skip
   * @param {number} limit - Number of records to return
   * @param {string} search - Optional search term for trade code
   * @returns {Promise} Paginated stocks response with total count
   */
  getAllStocks: (skip = 0, limit = 500, search = null) =>
    apiClient.get('/stocks', { params: { skip, limit, search } }),

  /**
   * Get a single stock by ID
   * @param {number} id - Stock ID
   * @returns {Promise} Stock object
   */
  getStockById: (id) =>
    apiClient.get(`/stocks/${id}`),

  /**
   * Search stock by trade code
   * @param {string} tradeCode - Trade code to search
   * @returns {Promise} Stock object
   */
  searchByTradeCode: (tradeCode) =>
    apiClient.get(`/stocks/search/${tradeCode}`),

  /**
   * Create a new stock
   * @param {object} stockData - Stock data object
   * @returns {Promise} Created stock object
   */
  createStock: (stockData) =>
    apiClient.post('/stocks', stockData),

  /**
   * Update a stock by ID
   * @param {number} id - Stock ID
   * @param {object} stockData - Updated stock data
   * @returns {Promise} Updated stock object
   */
  updateStock: (id, stockData) =>
    apiClient.put(`/stocks/${id}`, stockData),

  /**
   * Delete a stock by ID
   * @param {number} id - Stock ID
   * @returns {Promise} Success message
   */
  deleteStock: (id) =>
    apiClient.delete(`/stocks/${id}`),

  /**
   * Get chart data for a stock (date, close, volume)
   * @param {string} tradeCode - Trade code to get chart data for
   * @returns {Promise} Array of chart data points sorted by date ascending
   */
  getChartData: (tradeCode) =>
    apiClient.get(`/stocks/chart/${tradeCode}`),

  /**
   * Get list of unique trade codes
   * @returns {Promise} Array of trade code strings sorted alphabetically
   */
  getTradeCodeList: () =>
    apiClient.get('/trade-codes'),
};

export default stockAPI;
