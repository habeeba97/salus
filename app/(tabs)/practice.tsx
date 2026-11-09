import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PracticeScreen() {
  const [activeTimer, setActiveTimer] = useState<string | null>(null);
  const [seconds, setSeconds] = useState(60);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && seconds > 0) {
      interval = setInterval(() => setSeconds((s) => s - 1), 1000);
    } else if (seconds === 0) {
      setIsRunning(false);
    }
    return () => clearInterval(interval);
  }, [isRunning, seconds]);

  const startWorkout = (name: string, durationSec: number) => {
    setActiveTimer(name);
    setSeconds(durationSec);
    setIsRunning(true);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>⚡ Daily Fitness & Somatic Reset</Text>
        <Text style={styles.subHeader}>Gentle mobility, mini-cycle cardio, and breath pacing</Text>

        {/* Live Active Timer Card */}
        <View style={styles.timerCard}>
          <Text style={styles.timerTitle}>{activeTimer || 'Ready to Move'}</Text>
          <Text style={styles.timerClock}>
            {Math.floor(seconds / 60)}:{seconds % 60 < 10 ? `0${seconds % 60}` : seconds % 60}
          </Text>
          <View style={styles.btnRow}>
            <Pressable
              onPress={() => setIsRunning(!isRunning)}
              style={[styles.btn, isRunning ? styles.btnPause : styles.btnStart]}
            >
              <Text style={styles.btnText}>{isRunning ? 'Pause' : 'Start Pace'}</Text>
            </Pressable>
            <Pressable
              onPress={() => { setIsRunning(false); setSeconds(60); }}
              style={styles.btnReset}
            >
              <Text style={styles.btnText}>Reset</Text>
            </Pressable>
          </View>
        </View>

        {/* Quick Workout Routines */}
        <Text style={styles.sectionTitle}>Movement Blocks</Text>

        <Pressable
          onPress={() => startWorkout('🚴 Mini-Cycle Moderate Cardio', 600)}
          style={styles.card}
        >
          <Text style={styles.cardTitle}>🚴 Mini-Cycle Steady Cadence</Text>
          <Text style={styles.cardDesc}>10 min low-impact pedal cadence to activate lymphatic drainage and blood flow.</Text>
        </Pressable>

        <Pressable
          onPress={() => startWorkout('🧘 Posture & Pelvic Alignment', 300)}
          style={styles.card}
        >
          <Text style={styles.cardTitle}>🧘 Posture & Spine Release</Text>
          <Text style={styles.cardDesc}>5 min spine elongation, seated torso twists, and diaphragm opening.</Text>
        </Pressable>

        <Pressable
          onPress={() => startWorkout('🌬 Box Breathing Reset', 180)}
          style={styles.card}
        >
          <Text style={styles.cardTitle}>🌬 4-4-4-4 Autonomic Calming</Text>
          <Text style={styles.cardDesc}>3 min vagus nerve reset to lower cortisol and heart rate variability.</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#06070D' },
  container: { padding: 18, gap: 14 },
  header: { fontSize: 20, fontWeight: '800', color: '#FFFFFF' },
  subHeader: { fontSize: 13, color: '#94A3B8', marginBottom: 6 },
  timerCard: { backgroundColor: '#111528', padding: 20, borderRadius: 18, alignItems: 'center', borderWidth: 1, borderColor: '#1E2548' },
  timerTitle: { color: '#C7D2FE', fontSize: 15, fontWeight: '700' },
  timerClock: { color: '#FFFFFF', fontSize: 44, fontWeight: '900', marginVertical: 10 },
  btnRow: { flexDirection: 'row', gap: 10 },
  btn: { paddingVertical: 10, paddingHorizontal: 22, borderRadius: 10 },
  btnStart: { backgroundColor: '#4F46E5' },
  btnPause: { backgroundColor: '#D97706' },
  btnReset: { backgroundColor: '#262C4A', paddingVertical: 10, paddingHorizontal: 18, borderRadius: 10 },
  btnText: { color: '#FFF', fontWeight: '700', fontSize: 13 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#F1F5F9', marginTop: 8 },
  card: { backgroundColor: '#0D1122', padding: 16, borderRadius: 14, borderWidth: 1, borderColor: '#181E38', gap: 4 },
  cardTitle: { color: '#E2E8F0', fontSize: 14, fontWeight: '700' },
  cardDesc: { color: '#64748B', fontSize: 12, lineHeight: 18 },
});
