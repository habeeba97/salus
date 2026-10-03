import React from 'react';
import { View } from 'react-native';
import type { Lesson } from '../content';
import { formatReviewDate } from '../content/format';
import {
  AUDIENCE_LABELS,
  CONTENT_STATUS_INFO,
  SOURCE_TYPE_LABELS,
} from '../content/labels';
import { AppText } from './AppText';
import { Card } from './Card';
import { EvidenceBadge } from './EvidenceBadge';
import { LessonSectionView } from './LessonSectionView';
import { SafetyTier } from './SafetyTier';
import { Screen } from './Screen';
import { Tag } from './Tag';

function SourcesBlock({ lesson }: { lesson: Lesson }) {
  const hasPlaceholder = lesson.sources.some((s) => s.type === 'placeholder');
  return (
    <View style={{ gap: 12 }}>
      <AppText variant="h2" header>
        Sources
      </AppText>
      {hasPlaceholder ? (
        <AppText variant="small" tone="secondary">
          Placeholder sources are examples only. They are not real references.
        </AppText>
      ) : null}
      {lesson.sources.map((source, index) => (
        <Card key={source.id}>
          <AppText emphasis>{`${index + 1}. ${source.title}`}</AppText>
          <AppText variant="small" tone="secondary">
            {source.organization}
          </AppText>
          <Tag label={SOURCE_TYPE_LABELS[source.type]} />
          <AppText variant="small" tone="secondary">
            {source.publishedOrReviewedDate
              ? `Date: ${formatReviewDate(source.publishedOrReviewedDate)}`
              : 'Date: not set'}
          </AppText>
          {source.url ? (
            <AppText variant="small" tone="secondary" selectable>
              {source.url}
            </AppText>
          ) : null}
        </Card>
      ))}
    </View>
  );
}

function ReviewBlock({ lesson }: { lesson: Lesson }) {
  const { review } = lesson;
  return (
    <Card>
      <AppText variant="h3" header>
        Review information
      </AppText>
      <AppText>
        {review.lastReviewed
          ? `Last reviewed: ${formatReviewDate(review.lastReviewed)}`
          : 'Last reviewed: not yet reviewed'}
      </AppText>
      <AppText>
        {review.reviewerRole
          ? `Reviewed by: ${review.reviewerRole}`
          : 'Reviewed by: not yet reviewed'}
      </AppText>
      {review.notes ? (
        <AppText variant="small" tone="secondary">
          {review.notes}
        </AppText>
      ) : null}
    </Card>
  );
}

/** Reusable reader for any Lesson. All content comes from the lesson data. */
export function LessonReader({ lesson }: { lesson: Lesson }) {
  const statusInfo = CONTENT_STATUS_INFO[lesson.status];
  // Placeholder lessons contain no real claims, so they carry no evidence labels.
  const showLabels = lesson.status !== 'placeholder';

  return (
    <Screen>
      <View style={{ gap: 8 }}>
        <AppText variant="h1" header>
          {lesson.title}
        </AppText>
        {lesson.subtitle ? <AppText tone="secondary">{lesson.subtitle}</AppText> : null}
      </View>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        <Tag label={`${lesson.estimatedMinutes} min read`} />
        {lesson.audience.map((id) => (
          <Tag key={id} label={AUDIENCE_LABELS[id]} />
        ))}
        <Tag label={statusInfo.label} />
      </View>

      {statusInfo.readerNotice ? (
        <Card tone="soft">
          <AppText>{statusInfo.readerNotice}</AppText>
        </Card>
      ) : null}

      <AppText>{lesson.description}</AppText>

      {showLabels ? (
        <View style={{ gap: 12 }}>
          <View style={{ gap: 6 }}>
            <AppText variant="small" tone="secondary">
              Overall evidence for this lesson
            </AppText>
            <EvidenceBadge category={lesson.evidence} showExplanation />
          </View>
          <SafetyTier tier={lesson.safetyTier} variant="banner" message={lesson.safetyNote} />
        </View>
      ) : null}

      {lesson.sections.map((section) => (
        <LessonSectionView key={section.id} section={section} sources={lesson.sources} />
      ))}

      <SourcesBlock lesson={lesson} />
      <ReviewBlock lesson={lesson} />
    </Screen>
  );
}
