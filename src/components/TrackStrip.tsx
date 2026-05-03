import React from 'react';
import { audioEngine, AudioTrack } from '../audio/AudioEngine';
import { Fader } from './Fader';
import { Knob } from './Knob';
import { Meter } from './Meter';

interface TrackStripProps {
  track: AudioTrack;
  onUpdate: () => void;
}

export const TrackStrip: React.FC<TrackStripProps> = ({ track, onUpdate }) => {
  const handleVolumeChange = (val: number) => {
    audioEngine.setTrackVolume(track.id, val);
    onUpdate();
  };

  const handlePanChange = (val: number) => {
    audioEngine.setTrackPan(track.id, val);
    onUpdate();
  };

  return (
    <div className="track-strip">
      <div style={{ fontSize: '10px', fontWeight: 'bold', height: '20px', overflow: 'hidden', width: '100%', textAlign: 'center' }}>
        {track.name}
      </div>
      
      <Knob 
        value={track.pan} 
        min={-1} 
        max={1} 
        onChange={handlePanChange} 
        label="PAN" 
      />

      <div style={{ display: 'flex', gap: '5px', alignItems: 'flex-end' }}>
        <Meter analyser={track.analyserNode} />
        <Fader 
          value={track.volume} 
          min={0} 
          max={1.5} 
          onChange={handleVolumeChange} 
        />
      </div>

      <div style={{ display: 'flex', gap: '5px' }}>
        <button style={{ fontSize: '10px', background: track.isSolo ? 'orange' : '#444' }}>S</button>
        <button style={{ fontSize: '10px', background: track.isMuted ? 'red' : '#444' }}>M</button>
      </div>
    </div>
  );
};
