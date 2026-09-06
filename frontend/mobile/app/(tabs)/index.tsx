import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, TextInput } from 'react-native';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

// Point this at your deployed web app (or use your machine's LAN IP with
// `npm run dev` during development — localhost won't reach a device).
const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000';

export default function HomeScreen() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [sources, setSources] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  async function ask() {
    const q = question.trim();
    if (!q || loading) return;

    setLoading(true);
    setAnswer('');
    setSources([]);

    try {
      const res = await fetch(`${API_URL}/api/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q }),
      });
      const data = await res.json();
      setAnswer(data.answer ?? data.error ?? 'Something went wrong.');
      setSources(Array.isArray(data.sources) ? data.sources : []);
    } catch {
      setAnswer(`Could not reach the server at ${API_URL}. Set EXPO_PUBLIC_API_URL to your app's address.`);
    }

    setLoading(false);
  }

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <ThemedView style={styles.headerContent}>
          <ThemedText type="title">🇺🇸</ThemedText>
        </ThemedView>
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Know Your Rights</ThemedText>
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <ThemedText>
          Ask a question about your rights and get an answer grounded in constitutional source
          material.
        </ThemedText>

        <TextInput
          style={styles.input}
          value={question}
          onChangeText={setQuestion}
          placeholder="e.g. Can police search my car?"
          placeholderTextColor="#888"
          multiline
        />

        <Pressable style={styles.button} onPress={ask} disabled={loading}>
          <ThemedText style={styles.buttonText}>{loading ? 'Asking…' : 'Ask AI'}</ThemedText>
        </Pressable>
      </ThemedView>

      {loading && <ActivityIndicator />}

      {answer !== '' && (
        <ThemedView style={styles.answerCard}>
          <ThemedText type="subtitle">Answer</ThemedText>
          <ThemedText>{answer}</ThemedText>
          {sources.length > 0 && (
            <ThemedText style={styles.sources}>Sources: {sources.join(', ')}</ThemedText>
          )}
        </ThemedView>
      )}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 12,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#888',
    borderRadius: 10,
    padding: 12,
    minHeight: 48,
    color: '#888',
  },
  button: {
    backgroundColor: '#1D3D47',
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  answerCard: {
    gap: 8,
    borderWidth: 1,
    borderColor: '#8883',
    borderRadius: 10,
    padding: 14,
  },
  sources: {
    fontSize: 12,
    opacity: 0.6,
  },
});
