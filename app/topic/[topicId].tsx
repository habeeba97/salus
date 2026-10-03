import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { AppText } from '../../src/components/AppText';
import { Button } from '../../src/components/Button';
import { Card } from '../../src/components/Card';
import { LessonCard } from '../../src/components/LessonCard';
import { SafetyHelpButton } from '../../src/components/SafetyHelpButton';
import { Screen } from '../../src/components/Screen';
import { getLessonsByTopic, getTopic } from '../../src/content';

export default function TopicScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ topicId: string }>();
  const topicId = Array.isArray(params.topicId) ? params.topicId[0] : params.topicId;
  const topic = topicId ? getTopic(topicId) : undefined;

  const headerRight = () => (
    <View style={{ marginRight: 8 }}>
      <SafetyHelpButton />
    </View>
  );

  if (!topic) {
    return (
      <Screen>
        <Stack.Screen options={{ title: 'Topic', headerBackTitle: 'Learn', headerRight }} />
        <AppText variant="h2" header>
          Topic not found
        </AppText>
        <AppText>We could not find that topic.</AppText>
        <Button label="Go to Learn" onPress={() => router.replace('/learn')} />
      </Screen>
    );
  }

  const lessons = getLessonsByTopic(topic.id);

  return (
    <Screen>
      <Stack.Screen options={{ title: topic.title, headerBackTitle: 'Learn', headerRight }} />
      <AppText variant="h1" header>
        {topic.title}
      </AppText>
      <AppText tone="secondary">{topic.description}</AppText>

      {lessons.length === 0 ? (
        <Card tone="soft">
          <AppText variant="h3" header>
            Lessons are coming soon
          </AppText>
          <AppText>There are no lessons in this topic yet.</AppText>
        </Card>
      ) : (
        lessons.map((lesson) => (
          <LessonCard
            key={lesson.id}
            lesson={lesson}
            onPress={() =>
              router.push({ pathname: '/lesson/[lessonId]', params: { lessonId: lesson.id } })
            }
          />
        ))
      )}
    </Screen>
  );
}
