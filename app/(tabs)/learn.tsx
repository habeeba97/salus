import { useRouter } from 'expo-router';
import React from 'react';
import { AppText } from '../../src/components/AppText';
import { Card } from '../../src/components/Card';
import { Screen } from '../../src/components/Screen';
import { Tag } from '../../src/components/Tag';
import { TopicCard } from '../../src/components/TopicCard';
import { getLessonsByTopic, getTopics } from '../../src/content';

export default function LearnScreen() {
  const router = useRouter();
  const topics = getTopics();

  return (
    <Screen>
      <AppText variant="h1" header>
        Learn
      </AppText>
      <AppText tone="secondary">Choose a topic to start learning.</AppText>

      <Card tone="soft">
        <Tag label="Demonstration content" />
        <AppText>
          Lessons in this version are for testing the app. They have not been reviewed by a health
          professional.
        </AppText>
      </Card>

      {topics.map((topic) => (
        <TopicCard
          key={topic.id}
          topic={topic}
          lessonCount={getLessonsByTopic(topic.id).length}
          onPress={() =>
            router.push({ pathname: '/topic/[topicId]', params: { topicId: topic.id } })
          }
        />
      ))}
    </Screen>
  );
}
