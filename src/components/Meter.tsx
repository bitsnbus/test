import React, { useEffect, useState, useRef } from 'react';

interface MeterProps {
  analyser: AnalyserNode | null;
}

export const Meter: React.FC<MeterProps> = ({ analyser }) => {
  const [level, setLevel] = useState(0);
  const requestRef = useRef<number>();

  const updateMeter = () => {
    if (analyser) {
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(dataArray);
      
      const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
      setLevel(average / 255);
    }
    requestRef.current = requestAnimationFrame(updateMeter);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(updateMeter);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [analyser]);

  const leds = Array.from({ length: 20 }, (_, i) => i);

  return (
    <div className="meter-container">
      {leds.map((i) => {
        const threshold = i / leds.length;
        const isActive = level > threshold;
        let color = 'green';
        if (i > 14) color = 'yellow';
        if (i > 17) color = 'red';
        
        return (
          <div 
            key={i} 
            className={`led ${isActive ? 'active' : ''} ${color}`}
          />
        );
      })}
    </div>
  );
};
