import React, { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Pressable,
  Modal,
  Platform,
} from "react-native";
import { AppText } from "./AppText";

type RobotaMood = "stargaze" | "wave" | "dance" | "meditate";

interface ScenePreset {
  id: RobotaMood;
  label: string;
  emoji: string;
  title: string;
  subtitle: string;
  glowColor: string;
  secondaryColor: string;
  bgTop: string;
  bgBottom: string;
}

const SCENES: ScenePreset[] = [
  {
    id: "stargaze",
    label: "Chill",
    emoji: "✨",
    title: "Robota's Midnight Stargaze",
    subtitle: "Cosmic synth plucks & twinkling stars",
    glowColor: "#38BDF8",
    secondaryColor: "#818CF8",
    bgTop: "#070B1E",
    bgBottom: "#1E1B4B",
  },
  {
    id: "wave",
    label: "Say Hi",
    emoji: "👋",
    title: "Friendly Companion Greeting",
    subtitle: "Energetic robot chirps & happy melody",
    glowColor: "#F472B6",
    secondaryColor: "#FB7185",
    bgTop: "#1A0B26",
    bgBottom: "#4C1D95",
  },
  {
    id: "dance",
    label: "Vibe",
    emoji: "🎵",
    title: "432Hz Energetic Lo-Fi Groove",
    subtitle: "Upbeat bassline, chords & bouncy rhythm",
    glowColor: "#FBBF24",
    secondaryColor: "#F59E0B",
    bgTop: "#17112B",
    bgBottom: "#3B0764",
  },
  {
    id: "meditate",
    label: "Breathe",
    emoji: "🪷",
    title: "Vagal Breath Companion",
    subtitle: "Deep 528Hz warm harmonic waves",
    glowColor: "#34D399",
    secondaryColor: "#10B981",
    bgTop: "#06181E",
    bgBottom: "#115E59",
  },
];

// Real-Time Web Audio API Multi-Mode Music & Sound FX Synthesizer
class RobotaMusicEngine {
  private ctx: AudioContext | null = null;
  private loopTimer: ReturnType<typeof setInterval> | null = null;
  private step = 0;

  private ensureContext(): AudioContext | null {
    if (Platform.OS !== "web" || typeof window === "undefined") return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  private playSynthNote(
    freq: number,
    duration: number,
    type: OscillatorType = "sine",
    gainVal = 0.08,
    slideToFreq?: number
  ) {
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    if (slideToFreq) {
      osc.frequency.exponentialRampToValueAtTime(slideToFreq, now + duration * 0.85);
    }

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(gainVal, now + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + duration + 0.04);
  }

  private playPercussionKick() {
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(42, now + 0.16);

    gain.gain.setValueAtTime(0.14, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.2);
  }

  private playHiHat() {
    const ctx = this.ensureContext();
    if (!ctx) return;

    const bufferSize = ctx.sampleRate * 0.05;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = "highpass";
    filter.frequency.value = 7000;

    const gain = ctx.createGain();
    const now = ctx.currentTime;
    gain.gain.setValueAtTime(0.035, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start(now);
  }

  // Immediate joyful greeting chirp when user taps "Say Hi"
  playWaveGreetingBurst() {
    this.playSynthNote(523.25, 0.18, "triangle", 0.09, 659.25);
    setTimeout(() => this.playSynthNote(659.25, 0.18, "triangle", 0.09, 783.99), 120);
    setTimeout(() => this.playSynthNote(1046.5, 0.35, "sine", 0.08), 240);
  }

  startModeMusic(mode: RobotaMood) {
    this.stop();
    this.step = 0;

    if (mode === "wave") {
      this.playWaveGreetingBurst();
    }

    const intervalMs = mode === "dance" ? 260 : mode === "wave" ? 300 : mode === "stargaze" ? 480 : 900;

    this.loopTimer = setInterval(() => {
      const s = this.step++;

      if (mode === "dance") {
        // Energetic Lo-Fi Funk Groove (Kick + Hat + Bouncy Bass + Bright Chords)
        const bassNotes = [110, 110, 130.81, 146.83, 164.81, 146.83, 130.81, 98.0];
        const leadNotes = [440, 523.25, 659.25, 587.33, 659.25, 783.99, 659.25, 523.25];

        if (s % 2 === 0) this.playPercussionKick();
        if (s % 2 === 1) this.playHiHat();

        this.playSynthNote(bassNotes[s % bassNotes.length], 0.24, "triangle", 0.09);
        if (s % 2 === 0) {
          this.playSynthNote(leadNotes[s % leadNotes.length], 0.32, "sine", 0.065);
        }
      } else if (mode === "wave") {
        // Playful Upbeat Robot Melody + Cute Chirps
        const melody = [523.25, 659.25, 783.99, 659.25, 880, 783.99, 659.25, 1046.5];
        const note = melody[s % melody.length];
        this.playSynthNote(note, 0.28, "triangle", 0.075);

        if (s % 4 === 0) {
          this.playSynthNote(261.63, 0.5, "sine", 0.06);
        }
        if (s % 6 === 3) {
          // Cute R2-style micro chirp
          this.playSynthNote(740, 0.14, "sine", 0.06, 1180);
        }
      } else if (mode === "stargaze") {
        // Dreamy Cosmic Synth Arpeggio (432Hz-inspired)
        const arp = [261.63, 329.63, 392.0, 493.88, 523.25, 493.88, 392.0, 329.63];
        this.playSynthNote(arp[s % arp.length], 0.85, "sine", 0.06);
        if (s % 4 === 0) {
          this.playSynthNote(130.81, 1.6, "triangle", 0.045);
        }
      } else if (mode === "meditate") {
        // Deep 528Hz & 396Hz Zen Singing Bowl Harmonics
        const zenNotes = [264, 396, 528, 396];
        this.playSynthNote(zenNotes[s % zenNotes.length], 1.8, "sine", 0.055);
      }
    }, intervalMs);
  }

  stop() {
    if (this.loopTimer) {
      clearInterval(this.loopTimer);
      this.loopTimer = null;
    }
  }
}

const robotaMusic = new RobotaMusicEngine();

function RobotaCanvasVideo({
  scene,
  isPlaying,
  height = 240,
}: {
  scene: ScenePreset;
  isPlaying: boolean;
  height?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (Platform.OS !== "web") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animFrameId: number;
    let t = 0;

    const stars = Array.from({ length: 38 }, () => ({
      x: Math.random(),
      y: Math.random() * 0.78,
      r: 0.8 + Math.random() * 1.8,
      speed: 0.02 + Math.random() * 0.04,
      phase: Math.random() * Math.PI * 2,
    }));

    const floaters = Array.from({ length: 14 }, (_, i) => ({
      x: 0.1 + (i / 14) * 0.8,
      y: Math.random(),
      speed: 0.002 + Math.random() * 0.003,
      wobble: Math.random() * Math.PI * 2,
      size: 4 + Math.random() * 4,
    }));

    let shootX = -100;
    let shootY = 30;
    let shootActive = false;

    const render = () => {
      const dpr = typeof window !== "undefined" ? Math.min(window.devicePixelRatio || 1, 2) : 1;
      const rect = canvas.getBoundingClientRect();
      const w = rect.width || 340;
      const h = rect.height || height;

      if (canvas.width !== Math.floor(w * dpr) || canvas.height !== Math.floor(h * dpr)) {
        canvas.width = Math.floor(w * dpr);
        canvas.height = Math.floor(h * dpr);
      }

      ctx.save();
      ctx.scale(dpr, dpr);

      if (isPlaying) {
        t += 0.035;
      }

      // 1. Background Sky Gradient
      const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
      skyGrad.addColorStop(0, scene.bgTop);
      skyGrad.addColorStop(1, scene.bgBottom);
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, w, h);

      // 2. Twinkling Stars
      stars.forEach((s) => {
        const alpha = 0.35 + 0.65 * Math.abs(Math.sin(t * 1.2 + s.phase));
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha.toFixed(2)})`;
        ctx.beginPath();
        ctx.arc(s.x * w, s.y * h, s.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // 3. Occasional Shooting Star
      if (!shootActive && Math.random() < 0.012 && isPlaying) {
        shootActive = true;
        shootX = w * (0.2 + Math.random() * 0.6);
        shootY = h * 0.08;
      }
      if (shootActive) {
        ctx.strokeStyle = "rgba(255, 255, 255, 0.85)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(shootX, shootY);
        ctx.lineTo(shootX - 36, shootY - 14);
        ctx.stroke();
        if (isPlaying) {
          shootX += 7;
          shootY += 2.8;
        }
        if (shootX > w + 60) shootActive = false;
      }

      // 4. Glowing Horizon Floor
      const floorGrad = ctx.createRadialGradient(w / 2, h * 0.92, 10, w / 2, h * 0.92, w * 0.55);
      floorGrad.addColorStop(0, `${scene.glowColor}33`);
      floorGrad.addColorStop(1, "transparent");
      ctx.fillStyle = floorGrad;
      ctx.fillRect(0, h * 0.55, w, h * 0.45);

      const cx = w / 2;
      const danceBounce = scene.id === "dance" ? Math.abs(Math.sin(t * 2.8)) * -12 : 0;
      const hoverY = Math.sin(t * 1.3) * 7 + danceBounce;
      const cy = h * 0.48 + hoverY;
      const tilt =
        scene.id === "dance"
          ? Math.sin(t * 2.8) * 0.16
          : scene.id === "wave"
          ? Math.sin(t * 2.2) * 0.08
          : Math.sin(t * 0.8) * 0.04;

      // 5. Expanding Sound/Aura Rings Behind Robota
      const ringSpeed = scene.id === "dance" ? 0.65 : 0.35;
      const ringProgress = (t * ringSpeed) % 1;
      const ringRadius = 46 + ringProgress * 76;
      ctx.strokeStyle = scene.glowColor;
      ctx.globalAlpha = (1 - ringProgress) * 0.48;
      ctx.lineWidth = scene.id === "dance" ? 2.5 : 2;
      ctx.beginPath();
      ctx.arc(cx, cy, ringRadius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 1;

      // 6. Floating Ambient Particles
      floaters.forEach((f, idx) => {
        if (isPlaying) {
          f.y -= scene.id === "dance" ? f.speed * 1.6 : f.speed;
          if (f.y < -0.05) f.y = 1.05;
        }
        const fx = f.x * w + Math.sin(t + f.wobble) * 14;
        const fy = f.y * h;
        ctx.fillStyle = idx % 2 === 0 ? scene.glowColor : scene.secondaryColor;
        ctx.globalAlpha = 0.8;

        if (scene.id === "wave" && idx % 3 === 0) {
          ctx.font = "14px sans-serif";
          ctx.fillText("♥", fx, fy);
        } else if (scene.id === "dance" && idx % 2 === 0) {
          ctx.font = "15px sans-serif";
          ctx.fillText("♪", fx, fy);
        } else {
          ctx.beginPath();
          ctx.arc(fx, fy, f.size * 0.5, 0, Math.PI * 2);
          ctx.fill();
        }
      });
      ctx.globalAlpha = 1;

      // 7. Ground Hover Shadow
      const shadowScale = 1 - hoverY * 0.015;
      ctx.fillStyle = "rgba(0, 0, 0, 0.42)";
      ctx.beginPath();
      ctx.ellipse(cx, h * 0.81, 34 * shadowScale, 8 * shadowScale, 0, 0, Math.PI * 2);
      ctx.fill();

      // 8. Draw Robota Character
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(tilt);

      // Thruster Flame Under Body
      const flameH = 12 + Math.sin(t * 9) * 4;
      const flameGrad = ctx.createLinearGradient(0, 28, 0, 28 + flameH);
      flameGrad.addColorStop(0, scene.glowColor);
      flameGrad.addColorStop(1, "transparent");
      ctx.fillStyle = flameGrad;
      ctx.beginPath();
      ctx.moveTo(-12, 28);
      ctx.lineTo(12, 28);
      ctx.lineTo(0, 28 + flameH);
      ctx.closePath();
      ctx.fill();

      // Left Arm
      ctx.save();
      ctx.translate(-34, 12);
      const leftArmAngle =
        scene.id === "dance"
          ? Math.sin(t * 5.6) * 0.75 - 0.5
          : Math.sin(t * 1.4) * 0.15 + 0.25;
      ctx.rotate(leftArmAngle);
      ctx.fillStyle = "#E2E8F0";
      ctx.beginPath();
      ctx.roundRect(-6, 0, 11, 24, 6);
      ctx.fill();
      ctx.restore();

      // Right Arm (Waves enthusiastically in "wave" mode!)
      ctx.save();
      ctx.translate(34, 12);
      const rightArmAngle =
        scene.id === "wave"
          ? -2.35 + Math.sin(t * 7.5) * 0.5
          : scene.id === "dance"
          ? -Math.sin(t * 5.6) * 0.75 + 0.5
          : -Math.sin(t * 1.4) * 0.15 - 0.25;
      ctx.rotate(rightArmAngle);
      ctx.fillStyle = "#E2E8F0";
      ctx.beginPath();
      ctx.roundRect(-5, 0, 11, 24, 6);
      ctx.fill();
      ctx.restore();

      // Torso
      const bodyGrad = ctx.createLinearGradient(-26, 2, 26, 32);
      bodyGrad.addColorStop(0, "#FFFFFF");
      bodyGrad.addColorStop(1, "#CBD5E1");
      ctx.fillStyle = bodyGrad;
      ctx.beginPath();
      ctx.roundRect(-25, 2, 50, 28, 14);
      ctx.fill();

      // Glowing Chest Heart Core
      const corePulse = 5.5 + Math.sin(t * 4) * 1.8;
      ctx.fillStyle = scene.glowColor;
      ctx.shadowColor = scene.glowColor;
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(0, 16, corePulse, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Antenna
      ctx.strokeStyle = "#94A3B8";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, -48);
      ctx.lineTo(0, -60);
      ctx.stroke();

      ctx.fillStyle = scene.glowColor;
      ctx.shadowColor = scene.glowColor;
      ctx.shadowBlur = 14;
      ctx.beginPath();
      ctx.arc(0, -63, 5 + Math.sin(t * 4.5) * 1.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Head Shell
      const headGrad = ctx.createLinearGradient(-44, -50, 44, 2);
      headGrad.addColorStop(0, "#FFFFFF");
      headGrad.addColorStop(1, "#E2E8F0");
      ctx.fillStyle = headGrad;
      ctx.beginPath();
      ctx.roundRect(-44, -50, 88, 52, 22);
      ctx.fill();

      // Ear Headphones
      ctx.fillStyle = scene.glowColor;
      ctx.beginPath();
      ctx.roundRect(-50, -34, 7, 20, 4);
      ctx.roundRect(43, -34, 7, 20, 4);
      ctx.fill();

      // Dark OLED Face Visor
      ctx.fillStyle = "#080C18";
      ctx.beginPath();
      ctx.roundRect(-36, -42, 72, 36, 15);
      ctx.fill();

      // Animated Eyes Inside Visor
      const isBlinking = Math.sin(t * 1.1) > 0.96;
      ctx.strokeStyle = scene.glowColor;
      ctx.fillStyle = scene.glowColor;
      ctx.shadowColor = scene.glowColor;
      ctx.shadowBlur = 10;
      ctx.lineWidth = 3;
      ctx.lineCap = "round";

      if (isBlinking || scene.id === "meditate") {
        ctx.beginPath();
        ctx.arc(-15, -24, 7, 0.15 * Math.PI, 0.85 * Math.PI);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(15, -24, 7, 0.15 * Math.PI, 0.85 * Math.PI);
        ctx.stroke();
      } else if (scene.id === "wave" || scene.id === "dance") {
        ctx.beginPath();
        ctx.arc(-15, -21, 7, 1.15 * Math.PI, 1.85 * Math.PI);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(15, -21, 7, 1.15 * Math.PI, 1.85 * Math.PI);
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.arc(-15, -25, 5.5, 0, Math.PI * 2);
        ctx.arc(15, -25, 5.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#FFFFFF";
        ctx.beginPath();
        ctx.arc(-13.5, -26.5, 1.8, 0, Math.PI * 2);
        ctx.arc(16.5, -26.5, 1.8, 0, Math.PI * 2);
        ctx.fill();
      }

      // Cute Digital Smile
      ctx.strokeStyle = scene.glowColor;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(0, -17, 6, 0.15 * Math.PI, 0.85 * Math.PI);
      ctx.stroke();
      ctx.shadowBlur = 0;

      ctx.restore();
      ctx.restore();

      animFrameId = requestAnimationFrame(render);
    };

    animFrameId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animFrameId);
  }, [scene, isPlaying, height]);

  if (Platform.OS !== "web") {
    return (
      <View style={[styles.nativeFallback, { height, backgroundColor: scene.bgTop }]}>
        <AppText style={{ fontSize: 48 }}>🤖</AppText>
      </View>
    );
  }

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: "100%",
        height: "100%",
        display: "block",
      }}
    />
  );
}

export function RobotaAnimatedTheater() {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [musicOn, setMusicOn] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const scene = SCENES[activeIndex];

  useEffect(() => {
    if (isPlaying && musicOn) {
      robotaMusic.startModeMusic(scene.id);
    } else {
      robotaMusic.stop();
    }
    return () => {
      robotaMusic.stop();
    };
  }, [scene.id, isPlaying, musicOn]);

  const handleSelectScene = (idx: number) => {
    setActiveIndex(idx);
    setIsPlaying(true);
    // Automatically enable energetic music when user taps a Robota action pill!
    setMusicOn(true);
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.sectionHeader}>
        <View>
          <AppText style={styles.kicker}>LIVE 60FPS ANIMATION & AUDIO</AppText>
          <AppText style={styles.heading}>Robota Sanctuary Theater</AppText>
        </View>
        <Pressable
          onPress={() => setMusicOn((m) => !m)}
          style={[
            styles.soundPill,
            musicOn && {
              backgroundColor: "rgba(56, 189, 248, 0.2)",
              borderColor: scene.glowColor,
            },
          ]}
        >
          <AppText style={styles.soundPillText}>
            {musicOn ? "🔊 Music On" : "🔇 Tap for Music"}
          </AppText>
        </Pressable>
      </View>

      {/* Main Video Frame */}
      <View style={[styles.videoCard, { borderColor: `${scene.glowColor}66` }]}>
        <RobotaCanvasVideo scene={scene} isPlaying={isPlaying} height={240} />

        {/* Top Bar Overlay */}
        <View style={styles.topOverlay}>
          <Pressable
            onPress={() => setIsFullscreen(true)}
            style={styles.glassBtn}
            hitSlop={10}
          >
            <AppText style={styles.glassBtnText}>⛶ Full Screen</AppText>
          </Pressable>
        </View>

        {/* Bottom Caption & Play/Pause */}
        <View style={styles.bottomOverlay}>
          <View style={{ flex: 1 }}>
            <AppText style={styles.sceneTitle}>{scene.title}</AppText>
            <AppText style={styles.sceneSub}>{scene.subtitle}</AppText>
          </View>

          <Pressable
            onPress={() => setIsPlaying((p) => !p)}
            style={[styles.playBtn, { borderColor: scene.glowColor }]}
          >
            <AppText style={styles.playBtnIcon}>{isPlaying ? "❚❚" : "▶"}</AppText>
          </Pressable>
        </View>
      </View>

      {/* Interactive Action / Scene Pills */}
      <View style={styles.pillsRow}>
        {SCENES.map((item, idx) => {
          const selected = idx === activeIndex;
          return (
            <Pressable
              key={item.id}
              onPress={() => handleSelectScene(idx)}
              style={[
                styles.actionPill,
                selected && {
                  borderColor: item.glowColor,
                  backgroundColor: "rgba(255, 255, 255, 0.12)",
                },
              ]}
            >
              <AppText style={styles.pillEmoji}>{item.emoji}</AppText>
              <AppText style={[styles.pillText, selected && styles.pillTextActive]}>
                {item.label}
              </AppText>
            </Pressable>
          );
        })}
      </View>

      {/* Full Screen Theater Modal */}
      <Modal visible={isFullscreen} animationType="fade" transparent={false}>
        <View style={[styles.fullScreenWrap, { backgroundColor: scene.bgTop }]}>
          <RobotaCanvasVideo scene={scene} isPlaying={isPlaying} height={680} />

          <View style={styles.fullTopControls}>
            <Pressable
              onPress={() => setMusicOn((m) => !m)}
              style={styles.exitFullBtn}
            >
              <AppText style={styles.exitFullText}>
                {musicOn ? "🔊 Music On" : "🔇 Muted"}
              </AppText>
            </Pressable>

            <Pressable
              onPress={() => setIsFullscreen(false)}
              style={styles.exitFullBtn}
            >
              <AppText style={styles.exitFullText}>✕ Exit</AppText>
            </Pressable>
          </View>

          <View style={styles.fullBottomControls}>
            {SCENES.map((item, idx) => {
              const selected = idx === activeIndex;
              return (
                <Pressable
                  key={item.id}
                  onPress={() => handleSelectScene(idx)}
                  style={[
                    styles.actionPill,
                    selected && {
                      borderColor: item.glowColor,
                      backgroundColor: "rgba(255, 255, 255, 0.16)",
                    },
                  ]}
                >
                  <AppText style={styles.pillEmoji}>{item.emoji}</AppText>
                  <AppText style={[styles.pillText, selected && styles.pillTextActive]}>
                    {item.label}
                  </AppText>
                </Pressable>
              );
            })}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 16,
    gap: 10,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  kicker: {
    fontSize: 9.5,
    fontWeight: "800",
    color: "#38BDF8",
    letterSpacing: 1.2,
  },
  heading: {
    fontSize: 17,
    fontWeight: "800",
    color: "#F8FAFC",
    marginTop: 2,
  },
  soundPill: {
    backgroundColor: "rgba(19, 23, 42, 0.85)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.16)",
  },
  soundPillText: {
    fontSize: 10.5,
    fontWeight: "800",
    color: "#E2E8F0",
  },
  videoCard: {
    height: 240,
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: 1.5,
    backgroundColor: "#070B1E",
    position: "relative",
  },
  nativeFallback: {
    alignItems: "center",
    justifyContent: "center",
  },
  topOverlay: {
    position: "absolute",
    top: 12,
    right: 12,
  },
  glassBtn: {
    backgroundColor: "rgba(7, 11, 30, 0.72)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
  },
  glassBtnText: {
    color: "#F8FAFC",
    fontSize: 10.5,
    fontWeight: "700",
  },
  bottomOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(7, 10, 22, 0.76)",
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 10,
  },
  sceneTitle: {
    color: "#FFFFFF",
    fontSize: 13.5,
    fontWeight: "800",
  },
  sceneSub: {
    color: "#94A3B8",
    fontSize: 11,
  },
  playBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1.5,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  playBtnIcon: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "900",
  },
  pillsRow: {
    flexDirection: "row",
    gap: 8,
  },
  actionPill: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(19, 23, 42, 0.84)",
    paddingVertical: 9,
    paddingHorizontal: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    gap: 4,
  },
  pillEmoji: {
    fontSize: 13,
  },
  pillText: {
    color: "#94A3B8",
    fontSize: 11.5,
    fontWeight: "700",
  },
  pillTextActive: {
    color: "#FFFFFF",
    fontWeight: "800",
  },
  fullScreenWrap: {
    flex: 1,
    position: "relative",
  },
  fullTopControls: {
    position: "absolute",
    top: 44,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  exitFullBtn: {
    backgroundColor: "rgba(7, 11, 30, 0.82)",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  exitFullText: {
    color: "#FFFFFF",
    fontSize: 12.5,
    fontWeight: "800",
  },
  fullBottomControls: {
    position: "absolute",
    bottom: 34,
    left: 16,
    right: 16,
    flexDirection: "row",
    gap: 8,
  },
});
