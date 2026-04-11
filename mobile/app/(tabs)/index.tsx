import { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { supabase } from '../../lib/supabase';
import { useFocusEffect, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function DashboardScreen() {
  const router = useRouter();
  const [stats, setStats] = useState({ balance: 0, income: 0, expense: 0 });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const calculateFinance = async () => {
    try {
      const { data, error } = await supabase.from('transactions').select('amount, type');
      if (error) throw error;

      let income = 0;
      let expense = 0;

      data?.forEach((item) => {
        if (item.type === 'income') income += Number(item.amount);
        else expense += Number(item.amount);
      });

      setStats({
        income,
        expense,
        balance: income - expense
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(useCallback(() => { calculateFinance(); }, []));

  const onRefresh = () => {
    setRefreshing(true);
    calculateFinance();
  };

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" color="#2563eb" /></View>;
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.header}>
        <Text style={styles.greeting}>Financial Overview</Text>
        <TouchableOpacity onPress={() => router.push('/add')}>
          <Ionicons name="add-circle" size={40} color="#2563eb" />
        </TouchableOpacity>
      </View>

      {/* Main Balance Card */}
      <View style={styles.mainCard}>
        <Text style={styles.cardLabel}>Total Balance</Text>
        <Text style={styles.balanceText}>Rs.{stats.balance.toLocaleString()}</Text>
      </View>

      {/* Stats Row */}
      <View style={styles.statsRow}>
        <View style={[styles.statBox, { backgroundColor: '#dcfce7' }]}>
          <Ionicons name="arrow-down-circle" size={24} color="#166534" />
          <Text style={styles.statLabel}>Income</Text>
          <Text style={styles.incomeValue}>+Rs.{stats.income.toLocaleString()}</Text>
        </View>

        <View style={[styles.statBox, { backgroundColor: '#fee2e2' }]}>
          <Ionicons name="arrow-up-circle" size={24} color="#991b1b" />
          <Text style={styles.statLabel}>Expenses</Text>
          <Text style={styles.expenseValue}>-Rs.{stats.expense.toLocaleString()}</Text>
        </View>
      </View>

      {/* Quick Actions / Navigation */}
      <TouchableOpacity 
        style={styles.historyLink} 
        onPress={() => router.push('/transactions')}
      >
        <Text style={styles.historyLinkText}>View Detailed History</Text>
        <Ionicons name="chevron-forward" size={20} color="#64748b" />
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', paddingHorizontal: 20 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { marginTop: 60, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
  greeting: { fontSize: 24, fontWeight: '800', color: '#1e293b' },
  mainCard: { backgroundColor: '#2563eb', padding: 30, borderRadius: 24, elevation: 5, shadowColor: '#2563eb', shadowOpacity: 0.3, shadowRadius: 10 },
  cardLabel: { color: '#bfdbfe', fontSize: 14, fontWeight: '600', textTransform: 'uppercase' },
  balanceText: { color: '#fff', fontSize: 42, fontWeight: '900', marginTop: 5 },
  statsRow: { flexDirection: 'row', gap: 15, marginTop: 20 },
  statBox: { flex: 1, padding: 20, borderRadius: 20 },
  statLabel: { fontSize: 12, color: '#64748b', fontWeight: '700', marginTop: 10, textTransform: 'uppercase' },
  incomeValue: { fontSize: 18, fontWeight: '800', color: '#166534', marginTop: 2 },
  expenseValue: { fontSize: 18, fontWeight: '800', color: '#991b1b', marginTop: 2 },
  historyLink: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: 20, borderRadius: 16, marginTop: 30, borderWidth: 1, borderColor: '#e2e8f0' },
  historyLinkText: { fontSize: 16, fontWeight: '600', color: '#1e293b' }
});