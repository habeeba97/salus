import React, { useEffect, useState, useRef } from "react";
import {
  View,
  StyleSheet,
  Modal,
  Pressable,
  Animated,
  Easing,
  Platform,
} from "react-native";
import { AppText } from "./AppText";

export interface GuidedQuestData {
  id: string;
  title: string;
  duration: string;
  durationSeconds: number;
  xp: string;
  emoji: string;
  category: string;
  cueTitle: string;
  phases: string[];
}

interface SomaticQuestModalProps {
  quest: GuidedQuestData | null;
  visible: boolean;
  onClose: () => void;
  onComplete: (questId: string) => void;
}

// Pure Web Audio API Harmonic Synthesizer (Zero External Assets)
class SomaticSoundEngine {
  private ctx: AudioContext | null = null;

  private getContext(): AudioContext | null {
    if (Platform.OS !== "web" || typeof window === "undefined") return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  playTone(freq: number, duration: number, type: OscillatorType = "sine", peakGain = 0.08, delay = 0) {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);

    // Soft attack & long singing-bowl decay
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(peakGain, now + 0.18);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + duration + 0.05);
  }

  // Gentle rising 432Hz -> 528Hz harmonic chime for Inhale / Expand
  playInhaleChime() {
    this.playTone(432, 2.4, "sine", 0.06, 0);
    this.playTone(528, 2.8, "sine", 0.04, 0.25);
  }

  // Warm grounding 396Hz -> 285Hz bowl tone for Exhale / Release
  playExhaleChime() {
    this.playTone(396, 3.2, "sine", 0.06, 0);
    this.playTone(285, 3.6, "triangle", 0.035, 0.2);
  }

  // Luminous 3-note celebration chord on Quest Completion
  playCompletionChord() {
    this.playTone(528, 2.5, "sine", 0.07, 0);
    this.playTone(660, 2.8, "sine", 0.055, 0.15);
    this.playTone(792, 3.2, "sine", 0.05, 0.3);
  }
}

const soundEngine = new SomaticSoundEngine();

export function SomaticQuestModal({
  quest,
  visible,
  onClose,
  onComplete,
}: SomaticQuestModalProps) {
  const [secondsLeft, setSecondsLeft] = useState<number>(120);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [phaseIndex, setPhaseIndex] = useState<number>(0);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [breathStateLabel, setBreathStateLabel] = useState<"Inhale & Expand" | "Exhale & Soften">("Inhale & Expand");

  const breathScale = useRef(new Animated.Value(0.85)).current;
  const ringOpacity = useRef(new Animated.Value(0.35)).current;
  const soundEnabledRef = useRef<boolean>(true);

  useEffect(() => {
    soundEnabledRef.current = soundEnabled;
  }, [soundEnabled]);

  useEffect(() => {
    if (quest && visible) {
      setSecondsLeft(quest.durationSeconds);
      setIsRunning(true);
      setPhaseIndex(0);
      setBreathStateLabel("Inhale & Expand");
    } else {
      setIsRunning(false);
    }
  }, [quest, visible]);

  // Synchronized Breathing Orb + Inhale/Exhale Web Audio Chimes
  useEffect(() => {
    if (!visible || !isRunning) return;

    let cancelled = false;

    const runBreathCycle = () => {
      if (cancelled) return;

      // Phase 1: Inhale (4s)
      setBreathStateLabel("Inhale & Expand");
      if (soundEnabledRef.current) {
        soundEngine.playInhaleChime();
      }

      Animated.parallel([
        Animated.timing(breathScale, {
          toValue: 1.22,
          duration: 4000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(ringOpacity, {
          toValue: 0.85,
          duration: 4000,
          useNativeDriver: true,
        }),
      ]).start(({ finished }) => {
        if (!finished || cancelled) return;

        // Phase 2: Exhale (5s)
        setBreathStateLabel("Exhale & Soften");
        if (soundEnabledRef.current) {
          soundEngine.playExhaleChime();
        }

        Animated.parallel([
          Animated.timing(breathScale, {
            toValue: 0.85,
            duration: 5000,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(ringOpacity, {
            toValue: 0.3,
            duration: 5000,
            useNativeDriver: true,
          }),
        ]).start(({ finished: exhaleFinished }) => {
          if (exhaleFinished && !cancelled) {
            runBreathCycle();
          }
        });
      });
    };

    runBreathCycle();

    return () => {
      cancelled = true;
      breathScale.stopAnimation();
      ringOpacity.stopAnimation();
    };
  }, [visible, isRunning]);

  // Sensory Cue Rotation every 6 seconds
  useEffect(() => {
    if (!visible || !isRunning || !quest) return;

    const cueTimer = setInterval(() => {
      setPhaseIndex((prev) => (prev + 1) % quest.phases.length);
    }, 6000);

    return () => clearInterval(cueTimer);
  }, [visible, isRunning, quest]);

  // 1-second smooth clock tick
  useEffect(() => {
    if (!visible || !isRunning || !quest) return;

    const clock = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(clock);
          setIsRunning(false);
          if (soundEnabledRef.current) {
            soundEngine.playCompletionChord();
          }
          onComplete(quest.id);
          onClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(clock);
  }, [visible, isRunning, quest]);

  if (!quest) return null;

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const formattedTime = `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  const currentPhaseText = quest.phases[phaseIndex % quest.phases.length];

  const handleFinishEarly = () => {
    setIsRunning(false);
    if (soundEnabledRef.current) {
      soundEngine.playCompletionChord();
    }
    onComplete(quest.id);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Top Bar with Audio Toggle & Close */}
          <View style={styles.topRow}>
            <View style={styles.categoryBadge}>
              <AppText style={styles.categoryText}>{quest.category}</AppText>
            </View>

            <View style={styles.topControls}>
              <Pressable
                onPress={() => setSoundEnabled((s) => !s)}
                style={styles.soundBtn}
                hitSlop={10}
              >
                <AppText style={styles.soundBtnText}>
                  {soundEnabled ? "🔊 Chimes On" : "🔇 Muted"}
                </AppText>
              </Pressable>

              <Pressable onPress={onClose} style={styles.closeBtn} hitSlop={12}>
                <AppText style={styles.closeText}>✕</AppText>
              </Pressable>
            </View>
          </View>

          {/* Title */}
          <View style={styles.headerBlock}>
            <AppText style={styles.questTitle}>{quest.title}</AppText>
            <AppText style={styles.cueSubtitle}>{quest.cueTitle}</AppText>
          </View>

          {/* Animated Somatic Orb */}
          <View style={styles.orbStage}>
            <Animated.View
              style={[
                styles.outerAura,
                {
                  opacity: ringOpacity,
                  transform: [{ scale: breathScale }],
                },
              ]}
            />
            <Animated.View
              style={[
                styles.coreOrb,
                {
                  transform: [{ scale: breathScale }],
                },
              ]}
            >
              <AppText style={styles.orbEmoji}>{quest.emoji}</AppText>
              <AppText style={styles.timerDigits}>{formattedTime}</AppText>
            </Animated.View>
          </View>

          {/* Breath Rhythm Pill */}
          <View style={styles.rhythmPill}>
            <AppText style={styles.rhythmText}>
              {isRunning ? `✨ ${breathStateLabel}` : "⏸ Paused"}
            </AppText>
          </View>

          {/* Live Guided Prompt */}
          <View style={styles.promptBox}>
            <AppText style={styles.promptKicker}>LIVE SOMATIC CUE</AppText>
            <AppText style={styles.promptText}>{currentPhaseText}</AppText>
          </View>

          {/* Controls */}
          <View style={styles.controlsRow}>
            <Pressable
              onPress={() => setIsRunning((r) => !r)}
              style={styles.pauseBtn}
            >
              <AppText style={styles.pauseBtnText}>
                {isRunning ? "⏸ Pause" : "▶ Resume"}
              </AppText>
            </Pressable>

            <Pressable onPress={handleFinishEarly} style={styles.completeBtn}>
              <AppText style={styles.completeBtnText}>
                Complete & Claim {quest.xp} ✓
              </AppText>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(5, 7, 15, 0.92)",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  container: {
    backgroundColor: "#11162B",
    borderRadius: 28,
    padding: 22,
    borderWidth: 1.5,
    borderColor: "rgba(129, 140, 248, 0.4)",
    gap: 16,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  topControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  soundBtn: {
    backgroundColor: "rgba(52, 211, 153, 0.14)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(52, 211, 153, 0.35)",
  },
  soundBtnText: {
    color: "#34D399",
    fontSize: 11,
    fontWeight: "700",
  },
  categoryBadge: {
    backgroundColor: "rgba(129, 140, 248, 0.16)",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(129, 140, 248, 0.35)",
  },
  categoryText: {
    color: "#A5B4FC",
    fontSize: 10.5,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#1E2540",
    alignItems: "center",
    justifyContent: "center",
  },
  closeText: {
    color: "#94A3B8",
    fontSize: 15,
    fontWeight: "700",
  },
  headerBlock: {
    alignItems: "center",
    gap: 4,
  },
  questTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#FFFFFF",
    textAlign: "center",
  },
  cueSubtitle: {
    fontSize: 12.5,
    color: "#94A3B8",
    textAlign: "center",
  },
  orbStage: {
    height: 185,
    alignItems: "center",
    justifyContent: "center",
  },
  outerAura: {
    position: "absolute",
    width: 165,
    height: 165,
    borderRadius: 82.5,
    backgroundColor: "rgba(99, 102, 241, 0.28)",
    borderWidth: 1.5,
    borderColor: "#818CF8",
  },
  coreOrb: {
    width: 126,
    height: 126,
    borderRadius: 63,
    backgroundColor: "#1E2647",
    borderWidth: 2,
    borderColor: "#34D399",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  orbEmoji: {
    fontSize: 28,
  },
  timerDigits: {
    fontSize: 21,
    fontWeight: "900",
    color: "#F8FAFC",
    letterSpacing: 1,
  },
  rhythmPill: {
    alignSelf: "center",
    backgroundColor: "rgba(129, 140, 248, 0.14)",
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(129, 140, 248, 0.3)",
  },
  rhythmText: {
    color: "#C7D2FE",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.4,
  },
  promptBox: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 18,
    padding: 15,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    gap: 5,
  },
  promptKicker: {
    fontSize: 9.5,
    fontWeight: "800",
    color: "#FBBF24",
    letterSpacing: 1.2,
  },
  promptText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#F1F5F9",
    textAlign: "center",
    lineHeight: 20,
  },
  controlsRow: {
    flexDirection: "row",
    gap: 10,
  },
  pauseBtn: {
    flex: 1,
    backgroundColor: "#1E2640",
    paddingVertical: 14,
    borderRadius: 18,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#334155",
  },
  pauseBtnText: {
    color: "#E2E8F0",
    fontSize: 13,
    fontWeight: "700",
  },
  completeBtn: {
    flex: 2,
    backgroundColor: "#10B981",
    paddingVertical: 14,
    borderRadius: 18,
    alignItems: "center",
  },
  completeBtnText: {
    color: "#022C22",
    fontSize: 13.5,
    fontWeight: "800",
  },
});
