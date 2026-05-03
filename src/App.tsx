import React, { useState } from 'react';
import { audioEngine, AudioTrack } from './audio/AudioEngine';
import { TrackStrip } from './components/TrackStrip';
import './App.css';

function App() {
  const [trackIds, setTrackIds] = useState<string[]>([]);
  const [, setUpdateTrigger] = useState(0);

  const forceUpdate = () => setUpdateTrigger(prev => prev + 1);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        await audioEngine.addTrack(files[i]);
      }
      setTrackIds(audioEngine.getTrackIds());
    }
  };

  return (
    <div className="app-container">
      <header style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>VIRTUAL STUDIO MIXER</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => audioEngine.play()}>PLAY</button>
          <button onClick={() => audioEngine.stop()}>STOP</button>
          <input 
            type="file" 
            multiple 
            accept="audio/*" 
            onChange={handleFileUpload}
            id="file-upload"
            style={{ display: 'none' }}
          />
          <label htmlFor="file-upload" className="button" style={{ 
            background: '#444', 
            padding: '5px 15px', 
            borderRadius: '4px', 
            cursor: 'pointer',
            border: '1px solid #666'
          }}>
            ADD TRACKS
          </label>
        </div>
      </header>

      <div className="mixer-desk">
        {trackIds.map(id => {
          const track = audioEngine.getTrack(id);
          return track ? (
            <TrackStrip key={id} track={track} onUpdate={forceUpdate} />
          ) : null;
        })}
        
        {trackIds.length === 0 && (
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', opacity: 0.3 }}>
            DRAG OR ADD AUDIO TRACKS TO START MIXING
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
