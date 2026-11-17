import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Pressable, Platform } from "react-native";
import { Screen } from "../../src/components/Screen";
import { AppText } from "../../src/components/AppText";
import { AnimatedExerciseStudio } from "../../src/components/AnimatedExerciseStudio";

const YOUTUBE_ROUTINES = [
  {
    id: "FB5-7tIiX-I",
    tag: "KIDS ANIMATED WORKOUT",
    title: "12 Easy Exercises For Kids At Home",
    duration: "15 MIN • LITTLE SPORTS",
  },
  {
    id: "9o0UPuDBM8M",
    tag: "ADULTS ANATOMICAL MORNING FLOW",
    title: "Fast Morning Exercises for Full Body",
    duration: "15 MIN • MUSCLE HIGHLIGHT",
  },
  {
    id: "LhL5SNZfnQs",
    tag: "ADULTS FULL BODY CHALLENGE",
    title: "14 Days Home Workout Routine",
    duration: "22 MIN • ROBERTA'S GYM",
  },
];

export default function PracticeScreen() {
  const [activeVideoId, setActiveVideoId] = useState<string>("FB5-7tIiX-I");

  return (
    <Screen style={styles.screenBg}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <AppText style={styles.kicker}>SALUS • ANIMATED MOVEMENT STUDIO</AppText>
          <AppText style={styles.title}>Kids & Adults Exercise Lab</AppText>
          <AppText style={styles.sub}>
            Interactive 60fps animated workouts with rep counters & full guided video routines.
          </AppText>
        </View>

        {/* Custom Original 60fps Kids & Adults Animated Exercise Studio */}
        <AnimatedExerciseStudio />

        {/* Official YouTube Embedded Video Theater (Copyright-Safe) */}
        <View style={styles.videoSection}>
          <AppText style={styles.videoKicker}>FULL GUIDED VIDEO ROUTINES</AppText>
          <AppText style={styles.videoHeading}>Watch & Follow Along</AppText>

          <View style={styles.videoTabs}>
            {YOUTUBE_ROUTINES.map((vid) => {
              const selected = vid.id === activeVideoId;
              return (
                <Pressable
                  key={vid.id}
                  onPress={() => setActiveVideoId(vid.id)}
                  style={[styles.vidTab, selected && styles.vidTabActive]}
                >
                  <AppText style={[styles.vidTabTag, selected && { color: "#38BDF8" }]}>
                    {vid.tag}
                  </AppText>
                  <AppText style={styles.vidTabTitle}>{vid.title}</AppText>
                  <AppText style={styles.vidTabMeta}>{vid.duration}</AppText>
                </Pressable>
              );
            })}
          </View>

          {Platform.OS === "web" && (
            <View style={styles.iframeBox}>
              <iframe
                width="100%"
                height="220"
                src={`https://www.youtube-nocookie.com/embed/${activeVideoId}?rel=0`}
                title="Guided Exercise Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ borderRadius: 18, display: "block" }}
              />
            </View>
          )}
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screenBg: { backgroundColor: "#070811" },
  scroll: { padding: 16, paddingBottom: 44, gap: 18 },
  header: { gap: 4 },
  kicker: { fontSize: 10, fontWeight: "800", color: "#38BDF8", letterSpacing: 1.4 },
  title: { fontSize: 23, fontWeight: "800", color: "#F8FAFC" },
  sub: { fontSize: 12, color: "#94A3B8", lineHeight: 17 },
  videoSection: {
    gap: 10,
    marginTop: 4,
  },
  videoKicker: {
    fontSize: 9.5,
    fontWeight: "800",
    color: "#F472B6",
    letterSpacing: 1.2,
  },
  videoHeading: {
    fontSize: 17,
    fontWeight: "800",
    color: "#F8FAFC",
  },
  videoTabs: {
    gap: 8,
  },
  vidTab: {
    backgroundColor: "rgba(19, 23, 42, 0.85)",
    padding: 13,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    gap: 2,
  },
  vidTabActive: {
    borderColor: "#38BDF8",
    backgroundColor: "rgba(56, 189, 248, 0.12)",
  },
  vidTabTag: {
    fontSize: 9,
    fontWeight: "900",
    color: "#94A3B8",
    letterSpacing: 0.9,
  },
  vidTabTitle: {
    fontSize: 13.5,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  vidTabMeta: {
    fontSize: 10.5,
    color: "#94A3B8",
  },
  iframeBox: {
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1.5,
    borderColor: "rgba(56, 189, 248, 0.45)",
    backgroundColor: "#000000",
  },
});
