import React from 'react';
import './Legend.css';

interface LegendItem {
  color: string;
  label: string;
}

interface LegendProps {
  items: LegendItem[];
}

const Legend: React.FC<LegendProps> = ({ items }) => {
  return (
    <div className="legend">
      {items.map((item, index) => (
        <div className="legend-item" key={index}>
          <div
            className="legend-color"
            style={{ backgroundColor: item.color }}
          />
          <span className="legend-label">{item.label}</span>
        </div>
      ))}
    </div>
  );
};

export default Legend;
