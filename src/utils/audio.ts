/**
 * Pure Web Audio API Sound Synthesizer for LıkırLoop
 * Requires zero external audio assets, works completely offline & reliably.
 */

class SoundSynthesizer {
  private ctx: AudioContext | null = null;
  private noiseNode: AudioBufferSourceNode | null = null;
  private filterNode: BiquadFilterNode | null = null;
  private gainNode: GainNode | null = null;
  private isMuted: boolean = false;

  constructor() {
    // AudioContext will be initialized on first user gesture
  }

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted) {
      this.stopWaterStream();
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Generates realistic liquid stream sound using filtered noise with acoustic resonance
   */
  public startWaterStream(durationSeconds: number = 5) {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    this.stopWaterStream();

    const sampleRate = ctx.sampleRate;
    const bufferSize = sampleRate * Math.min(durationSeconds + 0.5, 8);
    const buffer = ctx.createBuffer(1, bufferSize, sampleRate);
    const data = buffer.getChannelData(0);

    // Generate Brownian / Pink noise for natural liquid hiss and bubbles
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
      b6 = white * 0.115926;
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;

    // Resonant bandpass filter that rises in pitch as bottle fills (classic cavity resonance)
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(320, ctx.currentTime);
    // Gradually shift resonant frequency from 320 Hz to 1200 Hz over fill duration
    filter.frequency.exponentialRampToValueAtTime(1150, ctx.currentTime + durationSeconds);
    filter.Q.setValueAtTime(3.5, ctx.currentTime);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.01, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.35, ctx.currentTime + 0.3);
    gain.gain.setValueAtTime(0.35, ctx.currentTime + durationSeconds - 0.4);
    gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + durationSeconds);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    source.start(ctx.currentTime);
    source.stop(ctx.currentTime + durationSeconds);

    this.noiseNode = source;
    this.filterNode = filter;
    this.gainNode = gain;
  }

  public stopWaterStream() {
    if (this.gainNode && this.ctx) {
      try {
        this.gainNode.gain.setValueAtTime(this.gainNode.gain.value, this.ctx.currentTime);
        this.gainNode.gain.linearRampToValueAtTime(0.0001, this.ctx.currentTime + 0.1);
      } catch {
        // Safe catch
      }
    }
    if (this.noiseNode) {
      try {
        this.noiseNode.stop();
        this.noiseNode.disconnect();
      } catch {
        // Ignore if already stopped
      }
      this.noiseNode = null;
    }
  }

  /**
   * Plays a pleasant harmonic completion chime
   */
  public playSuccessChime() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const chords = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    const startTime = ctx.currentTime;

    chords.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime + idx * 0.08);

      gain.gain.setValueAtTime(0.001, startTime + idx * 0.08);
      gain.gain.linearRampToValueAtTime(0.18, startTime + idx * 0.08 + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + idx * 0.08 + 0.9);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime + idx * 0.08);
      osc.stop(startTime + idx * 0.08 + 0.95);
    });
  }

  /**
   * Sound effect for scan & validation actions
   */
  public playTone(type: 'scan' | 'warn' | 'error') {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const t = ctx.currentTime;

    if (type === 'scan') {
      // Pleasant high double beep
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(880, t);
      osc.frequency.setValueAtTime(1320, t + 0.07);
      gain.gain.setValueAtTime(0.15, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.25);
    } else if (type === 'warn') {
      // Gentle warning mid tone
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(440, t);
      osc.frequency.setValueAtTime(370, t + 0.1);
      gain.gain.setValueAtTime(0.12, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.32);
    } else {
      // Low buzz for rejection
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, t);
      osc.frequency.setValueAtTime(180, t + 0.12);
      gain.gain.setValueAtTime(0.18, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.38);
    }
  }
}

export const soundFx = new SoundSynthesizer();
