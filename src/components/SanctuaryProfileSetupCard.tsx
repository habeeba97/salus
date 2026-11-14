import React, { useEffect, useState } from "react";
import { View, StyleSheet, Pressable, Modal, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppText } from "./AppText";

const PROFILE_STORAGE_KEY = "salus_personalized_plan";

interface SanctuaryPlan {
  goal: string;
  level: string;
  dailyMinutes: string;
  practices: string[];
  devices: string[];
}

const DEFAULT_PLAN: SanctuaryPlan = {
  goal: "Calm Nervous System & Reduce Anxiety",
  level: "Gentle Flow",
  dailyMinutes: "10–15 mins",
  practices: ["Vagal Breath", "Yoga Stretch", "Sound Bath"],
  devices: ["Mobile Sensors"],
};

const GOALS = [
  "Calm Nervous System & Reduce Anxiety",
  "Deep Restorative Sleep",
  "Release Neck, Jaw & Desk Tension",
  "Boost Morning Energy & Focus",
];

const LEVELS = [
  { title: "Gentle Beginner", sub: "Soft, slow nervous system resets" },
  { title: "Balanced Flow", sub: "Daily breathwork + somatic movement" },
  { title: "Deep Alchemy", sub: "Extended binaural & vagal sessions" },
];

const TIME_WINDOWS = ["5–10 mins", "10–15 mins", "20–30 mins", "30+ mins"];

const PRACTICE_TYPES = [
  "Vagal Breath",
  "Yoga Stretch",
  "Sound Bath",
  "Somatic Shake",
  "Meditation",
  "Tai-Chi Flow",
  "Sleep Nidra",
  "Heart Coherence",
];

const DEVICE_TYPES = [
  "Samsung Watch",
  "Fitbit",
  "Apple Watch",
  "BLE Heart Strap",
  "Mobile Sensors",
];

export function SanctuaryProfileSetupCard() {
  const [plan, setPlan] = useState<SanctuaryPlan>(DEFAULT_PLAN);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  useEffect(() => {
    const loadPlan = async () => {
      try {
        const raw = await AsyncStorage.getItem(PROFILE_STORAGE_KEY);
        if (raw) setPlan(JSON.parse(raw));
      } catch {}
    };
    loadPlan();
  }, []);

  const savePlan = async (updated: SanctuaryPlan) => {
    setPlan(updated);
    try {
      await AsyncStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(updated));
    } catch {}
  };

  const toggleItem = (list: string[], item: string): string[] => {
    if (list.includes(item)) {
      return list.length > 1 ? list.filter((x) => x !== item) : list;
    }
    return [...list, item];
  };

  return (
    <View style={styles.wrapper}>
      <Pressable onPress={() => setModalVisible(true)} style={styles.summaryCard}>
        <View style={styles.topRow}>
          <View style={styles.badge}>
            <AppText style={styles.badgeText}>MY SANCTUARY PLAN</AppText>
          </View>
          <AppText style={styles.editLink}>Customize →</AppText>
        </View>

        <AppText style={styles.goalTitle}>{plan.goal}</AppText>

        <View style={styles.metaChipsRow}>
          <View style={styles.metaChip}>
            <AppText style={styles.metaChipText}>⏱ {plan.dailyMinutes}</AppText>
          </View>
          <View style={styles.metaChip}>
            <AppText style={styles.metaChipText}>✦ {plan.level}</AppText>
          </View>
          <View style={styles.metaChip}>
            <AppText style={styles.metaChipText}>
              🧘 {plan.practices.length} Practices
            </AppText>
          </View>
        </View>
      </Pressable>

      {/* FitOn-Inspired Interactive Sanctuary Goal & Practice Customizer Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent={false}>
        <View style={styles.modalBg}>
          <View style={styles.modalHeader}>
            <View>
              <AppText style={styles.modalKicker}>PERSONALIZE SALUS</AppText>
              <AppText style={styles.modalTitle}>Your Somatic Blueprint</AppText>
            </View>
            <Pressable
              onPress={() => setModalVisible(false)}
              style={styles.doneBtn}
            >
              <AppText style={styles.doneBtnText}>Save Plan ✓</AppText>
            </Pressable>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.modalScroll}
          >
            {/* 1. Primary Goal */}
            <AppText style={styles.sectionLabel}>1. WHAT IS YOUR PRIMARY GOAL?</AppText>
            <View style={styles.stackGroup}>
              {GOALS.map((g) => {
                const selected = plan.goal === g;
                return (
                  <Pressable
                    key={g}
                    onPress={() => savePlan({ ...plan, goal: g })}
                    style={[styles.optionCard, selected && styles.optionCardSelected]}
                  >
                    <AppText style={[styles.optionText, selected && styles.optionTextSelected]}>
                      {selected ? "● " : "○ "}
                      {g}
                    </AppText>
                  </Pressable>
                );
              })}
            </View>

            {/* 2. Intensity Level */}
            <AppText style={styles.sectionLabel}>2. CHOOSE YOUR INTENSITY LEVEL</AppText>
            <View style={styles.stackGroup}>
              {LEVELS.map((lvl) => {
                const selected = plan.level === lvl.title;
                return (
                  <Pressable
                    key={lvl.title}
                    onPress={() => savePlan({ ...plan, level: lvl.title })}
                    style={[styles.optionCard, selected && styles.optionCardSelected]}
                  >
                    <AppText style={[styles.optionText, selected && styles.optionTextSelected]}>
                      {lvl.title}
                    </AppText>
                    <AppText style={styles.optionSub}>{lvl.sub}</AppText>
                  </Pressable>
                );
              })}
            </View>

            {/* 3. Daily Time Window */}
            <AppText style={styles.sectionLabel}>3. DAILY PRACTICE TIME</AppText>
            <View style={styles.pillWrap}>
              {TIME_WINDOWS.map((tw) => {
                const selected = plan.dailyMinutes === tw;
                return (
                  <Pressable
                    key={tw}
                    onPress={() => savePlan({ ...plan, dailyMinutes: tw })}
                    style={[styles.tagPill, selected && styles.tagPillSelected]}
                  >
                    <AppText style={[styles.tagPillText, selected && styles.tagPillTextSelected]}>
                      {tw}
                    </AppText>
                  </Pressable>
                );
              })}
            </View>

            {/* 4. Favorite Somatic Classes */}
            <AppText style={styles.sectionLabel}>4. FAVORITE SOMATIC PRACTICES</AppText>
            <View style={styles.pillWrap}>
              {PRACTICE_TYPES.map((p) => {
                const selected = plan.practices.includes(p);
                return (
                  <Pressable
                    key={p}
                    onPress={() =>
                      savePlan({ ...plan, practices: toggleItem(plan.practices, p) })
                    }
                    style={[styles.tagPill, selected && styles.tagPillSelected]}
                  >
                    <AppText style={[styles.tagPillText, selected && styles.tagPillTextSelected]}>
                      {selected ? "✓ " : "+ "}
                      {p}
                    </AppText>
                  </Pressable>
                );
              })}
            </View>

            {/* 5. Connected Wearables */}
            <AppText style={styles.sectionLabel}>5. WEARABLES & SENSORS</AppText>
            <View style={styles.pillWrap}>
              {DEVICE_TYPES.map((dev) => {
                const selected = plan.devices.includes(dev);
                return (
                  <Pressable
                    key={dev}
                    onPress={() =>
                      savePlan({ ...plan, devices: toggleItem(plan.devices, dev) })
                    }
                    style={[styles.tagPill, selected && styles.tagPillSelected]}
                  >
                    <AppText style={[styles.tagPillText, selected && styles.tagPillTextSelected]}>
                      {selected ? "✓ " : "+ "}
                      {dev}
                    </AppText>
                  </Pressable>
                );
              })}
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 16,
  },
  summaryCard: {
    backgroundColor: "rgba(17, 22, 43, 0.78)",
    borderRadius: 22,
    padding: 16,
    borderWidth: 1.5,
    borderColor: "rgba(56, 189, 248, 0.4)",
    gap: 10,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  badge: {
    backgroundColor: "rgba(56, 189, 248, 0.16)",
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 8,
  },
  badgeText: {
    color: "#38BDF8",
    fontSize: 9.5,
    fontWeight: "800",
    letterSpacing: 1,
  },
  editLink: {
    color: "#F472B6",
    fontSize: 11.5,
    fontWeight: "800",
  },
  goalTitle: {
    color: "#FFFFFF",
    fontSize: 15.5,
    fontWeight: "800",
  },
  metaChipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  metaChip: {
    backgroundColor: "rgba(255, 255, 255, 0.07)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  metaChipText: {
    color: "#CBD5E1",
    fontSize: 11,
    fontWeight: "700",
  },
  modalBg: {
    flex: 1,
    backgroundColor: "#070914",
    paddingTop: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.08)",
  },
  modalKicker: {
    color: "#38BDF8",
    fontSize: 9.5,
    fontWeight: "800",
    letterSpacing: 1.2,
  },
  modalTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "800",
    marginTop: 2,
  },
  doneBtn: {
    backgroundColor: "#F472B6",
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 14,
  },
  doneBtnText: {
    color: "#FFFFFF",
    fontSize: 12.5,
    fontWeight: "900",
  },
  modalScroll: {
    padding: 18,
    paddingBottom: 48,
    gap: 12,
  },
  sectionLabel: {
    color: "#94A3B8",
    fontSize: 10.5,
    fontWeight: "800",
    letterSpacing: 1,
    marginTop: 8,
  },
  stackGroup: {
    gap: 8,
  },
  optionCard: {
    backgroundColor: "#11162B",
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  optionCardSelected: {
    borderColor: "#F472B6",
    backgroundColor: "rgba(244, 114, 182, 0.14)",
  },
  optionText: {
    color: "#E2E8F0",
    fontSize: 13.5,
    fontWeight: "700",
  },
  optionTextSelected: {
    color: "#FFFFFF",
    fontWeight: "800",
  },
  optionSub: {
    color: "#94A3B8",
    fontSize: 11.5,
    marginTop: 3,
  },
  pillWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tagPill: {
    backgroundColor: "#11162B",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
  },
  tagPillSelected: {
    borderColor: "#38BDF8",
    backgroundColor: "rgba(56, 189, 248, 0.18)",
  },
  tagPillText: {
    color: "#94A3B8",
    fontSize: 12,
    fontWeight: "700",
  },
  tagPillTextSelected: {
    color: "#FFFFFF",
    fontWeight: "800",
  },
});
