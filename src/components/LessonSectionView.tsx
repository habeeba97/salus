import React from 'react';
import { View } from 'react-native';
import type { LessonSection, SourceReference } from '../content';
import { AppText } from './AppText';
import { CalloutBox } from './CalloutBox';
import { EvidenceBadge } from './EvidenceBadge';
import { MediaPlaceholder } from './MediaPlaceholder';
import { SafetyTier } from './SafetyTier';

interface Props {
  section: LessonSection;
  /** The lesson's full source list. Used to number the section's sources. */
  sources: SourceReference[];
}

/** Renders one section of a lesson. Contains no lesson content of its own. */
export function LessonSectionView({ section, sources }: Props) {
  const sourceNumbers = (section.sourceIds ?? [])
    .map((id) => sources.findIndex((source) => source.id === id) + 1)
    .filter((n) => n > 0);

  return (
    <View style={{ gap: 12 }}>
      <AppText variant="h2" header>
        {section.heading}
      </AppText>

      {section.evidence ? <EvidenceBadge category={section.evidence} size="compact" /> : null}

      {section.media ? <MediaPlaceholder media={section.media} /> : null}

      {section.body.map((paragraph, index) => (
        <AppText key={index}>{paragraph}</AppText>
      ))}

      {section.bullets?.map((bullet, index) => (
        <View key={index} style={{ flexDirection: 'row', gap: 10 }}>
          <AppText>{'\u2022'}</AppText>
          <AppText style={{ flex: 1 }}>{bullet}</AppText>
        </View>
      ))}

      {section.callout ? <CalloutBox callout={section.callout} /> : null}

      {section.safetyTier ? (
        <SafetyTier
          tier={section.safetyTier}
          variant="banner"
          message={section.safetyNote}
        />
      ) : null}

      {sourceNumbers.length > 0 ? (
        <AppText variant="small" tone="secondary">
          {`Sources: ${sourceNumbers.join(', ')}`}
        </AppText>
      ) : null}
    </View>
  );
}
