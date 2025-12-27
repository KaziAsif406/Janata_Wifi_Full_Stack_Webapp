import React, { useState, useEffect } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import stockAPI from '../services/stockAPI';
import { useChartDataCache } from '../hooks/useChartDataCache';
import '../styles/PriceRangeChart.css';

/**
 * PriceRangeChart Component
 * 
 * Displays daily price range (High-Low) visualization
 * - Area chart showing high and low prices per day
 * - Helps visualize daily volatility
 * 
 * Props:
 *   - selectedTradeCode: string (trade code to visualize)
 * 
 * Data comes from API endpoint: /api/stocks/chart/{trade_code}
 */
function PriceRangeChart({ selectedTradeCode, chartCache }) {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { getFromCache, saveToCache } = useChartDataCache(chartCache);

  useEffect(() => {
    if (!selectedTradeCode) {
      setChartData([]);
      return;
    }

    const fetchChartData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Check if data is already cached
        const cachedData = getFromCache(selectedTradeCode);
        if (cachedData) {
          // Use cached data - instant load, no API call
          setChartData(cachedData);
          setLoading(false);
          return;
        }

        // Fetch from API if not in cache
        const response = await stockAPI.getChartData(selectedTradeCode);
        // Data already sorted by date ascending from backend
        
        // Save to cache for future use
        saveToCache(selectedTradeCode, response.data);
        setChartData(response.data);
      } catch (err) {
        setError('Failed to load price range data');
        console.error('Error fetching chart data:', err);
        setChartData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, [selectedTradeCode, getFromCache, saveToCache]);

  if (!selectedTradeCode || chartData.length === 0) {
    return null;
  }

  return (
    <div className="price-range-chart-wrapper">
      <h3 className="chart-title">Daily Price Range (High–Low)</h3>
      {loading && <div className="chart-loading">Loading price range data...</div>}
      {error && <div className="chart-error">⚠️ {error}</div>}
      {!loading && chartData.length > 0 && (
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorHigh" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorLow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.7} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
            <XAxis
              dataKey="date"
              tick={{ fill: 'white', fontSize: 12 }}
              stroke="rgba(255, 255, 255, 0.3)"
              interval={Math.floor(chartData.length / 10) || 0}
            />
            <YAxis
              tick={{ fill: 'white', fontSize: 12 }}
              stroke="rgba(255, 255, 255, 0.3)"
              label={{ value: 'Price', angle: -90, position: 'insideLeft', fill: 'white' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                color: 'white',
              }}
              formatter={(value) => `${parseFloat(value).toFixed(2)}`}
              labelFormatter={(label) => `Date: ${label}`}
            />
            <Legend
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="line"
            />
            {/* High Price Area */}
            <Area
              type="monotone"
              dataKey="high"
              stroke="#8b5cf6"
              strokeWidth={2}
              fill="url(#colorHigh)"
              name="High Price"
              isAnimationActive={true}
            />
            {/* Low Price Area */}
            <Area
              type="monotone"
              dataKey="low"
              stroke="#06b6d4"
              strokeWidth={2}
              fill="url(#colorLow)"
              name="Low Price"
              isAnimationActive={true}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

// Memoize to prevent re-renders when parent updates but selectedTradeCode prop doesn't change
export default React.memo(PriceRangeChart);
