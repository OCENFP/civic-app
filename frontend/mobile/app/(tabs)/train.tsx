import { useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
// Synced copy of src/data/scenarios.json from the web app — keep in step.
import scenariosData from '@/constants/scenarios.json';

type Choice = {
  text: string;
  correct: boolean;
  next: string;
  feedback: string;
};

type Step = {
  question?: string;
  choices?: Choice[];
  end?: boolean;
  result?: string;
};

type Scenario = {
  id: string;
  title: string;
  description: string;
  steps: Record<string, Step>;
};

const scenarios = scenariosData as unknown as Scenario[];

export default function TrainScreen() {
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [stepId, setStepId] = useState('start');
  const [feedback, setFeedback] = useState('');
  const [score, setScore] = useState(0);

  function start(s: Scenario) {
    setScenario(s);
    setStepId('start');
    setFeedback('');
    setScore(0);
  }

  function choose(choice: Choice) {
    setFeedback(choice.feedback);
    if (choice.correct) setScore((v) => v + 1);
    setStepId(choice.next);
  }

  const step = scenario?.steps[stepId];

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <ThemedView style={styles.headerContent}>
          <ThemedText type="title">🎯</ThemedText>
        </ThemedView>
      }>
      {!scenario && (
        <>
          <ThemedView style={styles.titleContainer}>
            <ThemedText type="title">Training</ThemedText>
          </ThemedView>
          <ThemedText>
            Pick a scenario and practice protecting your rights under pressure.
          </ThemedText>

          {scenarios.map((s) => (
            <ThemedView key={s.id} style={styles.card}>
              <ThemedText type="subtitle">{s.title}</ThemedText>
              <ThemedText>{s.description}</ThemedText>
              <Pressable style={styles.button} onPress={() => start(s)}>
                <ThemedText style={styles.buttonText}>Start</ThemedText>
              </Pressable>
            </ThemedView>
          ))}
        </>
      )}

      {scenario && step && !step.end && (
        <>
          <ThemedView style={styles.titleContainer}>
            <ThemedText type="title">{scenario.title}</ThemedText>
          </ThemedView>

          <ThemedView style={styles.card}>
            <ThemedText type="subtitle">{step.question}</ThemedText>
            {step.choices?.map((c) => (
              <Pressable key={c.text} style={styles.button} onPress={() => choose(c)}>
                <ThemedText style={styles.buttonText}>{c.text}</ThemedText>
              </Pressable>
            ))}
          </ThemedView>

          {feedback !== '' && <ThemedText style={styles.feedback}>{feedback}</ThemedText>}
        </>
      )}

      {scenario && step?.end && (
        <>
          <ThemedView style={styles.titleContainer}>
            <ThemedText type="title">{scenario.title}</ThemedText>
          </ThemedView>

          <ThemedView style={styles.card}>
            <ThemedText type="subtitle">{step.result}</ThemedText>
            <ThemedText>Correct choices: {score}</ThemedText>

            <Pressable style={styles.button} onPress={() => start(scenario)}>
              <ThemedText style={styles.buttonText}>Try Again</ThemedText>
            </Pressable>
            <Pressable style={styles.button} onPress={() => setScenario(null)}>
              <ThemedText style={styles.buttonText}>All Scenarios</ThemedText>
            </Pressable>
          </ThemedView>
        </>
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
  card: {
    gap: 10,
    borderWidth: 1,
    borderColor: '#8883',
    borderRadius: 10,
    padding: 14,
    marginBottom: 4,
  },
  button: {
    backgroundColor: '#1D3D47',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  feedback: {
    fontStyle: 'italic',
  },
});
