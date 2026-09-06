import { StyleSheet } from 'react-native';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

const RIGHTS = [
  {
    title: 'Right to a Lawyer',
    law: '6th Amendment',
    explanation: 'A lawyer protects you if you are accused of a crime.',
    action: 'Ask for a lawyer before answering questions.',
    script: 'I want a lawyer',
  },
  {
    title: 'Refusing Searches',
    law: '4th Amendment',
    explanation: 'Police need a legal reason or your permission to search.',
    action: 'Clearly say you do not consent.',
    script: 'I do not consent to searches',
  },
  {
    title: 'Remaining Silent',
    law: '5th Amendment',
    explanation: 'You do not have to answer police questions.',
    action: 'Politely refuse to answer questions.',
    script: 'I choose to remain silent',
  },
];

export default function ExploreScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <ThemedView style={styles.headerContent}>
          <ThemedText type="title">📜</ThemedText>
        </ThemedView>
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Core Rights</ThemedText>
      </ThemedView>

      <ThemedText>
        Three phrases cover most encounters. Know them before you need them.
      </ThemedText>

      {RIGHTS.map((r) => (
        <ThemedView key={r.title} style={styles.card}>
          <ThemedText type="subtitle">{r.title}</ThemedText>
          <ThemedText style={styles.law}>{r.law}</ThemedText>
          <ThemedText>{r.explanation}</ThemedText>
          <ThemedText>Do: {r.action}</ThemedText>
          <ThemedText type="defaultSemiBold">Say: &ldquo;{r.script}&rdquo;</ThemedText>
        </ThemedView>
      ))}
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
  card: {
    gap: 6,
    borderWidth: 1,
    borderColor: '#8883',
    borderRadius: 10,
    padding: 14,
    marginBottom: 4,
  },
  law: {
    fontSize: 12,
    opacity: 0.6,
  },
});
