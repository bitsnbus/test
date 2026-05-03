import React from 'react';

interface FaderProps {
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}

export const Fader: React.FC<FaderProps> = ({ value, min, max, onChange }) => {
  const percent = ((value - min) / (max - min)) * 100;
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(parseFloat(e.target.value));
  };

  return (
    <div className="fader-container">
      <input
        type="range"
        min={min}
        max={max}
        step="0.01"
        value={value}
        onChange={handleChange}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '200px', // Matches container height but rotated
          height: '40px',
          transform: 'rotate(-90deg) translate(-80px, -80px)',
          opacity: 0,
          cursor: 'pointer',
          zIndex: 2
        }}
      />
      <div 
        className="fader-thumb" 
        style={{ bottom: `calc(${percent}% - 30px)` }}
      >
        <div className="fader-line" />
        <div className="fader-line" style={{ marginTop: '4px' }} />
        <div className="fader-line" style={{ marginTop: '4px' }} />
      </div>
    </div>
  );
};
