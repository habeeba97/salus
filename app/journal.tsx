import { useRouter } from "expo-router";
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  TextInput,
  Pressable,
  FlatList,
  StyleSheet,
  Animated,
  Easing,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Modal,
  Dimensions,
  Vibration,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppText } from "../src/components/AppText";

const { width: W, height: H } = Dimensions.get("window");
const JOURNAL_KEY = "@salus_sanctuary_journal_v1";

// 48 High-Velocity Singular Stardust Nova Shards
const SHARDS = Array.from({ length: 48 }).map((_, i) => {
  const angle = (i / 48) * 2 * Math.PI;
  const dist = 160 + ((i * 23) % 220);
  return {
    id: i,
    tx: Math.cos(angle) * dist,
    ty: Math.sin(angle) * dist,
    size: 3 + (i % 6) * 3,
    color: i % 4 === 0 ? "#818CF8" : i % 4 === 1 ? "#38BDF8" : i % 4 === 2 ? "#C084FC" : "#F472B6",
    delay: (i % 8) * 30,
  };
});

export default function JournalScreen() {
  const router = useRouter();
  const [inputText, setInputText] = useState("");
  const [entries, setEntries] = useState([]);
  
  // High-End Void Phases: idle -> imploding -> exploding -> integration
  const [voidActive, setVoidActive] = useState(false);
  const [phase, setPhase] = useState("idle");

  // Physics Animators
  const vortexRotate = useRef(new Animated.Value(0)).current;
  const coreScale = useRef(new Animated.Value(1)).current;
  const coreOpacity = useRef(new Animated.Value(1)).current;
  const flashOpacity = useRef(new Animated.Value(0)).current;
  const shockwave = useRef(new Animated.Value(0.1)).current;
  const shockwaveAlpha = useRef(new Animated.Value(0)).current;
  const shardAnims = useRef(SHARDS.map(() => new Animated.Value(0))).current;
  const breathPacer = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    (async () => {
      try {
        const d = await AsyncStorage.getItem(JOURNAL_KEY);
        if (d) setEntries(JSON.parse(d));
      } catch (e) {}
    })();
  }, []);

  const saveEntries = async (arr) => {
    setEntries(arr);
    try { await AsyncStorage.setItem(JOURNAL_KEY, JSON.stringify(arr)); } catch (e) {}
  };

  // Binaural Atmospheric Audio Generator
  const triggerBinauralSomaticAudio = () => {
    try {
      if (typeof window !== "undefined" && (window.AudioContext || window.webkitAudioContext)) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        const ctx = new AudioCtx();

        // 1. Sub-Bass Vacuum Implosion
        const subOsc = ctx.createOscillator();
        const subGain = ctx.createGain();
        subOsc.type = "sine";
        subOsc.frequency.setValueAtTime(140, ctx.currentTime);
        subOsc.frequency.exponentialRampToValueAtTime(38, ctx.currentTime + 1.2);
        subGain.gain.setValueAtTime(0.3, ctx.currentTime);
        subGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
        subOsc.connect(subGain);
        subGain.connect(ctx.destination);
        subOsc.start();
        subOsc.stop(ctx.currentTime + 1.25);

        // 2. Cosmic Release Resonant Tone (528Hz Solfeggio)
        setTimeout(() => {
          const resOsc = ctx.createOscillator();
          const resGain = ctx.createGain();
          resOsc.type = "triangle";
          resOsc.frequency.setValueAtTime(528, ctx.currentTime);
          resOsc.frequency.exponentialRampToValueAtTime(176, ctx.currentTime + 3.5);
          resGain.gain.setValueAtTime(0.01, ctx.currentTime);
          resGain.gain.linearRampToValueAtTime(0.35, ctx.currentTime + 0.3);
          resGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 3.8);
          resOsc.connect(resGain);
          resGain.connect(ctx.destination);
          resOsc.start();
          resOsc.stop(ctx.currentTime + 4.0);
        }, 1100);
      }
    } catch (e) {}
  };

  // Extreme Singularity Implosion -> Supernova Burst
  const triggerCosmicCollapse = () => {
    if (!inputText.trim()) return;
    setPhase("imploding");
    triggerBinauralSomaticAudio();
    Vibration.vibrate([0, 40, 60, 80]); // Gravitational vibration sequence

    // 1. Vortex Whirl & Gravitational Pull
    Animated.parallel([
      Animated.timing(vortexRotate, {
        toValue: 1,
        duration: 1200,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(coreScale, {
        toValue: 0.05,
        duration: 1200,
        easing: Easing.in(Easing.back(1.5)),
        useNativeDriver: true,
      }),
      Animated.timing(coreOpacity, {
        toValue: 0.2,
        duration: 1100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // 2. Supernova Explosion Phase
      setPhase("exploding");
      Vibration.vibrate(120); // Physical blast rumble

      flashOpacity.setValue(1);
      shockwave.setValue(0.1);
      shockwaveAlpha.setValue(1);

      Animated.parallel([
        // White-out flash dissipation
        Animated.timing(flashOpacity, {
          toValue: 0,
          duration: 900,
          useNativeDriver: true,
        }),
        // Radial gravitational shockwave
        Animated.timing(shockwave, {
          toValue: 4.8,
          duration: 2200,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(shockwaveAlpha, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
        // 48 High-Velocity Cosmic Shards scattering
        ...shardAnims.map((anim, idx) =>
          Animated.sequence([
            Animated.delay(SHARDS[idx].delay),
            Animated.timing(anim, {
              toValue: 1,
              duration: 2400,
              easing: Easing.out(Easing.cubic),
              useNativeDriver: true,
            }),
          ])
        ),
      ]).start(() => {
        // 3. Somatosensory Vagal Anchor Phase
        setPhase("integration");
        Animated.loop(
          Animated.sequence([
            Animated.timing(breathPacer, { toValue: 1.35, duration: 4000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
            Animated.timing(breathPacer, { toValue: 1.0, duration: 4000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
          ])
        ).start();
      });
    });
  };

  const closeVoidReset = () => {
    coreScale.setValue(1);
    coreOpacity.setValue(1);
    vortexRotate.setValue(0);
    shardAnims.forEach((a) => a.setValue(0));
    shockwave.setValue(0.1);
    shockwaveAlpha.setValue(0);
    setInputText("");
    setPhase("idle");
    setVoidActive(false);
  };

  const handleAnchor = () => {
    if (!inputText.trim()) return;
    const entry = {
      id: Date.now().toString(),
      thought: inputText.trim(),
      timestamp: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }),
    };
    saveEntries([entry, ...entries]);
    setInputText("");
  };

  const rotInterpolate = vortexRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "720deg"],
  });

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#05060A" />
      <View style={styles.main}>
        {/* Top Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backTouch}>
            <AppText style={styles.backGlyph}>‹ Back</AppText>
          </Pressable>
          <View style={{ flex: 1 }}>
            <AppText style={styles.hTitle}>Sanctuary Void</AppText>
            <AppText style={styles.hSub}>Neuro-Somatic Thought Evaporator</AppText>
          </View>
        </View>

        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
          <FlatList
            data={entries}
            keyExtractor={(i) => i.id}
            contentContainerStyle={styles.list}
            ListHeaderComponent={
              <View style={styles.lead}>
                <View style={styles.kickerBox}>
                  <AppText style={styles.kickerTag}>SINGULARITY DEFUSION CHAMBER</AppText>
                  <AppText style={styles.kickerDesc}>
                    Type your deepest mental strain below. Enter the Cosmic Void to physically implode and scatter it into space.
                  </AppText>
                </View>

                {/* Input Matrix */}
                <View style={styles.field}>
                  <TextInput
                    placeholder="Write whatever is causing unbearable weight, chaos, or tension..."
                    placeholderTextColor="#475569"
                    value={inputText}
                    onChangeText={setInputText}
                    multiline
                    numberOfLines={5}
                    style={styles.fieldInput}
                  />
                </View>

                {/* Main Action Portals */}
                <View style={{ gap: 10 }}>
                  <Pressable
                    onPress={() => setVoidActive(true)}
                    style={[styles.portalTrigger, !inputText.trim() && { opacity: 0.35 }]}
                    disabled={!inputText.trim()}
                  >
                    <View style={styles.portalOrb}>
                      <AppText style={{ fontSize: 22 }}>🕳️</AppText>
                    </View>
                    <View style={{ flex: 1 }}>
                      <AppText style={styles.portalTxt}>Launch Gravitational Collapse</AppText>
                      <AppText style={styles.portalSubTxt}>Full-Screen Singularity & Binaural Burst</AppText>
                    </View>
                    <AppText style={styles.portalArrow}>→</AppText>
                  </Pressable>

                  <Pressable
                    onPress={handleAnchor}
                    style={[styles.anchorTrigger, !inputText.trim() && { opacity: 0.35 }]}
                    disabled={!inputText.trim()}
                  >
                    <AppText style={styles.anchorTxt}>Anchor as Integrated Wisdom ⚓</AppText>
                  </Pressable>
                </View>

                {entries.length > 0 && (
                  <View style={{ marginTop: 14 }}>
                    <AppText style={styles.archiveTitle}>Anchored Wisdom Archive</AppText>
                  </View>
                )}
              </View>
            }
            renderItem={({ item }) => (
              <View style={styles.savedCard}>
                <View style={styles.savedHead}>
                  <AppText style={styles.savedTime}>{item.timestamp}</AppText>
                  <Pressable onPress={() => saveEntries(entries.filter((x) => x.id !== item.id))}>
                    <AppText style={styles.del}>×</AppText>
                  </Pressable>
                </View>
                <AppText style={styles.savedBody}>{item.thought}</AppText>
              </View>
            )}
          />
        </KeyboardAvoidingView>

        {/* 🕳️ FULL-SCREEN ULTIMATE GRAVITATIONAL SINGULARITY VOID 🕳️ */}
        <Modal visible={voidActive} transparent animationType="fade">
          <View style={styles.void}>
            <StatusBar hidden />

            {/* Ambient Deep Space Nebulas */}
            <View style={styles.nebulaTop} />
            <View style={styles.nebulaBottom} />

            {/* White-Out Supernova Flash */}
            <Animated.View
              pointerEvents="none"
              style={[styles.flashScreen, { opacity: flashOpacity }]}
            />

            {/* Expanding Gravitational Shockwave Ring */}
            {(phase === "exploding" || phase === "integration") && (
              <Animated.View
                pointerEvents="none"
                style={[
                  styles.shockwaveRing,
                  {
                    transform: [{ scale: shockwave }],
                    opacity: shockwaveAlpha,
                  },
                ]}
              />
            )}

            {/* 48 Stardust Nova Shards */}
            {phase === "exploding" &&
              SHARDS.map((s, idx) => {
                const anim = shardAnims[idx];
                const translateX = anim.interpolate({ inputRange: [0, 1], outputRange: [0, s.tx] });
                const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [0, s.ty] });
                const opacity = anim.interpolate({ inputRange: [0, 0.1, 0.6, 1], outputRange: [0, 1, 0.5, 0] });
                const scale = anim.interpolate({ inputRange: [0, 0.3, 1], outputRange: [0.3, 2.2, 0.1] });

                return (
                  <Animated.View
                    key={s.id}
                    pointerEvents="none"
                    style={[
                      styles.shard,
                      {
                        width: s.size,
                        height: s.size,
                        borderRadius: s.size / 2,
                        backgroundColor: s.color,
                        opacity,
                        transform: [{ translateX }, { translateY }, { scale }],
                      },
                    ]}
                  />
                );
              })}

            {/* Center Gravitational Core */}
            <View style={styles.centerStage}>
              {phase !== "integration" ? (
                <Animated.View
                  style={[
                    styles.coreCard,
                    {
                      opacity: coreOpacity,
                      transform: [
                        { scale: coreScale },
                        { rotate: rotInterpolate },
                      ],
                    },
                  ]}
                >
                  <View style={styles.singularityBadge}>
                    <AppText style={styles.singularityTxt}>
                      {phase === "imploding" ? "CRUSHING INTO SINGULARITY..." : "BOUND MENTAL GRAVITY"}
                    </AppText>
                  </View>
                  <AppText style={styles.coreThought}>"{inputText}"</AppText>
                  <AppText style={styles.coreHint}>
                    {phase === "imploding"
                      ? "Witness the density collapse. Your mind is releasing its grip."
                      : "These are neuron electrical impulses, not your identity."}
                  </AppText>
                </Animated.View>
              ) : (
                /* Post-Supernova Parasympathetic Lock */
                <View style={styles.somaticLockChamber}>
                  <Animated.View
                    style={[
                      styles.pacerHalo,
                      { transform: [{ scale: breathPacer }] },
                    ]}
                  />
                  <View style={styles.pacerCore}>
                    <AppText style={{ fontSize: 32 }}>🫁</AppText>
                  </View>

                  <AppText style={styles.lockBadge}>NEURO-BIOLOGICAL SYSTEM DETOXIFIED</AppText>
                  <AppText style={styles.lockTitle}>Vagus Reset Coherence</AppText>
                  <AppText style={styles.lockBody}>
                    Match your breath with the expanding halo. Inhale as it blooms... exhale all tension as it settles.
                  </AppText>

                  <Pressable onPress={closeVoidReset} style={styles.sealBtn}>
                    <AppText style={styles.sealBtnTxt}>Accept the Calm • Seal Sanctuary</AppText>
                  </Pressable>
                </View>
              )}
            </View>

            {/* Action Bar (Only Idle) */}
            {phase === "idle" && (
              <View style={styles.bottomBar}>
                <Pressable onPress={() => setVoidActive(false)} style={styles.cancelBtn}>
                  <AppText style={styles.cancelTxt}>Step Back</AppText>
                </Pressable>

                <Pressable onPress={triggerCosmicCollapse} style={styles.igniteBtn}>
                  <AppText style={styles.igniteTxt}>COLLAPSE TO STARDUST ✨</AppText>
                </Pressable>
              </View>
            )}
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#05060A" },
  main: { flex: 1, backgroundColor: "#05060A" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#131726",
  },
  backTouch: { paddingRight: 14, paddingVertical: 4 },
  backGlyph: { fontSize: 20, color: "#818CF8", fontWeight: "700" },
  hTitle: { fontSize: 16, fontWeight: "800", color: "#F8FAFC" },
  hSub: { fontSize: 11, color: "#94A3B8" },
  list: { paddingHorizontal: 16, paddingBottom: 40, gap: 14 },
  lead: { gap: 14, paddingVertical: 8 },
  kickerBox: {
    backgroundColor: "#0D1020",
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#1E2442",
    gap: 4,
  },
  kickerTag: { fontSize: 10, fontWeight: "800", color: "#818CF8", letterSpacing: 1.2 },
  kickerDesc: { fontSize: 13, lineHeight: 19, color: "#CBD5E1" },
  field: {
    width: "100%",
    backgroundColor: "#0F1224",
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "#20264A",
    padding: 16,
    minHeight: 140,
  },
  fieldInput: {
    color: "#FFFFFF",
    fontSize: 15,
    lineHeight: 23,
    textAlignVertical: "top",
    minHeight: 110,
  },
  portalTrigger: {
    backgroundColor: "#161338",
    borderWidth: 1.5,
    borderColor: "#6366F1",
    padding: 16,
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    shadowColor: "#6366F1",
    shadowOpacity: 0.5,
    shadowRadius: 18,
    elevation: 10,
  },
  portalOrb: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#2E1E66",
    alignItems: "center",
    justifyContent: "center",
  },
  portalTxt: { fontSize: 15, fontWeight: "800", color: "#FFFFFF" },
  portalSubTxt: { fontSize: 11, color: "#A5B4FC", marginTop: 2 },
  portalArrow: { fontSize: 20, color: "#818CF8", fontWeight: "700" },
  anchorTrigger: {
    backgroundColor: "#101222",
    borderWidth: 1,
    borderColor: "#1E2444",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  anchorTxt: { color: "#94A3B8", fontWeight: "700", fontSize: 12 },
  archiveTitle: { fontSize: 15, fontWeight: "800", color: "#F8FAFC" },
  savedCard: {
    backgroundColor: "#0C0E1B",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "#181D36",
    gap: 8,
  },
  savedHead: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  savedTime: { fontSize: 11, fontWeight: "700", color: "#818CF8" },
  del: { color: "#64748B", fontSize: 18, fontWeight: "700" },
  savedBody: { fontSize: 13, lineHeight: 20, color: "#E2E8F0" },

  /* VOID COSMIC STYLES */
  void: {
    flex: 1,
    backgroundColor: "#020306",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  nebulaTop: {
    position: "absolute",
    top: -100,
    width: W * 1.3,
    height: 400,
    borderRadius: 200,
    backgroundColor: "#2E1065",
    opacity: 0.25,
  },
  nebulaBottom: {
    position: "absolute",
    bottom: -100,
    width: W * 1.3,
    height: 400,
    borderRadius: 200,
    backgroundColor: "#1E1B4B",
    opacity: 0.28,
  },
  flashScreen: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#FFFFFF",
    zIndex: 99,
  },
  shockwaveRing: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 3,
    borderColor: "#C084FC",
    shadowColor: "#818CF8",
    shadowOpacity: 1,
    shadowRadius: 26,
  },
  shard: {
    position: "absolute",
    shadowColor: "#FFFFFF",
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 10,
  },
  centerStage: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 340,
  },
  coreCard: {
    width: "100%",
    backgroundColor: "#0A0C18",
    borderRadius: 26,
    borderWidth: 2,
    borderColor: "#4F46E5",
    padding: 26,
    alignItems: "center",
    gap: 16,
    shadowColor: "#6366F1",
    shadowOpacity: 0.8,
    shadowRadius: 36,
  },
  singularityBadge: {
    backgroundColor: "#1E1B4B",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#6366F1",
  },
  singularityTxt: { fontSize: 9, fontWeight: "900", color: "#A5B4FC", letterSpacing: 1.5 },
  coreThought: {
    fontSize: 20,
    lineHeight: 30,
    color: "#FFFFFF",
    textAlign: "center",
    fontStyle: "italic",
    fontWeight: "700",
  },
  coreHint: { fontSize: 12, color: "#94A3B8", textAlign: "center", lineHeight: 18 },
  somaticLockChamber: { alignItems: "center", gap: 14, paddingHorizontal: 16 },
  pacerHalo: {
    position: "absolute",
    top: -16,
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: "#065F46",
    opacity: 0.35,
  },
  pacerCore: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: "#064E3B",
    borderWidth: 2.5,
    borderColor: "#34D399",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
    shadowColor: "#10B981",
    shadowOpacity: 0.7,
    shadowRadius: 20,
  },
  lockBadge: { fontSize: 10, fontWeight: "900", color: "#34D399", letterSpacing: 2 },
  lockTitle: { fontSize: 26, fontWeight: "900", color: "#FFFFFF" },
  lockBody: { fontSize: 14, lineHeight: 22, color: "#CBD5E1", textAlign: "center" },
  sealBtn: {
    marginTop: 14,
    backgroundColor: "#10B981",
    paddingVertical: 16,
    paddingHorizontal: 26,
    borderRadius: 18,
    alignItems: "center",
    shadowColor: "#10B981",
    shadowOpacity: 0.6,
    shadowRadius: 20,
  },
  sealBtnTxt: { color: "#042F2E", fontWeight: "900", fontSize: 13, letterSpacing: 0.5 },
  bottomBar: {
    position: "absolute",
    bottom: 40,
    left: 20,
    right: 20,
    flexDirection: "row",
    gap: 12,
  },
  cancelBtn: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 18,
    backgroundColor: "#111424",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#1E2544",
  },
  cancelTxt: { color: "#94A3B8", fontWeight: "700", fontSize: 13 },
  igniteBtn: {
    flex: 1,
    backgroundColor: "#6366F1",
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "#A5B4FC",
    shadowColor: "#6366F1",
    shadowOpacity: 0.9,
    shadowRadius: 25,
    elevation: 12,
  },
  igniteTxt: { color: "#FFFFFF", fontWeight: "900", fontSize: 13, letterSpacing: 1 },
});
