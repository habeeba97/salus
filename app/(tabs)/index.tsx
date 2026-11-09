import { useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import { View, Pressable, StyleSheet, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppText } from "../../src/components/AppText";
import { Screen } from "../../src/components/Screen";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <Screen style={styles.screenBg}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <AppText style={styles.kicker}>SALUS • BIOLOGICAL SANCTUARY</AppText>
          <AppText style={styles.title}>Nervous State & Sanctuary</AppText>
        </View>

        {/* Alchemy Sanctuary Portal */}
        <Pressable onPress={() => router.push("/alchemy")} style={styles.alchemyCard}>
          <View style={styles.rowBetween}>
            <AppText style={styles.goldTag}>EMOTIONAL TRANSMUTATION & D.O.S.E.</AppText>
            <AppText style={styles.enterText}>ENTER →</AppText>
          </View>
          <View style={styles.rowAlign}>
            <View style={styles.iconOrb}>
              <AppText style={{ fontSize: 26 }}>🌟</AppText>
            </View>
            <View style={{ flex: 1, gap: 2 }}>
              <AppText style={styles.cardTitle}>The Alchemy Sanctuary</AppText>
              <AppText style={styles.cardSub}>
                Turn grief into power, ignite oxytocin & dopamine, and reclaim inner strength.
              </AppText>
            </View>
          </View>
        </Pressable>

        {/* Thought Defuser Portal */}
        <Pressable onPress={() => router.push("/journal")} style={styles.defuserCard}>
          <View style={styles.rowBetween}>
            <AppText style={styles.purpleTag}>COGNITIVE EVAPORATION</AppText>
            <AppText style={styles.enterText}>OPEN VOID →</AppText>
          </View>
          <View style={styles.rowAlign}>
            <View style={[styles.iconOrb, { backgroundColor: "#2E1065", borderColor: "#A855F7" }]}>
              <AppText style={{ fontSize: 26 }}>🌌</AppText>
            </View>
            <View style={{ flex: 1, gap: 2 }}>
              <AppText style={styles.cardTitle}>Thought Defuser Singularity</AppText>
              <AppText style={styles.cardSub}>
                Full-screen gravitational collapse & binaural stardust dispersal.
              </AppText>
            </View>
          </View>
        </Pressable>

        {/* Quick Nav Grid */}
        <View style={styles.grid}>
          <Pressable onPress={() => router.push("/practice")} style={styles.tile}>
            <AppText style={styles.tileEmoji}>🫁</AppText>
            <AppText style={styles.tileTitle}>Somatic Lab</AppText>
            <AppText style={styles.tileSub}>Breath & Frequencies</AppText>
          </Pressable>

          <Pressable onPress={() => router.push("/chat")} style={styles.tile}>
            <AppText style={styles.tileEmoji}>✦</AppText>
            <AppText style={styles.tileTitle}>Bubbi AI</AppText>
            <AppText style={styles.tileSub}>Clinical Somatic Coach</AppText>
          </Pressable>
        </View>

        <Pressable onPress={() => router.push("/help")} style={styles.safetyCard}>
          <AppText style={styles.safetyTitle}>Clinical Safety Shield & Crisis SOS →</AppText>
        </Pressable>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screenBg: { backgroundColor: "#090A10" },
  scroll: { paddingBottom: 40, gap: 16 },
  header: { paddingTop: 8 },
  kicker: { fontSize: 10, fontWeight: "800", color: "#818CF8", letterSpacing: 1.5 },
  title: { fontSize: 24, fontWeight: "800", color: "#F8FAFC", marginTop: 4 },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  rowAlign: { flexDirection: "row", alignItems: "center", gap: 14 },
  goldTag: { fontSize: 9, fontWeight: "900", color: "#FBBF24", letterSpacing: 1.2 },
  purpleTag: { fontSize: 9, fontWeight: "900", color: "#C084FC", letterSpacing: 1.2 },
  enterText: { fontSize: 11, color: "#C084FC", fontWeight: "800" },
  alchemyCard: {
    backgroundColor: "#151028",
    borderRadius: 22,
    padding: 18,
    borderWidth: 1.5,
    borderColor: "#A855F7",
    gap: 12,
  },
  defuserCard: {
    backgroundColor: "#0D0E1C",
    borderRadius: 22,
    padding: 18,
    borderWidth: 1.5,
    borderColor: "#4F46E5",
    gap: 12,
  },
  iconOrb: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#2E1065",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#C084FC",
  },
  cardTitle: { fontSize: 16, fontWeight: "800", color: "#FFFFFF" },
  cardSub: { fontSize: 12, color: "#CBD5E1", lineHeight: 17 },
  grid: { flexDirection: "row", gap: 12 },
  tile: {
    flex: 1,
    backgroundColor: "#131627",
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#222744",
    gap: 4,
  },
  tileEmoji: { fontSize: 24, marginBottom: 2 },
  tileTitle: { fontSize: 15, fontWeight: "700", color: "#FFFFFF" },
  tileSub: { fontSize: 11, color: "#94A3B8" },
  safetyCard: {
    backgroundColor: "#1A1523",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#3F2648",
  },
  safetyTitle: { color: "#F472B6", fontSize: 12, fontWeight: "800" },
});
