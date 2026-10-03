# Evidence and Safety Guide for content modules

Every piece of health content in Salus carries two separate labels.

| | EvidenceBadge | SafetyTier |
|---|---|---|
| Answers | How strong is the support for this claim, practice or ingredient? | How careful should the reader be, and should they talk to a professional? |
| Shape | Pill | Rounded rectangle (badge) or message block (banner) |
| Defined in | `src/constants/evidence.ts` | `src/constants/safetyTiers.ts` |

They are independent. A practice can have limited evidence and still be low risk, or have strong evidence and still need professional guidance for some people.

## Rules

1. Never type a label by hand. Use the component with an ID. Labels, explanations, icons and screen-reader text come from the constants.
2. Never change colors in a screen. Colors come from the theme (`colors.evidence`, `colors.tier`) so Light, Dark and High contrast stay consistent.
3. Every content item gets at least one EvidenceBadge. An item may show two when they describe different things (for example `traditional` plus `limited`).
4. Traditional use is not evidence. Use `traditional` to say where something comes from, and add a second badge to say what modern research shows.
5. Anything involving medicines, supplements, pregnancy, children or long-term conditions gets a SafetyTier of `caution` or higher.
6. These components never diagnose. They describe information, not a person's health.
7. A claim's evidence label must be reviewed by a qualified person before it is published.

## Using the components

```tsx
import { EvidenceBadge } from '../src/components/EvidenceBadge';
import { SafetyTier } from '../src/components/SafetyTier';

<EvidenceBadge category="limited" />                    // regular pill
<EvidenceBadge category="traditional" size="compact" /> // for lists and cards
<EvidenceBadge category="insufficient" showExplanation /> // pill plus one sentence

<SafetyTier tier="caution" />                           // small label
<SafetyTier tier="professional" variant="banner" message="Optional sentence about this situation." />
```

Evidence IDs: `strong`, `moderate`, `limited`, `traditional`, `insufficient`, `safetyConcern`.
Safety tier IDs: `general`, `caution`, `professional`, `urgent`.

The `urgent` banner adds a "When to get help" button by default. Use `showHelpLink` to turn this on or off for any banner.

## Examples (for implementation and testing only)

**Example A: a traditional practice with limited modern evidence**
```tsx
<EvidenceBadge category="traditional" size="compact" />
<EvidenceBadge category="limited" size="compact" />
<SafetyTier tier="caution" />
```

**Example B: a health claim with insufficient evidence**
```tsx
<AppText>"Detox water removes toxins from the body."</AppText>
<EvidenceBadge category="insufficient" showExplanation />
<SafetyTier tier="general" />
```

**Example C: a situation where professional guidance is recommended**
```tsx
<SafetyTier
  tier="professional"
  variant="banner"
  message="If you are unsure whether to change how you take a prescribed medicine, ask a doctor or pharmacist first. Do not stop or change it on your own."
/>
```

## Adding a new category later

1. Add the ID to `EVIDENCE_CATEGORY_IDS` and an entry to `EVIDENCE_CATEGORIES`.
2. Add its colors to all three themes in `src/theme/colors.ts`. TypeScript will flag any theme you miss.
3. Check text contrast is at least 4.5:1 and that the icon shape differs from existing ones.
4. Check it in `app/dev-gallery.tsx`.
