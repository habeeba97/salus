import React, { useState, useCallback } from "react";
import { View, StyleSheet, ScrollView, Pressable } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRouter } from "expo-router";
import { AppText } from "../../src/components/AppText";
import { Screen } from "../../src/components/Screen";
import { Ambient3DBackground } from "../../src/components/Ambient3DBackground";

interface DayHistory {
  dateStr: string;
  dayShort: string;
  moodId: string | null;
  questsDone: number;
}

const MOOD_META: Record<string, { label: string; emoji: string; accent: string }> = {
  wired: { label: "Wired", emoji: "⚡", accent: "#F43F5E" },
  foggy: { label: "Foggy", emoji: "🌫️", accent: "#A855F7" },
  tender: { label: "Tender", emoji: "🫧", accent: "#FBBF24" },
  grounded: { label: "Grounded", emoji: "🌿", accent: "#10B981" },
};

const LEVELS = [
  { minXp: 0, title: "Seed of Stillness", badge: "🌱" },
  { minXp: 75, title: "Vagal Explorer", badge: "🦋" },
  { minXp: 200, title: "Somatic Alchemist", badge: "✨" },
  { minXp: 400, title: "Sanctuary Keeper", badge: "🪷" },
  { minXp: 700, title: "Nervous System Sovereign", badge: "👑" },
];

export default function MeScreen() {
  const router = useRouter();
  const [streakCount, setStreakCount] = useState<number>(1);
  const [totalRituals, setTotalRituals] = useState<number>(0);
  const [calmXp, setCalmXp] = useState<number>(25);
  const [history, setHistory] = useState<DayHistory[]>([]);

  useFocusEffect(
    useCallback(() => {
      const loadProfileStats = async () => {
        try {
          const savedStreak = await AsyncStorage.getItem("salus_streak_count");
          const streak = savedStreak ? parseInt(savedStreak, 10) : 1;
          setStreakCount(streak);

          const last7: DayHistory[] = [];
          let ritualsSum = 0;
          let moodCheckinsCount = 0;

          for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split("T")[0];
            const dayShort = d.toLocaleDateString("en-IN", { weekday: "short" });

            const rawQuests = await AsyncStorage.getItem(`salus_quests_${dateStr}`);
            const parsedQuests: string[] = rawQuests ? JSON.parse(rawQuests) : [];
            const moodId = await AsyncStorage.getItem(`salus_mood_${dateStr}`);

            ritualsSum += parsedQuests.length;
            if (moodId) moodCheckinsCount += 1;

            last7.push({
              dateStr,
              dayShort,
              moodId,
              questsDone: parsedQuests.length,
            });
          }

          setHistory(last7);
          setTotalRituals(ritualsSum);
          const computedXp = ritualsSum * 25 + moodCheckinsCount * 15 + streak * 10;
          setCalmXp(computedXp);
        } catch (e) {
          // Fallback silently
        }
      };

      loadProfileStats();
    }, [])
  );

  // Determine current level & next level target
  let currentLevelIdx = 0;
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (calmXp >= LEVELS[i].minXp) {
      currentLevelIdx = i;
      break;
    }
  }

  const currentLevel = LEVELS[currentLevelIdx];
  const nextLevel = LEVELS[currentLevelIdx + 1];
  const xpProgressPercent = nextLevel
    ? Math.min(
        100,
        Math.round(
          ((calmXp - currentLevel.minXp) / (nextLevel.minXp - currentLevel.minXp)) * 100
        )
      )
    : 100;

  return (
    <Screen style={styles.screenBg}>
      <Ambient3DBackground />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Header */}
        <View style={styles.header}>
          <AppText style={styles.kicker}>SANCTUARY IDENTITY • PROGRESS</AppText>
          <AppText style={styles.title}>Inner Rhythm & Growth</AppText>
        </View>

        {/* 1. Calm XP & Level Badge Card */}
        <View style={styles.levelCard}>
          <View style={styles.levelTopRow}>
            <View style={styles.levelOrb}>
              <AppText style={styles.levelEmoji}>{currentLevel.badge}</AppText>
            </View>
            <View style={styles.levelMeta}>
              <AppText style={styles.levelTag}>
                LEVEL {currentLevelIdx + 1} • {calmXp} CALM XP
              </AppText>
              <AppText style={styles.levelTitle}>{currentLevel.title}</AppText>
              <AppText style={styles.levelSub}>
                {nextLevel
                  ? `${nextLevel.minXp - calmXp} XP to reach ${nextLevel.title}`
                  : "Maximum Sanctuary Mastery Achieved"}
              </AppText>
            </View>
          </View>

          {/* XP Progress Bar */}
          <View style={styles.xpTrack}>
            <View style={[styles.xpFill, { width: `${xpProgressPercent}%` }]} />
          </View>
        </View>

        {/* 2. Quick Metric Pills */}
        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <AppText style={styles.statEmoji}>🔥</AppText>
            <AppText style={styles.statValue}>{streakCount} Days</AppText>
            <AppText style={styles.statLabel}>Active Streak</AppText>
          </View>

          <View style={styles.statBox}>
            <AppText style={styles.statEmoji}>🧘</AppText>
            <AppText style={styles.statValue}>{totalRituals}</AppText>
            <AppText style={styles.statLabel}>Rituals Completed</AppText>
          </View>

          <View style={styles.statBox}>
            <AppText style={styles.statEmoji}>🌿</AppText>
            <AppText style={styles.statValue}>
              {history.filter((h) => !!h.moodId).length}/7
            </AppText>
            <AppText style={styles.statLabel}>Weekly Check-Ins</AppText>
          </View>
        </View>

        {/* 3. 7-Day Nervous System Check-In History */}
        <View style={styles.historyCard}>
          <View style={styles.historyHeader}>
            <AppText style={styles.historyTitle}>7-Day Nervous System Log</AppText>
            <AppText style={styles.historyHint}>Recent states</AppText>
          </View>

          <View style={styles.historyRow}>
            {history.map((item, idx) => {
              const moodInfo = item.moodId ? MOOD_META[item.moodId] : null;
              const isToday = idx === history.length - 1;
              return (
                <View key={item.dateStr} style={styles.historyCol}>
                  <View
                    style={[
                      styles.moodBubble,
                      moodInfo && {
                        borderColor: moodInfo.accent,
                        backgroundColor: "rgba(255, 255, 255, 0.09)",
                      },
                      isToday && styles.todayRing,
                    ]}
                  >
                    <AppText style={styles.historyEmoji}>
                      {moodInfo ? moodInfo.emoji : "·"}
                    </AppText>
                  </View>
                  <AppText style={[styles.dayLabel, isToday && styles.dayLabelToday]}>
                    {isToday ? "Today" : item.dayShort}
                  </AppText>
                  <AppText style={styles.questCountMini}>
                    {item.questsDone > 0 ? `${item.questsDone}✓` : ""}
                  </AppText>
                </View>
              );
            })}
          </View>

          {/* Legend */}
          <View style={styles.legendRow}>
            {Object.values(MOOD_META).map((m) => (
              <View key={m.label} style={styles.legendItem}>
                <AppText style={styles.legendEmoji}>{m.emoji}</AppText>
                <AppText style={styles.legendText}>{m.label}</AppText>
              </View>
            ))}
          </View>
        </View>

        {/* 4. Quick Sanctuary Portals */}
        <View style={styles.actionsList}>
          <Pressable
            onPress={() => router.push("/practice")}
            style={styles.actionRowCard}
          >
            <View style={styles.actionLeft}>
              <AppText style={styles.actionIcon}>🫁</AppText>
              <View>
                <AppText style={styles.actionTitle}>Enter Somatic Lab</AppText>
                <AppText style={styles.actionSub}>
                  Deep vagal breathing & 432Hz / 528Hz frequencies
                </AppText>
              </View>
            </View>
            <AppText style={styles.arrow}>→</AppText>
          </Pressable>

          <Pressable
            onPress={() => router.push("/chat")}
            style={styles.actionRowCard}
          >
            <View style={styles.actionLeft}>
              <AppText style={styles.actionIcon}>🐱</AppText>
              <View>
                <AppText style={styles.actionTitle}>Talk with Bubbi AI</AppText>
                <AppText style={styles.actionSub}>
                  Reflect on your weekly nervous system patterns
                </AppText>
              </View>
            </View>
            <AppText style={styles.arrow}>→</AppText>
          </Pressable>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screenBg: { backgroundColor: "#070811" },
  scroll: { paddingBottom: 44, gap: 16, zIndex: 2 },
  header: { paddingTop: 8, paddingHorizontal: 16 },
  kicker: { fontSize: 10, fontWeight: "800", color: "#818CF8", letterSpacing: 1.5 },
  title: { fontSize: 24, fontWeight: "800", color: "#F8FAFC", marginTop: 4 },
  levelCard: {
    marginHorizontal: 16,
    backgroundColor: "rgba(21, 18, 43, 0.85)",
    borderRadius: 24,
    padding: 18,
    borderWidth: 1.5,
    borderColor: "rgba(168, 85, 247, 0.55)",
    gap: 14,
  },
  levelTopRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  levelOrb: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(168, 85, 247, 0.2)",
    borderWidth: 1.5,
    borderColor: "#C084FC",
    alignItems: "center",
    justifyContent: "center",
  },
  levelEmoji: {
    fontSize: 30,
  },
  levelMeta: {
    flex: 1,
    gap: 2,
  },
  levelTag: {
    fontSize: 10,
    fontWeight: "900",
    color: "#FBBF24",
    letterSpacing: 1,
  },
  levelTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  levelSub: {
    fontSize: 11.5,
    color: "#CBD5E1",
  },
  xpTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    overflow: "hidden",
  },
  xpFill: {
    height: "100%",
    backgroundColor: "#C084FC",
    borderRadius: 4,
  },
  statsGrid: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 16,
  },
  statBox: {
    flex: 1,
    backgroundColor: "rgba(19, 23, 42, 0.82)",
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(129, 140, 248, 0.28)",
    gap: 3,
  },
  statEmoji: {
    fontSize: 20,
    marginBottom: 2,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  statLabel: {
    fontSize: 10.5,
    color: "#94A3B8",
    fontWeight: "600",
    textAlign: "center",
  },
  historyCard: {
    marginHorizontal: 16,
    backgroundColor: "rgba(18, 22, 38, 0.85)",
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(99, 102, 241, 0.32)",
    gap: 14,
  },
  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  historyTitle: {
    fontSize: 15.5,
    fontWeight: "800",
    color: "#F8FAFC",
  },
  historyHint: {
    fontSize: 11,
    color: "#818CF8",
    fontWeight: "700",
  },
  historyRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  historyCol: {
    alignItems: "center",
    gap: 5,
    flex: 1,
  },
  moodBubble: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  todayRing: {
    borderColor: "#FBBF24",
    borderWidth: 1.5,
  },
  historyEmoji: {
    fontSize: 17,
    color: "#64748B",
  },
  dayLabel: {
    fontSize: 10.5,
    color: "#94A3B8",
    fontWeight: "700",
  },
  dayLabelToday: {
    color: "#FBBF24",
    fontWeight: "800",
  },
  questCountMini: {
    fontSize: 9.5,
    color: "#34D399",
    fontWeight: "800",
    height: 12,
  },
  legendRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.07)",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  legendEmoji: {
    fontSize: 12,
  },
  legendText: {
    fontSize: 10.5,
    color: "#94A3B8",
    fontWeight: "600",
  },
  actionsList: {
    paddingHorizontal: 16,
    gap: 10,
  },
  actionRowCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(19, 23, 40, 0.84)",
    borderRadius: 18,
    padding: 15,
    borderWidth: 1,
    borderColor: "rgba(129, 140, 248, 0.28)",
  },
  actionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  actionIcon: {
    fontSize: 24,
  },
  actionTitle: {
    fontSize: 14.5,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  actionSub: {
    fontSize: 11.5,
    color: "#94A3B8",
    marginTop: 1,
  },
  arrow: {
    fontSize: 16,
    color: "#818CF8",
    fontWeight: "800",
  },
});
