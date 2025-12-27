import React from 'react';
import '../styles/KPICard.css';

/**
 * KPICard Component
 * 
 * Reusable card component for displaying key performance indicators
 * 
 * Props:
 *   - title: string (label for the KPI)
 *   - value: string | number (the KPI value to display)
 *   - unit: string (optional, unit suffix like "pk" for pack)
 *   - icon: string (optional, emoji icon)
 */
function KPICard({ title, value, unit = '', icon = '📊' }) {
  const displayValue = value === null || value === undefined ? 'N/A' : value;

  return (
    <div className="kpi-card">
      <div className="kpi-icon">{icon}</div>
      <div className="kpi-content">
        <p className="kpi-title">{title}</p>
        <p className="kpi-value">
          {displayValue}
          {value !== 'N/A' && unit && <span className="kpi-unit">{unit}</span>}
        </p>
      </div>
    </div>
  );
}

export default React.memo(KPICard);
