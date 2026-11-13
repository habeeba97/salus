import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated, Dimensions, Easing } from "react-native";

const { width, height } = Dimensions.get("window");

export function Ambient3DBackground() {
  const rotateOuter = useRef(new Animated.Value(0)).current;
  const rotateInner = useRef(new Animated.Value(0)).current;
  const orbFloat1 = useRef(new Animated.Value(0)).current;
  const orbFloat2 = useRef(new Animated.Value(0)).current;
  const pulseDepth = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    // 1. Slow 3D Gyroscope Ring Rotation (Outer)
    Animated.loop(
      Animated.timing(rotateOuter, {
        toValue: 1,
        duration: 24000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // 2. Counter-Rotating Inner 3D Orbit
    Animated.loop(
      Animated.timing(rotateInner, {
        toValue: 1,
        duration: 18000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // 3. Floating 3D Luminous Orbs (Z-depth illusion)
    Animated.loop(
      Animated.sequence([
        Animated.timing(orbFloat1, {
          toValue: 1,
          duration: 4500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(orbFloat1, {
          toValue: 0,
          duration: 4500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(orbFloat2, {
          toValue: 1,
          duration: 5500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(orbFloat2, {
          toValue: 0,
          duration: 5500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // 4. Deep Core Breathing Scale
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseDepth, {
          toValue: 1.12,
          duration: 3800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseDepth, {
          toValue: 0.95,
          duration: 3800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const spinOuter = rotateOuter.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const spinInner = rotateInner.interpolate({
    inputRange: [0, 1],
    outputRange: ["360deg", "0deg"],
  });

  const translateY1 = orbFloat1.interpolate({
    inputRange: [0, 1],
    outputRange: [-18, 22],
  });

  const scale1 = orbFloat1.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.9, 1.15, 0.9],
  });

  const translateY2 = orbFloat2.interpolate({
    inputRange: [0, 1],
    outputRange: [20, -24],
  });

  return (
    <View pointerEvents="none" style={styles.container}>
      {/* Deep Atmospheric Nebula Glows */}
      <Animated.View
        style={[
          styles.nebulaCore,
          { transform: [{ scale: pulseDepth }] },
        ]}
      />
      <View style={styles.nebulaBottom} />

      {/* 3D Perspective Tilted Orbital Rings */}
      <View style={styles.orbitalPlane}>
        <Animated.View
          style={[
            styles.ringOuter,
            {
              transform: [
                { perspective: 800 },
                { rotateX: "68deg" },
                { rotateY: "-14deg" },
                { rotateZ: spinOuter },
              ],
            },
          ]}
        >
          <View style={styles.ringNodeTop} />
          <View style={styles.ringNodeBottom} />
        </Animated.View>

        <Animated.View
          style={[
            styles.ringInner,
            {
              transform: [
                { perspective: 800 },
                { rotateX: "72deg" },
                { rotateY: "18deg" },
                { rotateZ: spinInner },
              ],
            },
          ]}
        >
          <View style={styles.ringNodeGold} />
        </Animated.View>
      </View>

      {/* Floating 3D Depth Spheres */}
      <Animated.View
        style={[
          styles.spherePrimary,
          {
            transform: [{ translateY: translateY1 }, { scale: scale1 }],
          },
        ]}
      >
        <View style={styles.sphereHighlight} />
      </Animated.View>

      <Animated.View
        style={[
          styles.sphereSecondary,
          {
            transform: [{ translateY: translateY2 }],
          },
        ]}
      >
        <View style={styles.sphereHighlightSmall} />
      </Animated.View>

      {/* Subtle 3D Perspective Floor Grid */}
      <View style={styles.perspectiveGridWrapper}>
        <View style={styles.gridLineHorizontal1} />
        <View style={styles.gridLineHorizontal2} />
        <View style={styles.gridLineHorizontal3} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden",
    backgroundColor: "#070811",
    zIndex: 0,
  },
  nebulaCore: {
    position: "absolute",
    top: height * 0.12,
    left: width * 0.1,
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: width * 0.4,
    backgroundColor: "rgba(99, 102, 241, 0.16)",
  },
  nebulaBottom: {
    position: "absolute",
    bottom: -60,
    right: -40,
    width: width * 0.75,
    height: width * 0.75,
    borderRadius: width * 0.375,
    backgroundColor: "rgba(168, 85, 247, 0.14)",
  },
  orbitalPlane: {
    position: "absolute",
    top: height * 0.18,
    left: 0,
    right: 0,
    height: 320,
    alignItems: "center",
    justifyContent: "center",
  },
  ringOuter: {
    position: "absolute",
    width: 310,
    height: 310,
    borderRadius: 155,
    borderWidth: 1.5,
    borderColor: "rgba(129, 140, 248, 0.35)",
    alignItems: "center",
    justifyContent: "space-between",
  },
  ringNodeTop: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#818CF8",
    marginTop: -5,
    shadowColor: "#818CF8",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 8,
  },
  ringNodeBottom: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: "#34D399",
    marginBottom: -3.5,
  },
  ringInner: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 1.2,
    borderColor: "rgba(192, 132, 252, 0.32)",
    alignItems: "flex-end",
    justifyContent: "center",
  },
  ringNodeGold: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: "#FBBF24",
    marginRight: -4.5,
    shadowColor: "#FBBF24",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 8,
  },
  spherePrimary: {
    position: "absolute",
    top: height * 0.16,
    right: 26,
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "rgba(79, 70, 229, 0.35)",
    borderWidth: 1,
    borderColor: "rgba(165, 180, 252, 0.45)",
    padding: 8,
  },
  sphereHighlight: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "rgba(255, 255, 255, 0.45)",
  },
  sphereSecondary: {
    position: "absolute",
    bottom: height * 0.24,
    left: 22,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(16, 185, 129, 0.22)",
    borderWidth: 1,
    borderColor: "rgba(52, 211, 153, 0.4)",
    padding: 6,
  },
  sphereHighlightSmall: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: "rgba(255, 255, 255, 0.4)",
  },
  perspectiveGridWrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 140,
    justifyContent: "space-evenly",
    opacity: 0.22,
  },
  gridLineHorizontal1: {
    height: 1,
    backgroundColor: "#6366F1",
    transform: [{ scaleX: 0.85 }],
  },
  gridLineHorizontal2: {
    height: 1,
    backgroundColor: "#6366F1",
    transform: [{ scaleX: 0.92 }],
  },
  gridLineHorizontal3: {
    height: 1,
    backgroundColor: "#6366F1",
  },
});
