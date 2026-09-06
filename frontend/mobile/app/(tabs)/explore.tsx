import { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { representatives, type Rep } from '@/lib/api';

export default function RepresentativesScreen() {
  const [address, setAddress] = useState('');
  const [reps, setReps] = useState<Rep[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function onFind() {
    if (loading) return;
    setLoading(true);
    setError('');
    setReps(null);
    try {
      setReps(await representatives(address));
    } catch {
      setError('Could not reach the server. Check EXPO_PUBLIC_API_URL.');
    }
    setLoading(false);
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <ThemedText type="title">Your Representatives</ThemedText>
        <ThemedText style={styles.muted}>
          Look up who represents you.
        </ThemedText>

        <TextInput
          value={address}
          onChangeText={setAddress}
          placeholder="Enter your address"
          placeholderTextColor="#8888"
          style={styles.input}
        />

        <Pressable
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={onFind}
          disabled={loading}>
          <ThemedText style={styles.buttonText}>
            {loading ? 'Finding…' : 'Find'}
          </ThemedText>
        </Pressable>

        {loading && <ActivityIndicator style={styles.spinner} />}
        {error ? <ThemedText style={styles.error}>{error}</ThemedText> : null}

        {reps !== null &&
          (reps.length === 0 ? (
            <ThemedText style={styles.muted}>
              No representatives found (the backend needs GOOGLE_API_KEY set).
            </ThemedText>
          ) : (
            reps.map((r, i) => (
              <ThemedView style={styles.card} key={i}>
                <ThemedText type="defaultSemiBold">{r.name}</ThemedText>
                <ThemedText style={styles.muted}>
                  {r.role} · {r.party} · {r.state}
                </ThemedText>
              </ThemedView>
            ))
          ))}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, paddingTop: 72, gap: 12 },
  muted: { opacity: 0.7 },
  input: {
    borderWidth: 1,
    borderColor: '#8886',
    borderRadius: 8,
    padding: 12,
    color: '#808080',
  },
  button: {
    backgroundColor: '#2563eb',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { color: '#fff', fontWeight: '600' },
  spinner: { marginTop: 12 },
  error: { color: '#dc2626' },
  card: {
    borderWidth: 1,
    borderColor: '#8884',
    borderRadius: 10,
    padding: 14,
    gap: 4,
  },
});
