import { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { supabase } from '../../lib/supabase';
import { Transaction } from '../../types/transaction';

export default function HomeScreen() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      
      setTransactions(data as Transaction[] || []);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 20, paddingTop: 60, backgroundColor: '#fff' }}>
      <Text style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 20 }}>
        Transactions
      </Text>
      
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={{ 
            padding: 16, 
            backgroundColor: '#f8f9fa', 
            marginVertical: 6, 
            borderRadius: 12,
            borderWidth: 1,
            borderColor: '#eee',
            flexDirection: 'row',
            justifyContent: 'space-between'
          }}>
            <View>
              <Text style={{ fontSize: 16, fontWeight: '600' }}>{item.category}</Text>
              <Text style={{ fontSize: 12, color: '#666' }}>{item.date}</Text>
            </View>
            <Text style={{ 
              fontSize: 18, 
              fontWeight: 'bold',
              color: item.type === 'expense' ? '#ef4444' : '#10b981' 
            }}>
              {item.type === 'expense' ? '-' : '+'}${item.amount}
            </Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', marginTop: 40, color: '#999' }}>
            No transactions found....
          </Text>
        }
      />
    </View>
  );
}