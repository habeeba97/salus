import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, Pressable } from "react-native";
import { Screen } from "../../src/components/Screen";
import { AppText } from "../../src/components/AppText";
import { IndianNourishSection } from "../../src/components/IndianNourishSection";
import { SanctuaryProfileSetupCard } from "../../src/components/SanctuaryProfileSetupCard";

interface SomaticExercise {
  id: string;
  emoji: string;
  title: string;
  durationSec: number;
  target: string;
  steps: string[];
}

const SOMATIC_EXERCISES: SomaticExercise[] = [
  {
    id: "sun-salutation",
    emoji: "🌅",
    title: "Slow Sun Salutation & Vagal Reach",
    durationSec: 180,
    target: "Spine Decompression & Morning Cortisol Balance",
    steps: [
      "Stand tall with feet hip-width apart; inhale deeply while sweeping both arms overhead.",
      "Exhale slowly for 6 seconds as you fold forward with soft knees, letting neck and jaw hang loose.",
      "Inhale halfway up with a flat back, then step back into a gentle low lunge and hold for 3 slow breaths.",
    ],
  },
  {
    id: "neck-jaw-release",
    emoji: "🧘",
    title: "Vagus Nerve Neck & Eye-Tracking Reset",
    durationSec: 120,
    target: "Cranial Nerve X & Screen Fatigue Relief",
    steps: [
      "Interlace fingers behind your head while keeping your face forward.",
      "Shift only your eyes all the way to the right for 30 seconds until a natural sigh or yawn triggers.",
      "Return eyes to center, take one slow breath, and repeat looking all the way to the left for 30 seconds.",
    ],
  },
  {
    id: "somatic-shake",
    emoji: "⚡",
    title: "Neurogenic Somatic Shake & Shoulder Drop",
    durationSec: 150,
    target: "Discharge Trapped Adrenaline & Chest Tightness",
    steps: [
      "Bounce lightly through your heels and knees while letting shoulders and wrists shake loosely.",
      "Take two quick inhales through the nose followed by an audible 'haaa' sigh out the mouth.",
      "Stand completely still for 30 seconds and feel the warm tingling sensation settle in your hands.",
    ],
  },
  {
    id: "legs-up-wall",
    emoji: "🌙",
    title: "Viparita Karani (Legs-Up-The-Wall)",
    durationSec: 300,
    target: "Parasympathetic Downshift & Deep Sleep Prep",
    steps: [
      "Lie on your back with hips close to a wall and rest both legs vertically upward.",
      "Place one hand on your lower belly and one on your heart; breathe into a 4-second inhale, 7-second exhale.",
      "Allow lower back and pelvic floor muscles to completely soften into the floor.",
    ],
  },
];

export default function LearnScreen() {
  const [activeExercise, setActiveExercise] = useState<SomaticExercise | null>(null);
  const [secondsLeft, setSecondsLeft] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  useEffect(() => {
    if (!isRunning || secondsLeft <= 0) return;
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isRunning, secondsLeft]);

  const startExercise = (ex: SomaticExercise) => {
    setActiveExercise(ex);
    setSecondsLeft(ex.durationSec);
    setIsRunning(true);
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <Screen style={styles.screenBg}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <AppText style={styles.kicker}>MOVEMENT • NUTRITION • WISDOM</AppText>
          <AppText style={styles.title}>Somatic Movement & Nourish</AppText>
          <AppText style={styles.subtitle}>
            Guided somatic exercises & Pan-India healing recipes for nervous system balance.
          </AppText>
        </View>

        {/* Personalized Somatic Plan Blueprint */}
        <SanctuaryProfileSetupCard />

        {/* Active Guided Exercise Timer Card */}
        {activeExercise && (
          <View style={styles.activeTimerCard}>
            <View style={styles.timerTopRow}>
              <View style={{ flex: 1 }}>
                <AppText style={styles.timerKicker}>GUIDED PRACTICE ACTIVE</AppText>
                <AppText style={styles.timerTitle}>
                  {activeExercise.emoji} {activeExercise.title}
                </AppText>
              </View>
              <AppText style={styles.timerClock}>{formatTime(secondsLeft)}</AppText>
            </View>

            <View style={styles.stepsList}>
              {activeExercise.steps.map((step, idx) => (
                <AppText key={idx} style={styles.stepItem}>
                  {idx + 1}. {step}
                </AppText>
              ))}
            </View>

            <View style={styles.timerControls}>
              <Pressable
                onPress={() => setIsRunning((r) => !r)}
                style={styles.timerPrimaryBtn}
              >
                <AppText style={styles.timerPrimaryText}>
                  {isRunning ? "❚❚ Pause" : "▶ Resume"}
                </AppText>
              </Pressable>

              <Pressable
                onPress={() => {
                  setIsRunning(false);
                  setActiveExercise(null);
                }}
                style={styles.timerCloseBtn}
              >
                <AppText style={styles.timerCloseText}>✕ Close</AppText>
              </Pressable>
            </View>
          </View>
        )}

        {/* Section 1: Somatic Exercises & Movement Flows */}
        <View style={styles.sectionBlock}>
          <AppText style={styles.sectionKicker}>SOMATIC MOVEMENT & EXERCISES</AppText>
          <AppText style={styles.sectionHeading}>Guided Body Resets</AppText>

          <View style={styles.exerciseList}>
            {SOMATIC_EXERCISES.map((ex) => {
              const isCurrent = activeExercise?.id === ex.id;
              return (
                <Pressable
                  key={ex.id}
                  onPress={() => startExercise(ex)}
                  style={[styles.exerciseCard, isCurrent && styles.exerciseCardActive]}
                >
                  <View style={styles.exOrb}>
                    <AppText style={{ fontSize: 22 }}>{ex.emoji}</AppText>
                  </View>
                  <View style={{ flex: 1, gap: 2 }}>
                    <AppText style={styles.exTitle}>{ex.title}</AppText>
                    <AppText style={styles.exTarget}>{ex.target}</AppText>
                  </View>
                  <View style={styles.durationPill}>
                    <AppText style={styles.durationText}>
                      {Math.round(ex.durationSec / 60)}m ▶
                    </AppText>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Section 2: Pan-India Wholesome Nourishment Recipes */}
        <IndianNourishSection />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screenBg: { backgroundColor: "#070811" },
  scroll: { paddingBottom: 44, gap: 18 },
  header: { paddingTop: 10, paddingHorizontal: 16, gap: 4 },
  kicker: { fontSize: 10, fontWeight: "800", color: "#38BDF8", letterSpacing: 1.4 },
  title: { fontSize: 23, fontWeight: "800", color: "#F8FAFC" },
  subtitle: { fontSize: 12, color: "#94A3B8", lineHeight: 17 },
  activeTimerCard: {
    marginHorizontal: 16,
    backgroundColor: "rgba(16, 185, 129, 0.14)",
    borderRadius: 22,
    padding: 16,
    borderWidth: 1.5,
    borderColor: "#34D399",
    gap: 12,
  },
  timerTopRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  timerKicker: {
    fontSize: 9,
    fontWeight: "900",
    color: "#34D399",
    letterSpacing: 1.1,
  },
  timerTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#FFFFFF",
    marginTop: 2,
  },
  timerClock: {
    fontSize: 22,
    fontWeight: "900",
    color: "#34D399",
  },
  stepsList: {
    gap: 6,
    backgroundColor: "rgba(7, 10, 22, 0.6)",
    padding: 12,
    borderRadius: 14,
  },
  stepItem: {
    fontSize: 12,
    color: "#E2E8F0",
    lineHeight: 17,
  },
  timerControls: {
    flexDirection: "row",
    gap: 10,
  },
  timerPrimaryBtn: {
    flex: 1,
    backgroundColor: "#34D399",
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
  },
  timerPrimaryText: {
    color: "#022C22",
    fontSize: 12.5,
    fontWeight: "900",
  },
  timerCloseBtn: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    justifyContent: "center",
  },
  timerCloseText: {
    color: "#E2E8F0",
    fontSize: 12,
    fontWeight: "700",
  },
  sectionBlock: {
    paddingHorizontal: 16,
    gap: 8,
  },
  sectionKicker: {
    fontSize: 9.5,
    fontWeight: "800",
    color: "#F472B6",
    letterSpacing: 1.2,
  },
  sectionHeading: {
    fontSize: 17,
    fontWeight: "800",
    color: "#F8FAFC",
    marginBottom: 2,
  },
  exerciseList: {
    gap: 10,
  },
  exerciseCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(19, 23, 42, 0.85)",
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(129, 140, 248, 0.28)",
    gap: 12,
  },
  exerciseCardActive: {
    borderColor: "#34D399",
    backgroundColor: "rgba(16, 185, 129, 0.12)",
  },
  exOrb: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(30, 41, 59, 0.9)",
    alignItems: "center",
    justifyContent: "center",
  },
  exTitle: {
    fontSize: 13.5,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  exTarget: {
    fontSize: 11,
    color: "#94A3B8",
    lineHeight: 15,
  },
  durationPill: {
    backgroundColor: "rgba(56, 189, 248, 0.18)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(56, 189, 248, 0.4)",
  },
  durationText: {
    color: "#38BDF8",
    fontSize: 11,
    fontWeight: "800",
  },
});
