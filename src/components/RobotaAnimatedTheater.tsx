import React, { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Pressable,
  Animated,
  Easing,
  Modal,
} from "react-native";
import { AppText } from "./AppText";

interface RobotaScene {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  bgTop: string;
  bgBottom: string;
  visorGlow: string;
  particleColor: string;
  eyeMode: "happy" | "sleepy" | "love" | "zen";
}

const ROBOTA_SCENES: RobotaScene[] = [
  {
    id: "stargaze",
    title: "Robota's Midnight Stargaze",
    subtitle: "Bioluminescent fireflies & deep calm",
    tag: "LOOP • 60FPS",
    bgTop: "#0B1026",
    bgBottom: "#1E1B4B",
    visorGlow: "#38BDF8",
    particleColor: "#FDE047",
    eyeMode: "happy",
  },
  {
    id: "rainy-window",
    title: "Cozy Rainy Sanctuary",
    subtitle: "Gentle glowing rain & warm core",
    tag: "SOOTHING",
    bgTop: "#091526",
    bgBottom: "#134E4A",
    visorGlow: "#34D399",
    particleColor: "#67E8F9",
    eyeMode: "sleepy",
  },
  {
    id: "heart-orbit",
    title: "Oxytocin Warmth Loop",
    subtitle: "Floating heart sparks & gentle sway",
    tag: "COMFORT",
    bgTop: "#1F102E",
    bgBottom: "#4C1D95",
    visorGlow: "#F472B6",
    particleColor: "#F9A8D4",
    eyeMode: "love",
  },
  {
    id: "zen-lotus",
    title: "Vagal Breath Companion",
    subtitle: "Synchronized chest-light expansion",
    tag: "BREATH SYNC",
    bgTop: "#121029",
    bgBottom: "#312E81",
    visorGlow: "#A78BFA",
    particleColor: "#C4B5FD",
    eyeMode: "zen",
  },
];

const PARTICLES = [
  { left: "12%", size: 5, duration: 4200, delay: 0 },
  { left: "26%", size: 4, duration: 5100, delay: 600 },
  { left: "42%", size: 6, duration: 4600, delay: 1200 },
  { left: "58%", size: 4, duration: 5400, delay: 300 },
  { left: "74%", size: 5, duration: 4400, delay: 900 },
  { left: "86%", size: 4, duration: 4900, delay: 1500 },
];

export function RobotaAnimatedTheater() {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isBlinking, setIsBlinking] = useState<boolean>(false);

  const hoverAnim = useRef(new Animated.Value(0)).current;
  const tiltAnim = useRef(new Animated.Value(0)).current;
  const antennaPulse = useRef(new Animated.Value(0.4)).current;
  const coreBreath = useRef(new Animated.Value(0.9)).current;
  const waveRing = useRef(new Animated.Value(0)).current;

  const particleAnims = useRef(PARTICLES.map(() => new Animated.Value(0))).current;

  const scene = ROBOTA_SCENES[activeIndex];

  // Natural blinking loop
  useEffect(() => {
    if (!isPlaying) return;
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 180);
    }, 3400);
    return () => clearInterval(blinkInterval);
  }, [isPlaying]);

  // Continuous 60fps Robota & Ambient Particle Animation Loop
  useEffect(() => {
    if (!isPlaying) return;

    const hoverLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(hoverAnim, {
          toValue: -10,
          duration: 1800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(hoverAnim, {
          toValue: 4,
          duration: 1800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );

    const tiltLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(tiltAnim, {
          toValue: 1,
          duration: 2400,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(tiltAnim, {
          toValue: -1,
          duration: 2400,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );

    const antennaLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(antennaPulse, {
          toValue: 1,
          duration: 1100,
          useNativeDriver: true,
        }),
        Animated.timing(antennaPulse, {
          toValue: 0.35,
          duration: 1100,
          useNativeDriver: true,
        }),
      ])
    );

    const coreLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(coreBreath, {
          toValue: 1.25,
          duration: 2200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(coreBreath, {
          toValue: 0.85,
          duration: 2200,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );

    const ringLoop = Animated.loop(
      Animated.timing(waveRing, {
        toValue: 1,
        duration: 3200,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      })
    );

    const pLoops = particleAnims.map((anim, idx) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(PARTICLES[idx].delay),
          Animated.timing(anim, {
            toValue: 1,
            duration: PARTICLES[idx].duration,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      )
    );

    hoverLoop.start();
    tiltLoop.start();
    antennaLoop.start();
    coreLoop.start();
    ringLoop.start();
    pLoops.forEach((l) => l.start());

    return () => {
      hoverLoop.stop();
      tiltLoop.stop();
      antennaLoop.stop();
      coreLoop.stop();
      ringLoop.stop();
      pLoops.forEach((l) => l.stop());
    };
  }, [isPlaying, activeIndex]);

  const rotateInterpolate = tiltAnim.interpolate({
    inputRange: [-1, 1],
    outputRange: ["-4deg", "4deg"],
  });

  const waveScale = waveRing.interpolate({
    inputRange: [0, 1],
    outputRange: [0.7, 2.1],
  });

  const waveOpacity = waveRing.interpolate({
    inputRange: [0, 0.7, 1],
    outputRange: [0.55, 0.15, 0],
  });

  const renderRobotaStage = (large = false) => (
    <View
      style={[
        styles.videoStage,
        large && styles.videoStageLarge,
        { backgroundColor: scene.bgTop },
      ]}
    >
      {/* Ambient Lower Horizon Glow */}
      <View
        style={[
          styles.horizonGlow,
          { backgroundColor: scene.bgBottom },
        ]}
      />

      {/* Animated Floating Fireflies / Rain / Petals */}
      {PARTICLES.map((p, idx) => {
        const translateY = particleAnims[idx].interpolate({
          inputRange: [0, 1],
          outputRange: scene.id === "rainy-window" ? [-20, 220] : [200, -20],
        });
        const opacity = particleAnims[idx].interpolate({
          inputRange: [0, 0.2, 0.8, 1],
          outputRange: [0, 0.9, 0.9, 0],
        });

        return (
          <Animated.View
            key={idx}
            style={[
              styles.particle,
              {
                left: p.left as unknown as number,
                width: scene.id === "rainy-window" ? 2 : p.size,
                height: scene.id === "rainy-window" ? 14 : p.size,
                borderRadius: p.size / 2,
                backgroundColor: scene.particleColor,
                opacity,
                transform: [{ translateY }],
              },
            ]}
          />
        );
      })}

      {/* Expanding Sound / Breath Aura Ring Behind Robota */}
      <Animated.View
        style={[
          styles.auraRing,
          {
            borderColor: scene.visorGlow,
            opacity: waveOpacity,
            transform: [{ scale: waveScale }],
          },
        ]}
      />

      {/* Animated Robota Character */}
      <Animated.View
        style={[
          styles.robotaBodyWrapper,
          large && { transform: [{ scale: 1.25 }, { translateY: hoverAnim }, { rotate: rotateInterpolate }] },
          !large && { transform: [{ translateY: hoverAnim }, { rotate: rotateInterpolate }] },
        ]}
      >
        {/* Glowing Antenna */}
        <View style={styles.antennaStem}>
          <Animated.View
            style={[
              styles.antennaBulb,
              {
                backgroundColor: scene.visorGlow,
                opacity: antennaPulse,
                shadowColor: scene.visorGlow,
              },
            ]}
          />
        </View>

        {/* Robota Head */}
        <View style={[styles.robotaHead, { borderColor: scene.visorGlow }]}>
          {/* Ear Pods */}
          <View style={[styles.earLeft, { backgroundColor: scene.visorGlow }]} />
          <View style={[styles.earRight, { backgroundColor: scene.visorGlow }]} />

          {/* Dark Glass Visor */}
          <View style={styles.visorScreen}>
            {isBlinking ? (
              <View style={styles.eyesRow}>
                <View style={[styles.closedEye, { backgroundColor: scene.visorGlow }]} />
                <View style={[styles.closedEye, { backgroundColor: scene.visorGlow }]} />
              </View>
            ) : scene.eyeMode === "love" ? (
              <View style={styles.eyesRow}>
                <AppText style={[styles.symbolEye, { color: scene.visorGlow }]}>♥</AppText>
                <AppText style={[styles.symbolEye, { color: scene.visorGlow }]}>♥</AppText>
              </View>
            ) : scene.eyeMode === "happy" ? (
              <View style={styles.eyesRow}>
                <AppText style={[styles.symbolEye, { color: scene.visorGlow }]}>◠</AppText>
                <AppText style={[styles.symbolEye, { color: scene.visorGlow }]}>◠</AppText>
              </View>
            ) : scene.eyeMode === "zen" ? (
              <View style={styles.eyesRow}>
                <AppText style={[styles.symbolEye, { color: scene.visorGlow }]}>◡</AppText>
                <AppText style={[styles.symbolEye, { color: scene.visorGlow }]}>◡</AppText>
              </View>
            ) : (
              <View style={styles.eyesRow}>
                <View style={[styles.ledEye, { backgroundColor: scene.visorGlow }]} />
                <View style={[styles.ledEye, { backgroundColor: scene.visorGlow }]} />
              </View>
            )}

            {/* Cute Little Smile */}
            <View style={[styles.tinySmile, { borderColor: scene.visorGlow }]} />
          </View>
        </View>

        {/* Robota Torso with Breathing Heart Core */}
        <View style={styles.robotaTorso}>
          <Animated.View
            style={[
              styles.heartCore,
              {
                backgroundColor: scene.visorGlow,
                transform: [{ scale: coreBreath }],
              },
            ]}
          />
        </View>
      </Animated.View>

      {/* Top Overlay Badge */}
      <View style={styles.stageTopBar}>
        <View style={styles.livePill}>
          <View style={[styles.liveDot, { backgroundColor: scene.visorGlow }]} />
          <AppText style={styles.liveText}>{scene.tag}</AppText>
        </View>

        {!large && (
          <Pressable
            onPress={() => setIsFullscreen(true)}
            style={styles.expandBtn}
            hitSlop={10}
          >
            <AppText style={styles.expandText}>⛶ Full Screen</AppText>
          </Pressable>
        )}
      </View>

      {/* Bottom Video Caption Overlay */}
      <View style={styles.stageBottomBar}>
        <View style={{ flex: 1 }}>
          <AppText style={styles.sceneTitle}>{scene.title}</AppText>
          <AppText style={styles.sceneSub}>{scene.subtitle}</AppText>
        </View>

        <Pressable
          onPress={() => setIsPlaying((p) => !p)}
          style={[styles.playPauseCircle, { borderColor: scene.visorGlow }]}
        >
          <AppText style={styles.playPauseIcon}>{isPlaying ? "❚❚" : "▶"}</AppText>
        </Pressable>
      </View>
    </View>
  );

  return (
    <View style={styles.wrapper}>
      <View style={styles.sectionHeader}>
        <View>
          <AppText style={styles.kicker}>ANIMATED COMPANION REELS</AppText>
          <AppText style={styles.heading}>Robota Sanctuary Theater</AppText>
        </View>
        <AppText style={styles.liveBadge}>DIRECT PLAY</AppText>
      </View>

      {/* Main Direct-Play Animated Video Card */}
      {renderRobotaStage(false)}

      {/* Scene Switcher Pills */}
      <View style={styles.sceneSelectorRow}>
        {ROBOTA_SCENES.map((item, idx) => {
          const selected = idx === activeIndex;
          return (
            <Pressable
              key={item.id}
              onPress={() => {
                setActiveIndex(idx);
                setIsPlaying(true);
              }}
              style={[
                styles.sceneChip,
                selected && {
                  borderColor: item.visorGlow,
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                },
              ]}
            >
              <View style={[styles.chipDot, { backgroundColor: item.visorGlow }]} />
              <AppText
                numberOfLines={1}
                style={[styles.chipLabel, selected && styles.chipLabelActive]}
              >
                {item.title.split(" ")[0]}
              </AppText>
            </Pressable>
          );
        })}
      </View>

      {/* Full-Screen Theater Modal */}
      <Modal visible={isFullscreen} animationType="fade" transparent={false}>
        <View style={[styles.fullScreenContainer, { backgroundColor: scene.bgTop }]}>
          <Pressable
            onPress={() => setIsFullscreen(false)}
            style={styles.fullCloseBtn}
          >
            <AppText style={styles.fullCloseText}>✕ Exit Theater</AppText>
          </Pressable>

          {renderRobotaStage(true)}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 16,
    gap: 10,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  kicker: {
    fontSize: 9.5,
    fontWeight: "800",
    color: "#38BDF8",
    letterSpacing: 1.2,
  },
  heading: {
    fontSize: 17,
    fontWeight: "800",
    color: "#F8FAFC",
    marginTop: 2,
  },
  liveBadge: {
    fontSize: 10,
    fontWeight: "800",
    color: "#34D399",
    backgroundColor: "rgba(16, 185, 129, 0.14)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  videoStage: {
    height: 225,
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: 1.5,
    borderColor: "rgba(56, 189, 248, 0.35)",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  videoStageLarge: {
    flex: 1,
    borderRadius: 0,
    borderWidth: 0,
  },
  horizonGlow: {
    position: "absolute",
    bottom: -40,
    width: "130%",
    height: 140,
    borderRadius: 100,
    opacity: 0.65,
  },
  particle: {
    position: "absolute",
    top: 0,
  },
  auraRing: {
    position: "absolute",
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 1.5,
  },
  robotaBodyWrapper: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  antennaStem: {
    width: 3,
    height: 14,
    backgroundColor: "#94A3B8",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  antennaBulb: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    marginTop: -5,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 8,
  },
  robotaHead: {
    width: 86,
    height: 60,
    borderRadius: 22,
    backgroundColor: "#F8FAFC",
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  earLeft: {
    position: "absolute",
    left: -6,
    width: 5,
    height: 20,
    borderRadius: 3,
  },
  earRight: {
    position: "absolute",
    right: -6,
    width: 5,
    height: 20,
    borderRadius: 3,
  },
  visorScreen: {
    width: 70,
    height: 44,
    borderRadius: 15,
    backgroundColor: "#090D16",
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
  },
  eyesRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  ledEye: {
    width: 10,
    height: 12,
    borderRadius: 5,
  },
  closedEye: {
    width: 12,
    height: 2.5,
    borderRadius: 2,
  },
  symbolEye: {
    fontSize: 15,
    fontWeight: "900",
    lineHeight: 17,
  },
  tinySmile: {
    width: 10,
    height: 5,
    borderBottomWidth: 2,
    borderRadius: 5,
  },
  robotaTorso: {
    width: 54,
    height: 36,
    borderRadius: 16,
    backgroundColor: "#E2E8F0",
    marginTop: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  heartCore: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  stageTopBar: {
    position: "absolute",
    top: 12,
    left: 12,
    right: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  livePill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(9, 13, 22, 0.72)",
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 10,
    gap: 5,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  liveText: {
    color: "#E2E8F0",
    fontSize: 9.5,
    fontWeight: "800",
    letterSpacing: 0.8,
  },
  expandBtn: {
    backgroundColor: "rgba(9, 13, 22, 0.72)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  expandText: {
    color: "#F8FAFC",
    fontSize: 10.5,
    fontWeight: "700",
  },
  stageBottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(7, 10, 20, 0.78)",
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 10,
  },
  sceneTitle: {
    color: "#FFFFFF",
    fontSize: 13.5,
    fontWeight: "800",
  },
  sceneSub: {
    color: "#94A3B8",
    fontSize: 11,
  },
  playPauseCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1.5,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  playPauseIcon: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "900",
  },
  sceneSelectorRow: {
    flexDirection: "row",
    gap: 8,
  },
  sceneChip: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(19, 23, 42, 0.82)",
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    gap: 5,
  },
  chipDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  chipLabel: {
    color: "#94A3B8",
    fontSize: 11,
    fontWeight: "700",
  },
  chipLabelActive: {
    color: "#FFFFFF",
    fontWeight: "800",
  },
  fullScreenContainer: {
    flex: 1,
  },
  fullCloseBtn: {
    position: "absolute",
    top: 44,
    right: 20,
    zIndex: 20,
    backgroundColor: "rgba(9, 13, 22, 0.8)",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  fullCloseText: {
    color: "#FFFFFF",
    fontSize: 12.5,
    fontWeight: "800",
  },
});
