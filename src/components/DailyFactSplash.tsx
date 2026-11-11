import React, { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Animated,
  Pressable,
  Dimensions,
  Easing,
} from "react-native";
import { AppText } from "./AppText";
import { getTodayFact, DailyFact } from "../data/dailyFacts";

const { width, height } = Dimensions.get("window");

interface DailyFactSplashProps {
  visible: boolean;
  onDismiss: () => void;
}

export function DailyFactSplash({ visible, onDismiss }: DailyFactSplashProps) {
  const [fact, setFact] = useState<DailyFact>(getTodayFact());
  const [revealed, setRevealed] = useState(false);

  // Core visual animation values
  const cardScale = useRef(new Animated.Value(0.7)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const pulseAura = useRef(new Animated.Value(1)).current;
  const mascotBob = useRef(new Animated.Value(0)).current;
  const starTwinkle = useRef(new Animated.Value(0.3)).current;

  // Transition to next screen full-screen visual wave
  const exitWaveScale = useRef(new Animated.Value(0)).current;
  const exitWaveOpacity = useRef(new Animated.Value(0)).current;
  const screenFade = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!visible) return;

    setFact(getTodayFact());
    setRevealed(false);

    // 1. Initial card emergence & soft pop
    Animated.parallel([
      Animated.timing(cardOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(cardScale, {
        toValue: 1,
        friction: 5,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    // 2. Continuous living aura pulse behind the deck
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAura, {
          toValue: 1.25,
          duration: 2200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAura, {
          toValue: 1,
          duration: 2200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // 3. Mascot floating breath motion
    Animated.loop(
      Animated.sequence([
        Animated.timing(mascotBob, {
          toValue: -12,
          duration: 1800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(mascotBob, {
          toValue: 0,
          duration: 1800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // 4. Background stars twinkle
    Animated.loop(
      Animated.sequence([
        Animated.timing(starTwinkle, {
          toValue: 1,
          duration: 1400,
          useNativeDriver: true,
        }),
        Animated.timing(starTwinkle, {
          toValue: 0.25,
          duration: 1400,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // 5. Flip and illuminate the wisdom fact
    const timer = setTimeout(() => {
      setRevealed(true);
    }, 900);

    return () => clearTimeout(timer);
  }, [visible]);

  // Immersive full-screen transition when user taps "Start My Practice"
  const handleStartPractice = () => {
    Animated.parallel([
      // Expanding visual warp ring
      Animated.timing(exitWaveOpacity, {
        toValue: 0.95,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(exitWaveScale, {
        toValue: 4.5,
        duration: 750,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      // Fade out current screen smoothly into the home screen
      Animated.timing(screenFade, {
        toValue: 0,
        duration: 700,
        delay: 150,
        useNativeDriver: true,
      }),
      Animated.timing(cardScale, {
        toValue: 1.15,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onDismiss();
    });
  };

  if (!visible) return null;

  return (
    <Animated.View style={[styles.fullOverlay, { opacity: screenFade }]}>
      {/* Dynamic Background Glowing Halos */}
      <View style={styles.ambientGlowTop} />
      <Animated.View
        style={[
          styles.pulsingCenterGlow,
          {
            transform: [{ scale: pulseAura }],
          },
        ]}
      />
      <View style={styles.ambientGlowBottom} />

      {/* Floating Constellations & Sparkles */}
      <Animated.View style={[styles.starsOverlay, { opacity: starTwinkle }]}>
        <AppText style={[styles.starIcon, { top: "14%", left: "18%" }]}>✦</AppText>
        <AppText style={[styles.starIcon, { top: "22%", right: "16%" }]}>✧</AppText>
        <AppText style={[styles.starIcon, { top: "38%", left: "10%" }]}>★</AppText>
        <AppText style={[styles.starIcon, { top: "62%", right: "12%" }]}>✦</AppText>
        <AppText style={[styles.starIcon, { bottom: "18%", left: "22%" }]}>✧</AppText>
      </Animated.View>

      {/* Top App Identity */}
      <View style={styles.brandRow}>
        <AppText style={styles.brandTitle}>SALUS</AppText>
        <View style={styles.brandSparkle} />
      </View>

      {/* Main Tarot & Deck Centerpiece */}
      <View style={styles.deckContainer}>
        {/* Layered Card Stack for 3D depth */}
        <View style={[styles.cardShadowLayer, styles.cardLayerTwo]} />
        <View style={[styles.cardShadowLayer, styles.cardLayerOne]} />

        {/* Mascot Peeking from the Wisdom Deck */}
        <Animated.View
          style={[
            styles.mascotHolder,
            {
              transform: [{ translateY: mascotBob }],
            },
          ]}
        >
          <View style={styles.mascotGlow} />
          <View style={styles.mascotFace}>
            <AppText style={styles.mascotEmoji}>🐱</AppText>
          </View>
        </Animated.View>

        {/* Foreground Wisdom Card */}
        <Animated.View
          style={[
            styles.heroCard,
            {
              opacity: cardOpacity,
              transform: [{ scale: cardScale }],
            },
          ]}
        >
          <View style={styles.cardHeader}>
            <View style={styles.badgePill}>
              <AppText style={styles.badgePillText}>✦ DAY FACT ✦</AppText>
            </View>
          </View>

          <View style={styles.cardBody}>
            {!revealed ? (
              <View style={styles.loadingDeck}>
                <AppText style={styles.deckPrompt}>Daily Wisdom</AppText>
                <AppText style={styles.deckSparkles}>✨</AppText>
              </View>
            ) : (
              <View style={styles.revealedContent}>
                <AppText style={styles.factCategory}>{fact.category}</AppText>
                <AppText style={styles.factQuote}>"{fact.fact}"</AppText>
                <View style={styles.goldDivider} />
                <View style={styles.tipCard}>
                  <AppText style={styles.tipLabel}>MICRO PRACTICE</AppText>
                  <AppText style={styles.tipBody}>{fact.tip}</AppText>
                </View>
              </View>
            )}
          </View>

          <View style={styles.cardFooter}>
            <AppText style={styles.footerNote}>{fact.source}</AppText>
          </View>
        </Animated.View>
      </View>

      {/* CTA Button */}
      <Pressable
        style={({ pressed }) => [
          styles.actionBtn,
          pressed && styles.actionBtnPressed,
        ]}
        onPress={handleStartPractice}
      >
        <AppText style={styles.actionBtnText}>Start My Practice  →</AppText>
      </Pressable>

      {/* Full-Screen Transition Wave that sweeps the screen */}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.screenTransitionWave,
          {
            opacity: exitWaveOpacity,
            transform: [{ scale: exitWaveScale }],
          },
        ]}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  fullOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
    backgroundColor: "#161730",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 54,
  },
  ambientGlowTop: {
    position: "absolute",
    top: -120,
    width: width * 1.2,
    height: 340,
    borderRadius: 200,
    backgroundColor: "rgba(99, 102, 241, 0.28)",
  },
  pulsingCenterGlow: {
    position: "absolute",
    top: height * 0.26,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: "rgba(168, 85, 247, 0.22)",
  },
  ambientGlowBottom: {
    position: "absolute",
    bottom: -80,
    width: width,
    height: 260,
    borderRadius: 150,
    backgroundColor: "rgba(244, 63, 94, 0.15)",
  },
  starsOverlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  starIcon: {
    position: "absolute",
    color: "#FDE68A",
    fontSize: 16,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 8,
  },
  brandTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: 4,
  },
  brandSparkle: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#FBBF24",
  },
  deckContainer: {
    width: Math.min(width * 0.85, 340),
    height: 410,
    alignItems: "center",
    justifyContent: "center",
  },
  cardShadowLayer: {
    position: "absolute",
    width: "100%",
    height: 380,
    borderRadius: 30,
    backgroundColor: "rgba(99, 102, 241, 0.3)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
  },
  cardLayerTwo: {
    transform: [{ rotate: "-7deg" }, { scale: 0.94 }],
    opacity: 0.5,
  },
  cardLayerOne: {
    transform: [{ rotate: "5deg" }, { scale: 0.97 }],
    opacity: 0.8,
  },
  mascotHolder: {
    position: "absolute",
    top: -30,
    zIndex: 10,
    alignItems: "center",
  },
  mascotGlow: {
    position: "absolute",
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(251, 191, 36, 0.4)",
  },
  mascotFace: {
    width: 74,
    height: 74,
    borderRadius: 37,
    backgroundColor: "#FCD34D",
    borderWidth: 3,
    borderColor: "#FEF08A",
    alignItems: "center",
    justifyContent: "center",
  },
  mascotEmoji: {
    fontSize: 38,
  },
  heroCard: {
    width: "100%",
    height: 390,
    borderRadius: 30,
    backgroundColor: "#3A387E",
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.35)",
    paddingHorizontal: 22,
    paddingVertical: 18,
    justifyContent: "space-between",
    zIndex: 5,
  },
  cardHeader: {
    alignItems: "center",
    marginTop: 18,
  },
  badgePill: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.25)",
  },
  badgePillText: {
    color: "#FEF08A",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.5,
  },
  cardBody: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
  },
  loadingDeck: {
    alignItems: "center",
    gap: 10,
  },
  deckPrompt: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  deckSparkles: {
    fontSize: 28,
  },
  revealedContent: {
    alignItems: "center",
    width: "100%",
  },
  factCategory: {
    fontSize: 11,
    fontWeight: "700",
    color: "#CBD5E1",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
  },
  factQuote: {
    fontSize: 16.5,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
    lineHeight: 24,
  },
  goldDivider: {
    width: 48,
    height: 2,
    backgroundColor: "#FBBF24",
    marginVertical: 12,
    borderRadius: 1,
  },
  tipCard: {
    backgroundColor: "rgba(0, 0, 0, 0.22)",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    width: "100%",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  tipLabel: {
    color: "#FBBF24",
    fontSize: 9.5,
    fontWeight: "800",
    letterSpacing: 1,
    marginBottom: 3,
  },
  tipBody: {
    color: "#E2E8F0",
    fontSize: 12,
    lineHeight: 17,
  },
  cardFooter: {
    alignItems: "center",
  },
  footerNote: {
    fontSize: 10.5,
    color: "#94A3B8",
    fontStyle: "italic",
  },
  actionBtn: {
    backgroundColor: "#FBBF24",
    paddingHorizontal: 36,
    paddingVertical: 15,
    borderRadius: 30,
    shadowColor: "#FBBF24",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
  },
  actionBtnPressed: {
    transform: [{ scale: 0.96 }],
    backgroundColor: "#F59E0B",
  },
  actionBtnText: {
    color: "#1E1B4B",
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  screenTransitionWave: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "#4F46E5",
    zIndex: 99999,
  },
});
