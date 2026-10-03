import React from 'react';
import { View } from 'react-native';
import type { Lesson } from '../content';
import { EVIDENCE_CATEGORIES } from '../constants/evidence';
import { CONTENT_STATUS_INFO } from '../content/labels';
import { AppText } from './AppText';
import { Card } from './Card';
import { EvidenceBadge } from './EvidenceBadge';
import { Tag } from './Tag';

interface Props {
  lesson: Lesson;
  onPress: () => void;
}

/** A tappable lesson summary used in lesson lists. */
export function LessonCard({ lesson, onPress }: Props) {
  const statusLabel = CONTENT_STATUS_INFO[lesson.status].label;
  const showEvidence = lesson.status !== 'placeholder';

  const label = [
    lesson.title,
    lesson.description,
    `${lesson.estimatedMinutes} minute read`,
    showEvidence ? `Overall evidence: ${EVIDENCE_CATEGORIES[lesson.evidence].label}` : null,
    `Status: ${statusLabel}`,
  ]
    .filter(Boolean)
    .join('. ');

  return (
    <Card
      onPress={onPress}
      accessibilityLabel={label}
      accessibilityHint="Opens the lesson"
    >
      <AppText variant="h3">{lesson.title}</AppText>
      <AppText tone="secondary">{lesson.description}</AppText>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}>
        {showEvidence ? <EvidenceBadge category={lesson.evidence} size="compact" /> : null}
        <Tag label={statusLabel} />
        <Tag label={`${lesson.estimatedMinutes} min`} />
      </View>
    </Card>
  );
}
