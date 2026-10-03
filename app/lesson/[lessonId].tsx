import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { AppText } from '../../src/components/AppText';
import { Button } from '../../src/components/Button';
import { LessonReader } from '../../src/components/LessonReader';
import { SafetyHelpButton } from '../../src/components/SafetyHelpButton';
import { Screen } from '../../src/components/Screen';
import { getLesson } from '../../src/content';

export default function LessonScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ lessonId: string }>();
  const lessonId = Array.isArray(params.lessonId) ? params.lessonId[0] : params.lessonId;
  const lesson = lessonId ? getLesson(lessonId) : undefined;

  const headerRight = () => (
    <View style={{ marginRight: 8 }}>
      <SafetyHelpButton />
    </View>
  );

  if (!lesson) {
    return (
      <Screen>
        <Stack.Screen options={{ title: 'Lesson', headerBackTitle: 'Back', headerRight }} />
        <AppText variant="h2" header>
          Lesson not found
        </AppText>
        <AppText>We could not find that lesson.</AppText>
        <Button label="Go to Learn" onPress={() => router.replace('/learn')} />
      </Screen>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: 'Lesson', headerBackTitle: 'Back', headerRight }} />
      <LessonReader lesson={lesson} />
    </>
  );
}
