import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'expo-router';

export default function SettingsScreen() {
  const router = useRouter();

  async function handleSignOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // The RootLayout listener will automatically switch to AuthScreen
      // because 'session' will become null.
    } catch (error: any) {
      Alert.alert("Sign Out Error", error.message);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      
      <TouchableOpacity 
        onPress={handleSignOut} // Calling the local function
        style={styles.signOutBtn}
      >
        <Text style={styles.btnText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#fff' 
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 30 
  },
  signOutBtn: { 
    backgroundColor: '#ef4444', 
    paddingHorizontal: 40, 
    paddingVertical: 15, 
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  btnText: { 
    color: '#fff', 
    fontWeight: 'bold', 
    fontSize: 16 
  }
});