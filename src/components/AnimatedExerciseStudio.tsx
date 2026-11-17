import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, Pressable, Platform } from "react-native";
import { AppText } from "./AppText";

export type StudioAudience = "kids" | "adults";
export type ExerciseMoveId =
  | "windmill"
  | "side_bends"
  | "high_march"
  | "jumping_jacks"
  | "punches"
  | "squat_kick"
  | "arm_circles"
  | "mountain_climber";

export interface ExerciseItem {
  id: ExerciseMoveId;
  audience: StudioAudience;
  emoji: string;
  title: string;
  targetMuscles: string;
  highlightZone: "shoulders" | "core" | "legs" | "full";
  durationSec: number;
  targetReps: number;
}

export const STUDIO_EXERCISES: ExerciseItem[] = [
  // KIDS ZONE EXERCISES
  {
    id: "windmill",
    audience: "kids",
    emoji: "🌀",
    title: "The Windmill",
    targetMuscles: "Shoulders, Arms & Spine Twist",
    highlightZone: "shoulders",
    durationSec: 40,
    targetReps: 20,
  },
  {
    id: "side_bends",
    audience: "kids",
    emoji: "🌈",
    title: "Rainbow Side Bends",
    targetMuscles: "Side Core & Flexibility",
    highlightZone: "core",
    durationSec: 40,
    targetReps: 20,
  },
  {
    id: "high_march",
    audience: "kids",
    emoji: "🦸",
    title: "High Step Hero March",
    targetMuscles: "Legs, Balance & Heart",
    highlightZone: "legs",
    durationSec: 40,
    targetReps: 20,
  },
  {
    id: "jumping_jacks",
    audience: "kids",
    emoji: "⭐",
    title: "Star Jumping Jacks",
    targetMuscles: "Full Body Energy Burst",
    highlightZone: "full",
    durationSec: 40,
    targetReps: 20,
  },
  {
    id: "punches",
    audience: "kids",
    emoji: "🥊",
    title: "Power Punches",
    targetMuscles: "Arms, Shoulders & Focus",
    highlightZone: "shoulders",
    durationSec: 40,
    targetReps: 20,
  },

  // ADULTS ANATOMICAL STUDIO EXERCISES
  {
    id: "arm_circles",
    audience: "adults",
    emoji: "🔥",
    title: "Lateral Arm Circles",
    targetMuscles: "Deltoids, Upper Back & Neck Release",
    highlightZone: "shoulders",
    durationSec: 45,
    targetReps: 20,
  },
  {
    id: "squat_kick",
    audience: "adults",
    emoji: "🦵",
    title: "Squat & Front Kick",
    targetMuscles: "Glutes, Quadriceps & Core",
    highlightZone: "legs",
    durationSec: 45,
    targetReps: 16,
  },
  {
    id: "side_bends",
    audience: "adults",
    emoji: "⚡",
    title: "Standing Oblique Reach",
    targetMuscles: "Obliques, Lats & Thoracic Spine",
    highlightZone: "core",
    durationSec: 45,
    targetReps: 20,
  },
  {
    id: "mountain_climber",
    audience: "adults",
    emoji: "🏔️",
    title: "Standing Cross Climbers",
    targetMuscles: "Full Body Cardio & Abs",
    highlightZone: "full",
    durationSec: 45,
    targetReps: 24,
  },
];

// Crisp Countdown & Rep Beep Synthesizer
function playStudioBeep(freq = 660, duration = 0.09) {
  if (Platform.OS !== "web" || typeof window === "undefined") return;
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0.06, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration + 0.02);
  } catch {}
}

function ExerciseAnimationCanvas({
  exercise,
  isPlaying,
  countdown,
  secondsLeft,
  totalDuration,
  repCount,
}: {
  exercise: ExerciseItem;
  isPlaying: boolean;
  countdown: number;
  secondsLeft: number;
  totalDuration: number;
  repCount: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (Platform.OS !== "web") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let t = 0;

    const drawLimb = (
      x1: number,
      y1: number,
      x2: number,
      y2: number,
      r1: number,
      r2: number,
      color: string
    ) => {
      ctx.strokeStyle = color;
      ctx.lineCap = "round";
      const steps = 10;
      for (let i = 0; i <= steps; i++) {
        const u = i / steps;
        const px = x1 + (x2 - x1) * u;
        const py = y1 + (y2 - y1) * u;
        const rad = r1 + (r2 - r1) * u;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(px, py, rad, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const render = () => {
      const dpr = typeof window !== "undefined" ? Math.min(window.devicePixelRatio || 1, 2) : 1;
      const rect = canvas.getBoundingClientRect();
      const w = rect.width || 340;
      const h = rect.height || 260;

      if (canvas.width !== Math.floor(w * dpr) || canvas.height !== Math.floor(h * dpr)) {
        canvas.width = Math.floor(w * dpr);
        canvas.height = Math.floor(h * dpr);
      }

      ctx.save();
      ctx.scale(dpr, dpr);

      if (isPlaying && countdown === 0) {
        t += 0.065;
      } else {
        t += 0.015;
      }

      const isKids = exercise.audience === "kids";

      // 1. Studio Background
      const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
      if (isKids) {
        bgGrad.addColorStop(0, "#1E1B4B");
        bgGrad.addColorStop(1, "#312E81");
      } else {
        bgGrad.addColorStop(0, "#090D16");
        bgGrad.addColorStop(1, "#161E31");
      }
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      // Subtle Studio Perspective Grid Floor
      ctx.strokeStyle = isKids ? "rgba(251, 191, 36, 0.14)" : "rgba(56, 189, 248, 0.12)";
      ctx.lineWidth = 1;
      const floorY = h * 0.78;
      ctx.beginPath();
      ctx.moveTo(0, floorY);
      ctx.lineTo(w, floorY);
      ctx.stroke();

      // Floor Shadow
      const cx = w * 0.52;
      const cy = h * 0.46;
      const jumpOffset =
        exercise.id === "jumping_jacks" ? Math.abs(Math.sin(t * 2)) * -18 : 0;

      ctx.fillStyle = "rgba(0, 0, 0, 0.38)";
      ctx.beginPath();
      ctx.ellipse(cx, floorY + 14, 42, 9, 0, 0, Math.PI * 2);
      ctx.fill();

      // 2. Calculate Joint Positions for Each Exercise
      const wave = Math.sin(t * 2);
      const waveCos = Math.cos(t * 2);

      let torsoTilt = 0;
      let hipY = 14 + jumpOffset;
      let lShoulder = { x: -18, y: -26 + jumpOffset };
      let rShoulder = { x: 18, y: -26 + jumpOffset };
      let lHand = { x: -34, y: 12 + jumpOffset };
      let rHand = { x: 34, y: 12 + jumpOffset };
      let lFoot = { x: -18, y: 76 };
      let rFoot = { x: 18, y: 76 };
      let lKnee = { x: -20, y: 46 };
      let rKnee = { x: 20, y: 46 };

      if (exercise.id === "windmill") {
        torsoTilt = wave * 0.45;
        lHand = { x: -46 + wave * 28, y: -42 + Math.abs(wave) * 52 };
        rHand = { x: 46 + wave * 28, y: -12 - Math.abs(wave) * 32 };
      } else if (exercise.id === "side_bends") {
        torsoTilt = wave * 0.34;
        lHand = { x: -26 + wave * 24, y: -62 + wave * 12 };
        rHand = { x: 28 + wave * 10, y: 16 };
      } else if (exercise.id === "high_march" || exercise.id === "mountain_climber") {
        const leftLift = Math.max(0, wave);
        const rightLift = Math.max(0, -wave);
        lKnee = { x: -20, y: 46 - leftLift * 28 };
        lFoot = { x: -20, y: 76 - leftLift * 34 };
        rKnee = { x: 20, y: 46 - rightLift * 28 };
        rFoot = { x: 20, y: 76 - rightLift * 34 };
        lHand = { x: -30, y: -10 - rightLift * 34 };
        rHand = { x: 30, y: -10 - leftLift * 34 };
      } else if (exercise.id === "jumping_jacks") {
        const spread = (wave + 1) * 0.5;
        lFoot = { x: -16 - spread * 24, y: 76 + jumpOffset * 0.4 };
        rFoot = { x: 16 + spread * 24, y: 76 + jumpOffset * 0.4 };
        lKnee = { x: -17 - spread * 12, y: 46 + jumpOffset * 0.6 };
        rKnee = { x: 17 + spread * 12, y: 46 + jumpOffset * 0.6 };
        lHand = { x: -36 + spread * 18, y: 10 - spread * 72 + jumpOffset };
        rHand = { x: 36 - spread * 18, y: 10 - spread * 72 + jumpOffset };
      } else if (exercise.id === "punches") {
        const punchL = Math.max(0, wave);
        const punchR = Math.max(0, -wave);
        torsoTilt = wave * 0.12;
        lHand = { x: -22 - punchL * 28, y: -22 - punchL * 6 };
        rHand = { x: 22 + punchR * 28, y: -22 - punchR * 6 };
      } else if (exercise.id === "arm_circles") {
        lHand = { x: -46 + waveCos * 10, y: -26 + wave * 16 };
        rHand = { x: 46 - waveCos * 10, y: -26 + wave * 16 };
      } else if (exercise.id === "squat_kick") {
        const squatPhase = Math.max(0, wave);
        const kickPhase = Math.max(0, -wave);
        hipY = 14 + squatPhase * 22;
        lShoulder.y = -26 + squatPhase * 22;
        rShoulder.y = -26 + squatPhase * 22;
        lKnee = { x: -26, y: 46 + squatPhase * 10 };
        rKnee = { x: 24, y: 46 - kickPhase * 22 };
        rFoot = { x: 24 + kickPhase * 34, y: 76 - kickPhase * 42 };
        lHand = { x: -26, y: -14 + squatPhase * 12 };
        rHand = { x: 26, y: -14 + squatPhase * 12 };
      }

      // 3. Draw Character (Kids Robo-Coach vs Adults Anatomical Muscle-Glow Athlete)
      ctx.save();
      ctx.translate(cx, cy);

      const baseLimbColor = isKids ? "#F8FAFC" : "#64748B";
      const muscleGlowColor = "#F43F5E"; // Anatomical red muscle highlight!
      const pulseAlpha = 0.55 + 0.45 * Math.abs(Math.sin(t * 3));

      const legColor =
        !isKids && (exercise.highlightZone === "legs" || exercise.highlightZone === "full")
          ? `rgba(244, 63, 94, ${pulseAlpha.toFixed(2)})`
          : baseLimbColor;

      const armColor =
        !isKids && (exercise.highlightZone === "shoulders" || exercise.highlightZone === "full")
          ? `rgba(244, 63, 94, ${pulseAlpha.toFixed(2)})`
          : isKids
          ? "#38BDF8"
          : baseLimbColor;

      const torsoColor =
        !isKids && (exercise.highlightZone === "core" || exercise.highlightZone === "full")
          ? `rgba(244, 63, 94, ${pulseAlpha.toFixed(2)})`
          : isKids
          ? "#FBBF24"
          : "#475569";

      // Legs
      drawLimb(-10, hipY, lKnee.x, lKnee.y, 9, 7.5, legColor);
      drawLimb(lKnee.x, lKnee.y, lFoot.x, lFoot.y, 7.5, 6, legColor);
      drawLimb(10, hipY, rKnee.x, rKnee.y, 9, 7.5, legColor);
      drawLimb(rKnee.x, rKnee.y, rFoot.x, rFoot.y, 7.5, 6, legColor);

      // Torso & Head
      ctx.save();
      ctx.rotate(torsoTilt);

      drawLimb(0, hipY, 0, -28 + jumpOffset, 15, 19, torsoColor);

      // Anatomical Muscle Core Indicator for Adults
      if (!isKids) {
        ctx.fillStyle = muscleGlowColor;
        ctx.shadowColor = muscleGlowColor;
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(0, -10 + jumpOffset, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Arms
      drawLimb(lShoulder.x, lShoulder.y, lHand.x, lHand.y, 7.5, 5.5, armColor);
      drawLimb(rShoulder.x, rShoulder.y, rHand.x, rHand.y, 7.5, 5.5, armColor);

      // Head
      if (isKids) {
        // Cute Junior Robo-Coach Visor Head
        ctx.fillStyle = "#FFFFFF";
        ctx.beginPath();
        ctx.roundRect(-22, -62 + jumpOffset, 44, 30, 12);
        ctx.fill();

        ctx.fillStyle = "#0F172A";
        ctx.beginPath();
        ctx.roundRect(-17, -57 + jumpOffset, 34, 20, 8);
        ctx.fill();

        // Happy glowing eyes
        ctx.strokeStyle = "#34D399";
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(-7, -47 + jumpOffset, 4, 1.1 * Math.PI, 1.9 * Math.PI);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(7, -47 + jumpOffset, 4, 1.1 * Math.PI, 1.9 * Math.PI);
        ctx.stroke();
      } else {
        // Sleek Athletic Head Silhouette
        ctx.fillStyle = "#94A3B8";
        ctx.beginPath();
        ctx.arc(0, -48 + jumpOffset, 13, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
      ctx.restore();

      // 4. FitOn-Style Bottom-Left Circular Pie Timer HUD
      const ringX = 44;
      const ringY = h - 42;
      const ringR = 24;
      const progress = totalDuration > 0 ? secondsLeft / totalDuration : 0;

      ctx.fillStyle = "rgba(15, 23, 42, 0.85)";
      ctx.beginPath();
      ctx.arc(ringX, ringY, ringR + 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(ringX, ringY, ringR, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = isKids ? "#FBBF24" : "#38BDF8";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(
        ringX,
        ringY,
        ringR,
        -Math.PI / 2,
        -Math.PI / 2 + Math.PI * 2 * progress
      );
      ctx.stroke();

      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 12px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(`${secondsLeft}s`, ringX, ringY);

      // 5. Top-Right Rep Counter Badge (Little Sports / Roberta Style)
      ctx.fillStyle = "rgba(15, 23, 42, 0.84)";
      ctx.beginPath();
      ctx.roundRect(w - 92, 14, 78, 34, 12);
      ctx.fill();

      ctx.fillStyle = isKids ? "#FBBF24" : "#F43F5E";
      ctx.font = "bold 14px sans-serif";
      ctx.fillText(`${repCount} / ${exercise.targetReps}`, w - 53, 31);

      // 6. 5-4-3-2-1 Ready Countdown Overlay
      if (countdown > 0) {
        ctx.fillStyle = "rgba(7, 10, 22, 0.72)";
        ctx.fillRect(0, 0, w, h);

        ctx.fillStyle = "#FBBF24";
        ctx.font = "bold 13px sans-serif";
        ctx.fillText("GET READY", w / 2, h / 2 - 34);

        ctx.fillStyle = "#FFFFFF";
        ctx.font = "bold 54px sans-serif";
        ctx.fillText(`${countdown}`, w / 2, h / 2 + 12);
      }

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [exercise, isPlaying, countdown, secondsLeft, totalDuration, repCount]);

  if (Platform.OS !== "web") {
    return (
      <View style={styles.nativeBox}>
        <AppText style={{ fontSize: 44 }}>{exercise.emoji}</AppText>
      </View>
    );
  }

  return (
    <canvas
      ref={canvasRef}
      style={{ width: "100%", height: "100%", display: "block" }}
    />
  );
}

export function AnimatedExerciseStudio() {
  const [audience, setAudience] = useState<StudioAudience>("kids");
  const filteredExercises = STUDIO_EXERCISES.filter((e) => e.audience === audience);

  const [selectedId, setSelectedId] = useState<string>(filteredExercises[0].id);
  const activeExercise =
    filteredExercises.find((e) => e.id === selectedId) || filteredExercises[0];

  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [countdown, setCountdown] = useState<number>(0);
  const [secondsLeft, setSecondsLeft] = useState<number>(activeExercise.durationSec);
  const [repCount, setRepCount] = useState<number>(1);
  const [caloriesBurned, setCaloriesBurned] = useState<number>(12);

  // Switch Kids / Adults Audience
  const handleSwitchAudience = (nextAudience: StudioAudience) => {
    setAudience(nextAudience);
    const first = STUDIO_EXERCISES.find((e) => e.audience === nextAudience)!;
    setSelectedId(first.id);
    setSecondsLeft(first.durationSec);
    setRepCount(1);
    setCountdown(3);
    setIsPlaying(true);
  };

  // Select specific exercise with 3-2-1 countdown
  const handleSelectExercise = (ex: ExerciseItem) => {
    setSelectedId(ex.id);
    setSecondsLeft(ex.durationSec);
    setRepCount(1);
    setCountdown(3);
    setIsPlaying(true);
    playStudioBeep(520, 0.08);
  };

  // Master Workout Timer & Rep Pacer
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      if (countdown > 0) {
        setCountdown((c) => {
          if (c > 1) playStudioBeep(540, 0.08);
          else playStudioBeep(880, 0.16);
          return c - 1;
        });
        return;
      }

      setSecondsLeft((sec) => {
        if (sec <= 1) {
          // Auto-advance to next exercise in list!
          const idx = filteredExercises.findIndex((e) => e.id === activeExercise.id);
          const nextEx = filteredExercises[(idx + 1) % filteredExercises.length];
          setSelectedId(nextEx.id);
          setRepCount(1);
          setCountdown(3);
          return nextEx.durationSec;
        }
        return sec - 1;
      });

      setRepCount((r) => (r < activeExercise.targetReps ? r + 1 : 1));
      setCaloriesBurned((cal) => cal + 1);
    }, 1100);

    return () => clearInterval(interval);
  }, [isPlaying, countdown, activeExercise, filteredExercises]);

  return (
    <View style={styles.wrapper}>
      {/* Top Audience Mode Toggle: Kids vs Adults */}
      <View style={styles.audienceRow}>
        <Pressable
          onPress={() => handleSwitchAudience("kids")}
          style={[styles.audienceTab, audience === "kids" && styles.audienceTabKids]}
        >
          <AppText style={[styles.audienceText, audience === "kids" && styles.audienceTextActive]}>
            🧒 Kids Fun Workout
          </AppText>
        </Pressable>

        <Pressable
          onPress={() => handleSwitchAudience("adults")}
          style={[styles.audienceTab, audience === "adults" && styles.audienceTabAdults]}
        >
          <AppText style={[styles.audienceText, audience === "adults" && styles.audienceTextActive]}>
            💪 Adults Muscle Studio
          </AppText>
        </Pressable>
      </View>

      {/* Main 60fps Animated Exercise Stage */}
      <View style={styles.stageCard}>
        <ExerciseAnimationCanvas
          exercise={activeExercise}
          isPlaying={isPlaying}
          countdown={countdown}
          secondsLeft={secondsLeft}
          totalDuration={activeExercise.durationSec}
          repCount={repCount}
        />

        {/* Top Left Live Label */}
        <View style={styles.stageTopBadge}>
          <AppText style={styles.stageBadgeText}>
            {audience === "kids" ? "JUNIOR ROBO-COACH" : "ANATOMICAL MUSCLE GLOW"}
          </AppText>
        </View>

        {/* FitOn-Style Bottom HUD Bar */}
        <View style={styles.hudBar}>
          <View style={{ flex: 1, paddingLeft: 66 }}>
            <AppText style={styles.hudTitle}>{activeExercise.title}</AppText>
            <AppText style={styles.hudSub}>{activeExercise.targetMuscles}</AppText>
          </View>

          <View style={styles.hudMetrics}>
            <AppText style={styles.hudMetricVal}>🔥 {caloriesBurned}</AppText>
            <AppText style={styles.hudMetricLabel}>KCAL</AppText>
          </View>

          <Pressable
            onPress={() => setIsPlaying((p) => !p)}
            style={styles.hudPlayBtn}
          >
            <AppText style={styles.hudPlayText}>{isPlaying ? "❚❚" : "▶"}</AppText>
          </Pressable>
        </View>
      </View>

      {/* Exercise Selector Pills */}
      <View style={styles.moveGrid}>
        {filteredExercises.map((ex) => {
          const active = ex.id === activeExercise.id;
          return (
            <Pressable
              key={ex.id}
              onPress={() => handleSelectExercise(ex)}
              style={[styles.movePill, active && styles.movePillActive]}
            >
              <AppText style={styles.moveEmoji}>{ex.emoji}</AppText>
              <View style={{ flex: 1 }}>
                <AppText style={[styles.moveTitle, active && styles.moveTitleActive]}>
                  {ex.title}
                </AppText>
                <AppText style={styles.moveReps}>{ex.targetReps} Reps • {ex.durationSec}s</AppText>
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 12,
  },
  audienceRow: {
    flexDirection: "row",
    gap: 10,
  },
  audienceTab: {
    flex: 1,
    backgroundColor: "rgba(19, 23, 42, 0.85)",
    paddingVertical: 11,
    borderRadius: 16,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  audienceTabKids: {
    borderColor: "#FBBF24",
    backgroundColor: "rgba(251, 191, 36, 0.16)",
  },
  audienceTabAdults: {
    borderColor: "#F43F5E",
    backgroundColor: "rgba(244, 63, 94, 0.16)",
  },
  audienceText: {
    color: "#94A3B8",
    fontSize: 12.5,
    fontWeight: "800",
  },
  audienceTextActive: {
    color: "#FFFFFF",
  },
  stageCard: {
    height: 270,
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: 1.5,
    borderColor: "rgba(56, 189, 248, 0.4)",
    backgroundColor: "#090D16",
    position: "relative",
  },
  nativeBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  stageTopBadge: {
    position: "absolute",
    top: 14,
    left: 14,
    backgroundColor: "rgba(7, 10, 22, 0.78)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
  },
  stageBadgeText: {
    color: "#38BDF8",
    fontSize: 9.5,
    fontWeight: "900",
    letterSpacing: 0.8,
  },
  hudBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(7, 10, 22, 0.78)",
    paddingVertical: 10,
    paddingRight: 12,
    gap: 10,
  },
  hudTitle: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },
  hudSub: {
    color: "#94A3B8",
    fontSize: 10.5,
  },
  hudMetrics: {
    alignItems: "center",
    paddingHorizontal: 6,
  },
  hudMetricVal: {
    color: "#FBBF24",
    fontSize: 12,
    fontWeight: "900",
  },
  hudMetricLabel: {
    color: "#94A3B8",
    fontSize: 8.5,
    fontWeight: "800",
  },
  hudPlayBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#38BDF8",
    alignItems: "center",
    justifyContent: "center",
  },
  hudPlayText: {
    color: "#082F49",
    fontSize: 11,
    fontWeight: "900",
  },
  moveGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  movePill: {
    width: "48.7%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(19, 23, 42, 0.84)",
    padding: 11,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    gap: 8,
  },
  movePillActive: {
    borderColor: "#38BDF8",
    backgroundColor: "rgba(56, 189, 248, 0.14)",
  },
  moveEmoji: {
    fontSize: 20,
  },
  moveTitle: {
    color: "#E2E8F0",
    fontSize: 12,
    fontWeight: "800",
  },
  moveTitleActive: {
    color: "#FFFFFF",
  },
  moveReps: {
    color: "#94A3B8",
    fontSize: 10,
    marginTop: 1,
  },
});
