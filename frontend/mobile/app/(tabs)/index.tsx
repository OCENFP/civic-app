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
import { ask } from '@/lib/api';

export default function AskScreen() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [source, setSource] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function onAsk() {
    if (!question.trim() || loading) return;
    setLoading(true);
    setError('');
    setAnswer('');
    setSource('');
    try {
      const res = await ask(question);
      setAnswer(res.answer);
      setSource(res.source);
    } catch {
      setError('Could not reach the server. Check EXPO_PUBLIC_API_URL.');
    }
    setLoading(false);
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <ThemedText type="title">Know Your Rights</ThemedText>
        <ThemedText style={styles.muted}>
          Ask a plain-language question about your rights.
        </ThemedText>

        <TextInput
          value={question}
          onChangeText={setQuestion}
          placeholder="Do I have to answer a police officer's questions?"
          placeholderTextColor="#8888"
          style={styles.input}
          multiline
        />

        <Pressable
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={onAsk}
          disabled={loading}>
          <ThemedText style={styles.buttonText}>
            {loading ? 'Asking…' : 'Ask'}
          </ThemedText>
        </Pressable>

        {loading && <ActivityIndicator style={styles.spinner} />}
        {error ? <ThemedText style={styles.error}>{error}</ThemedText> : null}

        {answer ? (
          <ThemedView style={styles.card}>
            <ThemedText>{answer}</ThemedText>
            {source && source !== 'None' ? (
              <ThemedText style={styles.muted}>Source: {source}</ThemedText>
            ) : null}
          </ThemedView>
        ) : null}
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
    minHeight: 64,
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
    gap: 8,
  },
});
