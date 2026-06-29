import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useCurrency } from "../context/CurrencyContext";
import { useSavingsGoal } from "../context/SavingsGoalContext";

interface Props {
  income: number;
  expenses: number;
}

export default function SavingsGoalCard({ income, expenses }: Props) {
  const { format } = useCurrency();
  const { savingsGoalPercent } = useSavingsGoal();

  const goalAmount = income > 0 ? Math.round(income * (savingsGoalPercent / 100)) : 0;
  const actuallySaved = income - expenses;
  const progress = goalAmount > 0 ? Math.max(0, Math.min(100, (actuallySaved / goalAmount) * 100)) : 0;

  let statusText = "Needs attention";
  let statusColor = "#ef4444";
  if (progress >= 100) { statusText = "On track"; statusColor = "#10b981"; }
  else if (progress >= 50) { statusText = "Almost there"; statusColor = "#f59e0b"; }

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Savings Goal ({savingsGoalPercent}%)</Text>
      <View style={styles.progressBarBg}>
        <View style={[styles.progressBarFill, { width: `${Math.min(progress, 100)}%`, backgroundColor: statusColor }]} />
      </View>
      <View style={styles.row}>
        <View>
          <Text style={styles.label}>Goal</Text>
          <Text style={styles.value}>{format(goalAmount)}</Text>
        </View>
        <View style={{ alignItems: "flex-end" }}>
          <Text style={styles.label}>Saved</Text>
          <Text style={[styles.value, { color: actuallySaved >= goalAmount ? "#10b981" : "#ef4444" }]}>
            {format(actuallySaved)}
          </Text>
        </View>
      </View>
      <Text style={[styles.status, { color: statusColor }]}>{statusText}</Text>
      {actuallySaved > goalAmount && (
        <Text style={styles.surplus}>
          Surplus of {format(actuallySaved - goalAmount)} — consider investing!
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: "#fff", padding: 20, borderRadius: 20, marginTop: 20, borderWidth: 1, borderColor: "#e2e8f0" },
  title: { fontSize: 14, fontWeight: "700", color: "#64748b", marginBottom: 12, textTransform: "uppercase", letterSpacing: 0.5 },
  progressBarBg: { height: 8, backgroundColor: "#e2e8f0", borderRadius: 4, overflow: "hidden" },
  progressBarFill: { height: 8, borderRadius: 4 },
  row: { flexDirection: "row", justifyContent: "space-between", marginTop: 16 },
  label: { fontSize: 12, color: "#94a3b8", fontWeight: "600" },
  value: { fontSize: 16, fontWeight: "800", color: "#1e293b", marginTop: 2 },
  status: { fontSize: 13, fontWeight: "700", marginTop: 12, textAlign: "center" },
  surplus: { fontSize: 12, color: "#10b981", marginTop: 8, textAlign: "center", fontWeight: "500" },
});
