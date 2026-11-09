import { useRouter } from "expo-router";
import React, { useState, useRef } from "react";
import {
  View,
  ScrollView,
  Pressable,
  StyleSheet,
  Animated,
  Easing,
  StatusBar,
  Vibration,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppText } from "../src/components/AppText";

interface DoseMolecule {
  id: "dopamine" | "oxytocin" | "serotonin" | "endorphin";
  name: string;
  neuroTitle: string;
  chemical: string;
  emoji: string;
  accent: string;
  bgGlow: string;
  somaticAction: string;
  scienceNote: string;
  microQuest: string;
}

const DOSE_SYSTEM: DoseMolecule[] = [
  {
    id: "oxytocin",
    name: "Heart Warmth & Safety",
    neuroTitle: "OXYTOCIN TRANSMUTATION",
    chemical: "Love & Neural Safety Molecule",
    emoji: "🫂",
    accent: "#F472B6",
    bgGlow: "#831843",
    somaticAction: "Cross your arms and give yourself a firm, warm embrace. Press both hands flat against your heart. Inhale for 4 seconds, whisper: I am deeply safe right here.",
    scienceNote: "Physical self-touch immediately signals the amygdala that danger has passed, flooding the bloodstream with natural oxytocin.",
    microQuest: "Send one honest 2-word gratitude text to someone you care about right now.",
  },
  {
    id: "dopamine",
    name: "Spark & Micro-Victory",
    neuroTitle: "DOPAMINE IGNITION",
    chemical: "Drive & Excitement Catalyst",
    emoji: "✨",
    accent: "#FBBF24",
    bgGlow: "#78350F",
    somaticAction: "Stand up immediately or roll your spine upright. Clench both fists tight for 5 seconds... then throw your hands open wide into the air with a power smile.",
    scienceNote: "Postural expansion and sudden intentional release triggers the striatum to release motivational dopamine pulses.",
    microQuest: "Complete one task that takes under 45 seconds (drink a glass of water, fix your bed pillow, wash your face).",
  },
  {
    id: "endorphin",
    name: "Physical Grief Release",
    neuroTitle: "ENDORPHIN TRAUMA SHAKEOUT",
    chemical: "Natural Pain & Ache Neutralizer",
    emoji: "⚡",
    accent: "#38BDF8",
    bgGlow: "#0C4A6E",
    somaticAction: "Shake your hands, wrists, and shoulders vigorously like water droplets are stuck on your fingers for 30 seconds. Exhale with a loud sigh.",
    scienceNote: "Neurogenic tremoring forces muscles to dump stored cortisol and adrenaline, replacing visceral heavy grief with endorphins.",
    microQuest: "Put on your favorite upbeat song and let your body sway without caring how it looks.",
  },
  {
    id: "serotonin",
    name: "Quiet Pride & Radiance",
    neuroTitle: "SEROTONIN RE-CALIBRATION",
    chemical: "Inner Worth & Peace Molecule",
    emoji: "☀️",
    accent: "#34D399",
    bgGlow: "#064E3B",
    somaticAction: "Look upward towards a window or light source. Drop your tongue from the roof of your mouth. Soften your belly completely.",
    scienceNote: "Visual upward tilt combined with light absorption shifts the brainstem into serotonin synthesis, terminating depressive mental rumination.",
    microQuest: "Name 3 tough things you have already survived and conquered in your past.",
  },
];

const EMOTIONAL_REBIRTH_PROMPTS = [
  {
    title: "The Alchemy of Pain",
    quote: "Grief is not the end of your story; it is emotional energy waiting to be transformed into unmatched strength, empathy, and unbreakable focus.",
    author: "Somatic Wisdom",
  },
  {
    title: "Temporary Weather",
    quote: "You are the wide open sky. The sorrow, the heartbreak, the fatigue—they are just passing storm clouds. Clouds always clear.",
    author: "Neural Grounding",
  },
  {
    title: "The Rebirth Pivot",
    quote: "The version of you that will achieve wonders is being forged right now in the quiet moments where you refuse to give up.",
    author: "Inner Alchemy",
  },
];

export default function AlchemyScreen() {
  const router = useRouter();
  const [selectedMolecule, setSelectedMolecule] = useState<DoseMolecule>(DOSE_SYSTEM[0]);
  const [activePromptIdx, setActivePromptIdx] = useState(0);
  const [burstActive, setBurstActive] = useState(false);

  const glowScale = useRef(new Animated.Value(1)).current;
  const cardFade = useRef(new Animated.Value(1)).current;

  const handleSelectMolecule = (mol: DoseMolecule) => {
    Vibration.vibrate(40);
    setSelectedMolecule(mol);
    cardFade.setValue(0.7);
    Animated.timing(cardFade, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const triggerHormoneSurge = () => {
    Vibration.vibrate([0, 50, 100, 150]);
    setBurstActive(true);

    Animated.sequence([
      Animated.timing(glowScale, {
        toValue: 1.35,
        duration: 400,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(glowScale, {
        toValue: 1,
        duration: 600,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start(() => setBurstActive(false));
  };

  const currPrompt = EMOTIONAL_REBIRTH_PROMPTS[activePromptIdx];

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#06070D" />
      <View style={styles.container}>
        
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <AppText style={styles.backText}>‹ Back</AppText>
          </Pressable>
          <View style={{ flex: 1 }}>
            <AppText style={styles.headerTitle}>The Alchemy Sanctuary</AppText>
            <AppText style={styles.headerSub}>Emotional Rebirth & Neuro-Chemistry Lab</AppText>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
          
          <View style={styles.heroCard}>
            <View style={styles.heroBadgeRow}>
              <View style={styles.liveDot} />
              <AppText style={styles.heroBadgeTxt}>EMOTIONAL TRANSMUTATION CHAMBER</AppText>
            </View>

            <AppText style={styles.heroQuote}>"{currPrompt.quote}"</AppText>
            <AppText style={styles.heroAuthor}>— {currPrompt.author}</AppText>

            <Pressable
              onPress={() => {
                setActivePromptIdx((prev) => (prev + 1) % EMOTIONAL_REBIRTH_PROMPTS.length);
                Vibration.vibrate(30);
              }}
              style={styles.cyclePromptBtn}
            >
              <AppText style={styles.cyclePromptTxt}>Receive Next Rebirth Spark ✨</AppText>
            </Pressable>
          </View>

          <View style={styles.sectionHead}>
            <AppText style={styles.secKicker}>NATURAL CHEMICAL RESTORATION</AppText>
            <AppText style={styles.secTitle}>Choose the Hormone You Need</AppText>
          </View>

          <View style={styles.molRow}>
            {DOSE_SYSTEM.map((mol) => {
              const isSelected = selectedMolecule.id === mol.id;
              return (
                <Pressable
                  key={mol.id}
                  onPress={() => handleSelectMolecule(mol)}
                  style={[
                    styles.molPill,
                    isSelected && { borderColor: mol.accent, backgroundColor: mol.bgGlow + "44" },
                  ]}
                >
                  <AppText style={{ fontSize: 24 }}>{mol.emoji}</AppText>
                  <AppText style={[styles.molName, isSelected && { color: mol.accent, fontWeight: "800" }]}>
                    {mol.id.toUpperCase()}
                  </AppText>
                </Pressable>
              );
            })}
          </View>

          <Animated.View style={[styles.forgeCard, { borderColor: selectedMolecule.accent, opacity: cardFade }]}>
            <View style={styles.forgeTop}>
              <Animated.View
                style={[
                  styles.glowOrb,
                  {
                    backgroundColor: selectedMolecule.accent,
                    transform: [{ scale: glowScale }],
                    opacity: burstActive ? 0.8 : 0.2,
                  },
                ]}
              />
              <View style={[styles.coreIconOrb, { backgroundColor: selectedMolecule.accent + "33", borderColor: selectedMolecule.accent }]}>
                <AppText style={{ fontSize: 32 }}>{selectedMolecule.emoji}</AppText>
              </View>

              <View style={{ flex: 1, gap: 2 }}>
                <AppText style={[styles.forgeKicker, { color: selectedMolecule.accent }]}>
                  {selectedMolecule.neuroTitle}
                </AppText>
                <AppText style={styles.forgeTitle}>{selectedMolecule.name}</AppText>
                <AppText style={styles.forgeChem}>{selectedMolecule.chemical}</AppText>
              </View>
            </View>

            <View style={styles.somaticActionBox}>
              <AppText style={styles.boxTag}>SOMATIC BODY ACTIVATION</AppText>
              <AppText style={styles.actionBody}>{selectedMolecule.somaticAction}</AppText>
            </View>

            <View style={styles.scienceBox}>
              <AppText style={[styles.boxTag, { color: selectedMolecule.accent }]}>WHY THIS LIFTS YOUR PAIN</AppText>
              <AppText style={styles.scienceBody}>{selectedMolecule.scienceNote}</AppText>
            </View>

            <View style={[styles.questBox, { borderColor: selectedMolecule.accent + "66" }]}>
              <AppText style={styles.questTitle}>⚡ 60-Second Momentum Quest:</AppText>
              <AppText style={styles.questBody}>{selectedMolecule.microQuest}</AppText>
            </View>

            <Pressable
              onPress={triggerHormoneSurge}
              style={[styles.surgeBtn, { backgroundColor: selectedMolecule.accent }]}
            >
              <AppText style={styles.surgeBtnTxt}>
                {burstActive ? "Synthesizing Hormone Stream..." : "Ignite " + selectedMolecule.id.toUpperCase() + " Flow 🌟"}
              </AppText>
            </Pressable>
          </Animated.View>

          <View style={styles.emergencyCard}>
            <AppText style={styles.emergencyKicker}>EMOTIONAL FIRST-AID PROTOCOL</AppText>
            <AppText style={styles.emergencyTitle}>When Sorrow or Grief Hits Hard</AppText>
            
            <View style={styles.protocolList}>
              <View style={styles.protocolItem}>
                <AppText style={styles.protocolNum}>01</AppText>
                <View style={{ flex: 1 }}>
                  <AppText style={styles.protocolH}>Do Not Resist the Tears</AppText>
                  <AppText style={styles.protocolP}>Emotional tears contain elevated cortisol. Crying is your body physically draining stress toxins.</AppText>
                </View>
              </View>

              <View style={styles.protocolItem}>
                <AppText style={styles.protocolNum}>02</AppText>
                <View style={{ flex: 1 }}>
                  <AppText style={styles.protocolH}>Wash Face With Cold Ice Water</AppText>
                  <AppText style={styles.protocolP}>Forces sudden vasoconstriction, shutting down emotional spirals within 20 seconds.</AppText>
                </View>
              </View>

              <View style={styles.protocolItem}>
                <AppText style={styles.protocolNum}>03</AppText>
                <View style={{ flex: 1 }}>
                  <AppText style={styles.protocolH}>Talk with Bubbi AI Somatic Coach</AppText>
                  <AppText style={styles.protocolP}>Pour out what hurts. Bubbi will guide you through grounding without judgement.</AppText>
                </View>
              </View>
            </View>

            <Pressable
              onPress={() => router.push("/chat")}
              style={styles.openCoachBtn}
            >
              <AppText style={styles.openCoachBtnTxt}>Open Safe Space with Bubbi →</AppText>
            </Pressable>
          </View>

        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#06070D" },
  container: { flex: 1, backgroundColor: "#06070D" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#141728",
  },
  backBtn: { paddingRight: 14, paddingVertical: 4 },
  backText: { fontSize: 20, color: "#818CF8", fontWeight: "700" },
  headerTitle: { fontSize: 16, fontWeight: "800", color: "#F8FAFC" },
  headerSub: { fontSize: 11, color: "#94A3B8" },
  scroll: { paddingHorizontal: 16, paddingVertical: 14, gap: 16, paddingBottom: 50 },
  heroCard: {
    backgroundColor: "#111428",
    borderRadius: 22,
    padding: 18,
    borderWidth: 1.5,
    borderColor: "#4338CA",
    gap: 12,
  },
  heroBadgeRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#FBBF24" },
  heroBadgeTxt: { fontSize: 9, fontWeight: "900", color: "#FBBF24", letterSpacing: 1.2 },
  heroQuote: { fontSize: 15, lineHeight: 24, color: "#F8FAFC", fontStyle: "italic", fontWeight: "600" },
  heroAuthor: { fontSize: 11, color: "#A5B4FC", fontWeight: "700" },
  cyclePromptBtn: {
    backgroundColor: "#1E1B4B",
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#3730A3",
  },
  cyclePromptTxt: { color: "#C7D2FE", fontSize: 12, fontWeight: "700" },
  sectionHead: { gap: 2, marginTop: 4 },
  secKicker: { fontSize: 10, fontWeight: "800", color: "#818CF8", letterSpacing: 1.2 },
  secTitle: { fontSize: 18, fontWeight: "800", color: "#FFFFFF" },
  molRow: { flexDirection: "row", gap: 8 },
  molPill: {
    flex: 1,
    backgroundColor: "#0F1222",
    borderRadius: 16,
    paddingVertical: 12,
    borderWidth: 1.5,
    borderColor: "#1E2442",
    alignItems: "center",
    gap: 6,
  },
  molName: { fontSize: 10, color: "#94A3B8", fontWeight: "700" },
  forgeCard: {
    backgroundColor: "#0D1022",
    borderRadius: 22,
    padding: 18,
    borderWidth: 1.5,
    gap: 14,
  },
  forgeTop: { flexDirection: "row", alignItems: "center", gap: 14, position: "relative" },
  glowOrb: { position: "absolute", width: 70, height: 70, borderRadius: 35, left: -4, top: -4 },
  coreIconOrb: { width: 62, height: 62, borderRadius: 31, borderWidth: 1.5, alignItems: "center", justifyContent: "center" },
  forgeKicker: { fontSize: 9, fontWeight: "900", letterSpacing: 1 },
  forgeTitle: { fontSize: 17, fontWeight: "800", color: "#FFFFFF" },
  forgeChem: { fontSize: 11, color: "#94A3B8" },
  somaticActionBox: {
    backgroundColor: "#13162C",
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#222744",
    gap: 6,
  },
  boxTag: { fontSize: 9, fontWeight: "900", color: "#94A3B8", letterSpacing: 1 },
  actionBody: { fontSize: 13, lineHeight: 21, color: "#F1F5F9" },
  scienceBox: {
    backgroundColor: "#0A0D1D",
    padding: 14,
    borderRadius: 14,
    gap: 4,
  },
  scienceBody: { fontSize: 12, lineHeight: 19, color: "#CBD5E1" },
  questBox: {
    backgroundColor: "#161932",
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    gap: 4,
  },
  questTitle: { fontSize: 11, fontWeight: "800", color: "#FBBF24" },
  questBody: { fontSize: 12, color: "#F1F5F9", lineHeight: 18 },
  surgeBtn: {
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  surgeBtnTxt: { color: "#06070D", fontWeight: "900", fontSize: 13, letterSpacing: 0.5 },
  emergencyCard: {
    backgroundColor: "#0B0E1E",
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: "#1F2648",
    gap: 12,
  },
  emergencyKicker: { fontSize: 9, fontWeight: "900", color: "#EF4444", letterSpacing: 1 },
  emergencyTitle: { fontSize: 16, fontWeight: "800", color: "#FFFFFF" },
  protocolList: { gap: 12, marginTop: 4 },
  protocolItem: { flexDirection: "row", gap: 12, alignItems: "flex-start" },
  protocolNum: { fontSize: 14, fontWeight: "900", color: "#6366F1", marginTop: 2 },
  protocolH: { fontSize: 13, fontWeight: "700", color: "#FFFFFF" },
  protocolP: { fontSize: 11, color: "#94A3B8", lineHeight: 17, marginTop: 2 },
  openCoachBtn: {
    backgroundColor: "#1F1B4E",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#4338CA",
    marginTop: 6,
  },
  openCoachBtnTxt: { color: "#C7D2FE", fontWeight: "700", fontSize: 12 },
});
