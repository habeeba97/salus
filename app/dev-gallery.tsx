// Development-only test screen. Reached from Settings in development builds.
// Sample text here is for testing the components only. It is not medical advice.
import React from 'react';
import { AppText } from '../src/components/AppText';
import { Card } from '../src/components/Card';
import { EvidenceBadge } from '../src/components/EvidenceBadge';
import { SafetyTier } from '../src/components/SafetyTier';
import { Screen } from '../src/components/Screen';
import { EVIDENCE_CATEGORY_IDS } from '../src/constants/evidence';
import { SAFETY_TIER_IDS } from '../src/constants/safetyTiers';

export default function DevGallery() {
  return (
    <Screen>
      <AppText variant="small" tone="secondary">
        Test screen. Sample text only, not medical advice.
      </AppText>

      <AppText variant="h2" header>
        Fonts
      </AppText>
      <Card>
        <AppText variant="display">Display (Fraunces)</AppText>
        <AppText variant="h1">Heading 1 (Fraunces)</AppText>
        <AppText variant="h2">Heading 2 (Fraunces)</AppText>
        <AppText variant="h3">Heading 3 (Figtree)</AppText>
        <AppText>Body text (Figtree). The quick brown fox jumps over the lazy dog.</AppText>
        <AppText emphasis>Body emphasis (Figtree semi-bold)</AppText>
        <AppText variant="small">Small text (Figtree)</AppText>
        <AppText variant="caption">Caption text (Figtree)</AppText>
      </Card>

      <AppText variant="h2" header>
        Evidence badges
      </AppText>
      <Card>
        <AppText variant="h3" header>
          Compact
        </AppText>
        {EVIDENCE_CATEGORY_IDS.map((id) => (
          <EvidenceBadge key={id} category={id} size="compact" />
        ))}
      </Card>
      <Card>
        <AppText variant="h3" header>
          Regular, with explanation
        </AppText>
        {EVIDENCE_CATEGORY_IDS.map((id) => (
          <EvidenceBadge key={id} category={id} showExplanation style={{ marginBottom: 8 }} />
        ))}
      </Card>

      <AppText variant="h2" header>
        Safety tiers
      </AppText>
      <Card>
        <AppText variant="h3" header>
          Badges
        </AppText>
        {SAFETY_TIER_IDS.map((id) => (
          <SafetyTier key={id} tier={id} />
        ))}
      </Card>
      {SAFETY_TIER_IDS.map((id) => (
        <SafetyTier key={id} tier={id} variant="banner" />
      ))}

      <AppText variant="h2" header>
        Example A: traditional practice
      </AppText>
      <Card>
        <AppText variant="h3" header>
          Sample traditional practice
        </AppText>
        <EvidenceBadge category="traditional" size="compact" />
        <EvidenceBadge category="limited" size="compact" />
        <AppText>Placeholder text describing how this practice is traditionally used.</AppText>
        <SafetyTier tier="caution" />
      </Card>

      <AppText variant="h2" header>
        Example B: health claim
      </AppText>
      <Card>
        <AppText variant="small" tone="secondary">
          Claim
        </AppText>
        <AppText variant="h3">"Detox water removes toxins from the body."</AppText>
        <EvidenceBadge category="insufficient" showExplanation />
        <SafetyTier tier="general" />
      </Card>

      <AppText variant="h2" header>
        Example C: professional guidance
      </AppText>
      <SafetyTier
        tier="professional"
        variant="banner"
        message="If you are unsure whether to change how you take a prescribed medicine, ask a doctor or pharmacist first. Do not stop or change it on your own."
      />
    </Screen>
  );
}
