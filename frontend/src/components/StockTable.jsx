import React, { useState } from 'react';
import stockAPI from '../services/stockAPI';
import '../styles/StockTable.css';

export default function StockTable({ data, onDataUpdate }) {
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  const sortedData = [...data].sort((a, b) => {
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (!isNaN(aValue) && !isNaN(bValue)) {
      return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
    }

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

  const startEditing = (item) => {
    setEditingId(item.id);
    setEditValues({ ...item });
    setSaveError(null);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditValues({});
    setSaveError(null);
  };

  const handleInputChange = (field, value) => {
    let convertedValue = value;
    
    // Only convert numeric fields
    if (['open', 'high', 'low', 'close'].includes(field)) {
      convertedValue = value === '' ? '' : parseFloat(value);
    } else if (field === 'volume') {
      convertedValue = value === '' ? '' : parseInt(value);
    }
    
    setEditValues((prev) => ({
      ...prev,
      [field]: convertedValue,
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setSaveError(null);

      const updatedData = {
        trade_code: editValues.trade_code,
        date: editValues.date,
        open: editValues.open,
        high: editValues.high,
        low: editValues.low,
        close: editValues.close,
        volume: editValues.volume,
      };

      const response = await stockAPI.updateStock(editingId, updatedData);
      
      // Update parent state with new data
      if (onDataUpdate) {
        onDataUpdate(response.data);
      }

      setEditingId(null);
      setEditValues({});
    } catch (err) {
      const errorMessage = err.response?.data?.detail || err.message || 'Failed to save';
      setSaveError(errorMessage);
      console.error('Error saving stock:', err);
    } finally {
      setSaving(false);
    }
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
      {saveError && <div className="save-error">⚠️ {saveError}</div>}
      
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
            <th className="actions-header">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedData.map((item) => (
            <tr key={item.id} className={editingId === item.id ? 'editing' : ''}>
              {editingId === item.id ? (
                <>
                  <td>
                    <input
                      type="text"
                      value={editValues.date}
                      onChange={(e) => handleInputChange('date', e.target.value)}
                      className="edit-input"
                    />
                  </td>
                  <td className="trade-code">
                    <input
                      type="text"
                      value={editValues.trade_code}
                      onChange={(e) => handleInputChange('trade_code', e.target.value)}
                      className="edit-input"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      step="0.01"
                      value={editValues.open}
                      onChange={(e) => handleInputChange('open', e.target.value)}
                      className="edit-input"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      step="0.01"
                      value={editValues.high}
                      onChange={(e) => handleInputChange('high', e.target.value)}
                      className="edit-input"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      step="0.01"
                      value={editValues.low}
                      onChange={(e) => handleInputChange('low', e.target.value)}
                      className="edit-input"
                    />
                  </td>
                  <td className="close-price">
                    <input
                      type="number"
                      step="0.01"
                      value={editValues.close}
                      onChange={(e) => handleInputChange('close', e.target.value)}
                      className="edit-input"
                    />
                  </td>
                  <td className="volume">
                    <input
                      type="number"
                      value={editValues.volume}
                      onChange={(e) => handleInputChange('volume', e.target.value)}
                      className="edit-input"
                    />
                  </td>
                  <td className="actions">
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="btn btn-save"
                    >
                      {saving ? 'Saving...' : 'Save'}
                    </button>
                    <button onClick={cancelEditing} className="btn btn-cancel">
                      Cancel
                    </button>
                  </td>
                </>
              ) : (
                <>
                  <td>{item.date}</td>
                  <td className="trade-code">{item.trade_code}</td>
                  <td>{parseFloat(item.open).toFixed(2)}</td>
                  <td>{parseFloat(item.high).toFixed(2)}</td>
                  <td>{parseFloat(item.low).toFixed(2)}</td>
                  <td className="close-price">{parseFloat(item.close).toFixed(2)}</td>
                  <td className="volume">{item.volume}</td>
                  <td className="actions">
                    <button
                      onClick={() => startEditing(item)}
                      className="btn btn-edit"
                    >
                      Edit
                    </button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
