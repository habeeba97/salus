import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView, Linking } from "react-native";
import { useRouter } from "expo-router";

export default function WomensHealthScreen() {
  const router = useRouter();
  const [periodDate, setPeriodDate] = useState(1);
  const [cycleLength, setCycleLength] = useState(28);

  // Clinical calculation: Ovulation is approx 14 days before next cycle
  // Cycle Day of ovulation = cycleLength - 14
  const ovulationCycleDay = cycleLength - 14;
  
  // Calendar dates calculation (normalized for 30-day view)
  const calcCalDay = (startDay: number, addDays: number) => {
    let d = startDay + addDays;
    return d > 30 ? `${d - 30} (next mo)` : `${d}`;
  };

  const estOvulationDate = calcCalDay(periodDate, ovulationCycleDay - 1);
  const fertileStart = calcCalDay(periodDate, Math.max(0, ovulationCycleDay - 6));
  const fertileEnd = calcCalDay(periodDate, ovulationCycleDay);

  return (
    <View style={s.box}>
      <Pressable onPress={() => router.back()} style={s.back}>
        <Text style={s.backTxt}>‹ Back</Text>
      </Pressable>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40, gap: 14 }}>
        <Text style={s.head}>MENSTRUAL CYCLE, OVULATION & FERTILITY WINDOW</Text>
        <Text style={s.sub}>Evidence-based cycle tracking aligned with ACOG & ASRM standards</Text>

        {/* Critical Contraceptive Warning */}
        <View style={s.warningCard}>
          <Text style={s.warningTitle}>⚠️ CRITICAL MEDICAL WARNING</Text>
          <Text style={s.warningText}>
            Calendar-based ovulation calculations should NOT be presented or used as a reliable contraceptive method. They cannot guarantee safe days or prevent pregnancy.
          </Text>
        </View>

        {/* Input Parameters */}
        <View style={s.card}>
          <Text style={s.cardH}>1. Select Period Start Date</Text>
          <View style={s.row}>
            {[1, 5, 10, 15, 20, 25].map((d) => (
              <Pressable
                key={d}
                onPress={() => setPeriodDate(d)}
                style={[s.dot, periodDate === d && s.dotActive]}
              >
                <Text style={s.dotTxt}>{d}</Text>
              </Pressable>
            ))}
          </View>

          <Text style={[s.cardH, { marginTop: 10 }]}>2. Select Average Cycle Length</Text>
          <View style={s.row}>
            {[28, 30, 32, 35].map((c) => (
              <Pressable
                key={c}
                onPress={() => setCycleLength(c)}
                style={[s.cycleChip, cycleLength === c && s.cycleChipActive]}
              >
                <Text style={[s.cycleTxt, cycleLength === c && s.cycleTxtActive]}>{c} Days</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Calculated Results */}
        <View style={s.resultCard}>
          <Text style={s.resultHeader}>Estimated Fertility Schedule</Text>
          <View style={s.resRow}>
            <Text style={s.resLabel}>🩸 Period Start:</Text>
            <Text style={s.resVal}>Day {periodDate} of month</Text>
          </View>
          <View style={s.resRow}>
            <Text style={s.resLabel}>✨ Estimated Ovulation:</Text>
            <Text style={s.resVal}>Day {estOvulationDate} (Cycle Day {ovulationCycleDay})</Text>
          </View>
          <View style={s.resRow}>
            <Text style={s.resLabel}>🌿 Fertile Window:</Text>
            <Text style={s.resVal}>Day {fertileStart} - {fertileEnd}</Text>
          </View>
          <Text style={s.noteText}>
            *Ovulation is estimated at approx 14 days before your next period. Exact timing varies between individuals and cycles.
          </Text>
        </View>

        {/* Core Scientific Concepts */}
        <View style={s.card}>
          <Text style={s.cardH}>Core Biological Concepts</Text>
          <View style={s.conceptItem}>
            <Text style={s.conceptTerm}>• Menstruation</Text>
            <Text style={s.conceptDesc}>Shedding of the uterine lining (Day 1 of cycle).</Text>
          </View>
          <View style={s.conceptItem}>
            <Text style={s.conceptTerm}>• Ovulation</Text>
            <Text style={s.conceptDesc}>Release of a mature egg from the ovary (~14 days before next period).</Text>
          </View>
          <View style={s.conceptItem}>
            <Text style={s.conceptTerm}>• Fertile Window</Text>
            <Text style={s.conceptDesc}>Days when pregnancy is biologically possible due to sperm lifespan (up to 5 days) and ovum survival (12-24 hours).</Text>
          </View>
        </View>

        {/* Authoritative References */}
        <View style={s.refCard}>
          <Text style={s.refTitle}>Authoritative References:</Text>
          <Text style={s.refItem}>• ACOG (American College of Obstetricians and Gynecologists)</Text>
          <Text style={s.refItem}>• NHS Menstrual Cycle & Fertility Guidelines</Text>
          <Text style={s.refItem}>• ASRM (American Society for Reproductive Medicine)</Text>
        </View>

        {/* Emergency Triage */}
        <View style={s.sosCard}>
          <Text style={s.sosTitle}>🚨 Emergency Triage & Consult</Text>
          <Text style={s.sosDesc}>Acute pelvic pain, severe stomach burning, vertigo or distress:</Text>
          <Pressable onPress={() => Linking.openURL("https://meet.google.com")} style={s.docBtn}>
            <Text style={s.btnTxt}>👩‍⚕️ Video Call With Doctor</Text>
          </Pressable>
          <Pressable onPress={() => Linking.openURL("tel:112")} style={s.callBtn}>
            <Text style={s.btnTxt}>🚨 Emergency SOS (112)</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  box: { flex: 1, backgroundColor: "#06070D", padding: 16, paddingTop: 40 },
  back: { marginBottom: 12 },
  backTxt: { color: "#F472B6", fontSize: 18, fontWeight: "700" },
  head: { fontSize: 18, fontWeight: "800", color: "#FFF", lineHeight: 24 },
  sub: { fontSize: 12, color: "#94A3B8", marginBottom: 8 },
  warningCard: { backgroundColor: "#3B1219", padding: 14, borderRadius: 14, borderWidth: 1, borderColor: "#E11D48", gap: 6 },
  warningTitle: { color: "#FDA4AF", fontSize: 13, fontWeight: "800" },
  warningText: { color: "#FFE4E6", fontSize: 12, lineHeight: 18 },
  card: { backgroundColor: "#111528", padding: 16, borderRadius: 16, gap: 10 },
  cardH: { fontSize: 14, fontWeight: "700", color: "#E2E8F0" },
  row: { flexDirection: "row", justifyContent: "space-between", marginVertical: 4 },
  dot: { width: 44, height: 44, borderRadius: 22, backgroundColor: "#1E2442", alignItems: "center", justifyContent: "center" },
  dotActive: { backgroundColor: "#E11D48" },
  dotTxt: { color: "#FFF", fontWeight: "700", fontSize: 14 },
  cycleChip: { flex: 1, paddingVertical: 10, marginHorizontal: 3, backgroundColor: "#1E2442", borderRadius: 10, alignItems: "center" },
  cycleChipActive: { backgroundColor: "#4F46E5" },
  cycleTxt: { color: "#94A3B8", fontSize: 12, fontWeight: "700" },
  cycleTxtActive: { color: "#FFF" },
  resultCard: { backgroundColor: "#0D1122", padding: 16, borderRadius: 16, borderWidth: 1, borderColor: "#2B3353", gap: 8 },
  resultHeader: { color: "#C7D2FE", fontSize: 15, fontWeight: "800", marginBottom: 4 },
  resRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 4, borderBottomWidth: 1, borderBottomColor: "#171D36" },
  resLabel: { color: "#94A3B8", fontSize: 13 },
  resVal: { color: "#FFF", fontSize: 13, fontWeight: "700" },
  noteText: { color: "#64748B", fontSize: 11, fontStyle: "italic", marginTop: 4, lineHeight: 16 },
  conceptItem: { gap: 2, marginVertical: 2 },
  conceptTerm: { color: "#F472B6", fontSize: 13, fontWeight: "700" },
  conceptDesc: { color: "#CBD5E1", fontSize: 12, lineHeight: 17 },
  refCard: { backgroundColor: "#080B14", padding: 14, borderRadius: 12, borderWidth: 1, borderColor: "#1A2035", gap: 4 },
  refTitle: { color: "#94A3B8", fontSize: 12, fontWeight: "700" },
  refItem: { color: "#64748B", fontSize: 11 },
  sosCard: { backgroundColor: "#210B13", padding: 16, borderRadius: 16, borderWidth: 1, borderColor: "#F43F5E", gap: 10 },
  sosTitle: { fontSize: 15, fontWeight: "800", color: "#FFF" },
  sosDesc: { fontSize: 12, color: "#CBD5E1" },
  docBtn: { backgroundColor: "#E11D48", padding: 12, borderRadius: 10, alignItems: "center", marginTop: 4 },
  callBtn: { backgroundColor: "#450A0A", padding: 12, borderRadius: 10, alignItems: "center" },
  btnTxt: { color: "#FFF", fontWeight: "800", fontSize: 13 },
});