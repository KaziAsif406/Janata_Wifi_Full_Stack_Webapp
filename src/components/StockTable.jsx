import React, { useState } from 'react';
import '../styles/StockTable.css';

export default function StockTable({ data }) {
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });

  const sortedData = [...data].sort((a, b) => {
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    // Handle numeric comparisons
    if (!isNaN(aValue) && !isNaN(bValue)) {
      return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
    }

    // Handle string comparisons
    if (sortConfig.direction === 'asc') {
      return String(aValue).localeCompare(String(bValue));
    }
    return String(bValue).localeCompare(String(aValue));
  });

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const renderHeader = (label, key) => (
    <th key={key} onClick={() => handleSort(key)} className="sortable">
      {label}
      <span className="sort-indicator">
        {sortConfig.key === key ? (sortConfig.direction === 'asc' ? ' ↑' : ' ↓') : ''}
      </span>
    </th>
  );

  if (data.length === 0) {
    return <div className="no-data">No data found</div>;
  }

  return (
    <div className="table-wrapper">
      <table className="stock-table">
        <thead>
          <tr>
            {renderHeader('Date', 'date')}
            {renderHeader('Trade Code', 'trade_code')}
            {renderHeader('Open', 'open')}
            {renderHeader('High', 'high')}
            {renderHeader('Low', 'low')}
            {renderHeader('Close', 'close')}
            {renderHeader('Volume', 'volume')}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((item, index) => (
            <tr key={index}>
              <td>{item.date}</td>
              <td className="trade-code">{item.trade_code}</td>
              <td>{parseFloat(item.open).toFixed(2)}</td>
              <td>{parseFloat(item.high).toFixed(2)}</td>
              <td>{parseFloat(item.low).toFixed(2)}</td>
              <td className="close-price">{parseFloat(item.close).toFixed(2)}</td>
              <td className="volume">{item.volume}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
