import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { View } from 'react-native';
import type { Topic } from '../content';
import { useTheme } from '../theme/ThemeProvider';
import { AppText } from './AppText';
import { Card } from './Card';

interface Props {
  topic: Topic;
  lessonCount: number;
  onPress: () => void;
}

/** A tappable topic category on the Learn screen. */
export function TopicCard({ topic, lessonCount, onPress }: Props) {
  const { colors } = useTheme();
  const countText =
    lessonCount === 0 ? 'Coming soon' : lessonCount === 1 ? '1 lesson' : `${lessonCount} lessons`;

  return (
    <Card
      onPress={onPress}
      accessibilityLabel={`${topic.title}. ${topic.description} ${countText}.`}
      accessibilityHint="Opens the lessons for this topic"
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
        <View
          style={{
            width: 48,
            height: 48,
            borderRadius: 24,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colors.primarySoft,
          }}
        >
          <Ionicons name={topic.icon} size={26} color={colors.primaryDeep} />
        </View>
        <View style={{ flex: 1 }}>
          <AppText variant="h3">{topic.title}</AppText>
          <AppText variant="small" tone="secondary">
            {topic.description}
          </AppText>
          <AppText variant="small" tone="brand" emphasis>
            {countText}
          </AppText>
        </View>
        <Ionicons name="chevron-forward" size={22} color={colors.textSecondary} />
      </View>
    </Card>
  );
}
