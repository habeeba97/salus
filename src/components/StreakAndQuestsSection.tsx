import React, { useEffect, useState, useRef } from "react";
import { View, StyleSheet, Pressable, Animated, Easing } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppText } from "./AppText";

interface Quest {
  id: string;
  title: string;
  duration: string;
  xp: string;
  emoji: string;
  category: string;
}

const DAILY_QUESTS: Quest[] = [
  {
    id: "vagal-sigh",
    title: "Physiological Double Sigh",
    duration: "2 mins",
    xp: "+25 Calm",
    emoji: "🌬️",
    category: "Nervous System",
  },
  {
    id: "warm-hydration",
    title: "Mindful Warm Herbal Sip",
    duration: "3 mins",
    xp: "+20 Nourish",
    emoji: "🍵",
    category: "Gut & Vagus",
  },
  {
    id: "sensory-ground",
    title: "5-4-3-2-1 Sensory Anchor",
    duration: "4 mins",
    xp: "+30 Focus",
    emoji: "🌿",
    category: "Grounding",
  },
];

const WEEK_DAYS = ["M", "T", "W", "T", "F", "S", "S"];

export function StreakAndQuestsSection() {
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [streakCount, setStreakCount] = useState<number>(1);
  const mascotFloat = useRef(new Animated.Value(0)).current;

  // Today's index (0 = Mon ... 6 = Sun)
  const jsDay = new Date().getDay();
  const todayIndex = jsDay === 0 ? 6 : jsDay - 1;

  useEffect(() => {
    // Load saved quests for today
    const loadProgress = async () => {
      try {
        const todayKey = new Date().toISOString().split("T")[0];
        const saved = await AsyncStorage.getItem(`salus_quests_${todayKey}`);
        if (saved) {
          setCompletedIds(JSON.parse(saved));
        }
        const savedStreak = await AsyncStorage.getItem("salus_streak_count");
        if (savedStreak) {
          setStreakCount(parseInt(savedStreak, 10));
        }
      } catch (e) {
        // Fallback silently
      }
    };
    loadProgress();

    // Gentle floating animation for Bubbi
    Animated.loop(
      Animated.sequence([
        Animated.timing(mascotFloat, {
          toValue: -6,
          duration: 1600,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(mascotFloat, {
          toValue: 0,
          duration: 1600,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const toggleQuest = async (id: string) => {
    const exists = completedIds.includes(id);
    const updated = exists
      ? completedIds.filter((item) => item !== id)
      : [...completedIds, id];

    setCompletedIds(updated);

    // Update streak if at least 1 quest completed
    const newStreak = updated.length > 0 ? Math.max(1, streakCount) : streakCount;
    setStreakCount(newStreak);

    try {
      const todayKey = new Date().toISOString().split("T")[0];
      await AsyncStorage.setItem(`salus_quests_${todayKey}`, JSON.stringify(updated));
      await AsyncStorage.setItem("salus_streak_count", String(newStreak));
    } catch (e) {
      // Ignore storage errors on private tabs
    }
  };

  const getGreetingMessage = () => {
    const hour = new Date().getHours();
    if (completedIds.length === DAILY_QUESTS.length) {
      return "All daily rituals complete! Your nervous system is deeply grounded today. ✨";
    }
    if (hour < 12) {
      return "Subah bakhair! Let's start slow—pick one gentle ritual to anchor your morning.";
    }
    if (hour < 18) {
      return "Midday check-in: Unclench your jaw, drop your shoulders, and take one slow breath.";
    }
    return "Evening wind-down: Soften the day's noise with a small somatic reset.";
  };

  const progressPercent = Math.round((completedIds.length / DAILY_QUESTS.length) * 100);

  return (
    <View style={styles.wrapper}>
      {/* 1. Top 7-Day Streak Bar */}
      <View style={styles.streakCard}>
        <View style={styles.streakHeader}>
          <View style={styles.streakBadge}>
            <AppText style={styles.flameIcon}>🔥</AppText>
            <AppText style={styles.streakNumber}>{streakCount} Day Streak</AppText>
          </View>
          <AppText style={styles.progressLabel}>
            {completedIds.length}/{DAILY_QUESTS.length} Rituals Done
          </AppText>
        </View>

        <View style={styles.daysRow}>
          {WEEK_DAYS.map((day, idx) => {
            const isToday = idx === todayIndex;
            const isCompleted = isToday && completedIds.length > 0;
            return (
              <View key={idx} style={styles.dayCol}>
                <View
                  style={[
                    styles.dayCircle,
                    isToday && styles.dayCircleToday,
                    isCompleted && styles.dayCircleDone,
                  ]}
                >
                  <AppText
                    style={[
                      styles.dayText,
                      (isToday || isCompleted) && styles.dayTextActive,
                    ]}
                  >
                    {isCompleted ? "✓" : day}
                  </AppText>
                </View>
                {isToday && <View style={styles.todayDot} />}
              </View>
            );
          })}
        </View>
      </View>

      {/* 2. Bubbi Companion Speech Bubble */}
      <View style={styles.companionRow}>
        <Animated.View
          style={[
            styles.bubbiAvatar,
            { transform: [{ translateY: mascotFloat }] },
          ]}
        >
          <AppText style={styles.bubbiEmoji}>🐱</AppText>
        </Animated.View>
        <View style={styles.speechBubble}>
          <AppText style={styles.bubbiName}>BUBBI • COMPANION</AppText>
          <AppText style={styles.speechText}>{getGreetingMessage()}</AppText>
        </View>
      </View>

      {/* 3. Interactive Daily Quests Deck */}
      <View style={styles.questsContainer}>
        <View style={styles.questsHeader}>
          <AppText style={styles.questsTitle}>Today's Somatic Quests</AppText>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
          </View>
        </View>

        {DAILY_QUESTS.map((quest) => {
          const isDone = completedIds.includes(quest.id);
          return (
            <Pressable
              key={quest.id}
              onPress={() => toggleQuest(quest.id)}
              style={({ pressed }) => [
                styles.questCard,
                isDone && styles.questCardDone,
                pressed && styles.questCardPressed,
              ]}
            >
              <View style={styles.questLeft}>
                <View style={[styles.questEmojiBox, isDone && styles.questEmojiBoxDone]}>
                  <AppText style={styles.questEmoji}>{quest.emoji}</AppText>
                </View>
                <View style={styles.questInfo}>
                  <AppText style={styles.questCategory}>{quest.category}</AppText>
                  <AppText style={[styles.questTitle, isDone && styles.questTitleDone]}>
                    {quest.title}
                  </AppText>
                  <AppText style={styles.questMeta}>
                    ⏱ {quest.duration} • <AppText style={styles.xpHighlight}>{quest.xp}</AppText>
                  </AppText>
                </View>
              </View>

              <View style={[styles.checkCircle, isDone && styles.checkCircleDone]}>
                {isDone && <AppText style={styles.checkMark}>✓</AppText>}
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
    paddingHorizontal: 16,
    gap: 14,
  },
  streakCard: {
    backgroundColor: "rgba(19, 23, 42, 0.82)",
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(251, 191, 36, 0.3)",
  },
  streakHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  streakBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(251, 191, 36, 0.14)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 5,
  },
  flameIcon: {
    fontSize: 14,
  },
  streakNumber: {
    color: "#FBBF24",
    fontSize: 12.5,
    fontWeight: "800",
  },
  progressLabel: {
    color: "#94A3B8",
    fontSize: 11.5,
    fontWeight: "700",
  },
  daysRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dayCol: {
    alignItems: "center",
    gap: 5,
  },
  dayCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  dayCircleToday: {
    borderColor: "#FBBF24",
    borderWidth: 1.5,
    backgroundColor: "rgba(251, 191, 36, 0.12)",
  },
  dayCircleDone: {
    backgroundColor: "#10B981",
    borderColor: "#34D399",
  },
  dayText: {
    color: "#94A3B8",
    fontSize: 12,
    fontWeight: "700",
  },
  dayTextActive: {
    color: "#FFFFFF",
    fontWeight: "900",
  },
  todayDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#FBBF24",
  },
  companionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  bubbiAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#FCD34D",
    borderWidth: 2,
    borderColor: "#FEF08A",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#FBBF24",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
  },
  bubbiEmoji: {
    fontSize: 28,
  },
  speechBubble: {
    flex: 1,
    backgroundColor: "rgba(30, 35, 62, 0.85)",
    borderRadius: 18,
    borderTopLeftRadius: 4,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "rgba(129, 140, 248, 0.3)",
  },
  bubbiName: {
    fontSize: 9.5,
    fontWeight: "800",
    color: "#A5B4FC",
    letterSpacing: 1,
    marginBottom: 2,
  },
  speechText: {
    fontSize: 12.5,
    color: "#F1F5F9",
    lineHeight: 18,
  },
  questsContainer: {
    gap: 10,
  },
  questsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 2,
  },
  questsTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#F8FAFC",
  },
  progressBarBg: {
    width: 90,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#10B981",
    borderRadius: 3,
  },
  questCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(19, 23, 40, 0.82)",
    borderRadius: 18,
    padding: 13,
    borderWidth: 1,
    borderColor: "rgba(99, 102, 241, 0.28)",
  },
  questCardDone: {
    backgroundColor: "rgba(16, 185, 129, 0.1)",
    borderColor: "rgba(16, 185, 129, 0.45)",
  },
  questCardPressed: {
    transform: [{ scale: 0.98 }],
  },
  questLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  questEmojiBox: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "rgba(255, 255, 255, 0.07)",
    alignItems: "center",
    justifyContent: "center",
  },
  questEmojiBoxDone: {
    backgroundColor: "rgba(16, 185, 129, 0.2)",
  },
  questEmoji: {
    fontSize: 20,
  },
  questInfo: {
    flex: 1,
  },
  questCategory: {
    fontSize: 9.5,
    fontWeight: "800",
    color: "#818CF8",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  questTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
    marginTop: 1,
  },
  questTitleDone: {
    textDecorationLine: "line-through",
    color: "#94A3B8",
  },
  questMeta: {
    fontSize: 11,
    color: "#94A3B8",
    marginTop: 2,
  },
  xpHighlight: {
    color: "#34D399",
    fontWeight: "700",
  },
  checkCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: "#475569",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  checkCircleDone: {
    backgroundColor: "#10B981",
    borderColor: "#10B981",
  },
  checkMark: {
    color: "#022C22",
    fontSize: 13,
    fontWeight: "900",
  },
});
