import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Pressable,
  StyleSheet,
  ScrollView,
  Linking,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { AppText } from "../src/components/AppText";

interface Helpline {
  name: string;
  desc: string;
  number: string;
  available: string;
}

const HELPLINES: Helpline[] = [
  {
    name: "Tele-MANAS (Govt of India)",
    desc: "National mental health 24x7 clinical support",
    number: "14416",
    available: "24/7 • Free • Multi-lingual",
  },
  {
    name: "KIRAN Helpline",
    desc: "Ministry of Social Justice 24/7 mental health line",
    number: "18005990019",
    available: "24/7 • Toll-Free",
  },
  {
    name: "Vandrevala Foundation",
    desc: "Confidential crisis intervention & emotional counseling",
    number: "+919999666555",
    available: "24/7 • Free Support",
  },
];

export default function HelpScreen() {
  const router = useRouter();
  const [shockActive, setShockActive] = useState(false);

  const callNumber = (num: string) => {
    Linking.openURL(`tel:${num}`);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#090A10" />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <AppText style={styles.backText}>‹ Back</AppText>
          </Pressable>
          <View style={styles.titleContainer}>
            <AppText style={styles.headerTitle}>Clinical Safety Shield</AppText>
            <AppText style={styles.headerSub}>Emergency Stabilization & Support</AppText>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
          
          {/* Mammalian Dive / Sensory Freeze Breaker */}
          <View style={styles.shockCard}>
            <View style={styles.shockTopRow}>
              <View style={styles.shockIconOrb}>
                <AppText style={{ fontSize: 24 }}>🧊</AppText>
              </View>
              <View style={{ flex: 1 }}>
                <AppText style={styles.shockKicker}>ACUTE PANIC INTERRUPT</AppText>
                <AppText style={styles.shockTitle}>Cold Water Vagus Reset</AppText>
              </View>
            </View>

            <AppText style={styles.shockBody}>
              Activating the Mammalian Dive Reflex physically drops acute tachycardia (racing heart) within 30 seconds.
            </AppText>

            {shockActive ? (
              <View style={styles.protocolBox}>
                <AppText style={styles.protocolStep}>1. Hold an ice cube or splash cold water on your temples and cheeks.</AppText>
                <AppText style={styles.protocolStep}>2. Rest your elbows on your knees and exhale through pursed lips.</AppText>
                <AppText style={styles.protocolStep}>3. You are biologically safe; your heart rate will decline rapidly now.</AppText>
                <Pressable onPress={() => setShockActive(false)} style={styles.closeProtocolBtn}>
                  <AppText style={styles.closeProtocolText}>Done Reset</AppText>
                </Pressable>
              </View>
            ) : (
              <Pressable onPress={() => setShockActive(true)} style={styles.shockActionBtn}>
                <AppText style={styles.shockBtnText}>Show Ice/Water Dive Protocol →</AppText>
              </Pressable>
            )}
          </View>

          {/* Calming Read-Aloud Anchor Script */}
          <View style={styles.anchorScriptCard}>
            <AppText style={styles.anchorKicker}>ANCHOR READ-ALOUD SCRIPT</AppText>
            <AppText style={styles.anchorLine}>"My body is having a temporary surge of adrenaline."</AppText>
            <AppText style={styles.anchorLine}>"Adrenaline is uncomfortable, but it is not dangerous."</AppText>
            <AppText style={styles.anchorLine}>"I do not have to fix anything right this second. I just have to breathe."</AppText>
          </View>

          {/* Verified Crisis Support Lines */}
          <View style={styles.sectionHeader}>
            <AppText style={styles.sectionTitle}>Direct Professional Lines</AppText>
            <AppText style={styles.sectionSubtitle}>Tap any card to dial immediately</AppText>
          </View>

          <View style={styles.helplineList}>
            {HELPLINES.map((item, idx) => (
              <Pressable
                key={idx}
                onPress={() => callNumber(item.number)}
                style={styles.helplineCard}
              >
                <View style={{ flex: 1, gap: 3 }}>
                  <AppText style={styles.helpName}>{item.name}</AppText>
                  <AppText style={styles.helpDesc}>{item.desc}</AppText>
                  <AppText style={styles.helpAvail}>{item.available}</AppText>
                </View>

                <View style={styles.dialBadge}>
                  <AppText style={styles.dialIcon}>📞</AppText>
                  <AppText style={styles.dialNumber}>{item.number}</AppText>
                </View>
              </Pressable>
            ))}
          </View>

          {/* Quick Return to Practice Studio */}
          <Pressable
            onPress={() => router.push("/practice")}
            style={styles.returnPracticeBtn}
          >
            <AppText style={styles.returnText}>Open Sensory Practice Studio (Box Breath / Tapper) →</AppText>
          </Pressable>

        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#090A10" },
  container: { flex: 1, backgroundColor: "#090A10" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#1E2238",
  },
  backBtn: { paddingRight: 14, paddingVertical: 4 },
  backText: { fontSize: 20, color: "#818CF8", fontWeight: "700" },
  titleContainer: { flex: 1 },
  headerTitle: { fontSize: 16, fontWeight: "800", color: "#F8FAFC" },
  headerSub: { fontSize: 11, color: "#94A3B8", marginTop: 1 },
  scroll: { paddingHorizontal: 16, paddingVertical: 16, gap: 16, paddingBottom: 40 },
  shockCard: {
    backgroundColor: "#10162B",
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: "#253466",
    gap: 12,
  },
  shockTopRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  shockIconOrb: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#1E2C52",
    alignItems: "center",
    justifyContent: "center",
  },
  shockKicker: { fontSize: 10, fontWeight: "800", color: "#38BDF8", letterSpacing: 1 },
  shockTitle: { fontSize: 16, fontWeight: "800", color: "#FFFFFF", marginTop: 2 },
  shockBody: { fontSize: 13, lineHeight: 19, color: "#CBD5E1" },
  shockActionBtn: {
    backgroundColor: "#0284C7",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  shockBtnText: { color: "#FFFFFF", fontWeight: "700", fontSize: 13 },
  protocolBox: {
    backgroundColor: "#0B1124",
    padding: 14,
    borderRadius: 14,
    gap: 10,
    borderWidth: 1,
    borderColor: "#1E3060",
  },
  protocolStep: { fontSize: 13, lineHeight: 20, color: "#E0F2FE" },
  closeProtocolBtn: {
    backgroundColor: "#1E293B",
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 4,
  },
  closeProtocolText: { color: "#94A3B8", fontSize: 12, fontWeight: "700" },
  anchorScriptCard: {
    backgroundColor: "#131422",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#252847",
    gap: 10,
  },
  anchorKicker: { fontSize: 10, fontWeight: "800", color: "#A78BFA", letterSpacing: 1 },
  anchorLine: { fontSize: 13, lineHeight: 21, color: "#F1F5F9", fontStyle: "italic" },
  sectionHeader: { gap: 2, marginTop: 4 },
  sectionTitle: { fontSize: 16, fontWeight: "800", color: "#F8FAFC" },
  sectionSubtitle: { fontSize: 12, color: "#94A3B8" },
  helplineList: { gap: 10 },
  helplineCard: {
    backgroundColor: "#15182C",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "#222744",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  helpName: { fontSize: 14, fontWeight: "700", color: "#FFFFFF" },
  helpDesc: { fontSize: 12, color: "#94A3B8" },
  helpAvail: { fontSize: 10, color: "#34D399", fontWeight: "700", marginTop: 2 },
  dialBadge: {
    backgroundColor: "#1E2342",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#333A66",
    alignItems: "center",
    gap: 2,
  },
  dialIcon: { fontSize: 14 },
  dialNumber: { fontSize: 11, fontWeight: "800", color: "#818CF8" },
  returnPracticeBtn: {
    backgroundColor: "#1A1A33",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#333366",
    marginTop: 6,
  },
  returnText: { color: "#C7D2FE", fontWeight: "700", fontSize: 12 },
});
