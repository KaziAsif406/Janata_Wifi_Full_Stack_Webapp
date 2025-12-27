import React, { useMemo } from 'react';
import KPICard from './KPICard';
import '../styles/KPISummary.css';

/**
 * KPISummary Component
 * 
 * Displays key performance indicators (KPIs) for the selected trade code
 * 
 * Props:
 *   - data: array of stock records (from API)
 *   - selectedTradeCode: string (currently selected trade code)
 * 
 * Calculates:
 *   - Highest Close Price: max(close)
 *   - Lowest Close Price: min(close)
 *   - Average Volume: mean(volume)
 */
function KPISummary({ data, selectedTradeCode }) {
  // Calculate KPIs from data
  const kpis = useMemo(() => {
    if (!data || data.length === 0) {
      return {
        highestClose: null,
        lowestClose: null,
        avgVolume: null,
      };
    }

    const closes = data.map((d) => parseFloat(d.close));
    const volumes = data.map((d) => parseInt(d.volume));

    const highest = Math.max(...closes);
    const lowest = Math.min(...closes);
    const avgVol = volumes.reduce((a, b) => a + b, 0) / volumes.length;

    return {
      highestClose: highest.toFixed(2),
      lowestClose: lowest.toFixed(2),
      avgVolume: Math.round(avgVol),
    };
  }, [data]);

  if (!selectedTradeCode) {
    return null;
  }

  return (
    <div className="kpi-summary">
      <KPICard
        title="Highest Close Price"
        value={kpis.highestClose}
        unit=""
        icon="📈"
      />
      <KPICard
        title="Lowest Close Price"
        value={kpis.lowestClose}
        unit=""
        icon="📉"
      />
      <KPICard
        title="Avg Daily Volume"
        value={kpis.avgVolume}
        unit="pk"
        icon="📦"
      />
    </div>
  );
}

export default React.memo(KPISummary);
