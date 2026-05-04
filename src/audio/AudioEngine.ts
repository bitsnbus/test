export interface AudioTrack {
  id: string;
  name: string;
  source: AudioBufferSourceNode | null;
  gainNode: GainNode;
  pannerNode: StereoPannerNode;
  analyserNode: AnalyserNode;
  buffer: AudioBuffer | null;
  isMuted: boolean;
  isSolo: boolean;
  volume: number;
  pan: number;
}

export class AudioEngine {
  private context: AudioContext;
  private masterGain: GainNode;
  private masterAnalyser: AnalyserNode;
  private tracks: Map<string, AudioTrack> = new Map();
  private isPlaying: boolean = false;

  constructor() {
    this.context = new (window.AudioContext || (window as any).webkitAudioContext)();
    this.masterGain = this.context.createGain();
    this.masterAnalyser = this.context.createAnalyser();
    this.masterAnalyser.fftSize = 512;
    
    this.masterGain.connect(this.masterAnalyser);
    this.masterAnalyser.connect(this.context.destination);
  }

  public async addTrack(file: File): Promise<string> {
    const id = Math.random().toString(36).substring(2, 9);
    const arrayBuffer = await file.arrayBuffer();
    const audioBuffer = await this.context.decodeAudioData(arrayBuffer);

    const gainNode = this.context.createGain();
    const pannerNode = this.context.createStereoPanner();
    const analyserNode = this.context.createAnalyser();

    analyserNode.fftSize = 256;

    // Routing: Source (created on play) -> Panner -> Gain -> Analyser -> Master
    pannerNode.connect(gainNode);
    gainNode.connect(analyserNode);
    analyserNode.connect(this.masterGain);

    const track: AudioTrack = {
      id,
      name: file.name,
      source: null,
      gainNode,
      pannerNode,
      analyserNode,
      buffer: audioBuffer,
      isMuted: false,
      isSolo: false,
      volume: 1,
      pan: 0,
    };

    this.tracks.set(id, track);
    return id;
  }

  public play() {
    if (this.isPlaying) return;
    if (this.context.state === 'suspended') {
      this.context.resume();
    }

    this.tracks.forEach((track) => {
      if (track.buffer) {
        const source = this.context.createBufferSource();
        source.buffer = track.buffer;
        source.connect(track.pannerNode);
        source.start(0);
        track.source = source;
      }
    });

    this.isPlaying = true;
  }

  public stop() {
    this.tracks.forEach((track) => {
      if (track.source) {
        track.source.stop();
        track.source.disconnect();
        track.source = null;
      }
    });
    this.isPlaying = false;
  }

  public setTrackVolume(id: string, volume: number) {
    const track = this.tracks.get(id);
    if (track) {
      track.volume = volume;
      this.updateGains();
    }
  }

  public toggleTrackMute(id: string) {
    const track = this.tracks.get(id);
    if (track) {
      track.isMuted = !track.isMuted;
      this.updateGains();
    }
  }

  public toggleTrackSolo(id: string) {
    const track = this.tracks.get(id);
    if (track) {
      track.isSolo = !track.isSolo;
      this.updateGains();
    }
  }

  private updateGains() {
    const soloActive = Array.from(this.tracks.values()).some(t => t.isSolo);
    
    this.tracks.forEach(track => {
      let effectiveVolume = track.volume;
      
      if (track.isMuted) {
        effectiveVolume = 0;
      } else if (soloActive && !track.isSolo) {
        effectiveVolume = 0;
      }
      
      track.gainNode.gain.setTargetAtTime(effectiveVolume, this.context.currentTime, 0.01);
    });
  }

  public setTrackPan(id: string, pan: number) {
    const track = this.tracks.get(id);
    if (track) {
      track.pan = pan;
      track.pannerNode.pan.setTargetAtTime(pan, this.context.currentTime, 0.01);
    }
  }

  public setMasterVolume(volume: number) {
    this.masterGain.gain.setTargetAtTime(volume, this.context.currentTime, 0.01);
  }

  public getMasterAnalyser(): AnalyserNode {
    return this.masterAnalyser;
  }

  public getTrackAnalyser(id: string): AnalyserNode | null {
    return this.tracks.get(id)?.analyserNode || null;
  }

  public getTrackIds(): string[] {
    return Array.from(this.tracks.keys());
  }

  public getTrack(id: string): AudioTrack | undefined {
    return this.tracks.get(id);
  }
}

export const audioEngine = new AudioEngine();
