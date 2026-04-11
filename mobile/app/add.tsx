import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
  Platform,
} from "react-native";
import { supabase } from "../lib/supabase";
import { useRouter } from "expo-router";
import DateTimePicker, { DateTimePickerAndroid } from "@react-native-community/datetimepicker";

type Frequency = "none" | "daily" | "weekly" | "monthly" | "yearly";

const CATEGORY_MAP = {
  income: ["Salary", "Freelance", "Investment", "Gift", "Other"],
  expense: ["Food", "Rent", "Travel", "Entertainment", "Shopping", "Healthcare", "Utilities", "Other"],
};

export default function AddTransactionScreen() {
  const router = useRouter();

  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState<"income" | "expense">("expense");
  const [date, setDate] = useState(new Date());

  const [frequency, setFrequency] = useState<Frequency>("none");
  const [endDate, setEndDate] = useState<Date | null>(null);

  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  // Optimization: Reset category if it doesn't exist in the new type's list
  useEffect(() => {
    setCategory("");
  }, [type]);

  const showAndroidPicker = (isEndDate: boolean) => {
    DateTimePickerAndroid.open({
      value: isEndDate ? (endDate || new Date()) : date,
      onChange: (event, selectedDate) => {
        if (selectedDate) {
          if (isEndDate) setEndDate(selectedDate);
          else setDate(selectedDate);
        }
      },
      mode: "date",
    });
  };

  async function handleSave() {
    if (!amount || !category) {
      Alert.alert("Error", "Amount and Category are required.");
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) throw new Error("User session expired.");

      const { error } = await supabase.from("transactions").insert([
        {
          user_id: user.id,
          amount: parseInt(amount),
          type: type,
          category: category,
          date: date.toISOString().split("T")[0],
          recurring_frequency: frequency,
          recurring_end_date: endDate ? endDate.toISOString().split("T")[0] : null,
        },
      ]);

      if (error) throw error;

      Alert.alert("Success", "Transaction recorded!", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error: any) {
      Alert.alert("Database Error", error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={styles.title}>Add Transaction</Text>

      {/* Type Selector */}
      <View style={styles.row}>
        <TouchableOpacity
          style={[styles.typeBtn, type === "expense" && styles.expenseActive]}
          onPress={() => setType("expense")}
        >
          <Text style={[styles.typeText, type === "expense" && styles.whiteText]}>Expense</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.typeBtn, type === "income" && styles.incomeActive]}
          onPress={() => setType("income")}
        >
          <Text style={[styles.typeText, type === "income" && styles.whiteText]}>Income</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Amount</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. 5000"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />

      <Text style={styles.label}>Select Category</Text>
      <View style={styles.categoryGrid}>
        {CATEGORY_MAP[type].map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[
              styles.categoryChip,
              category === cat && (type === "income" ? styles.incomeChipActive : styles.expenseChipActive)
            ]}
            onPress={() => setCategory(cat)}
          >
            <Text style={[styles.categoryChipText, category === cat && styles.whiteText]}>
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Manual category entry fallback */}
      {category === "Other" && (
        <TextInput
          style={[styles.input, { marginTop: 10 }]}
          placeholder="Type custom category..."
          onChangeText={setCategory}
        />
      )}

      {/* Date Picker */}
      <Text style={styles.label}>Date</Text>
      <TouchableOpacity
        style={styles.datePicker}
        onPress={() => (Platform.OS === "android" ? showAndroidPicker(false) : setShowDatePicker(true))}
      >
        <Text style={styles.dateText}>{date.toDateString()}</Text>
      </TouchableOpacity>
      {Platform.OS === "ios" && showDatePicker && (
        <DateTimePicker value={date} mode="date" display="spinner" onChange={(e, d) => { setShowDatePicker(false); if(d) setDate(d); }} />
      )}

      {/* Recurring Frequency */}
      <Text style={styles.label}>Recurring Frequency</Text>
      <View style={styles.frequencyRow}>
        {(["none", "daily", "weekly", "monthly"] as Frequency[]).map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.freqBtn, frequency === f && styles.freqActive]}
            onPress={() => setFrequency(f)}
          >
            <Text style={[styles.freqText, frequency === f && styles.whiteText]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Recurring End Date */}
      {frequency !== "none" && (
        <>
          <Text style={styles.label}>Recurring End Date</Text>
          <TouchableOpacity
            style={styles.datePicker}
            onPress={() => (Platform.OS === "android" ? showAndroidPicker(true) : setShowEndDatePicker(true))}
          >
            <Text style={styles.dateText}>{endDate ? endDate.toDateString() : "Select End Date"}</Text>
          </TouchableOpacity>
          {Platform.OS === "ios" && showEndDatePicker && (
            <DateTimePicker value={endDate || new Date()} mode="date" display="spinner" onChange={(e, d) => { setShowEndDatePicker(false); if(d) setEndDate(d); }} />
          )}
        </>
      )}

      <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveBtnText}>Save Transaction</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  title: { fontSize: 26, fontWeight: "900", color: "#1e293b", marginVertical: 20, paddingTop: 40 },
  label: { fontSize: 14, fontWeight: "700", color: "#64748b", marginBottom: 10, marginTop: 20, textTransform: "uppercase", letterSpacing: 0.5 },
  input: { borderWidth: 1, borderColor: "#e2e8f0", padding: 16, borderRadius: 14, fontSize: 16, backgroundColor: "#f8fafc" },
  row: { flexDirection: "row", gap: 10, marginBottom: 10 },
  typeBtn: { flex: 1, padding: 16, borderRadius: 14, alignItems: "center", backgroundColor: "#f1f5f9" },
  expenseActive: { backgroundColor: "#ef4444" },
  incomeActive: { backgroundColor: "#10b981" },
  typeText: { fontWeight: "700", color: "#64748b" },
  whiteText: { color: "#fff" },
  categoryGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  categoryChip: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 12, backgroundColor: "#f1f5f9", borderWidth: 1, borderColor: "#e2e8f0" },
  categoryChipText: { fontSize: 14, fontWeight: "600", color: "#475569" },
  incomeChipActive: { backgroundColor: "#10b981", borderColor: "#10b981" },
  expenseChipActive: { backgroundColor: "#ef4444", borderColor: "#ef4444" },
  datePicker: { padding: 16, borderWidth: 1, borderColor: "#e2e8f0", borderRadius: 14, backgroundColor: "#f8fafc" },
  dateText: { fontSize: 16, color: "#1e293b", fontWeight: "500" },
  frequencyRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  freqBtn: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 12, backgroundColor: "#f1f5f9" },
  freqActive: { backgroundColor: "#2563eb" },
  freqText: { fontSize: 13, fontWeight: "600", color: "#475569", textTransform: "capitalize" },
  saveBtn: { backgroundColor: "#2563eb", padding: 18, borderRadius: 16, alignItems: "center", marginTop: 40, shadowColor: "#2563eb", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 },
  saveBtnText: { color: "#fff", fontWeight: "800", fontSize: 18 },
});