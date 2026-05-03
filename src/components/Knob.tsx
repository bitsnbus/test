import React from 'react';

interface KnobProps {
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  label?: string;
}

export const Knob: React.FC<KnobProps> = ({ value, min, max, onChange, label }) => {
  // Map value to degrees (-150 to 150)
  const degrees = ((value - min) / (max - min)) * 300 - 150;

  const handleMouseDown = (e: React.MouseEvent) => {
    const startY = e.clientY;
    const startValue = value;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaY = startY - moveEvent.clientY;
      const range = max - min;
      const sensitivity = 0.01;
      let newValue = startValue + deltaY * sensitivity * range;
      newValue = Math.max(min, Math.min(max, newValue));
      onChange(newValue);
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div className="knob-container" onMouseDown={handleMouseDown}>
      <div 
        className="knob" 
        style={{ transform: `rotate(${degrees}deg)` }}
      >
        <div className="knob-indicator" />
      </div>
      {label && <div style={{ fontSize: '10px', textAlign: 'center', marginTop: '5px' }}>{label}</div>}
    </div>
  );
};
