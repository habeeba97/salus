import React, { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Animated,
  Pressable,
  Dimensions,
  Modal,
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
  const [flipped, setFlipped] = useState(false);

  // Animations
  const mascotTranslateY = useRef(new Animated.Value(40)).current;
  const mascotScale = useRef(new Animated.Value(0.8)).current;
  const cardScale = useRef(new Animated.Value(0.9)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const glowOpacity = useRef(new Animated.Value(0)).current;
  const starOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setFact(getTodayFact());
      setFlipped(false);

      // Intro animation sequence
      Animated.parallel([
        Animated.timing(cardOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.spring(cardScale, {
          toValue: 1,
          friction: 6,
          useNativeDriver: true,
        }),
        Animated.timing(starOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]).start();

      // Mascot peeks from behind card
      setTimeout(() => {
        Animated.parallel([
          Animated.spring(mascotTranslateY, {
            toValue: -20,
            friction: 5,
            tension: 40,
            useNativeDriver: true,
          }),
          Animated.spring(mascotScale, {
            toValue: 1,
            friction: 6,
            useNativeDriver: true,
          }),
        ]).start();
      }, 400);

      // Reveal fact & glow beam
      setTimeout(() => {
        setFlipped(true);
        Animated.timing(glowOpacity, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }).start();
      }, 1200);
    }
  }, [visible]);

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(cardOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(glowOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(cardScale, {
        toValue: 0.85,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onDismiss();
    });
  };

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable style={styles.backdrop} onPress={handleClose}>
        {/* Ambient Glow Beam */}
        <Animated.View
          style={[
            styles.glowBeam,
            {
              opacity: glowOpacity,
            },
          ]}
        />

        {/* Brand Header */}
        <View style={styles.topBrand}>
          <AppText style={styles.brandTitle}>Salus</AppText>
          <View style={styles.brandDot} />
        </View>

        {/* Twinkling Stars */}
        <Animated.View style={[styles.starsContainer, { opacity: starOpacity }]}>
          <AppText style={[styles.star, { top: "25%", left: "18%" }]}>✦</AppText>
          <AppText style={[styles.star, { top: "35%", right: "20%" }]}>✧</AppText>
          <AppText style={[styles.star, { bottom: "28%", left: "15%" }]}>★</AppText>
          <AppText style={[styles.star, { bottom: "24%", right: "16%" }]}>✦</AppText>
        </Animated.View>

        {/* Center Deck Area */}
        <View style={styles.centerContainer}>
          {/* Deck background shadows */}
          <View style={[styles.deckCard, styles.deckCardBack2]} />
          <View style={[styles.deckCard, styles.deckCardBack1]} />

          {/* Peeking Mascot behind card */}
          <Animated.View
            style={[
              styles.mascotContainer,
              {
                transform: [
                  { translateY: mascotTranslateY },
                  { scale: mascotScale },
                ],
              },
            ]}
          >
            <View style={styles.mascotFace}>
              <AppText style={styles.mascotEmoji}>🐱</AppText>
            </View>
          </Animated.View>

          {/* Main Card */}
          <Animated.View
            style={[
              styles.mainCard,
              {
                opacity: cardOpacity,
                transform: [{ scale: cardScale }],
              },
            ]}
          >
            <View style={styles.cardHeaderBadge}>
              <AppText style={styles.cardBadgeText}>DAY FACT</AppText>
            </View>

            <View style={styles.cardContent}>
              {!flipped ? (
                <View style={styles.unflippedState}>
                  <AppText style={styles.deckLabel}>Day fact</AppText>
                  <AppText style={styles.sparkleIcon}>✨</AppText>
                </View>
              ) : (
                <View style={styles.factContainer}>
                  <AppText style={styles.factText}>{fact.fact}</AppText>
                  <View style={styles.divider} />
                  <AppText style={styles.categoryText}>{fact.category}</AppText>
                  <AppText style={styles.tipText}>💡 {fact.tip}</AppText>
                </View>
              )}
            </View>
          </Animated.View>
        </View>

        {/* Bottom CTA Button */}
        <Pressable style={styles.continueBtn} onPress={handleClose}>
          <AppText style={styles.continueText}>Start My Practice  →</AppText>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "#2E368F",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 50,
  },
  glowBeam: {
    position: "absolute",
    top: 0,
    width: width * 0.9,
    height: height * 0.75,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderBottomLeftRadius: width * 0.45,
    borderBottomRightRadius: width * 0.45,
    transform: [{ scaleX: 1.2 }],
  },
  topBrand: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 10,
  },
  brandTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
  brandDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#FBBF24",
    marginTop: 6,
  },
  starsContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  star: {
    position: "absolute",
    color: "#FFFFFF",
    fontSize: 16,
    opacity: 0.7,
  },
  centerContainer: {
    width: width * 0.78,
    maxWidth: 320,
    height: 380,
    alignItems: "center",
    justifyContent: "center",
  },
  deckCard: {
    position: "absolute",
    width: "100%",
    height: 340,
    borderRadius: 24,
    backgroundColor: "rgba(129, 140, 248, 0.25)",
  },
  deckCardBack2: {
    transform: [{ rotate: "-6deg" }, { scale: 0.94 }],
  },
  deckCardBack1: {
    transform: [{ rotate: "4deg" }, { scale: 0.97 }],
  },
  mascotContainer: {
    position: "absolute",
    top: -24,
    zIndex: 1,
    alignItems: "center",
  },
  mascotFace: {
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: "#FDE047",
    borderWidth: 3,
    borderColor: "#FEF08A",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  mascotEmoji: {
    fontSize: 42,
  },
  mainCard: {
    width: "100%",
    height: 340,
    borderRadius: 24,
    backgroundColor: "#6366F1",
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.35)",
    padding: 20,
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 10,
    zIndex: 2,
  },
  cardHeaderBadge: {
    alignSelf: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  cardBadgeText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1,
  },
  cardContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 8,
  },
  unflippedState: {
    alignItems: "center",
    gap: 8,
  },
  deckLabel: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  sparkleIcon: {
    fontSize: 24,
  },
  factContainer: {
    alignItems: "center",
  },
  factText: {
    fontSize: 17,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
    lineHeight: 25,
  },
  divider: {
    width: 40,
    height: 2,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    marginVertical: 14,
  },
  categoryText: {
    fontSize: 11,
    color: "#E0E7FF",
    fontWeight: "600",
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  tipText: {
    fontSize: 12.5,
    color: "#FEF08A",
    textAlign: "center",
    marginTop: 8,
    lineHeight: 18,
    fontWeight: "500",
  },
  continueBtn: {
    backgroundColor: "#FBBF24",
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 28,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,
  },
  continueText: {
    color: "#1E1B4B",
    fontSize: 15,
    fontWeight: "800",
  },
});
