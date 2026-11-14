import { Platform } from "react-native";

export type SolfeggioFreq = 432 | 528 | 639 | 963;
export type BinauralBand = "gamma40" | "alpha10" | "theta6" | "delta2";
export type NatureScape = "none" | "rain" | "ocean" | "forest";

export interface StudioMixerState {
  isPlaying: boolean;
  solfeggio: SolfeggioFreq;
  solfeggioGain: number;
  binaural: BinauralBand;
  binauralGain: number;
  nature: NatureScape;
  natureGain: number;
}

const BINAURAL_OFFSETS: Record<BinauralBand, number> = {
  gamma40: 40,
  alpha10: 10,
  theta6: 6,
  delta2: 2.5,
};

class StudioAudioConnectorEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private analyser: AnalyserNode | null = null;

  // Solfeggio nodes
  private solfOsc: OscillatorNode | null = null;
  private solfGainNode: GainNode | null = null;

  // True Stereo Binaural nodes
  private binLeftOsc: OscillatorNode | null = null;
  private binRightOsc: OscillatorNode | null = null;
  private binGainNode: GainNode | null = null;

  // Nature procedural noise nodes
  private natureSource: AudioBufferSourceNode | null = null;
  private natureFilter: BiquadFilterNode | null = null;
  private natureGainNode: GainNode | null = null;
  private oceanLfo: OscillatorNode | null = null;

  private state: StudioMixerState = {
    isPlaying: false,
    solfeggio: 528,
    solfeggioGain: 0.25,
    binaural: "alpha10",
    binauralGain: 0.2,
    nature: "rain",
    natureGain: 0.35,
  };

  getState(): StudioMixerState {
    return { ...this.state };
  }

  private ensureGraph(): AudioContext | null {
    if (Platform.OS !== "web" || typeof window === "undefined") return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return null;
      this.ctx = new AudioCtx();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.85;

      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 64;

      this.masterGain.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);
    }

    if (this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  start(customState?: Partial<StudioMixerState>) {
    if (customState) {
      this.state = { ...this.state, ...customState };
    }
    const ctx = this.ensureGraph();
    if (!ctx || !this.masterGain) return;

    this.stopNodesOnly();

    const now = ctx.currentTime;

    // 1. Solfeggio Carrier Oscillator
    this.solfOsc = ctx.createOscillator();
    this.solfGainNode = ctx.createGain();
    this.solfOsc.type = "sine";
    this.solfOsc.frequency.setValueAtTime(this.state.solfeggio, now);
    this.solfGainNode.gain.setValueAtTime(0.001, now);
    this.solfGainNode.gain.exponentialRampToValueAtTime(
      Math.max(0.001, this.state.solfeggioGain * 0.25),
      now + 0.6
    );
    this.solfOsc.connect(this.solfGainNode);
    this.solfGainNode.connect(this.masterGain);
    this.solfOsc.start(now);

    // 2. True Stereo Binaural Beats (200Hz Left, 200Hz + Offset Right)
    const baseCarrier = 200;
    const beatOffset = BINAURAL_OFFSETS[this.state.binaural];

    this.binGainNode = ctx.createGain();
    this.binGainNode.gain.setValueAtTime(0.001, now);
    this.binGainNode.gain.exponentialRampToValueAtTime(
      Math.max(0.001, this.state.binauralGain * 0.2),
      now + 0.6
    );
    this.binGainNode.connect(this.masterGain);

    if (typeof ctx.createStereoPanner === "function") {
      const leftPan = ctx.createStereoPanner();
      leftPan.pan.value = -1;
      const rightPan = ctx.createStereoPanner();
      rightPan.pan.value = 1;

      this.binLeftOsc = ctx.createOscillator();
      this.binRightOsc = ctx.createOscillator();
      this.binLeftOsc.type = "sine";
      this.binRightOsc.type = "sine";
      this.binLeftOsc.frequency.setValueAtTime(baseCarrier, now);
      this.binRightOsc.frequency.setValueAtTime(baseCarrier + beatOffset, now);

      this.binLeftOsc.connect(leftPan);
      leftPan.connect(this.binGainNode);

      this.binRightOsc.connect(rightPan);
      rightPan.connect(this.binGainNode);

      this.binLeftOsc.start(now);
      this.binRightOsc.start(now);
    }

    // 3. Procedural Nature Soundscape Buffer (Pink/Brown Filtered Noise)
    if (this.state.nature !== "none") {
      const bufferSeconds = 4;
      const bufferSize = ctx.sampleRate * bufferSeconds;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);

      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.04;
        b6 = white * 0.115926;
      }

      this.natureSource = ctx.createBufferSource();
      this.natureSource.buffer = noiseBuffer;
      this.natureSource.loop = true;

      this.natureFilter = ctx.createBiquadFilter();
      this.natureGainNode = ctx.createGain();

      if (this.state.nature === "rain") {
        this.natureFilter.type = "bandpass";
        this.natureFilter.frequency.setValueAtTime(1100, now);
        this.natureFilter.Q.value = 0.7;
      } else if (this.state.nature === "ocean") {
        this.natureFilter.type = "lowpass";
        this.natureFilter.frequency.setValueAtTime(420, now);

        // Slow 0.12Hz wave surf modulation
        this.oceanLfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        this.oceanLfo.frequency.value = 0.12;
        lfoGain.gain.value = 260;
        this.oceanLfo.connect(lfoGain);
        lfoGain.connect(this.natureFilter.frequency);
        this.oceanLfo.start(now);
      } else {
        // Forest breeze
        this.natureFilter.type = "bandpass";
        this.natureFilter.frequency.setValueAtTime(680, now);
        this.natureFilter.Q.value = 1.4;
      }

      this.natureGainNode.gain.setValueAtTime(
        Math.max(0.001, this.state.natureGain * 0.45),
        now
      );

      this.natureSource.connect(this.natureFilter);
      this.natureFilter.connect(this.natureGainNode);
      this.natureGainNode.connect(this.masterGain);
      this.natureSource.start(now);
    }

    this.state.isPlaying = true;
  }

  updateParams(partial: Partial<StudioMixerState>) {
    this.state = { ...this.state, ...partial };
    if (!this.state.isPlaying) return;

    const ctx = this.ctx;
    if (!ctx) return;
    const now = ctx.currentTime;

    if (partial.solfeggio !== undefined && this.solfOsc) {
      this.solfOsc.frequency.setTargetAtTime(partial.solfeggio, now, 0.1);
    }
    if (partial.solfeggioGain !== undefined && this.solfGainNode) {
      this.solfGainNode.gain.setTargetAtTime(
        Math.max(0.001, partial.solfeggioGain * 0.25),
        now,
        0.1
      );
    }
    if (partial.binaural !== undefined && this.binRightOsc) {
      this.binRightOsc.frequency.setTargetAtTime(
        200 + BINAURAL_OFFSETS[partial.binaural],
        now,
        0.1
      );
    }
    if (partial.binauralGain !== undefined && this.binGainNode) {
      this.binGainNode.gain.setTargetAtTime(
        Math.max(0.001, partial.binauralGain * 0.2),
        now,
        0.1
      );
    }
    if (partial.natureGain !== undefined && this.natureGainNode) {
      this.natureGainNode.gain.setTargetAtTime(
        Math.max(0.001, partial.natureGain * 0.45),
        now,
        0.1
      );
    }
    if (partial.nature !== undefined) {
      this.start();
    }
  }

  getFrequencySpectrum(): number[] {
    if (!this.analyser || !this.state.isPlaying) {
      return [12, 18, 14, 22, 16, 20, 14, 18, 12, 16, 20, 14];
    }
    const data = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(data);
    const bars: number[] = [];
    for (let i = 0; i < 12; i++) {
      const val = data[i * 2] || 0;
      bars.push(Math.max(10, Math.min(48, Math.round((val / 255) * 48))));
    }
    return bars;
  }

  private stopNodesOnly() {
    const safeStop = (node: { stop: () => void; disconnect: () => void } | null) => {
      if (!node) return;
      try {
        node.stop();
      } catch {}
      try {
        node.disconnect();
      } catch {}
    };

    safeStop(this.solfOsc);
    safeStop(this.binLeftOsc);
    safeStop(this.binRightOsc);
    safeStop(this.natureSource);
    safeStop(this.oceanLfo);

    this.solfOsc = null;
    this.binLeftOsc = null;
    this.binRightOsc = null;
    this.natureSource = null;
    this.oceanLfo = null;
  }

  stop() {
    this.stopNodesOnly();
    this.state.isPlaying = false;
  }
}

export const studioAudioConnector = new StudioAudioConnectorEngine();
