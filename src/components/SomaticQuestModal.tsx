import React, { useEffect, useState, useRef } from "react";
import {
  View,
  StyleSheet,
  Modal,
  Pressable,
  Animated,
  Easing,
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

export function SomaticQuestModal({
  quest,
  visible,
  onClose,
  onComplete,
}: SomaticQuestModalProps) {
  const [secondsLeft, setSecondsLeft] = useState<number>(120);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [phaseIndex, setPhaseIndex] = useState<number>(0);

  const breathScale = useRef(new Animated.Value(0.85)).current;
  const ringOpacity = useRef(new Animated.Value(0.35)).current;

  useEffect(() => {
    if (quest && visible) {
      setSecondsLeft(quest.durationSeconds);
      setIsRunning(true);
      setPhaseIndex(0);
    } else {
      setIsRunning(false);
    }
  }, [quest, visible]);

  // Breathing / Grounding Orb Animation
  useEffect(() => {
    if (!visible || !isRunning) return;

    const loopAnim = Animated.loop(
      Animated.sequence([
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
        ]),
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
        ]),
      ])
    );

    loopAnim.start();
    return () => loopAnim.stop();
  }, [visible, isRunning]);

  // Countdown Timer & Phase Cycling
  useEffect(() => {
    if (!visible || !isRunning || !quest) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsRunning(false);
          onComplete(quest.id);
          onClose();
          return 0;
        }
        return prev - 1;
      });

      setPhaseIndex((prev) => (prev + 1) % quest.phases.length);
    }, 4500);

    return () => clearInterval(interval);
  }, [visible, isRunning, quest]);

  // 1-second smooth clock tick
  useEffect(() => {
    if (!visible || !isRunning || !quest) return;

    const clock = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(clock);
          setIsRunning(false);
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
    onComplete(quest.id);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Top Bar */}
          <View style={styles.topRow}>
            <View style={styles.categoryBadge}>
              <AppText style={styles.categoryText}>{quest.category}</AppText>
            </View>
            <Pressable onPress={onClose} style={styles.closeBtn} hitSlop={12}>
              <AppText style={styles.closeText}>✕</AppText>
            </Pressable>
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
    gap: 20,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
    height: 200,
    alignItems: "center",
    justifyContent: "center",
  },
  outerAura: {
    position: "absolute",
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: "rgba(99, 102, 241, 0.28)",
    borderWidth: 1.5,
    borderColor: "#818CF8",
  },
  coreOrb: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: "#1E2647",
    borderWidth: 2,
    borderColor: "#34D399",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  orbEmoji: {
    fontSize: 30,
  },
  timerDigits: {
    fontSize: 22,
    fontWeight: "900",
    color: "#F8FAFC",
    letterSpacing: 1,
  },
  promptBox: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 18,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    gap: 6,
  },
  promptKicker: {
    fontSize: 9.5,
    fontWeight: "800",
    color: "#FBBF24",
    letterSpacing: 1.2,
  },
  promptText: {
    fontSize: 14.5,
    fontWeight: "700",
    color: "#F1F5F9",
    textAlign: "center",
    lineHeight: 21,
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
