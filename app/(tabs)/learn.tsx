import { useRouter } from "expo-router";
import React from "react";
import { View, ScrollView, Pressable, StyleSheet } from "react-native";
import { AppText } from "../../src/components/AppText";
import { Screen } from "../../src/components/Screen";

export default function LearnScreen() {
  const router = useRouter();

  return (
    <Screen style={styles.screenBg}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <AppText style={styles.kicker}>NEUROSCIENCE & SOMATIC ARCHIVE</AppText>
          <AppText style={styles.title}>Knowledge & Biological Health</AppText>
        </View>

        {/* 🌸 SPECIAL WOMEN ONLY SANCTUARY CARD */}
        <Pressable 
          onPress={() => router.push("/womens-health")} 
          style={styles.womensCard}
        >
          <View style={styles.rowBetween}>
            <View style={styles.badgeRow}>
              <View style={styles.liveDot} />
              <AppText style={styles.pinkTag}>WOMEN ONLY • REPRODUCTIVE & CLINICAL SANCTUARY</AppText>
            </View>
            <AppText style={styles.openTag}>ENTER →</AppText>
          </View>

          <View style={styles.rowAlign}>
            <View style={styles.iconOrb}>
              <AppText style={{ fontSize: 28 }}>🌸</AppText>
            </View>
            <View style={{ flex: 1, gap: 3 }}>
              <AppText style={styles.womensTitle}>Women's Health, Cycle & Doctor Triage</AppText>
              <AppText style={styles.womensSub}>
                Yearly period & ovulation calendar, pregnancy sudden symptom decoders & 1-tap live OB-GYN video triage.
              </AppText>
            </View>
          </View>
        </Pressable>

        {/* Somatic Lessons */}
        <View style={styles.sectionHead}>
          <AppText style={styles.secKicker}>CLINICAL EDUCATION MODULES</AppText>
          <AppText style={styles.secTitle}>Somatic & Nervous System Literacy</AppText>
        </View>

        <View style={styles.lessonCard}>
          <AppText style={styles.lessonBadge}>NEURAL MAPPING</AppText>
          <AppText style={styles.lessonH}>The Vagus Nerve & Ventral Vagal State</AppText>
          <AppText style={styles.lessonP}>
            How your parasympathetic brake controls heart rate variability, digestion, and visceral emotional release.
          </AppText>
        </View>

        <View style={styles.lessonCard}>
          <AppText style={styles.lessonBadge}>BIO-CHEMISTRY</AppText>
          <AppText style={styles.lessonH}>D.O.S.E. Neurotransmitter Symphony</AppText>
          <AppText style={styles.lessonP}>
            The exact biological mechanics behind natural dopamine, oxytocin, serotonin, and endorphin pathways.
          </AppText>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screenBg: { backgroundColor: "#06070D" },
  scroll: { paddingBottom: 50, gap: 16 },
  header: { paddingTop: 8 },
  kicker: { fontSize: 10, fontWeight: "800", color: "#818CF8", letterSpacing: 1.5 },
  title: { fontSize: 24, fontWeight: "800", color: "#F8FAFC", marginTop: 4 },
  
  womensCard: {
    backgroundColor: "#1D0B1C",
    borderRadius: 22,
    padding: 18,
    borderWidth: 1.5,
    borderColor: "#F43F5E",
    gap: 14,
  },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  badgeRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#F43F5E" },
  pinkTag: { fontSize: 9, fontWeight: "900", color: "#FDA4AF", letterSpacing: 1 },
  openTag: { fontSize: 11, color: "#FDA4AF", fontWeight: "900" },
  rowAlign: { flexDirection: "row", alignItems: "center", gap: 14 },
  iconOrb: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "#4C0519",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "#FB7185",
  },
  womensTitle: { fontSize: 16, fontWeight: "800", color: "#FFFFFF" },
  womensSub: { fontSize: 12, color: "#CBD5E1", lineHeight: 18 },

  sectionHead: { gap: 2, marginTop: 8 },
  secKicker: { fontSize: 10, fontWeight: "800", color: "#818CF8", letterSpacing: 1.2 },
  secTitle: { fontSize: 18, fontWeight: "800", color: "#FFFFFF" },

  lessonCard: {
    backgroundColor: "#0F1224",
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#1E2445",
    gap: 6,
  },
  lessonBadge: { fontSize: 9, fontWeight: "900", color: "#818CF8", letterSpacing: 1 },
  lessonH: { fontSize: 15, fontWeight: "700", color: "#FFFFFF" },
  lessonP: { fontSize: 12, color: "#94A3B8", lineHeight: 18 },
});
