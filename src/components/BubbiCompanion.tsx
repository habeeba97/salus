import React, { useState } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { AppText } from './AppText';

const MOODS = [
  { face: '✦ ◕‿◕ ✦', label: 'Radiant', quote: 'You are capable of gentle, steady progress today.' },
  { face: '˘◡˘ ✨', label: 'Peaceful', quote: 'Take a soft breath. There is no rush right now.' },
  { face: '•‿• 🌿', label: 'Grounded', quote: 'Anchor yourself in the present moment.' },
  { face: '⚡ ◕ᴗ◕', label: 'Energized', quote: 'Small, consistent habits create massive transformations.' },
];

export function BubbiCompanion() {
  const [index, setIndex] = useState(0);
  const current = MOODS[index];

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % MOODS.length);
  };

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.badge}>
          <View style={styles.dot} />
          <AppText style={styles.badgeText}>BUBBI AI • {current.label.toUpperCase()}</AppText>
        </View>
        <AppText style={styles.hint}>Tap to change mood</AppText>
      </View>

      <Pressable onPress={handleNext} style={styles.contentRow}>
        <View style={styles.orbGlow}>
          <View style={styles.orb}>
            <AppText style={styles.faceText}>{current.face}</AppText>
          </View>
        </View>

        <View style={styles.messageBox}>
          <AppText style={styles.quoteText}>"{current.quote}"</AppText>
          <AppText style={styles.actionHint}>Tap companion to cycle presence ✨</AppText>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#131525',
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#A78BFA',
    marginRight: 6,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#C4B5FD',
    letterSpacing: 0.8,
  },
  hint: {
    fontSize: 11,
    color: '#71717A',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  orbGlow: {
    padding: 3,
    borderRadius: 36,
    backgroundColor: 'rgba(167, 139, 250, 0.2)',
  },
  orb: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#7C3AED',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#C4B5FD',
  },
  faceText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  messageBox: {
    flex: 1,
    gap: 4,
  },
  quoteText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#F4F4F5',
    fontStyle: 'italic',
    fontWeight: '500',
  },
  actionHint: {
    fontSize: 11,
    color: '#A1A1AA',
    marginTop: 2,
  },
});
