import React, { useState, useEffect } from 'react';
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import stockAPI from '../services/stockAPI';
import '../styles/ChartView.css';

/**
 * ChartView Component
 * 
 * Displays multi-axis chart visualization for stock data
 * - Line chart for closing price
 * - Bar chart for trading volume
 * 
 * Props:
 *   - selectedTradeCode: string (trade code to visualize)
 * 
 * Data will come from API endpoint: /api/stocks/chart/{trade_code}
 * 
 * Memoized to prevent re-renders when parent updates but selectedTradeCode doesn't change
 */
function ChartView({ selectedTradeCode }) {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch chart data when trade code changes
   */
  useEffect(() => {
    if (!selectedTradeCode) {
      setChartData([]);
      return;
    }

    const fetchChartData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch chart data from backend
        // Endpoint: GET /api/stocks/chart/{trade_code}
        // Returns: [{ date, close, volume }, ...] sorted by date ascending
        const response = await fetch(
          `http://localhost:8000/api/stocks/chart/${selectedTradeCode}`
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || 'Failed to fetch chart data');
        }

        const data = await response.json();
        setChartData(data);
      } catch (err) {
        const errorMessage = err.message || 'Failed to fetch chart data';
        setError(errorMessage);
        console.error('Error fetching chart data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, [selectedTradeCode]);

  /**
   * Render loading state
   */
  if (loading) {
    return (
      <div className="chart-view chart-loading">
        <p>Loading chart data...</p>
      </div>
    );
  }

  /**
   * Render error state
   */
  if (error) {
    return (
      <div className="chart-view chart-error">
        <p>⚠️ {error}</p>
      </div>
    );
  }

  /**
   * Render empty state
   */
  if (!selectedTradeCode || chartData.length === 0) {
    return (
      <div className="chart-view chart-empty">
        <p>Select a trade code to view chart data</p>
      </div>
    );
  }

  /**
   * Render chart
   * ComposedChart with:
   * - Line chart: close price (left Y-axis)
   * - Bar chart: volume (right Y-axis)
   * - X-axis: date (shared)
   * - Tooltip for hover info
   * - Legend for data labels
   */
  return (
    <div className="chart-view chart-container">
      <div className="chart-header">
        <h2>Price & Volume Analysis</h2>
        <p className="chart-subtitle">Trade Code: {selectedTradeCode}</p>
      </div>

      <div className="chart-content">
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart
            data={chartData}
            margin={{ top: 5, right: 60, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            
            {/* Shared X-Axis (Date) */}
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={80}
              label={{ value: 'Date', position: 'insideBottomRight', offset: -5 }}
            />
            
            {/* Left Y-Axis (Close Price) */}
            <YAxis
              yAxisId="left"
              tick={{ fontSize: 12 }}
              label={{ 
                value: 'Close Price ($)', 
                angle: -90, 
                position: 'insideLeft' 
              }}
            />
            
            {/* Right Y-Axis (Volume) */}
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fontSize: 12 }}
              label={{ 
                value: 'Trading Volume', 
                angle: 90, 
                position: 'insideRight' 
              }}
            />
            
            {/* Tooltip showing both datasets */}
            <Tooltip
              contentStyle={{
                backgroundColor: '#f9f9f9',
                border: '1px solid #ccc',
                borderRadius: '4px',
                padding: '8px',
              }}
              formatter={(value, name) => {
                if (name === 'Close Price') {
                  return [value.toFixed(2), name];
                }
                // Format volume with commas
                return [value.toLocaleString(), name];
              }}
              labelFormatter={(label) => `Date: ${label}`}
            />
            
            {/* Legend */}
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }} 
              verticalAlign="top"
            />
            
            {/* Line Chart: Close Price (Left Axis) */}
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="close"
              stroke="#667eea"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6, fill: '#764ba2' }}
              name="Close Price"
              isAnimationActive={true}
            />
            
            {/* Bar Chart: Volume (Right Axis) */}
            <Bar
              yAxisId="right"
              dataKey="volume"
              fill="#f59e0b"
              opacity={0.7}
              name="Trading Volume"
              isAnimationActive={true}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// Memoize ChartView to prevent re-renders when parent updates but selectedTradeCode prop doesn't change
export default React.memo(ChartView);
