import { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
  StyleSheet,
  Alert,
  AlertButton,
} from "react-native";
import { supabase } from "../../lib/supabase";
import { Transaction } from "../../types/transaction";
import { useRouter, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

export default function HomeScreen() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const fetchData = async () => {
    try {
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .order("date", { ascending: false });

      if (error) throw error;
      setTransactions((data as Transaction[]) || []);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, []),
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, []);


  const handleDelete = async (id: number) => {
    const { error } = await supabase.from("transactions").delete().eq("id", id);
    if (error) {
      Alert.alert("Error", "Could not delete transaction.");
    } else {
      fetchData(); 
    }
  };

  const handleStopRecurring = async (id: number) => {
    const { error } = await supabase
      .from("transactions")
      .update({
        recurring_frequency: "none",
        recurring_end_date: new Date().toISOString().split("T")[0],
      })
      .eq("id", id);

    if (error) {
      Alert.alert("Error", "Could not stop recurring transaction.");
    } else {
      Alert.alert("Success", "Recurring payments stopped.");
      fetchData();
    }
  };

  const showActionMenu = (item: Transaction) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const buttons: AlertButton[] = [
      {
        text: "Delete",
        style: "destructive",
        onPress: () =>
          Alert.alert("Delete", "Are you sure?", [
            { text: "Cancel" },
            { text: "Delete", onPress: () => handleDelete(item.id) },
          ]),
      },
    ];

    if (item.recurring_frequency && item.recurring_frequency !== "none") {
      buttons.unshift({
        text: "Stop Recurring",
        style: "default",
        onPress: () => handleStopRecurring(item.id),
      });
    }

    buttons.push({ text: "Cancel", style: "cancel" });

    Alert.alert(
      "Transaction Options",
      `Rs.{item.category}: Rs.Rs.{item.amount}`,
      buttons,
    );
  };


  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={{ padding: 20, paddingTop: 60 }}>
        <Text style={{ fontSize: 28, fontWeight: "800", color: "#1e293b" }}>
          Transactions
        </Text>
      </View>

      <FlatList
        data={transactions}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onLongPress={() => showActionMenu(item)} 
            delayLongPress={500} 
            activeOpacity={0.7}
          >
            <View>
              <Text style={styles.category}>{item.category}</Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={styles.date}>{item.date}</Text>
                {item.recurring_frequency && item.recurring_frequency !== "none" && (
                  <View style={styles.recurringBadge}>
                    <Ionicons name="repeat" size={10} color="#2563eb" />
                    <Text style={styles.recurringText}>
                      {item.recurring_frequency}
                    </Text>
                  </View>
                )}
              </View>
            </View>
            <Text
              style={[
                styles.amount,
                { color: item.type === "expense" ? "#ef4444" : "#10b981" },
              ]}
            >
              {item.type === "expense" ? "-" : "+"}Rs.{item.amount}
            </Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No transactions found.</Text>
        }
      />

      <TouchableOpacity style={styles.fab} onPress={() => router.push("/add")}>
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    backgroundColor: "#f8fafc",
    marginVertical: 6,
    borderRadius: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  category: { fontSize: 16, fontWeight: "600", color: "#1e293b" },
  date: { fontSize: 13, color: "#64748b", marginTop: 2 },
  recurringBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#dbeafe",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginLeft: 8,
    marginTop: 2,
  },
  recurringText: {
    fontSize: 10,
    color: "#2563eb",
    fontWeight: "700",
    marginLeft: 3,
    textTransform: "uppercase",
  },
  amount: { fontSize: 18, fontWeight: "700" },
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    color: "#94a3b8",
    fontSize: 16,
  },
  fab: {
    position: "absolute",
    bottom: 30,
    right: 30,
    backgroundColor: "#2563eb",
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
  },
});
