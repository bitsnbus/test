import React, { useEffect, useRef } from 'react';
import { audioEngine } from '../audio/AudioEngine';

interface FFTViewProps {
  trackId?: string;
  width?: number;
  height?: number;
}

export const FFTView: React.FC<FFTViewProps> = ({ trackId, width = 300, height = 150 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>();

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const analyser = trackId 
      ? audioEngine.getTrackAnalyser(trackId) 
      : audioEngine.getMasterAnalyser();

    if (!analyser) {
      ctx.clearRect(0, 0, width, height);
      requestRef.current = requestAnimationFrame(draw);
      return;
    }

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteFrequencyData(dataArray);

    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, width, height);

    const barWidth = (width / bufferLength) * 2.5;
    let barHeight;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      barHeight = (dataArray[i] / 255) * height;

      // Color based on frequency
      const hue = (i / bufferLength) * 360;
      ctx.fillStyle = `hsla(${hue}, 80%, 50%, 0.8)`;
      
      ctx.fillRect(x, height - barHeight, barWidth, barHeight);

      x += barWidth + 1;
    }

    requestRef.current = requestAnimationFrame(draw);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(draw);
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [trackId]);

  return (
    <div className="fft-view-container" style={{ 
      border: '1px solid #444', 
      background: '#000',
      borderRadius: '4px',
      overflow: 'hidden',
      width: width,
      height: height
    }}>
      <canvas 
        ref={canvasRef} 
        width={width} 
        height={height}
        style={{ display: 'block' }}
      />
    </div>
  );
};
