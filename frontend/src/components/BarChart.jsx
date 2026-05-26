import { memo } from 'react';

const BarChart = memo(({ monthCounts }) => {
  const entries = Object.entries(monthCounts);
  if (entries.length === 0) return <div className="bar-chart">No data available</div>;

  const max = Math.max(1, ...Object.values(monthCounts));

  return (
    <div className="bar-chart">
      {entries.map(([month, count]) => (
        <div key={month} className="bar-row">
          <span>{month}</span>
          <div className="bar-track">
            <div className="bar-fill" style={{ width: `${(count / max) * 100}%` }}></div>
          </div>
          <strong>{count}</strong>
        </div>
      ))}
    </div>
  );
});

BarChart.displayName = 'BarChart';

export default BarChart;
