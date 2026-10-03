// Single source of truth for evidence categories.
// Never type these labels by hand in screens: use EVIDENCE_CATEGORIES.
// Colors live in the theme (colors.evidence[id]) so all three themes stay in sync.
import { IconName } from './iconTypes';

export const EVIDENCE_CATEGORY_IDS = [
  'strong',
  'moderate',
  'limited',
  'traditional',
  'insufficient',
  'safetyConcern',
] as const;

export type EvidenceCategoryId = (typeof EVIDENCE_CATEGORY_IDS)[number];

export interface EvidenceCategory {
  id: EvidenceCategoryId;
  label: string;
  shortExplanation: string;
  accessibilityLabel: string;
  icon: IconName;
}

export const EVIDENCE_CATEGORIES: Record<EvidenceCategoryId, EvidenceCategory> = {
  strong: {
    id: 'strong',
    label: 'Strong evidence',
    shortExplanation: 'Supported by good-quality research that agrees.',
    accessibilityLabel:
      'Evidence level: strong evidence. Supported by good-quality research that agrees.',
    icon: 'shield-checkmark-outline',
  },
  moderate: {
    id: 'moderate',
    label: 'Moderate evidence',
    shortExplanation: 'Supported by some good research, but more is needed.',
    accessibilityLabel:
      'Evidence level: moderate evidence. Supported by some good research, but more is needed.',
    icon: 'shield-half-outline',
  },
  limited: {
    id: 'limited',
    label: 'Limited evidence',
    shortExplanation: 'Only a small amount of research, or results that do not agree.',
    accessibilityLabel:
      'Evidence level: limited evidence. Only a small amount of research, or results that do not agree.',
    icon: 'shield-outline',
  },
  traditional: {
    id: 'traditional',
    label: 'Traditional use',
    shortExplanation:
      'Used in a traditional practice. Modern research may be limited or missing.',
    accessibilityLabel:
      'Evidence type: traditional use. Used in a traditional practice. Modern research may be limited or missing.',
    icon: 'leaf-outline',
  },
  insufficient: {
    id: 'insufficient',
    label: 'Insufficient evidence',
    shortExplanation: 'Not enough research to say whether this works.',
    accessibilityLabel:
      'Evidence level: insufficient evidence. Not enough research to say whether this works.',
    icon: 'help-circle-outline',
  },
  safetyConcern: {
    id: 'safetyConcern',
    label: 'Potential safety concern',
    shortExplanation: 'Experts or research have raised concerns that this could cause harm.',
    accessibilityLabel:
      'Evidence note: potential safety concern. Experts or research have raised concerns that this could cause harm.',
    icon: 'hand-left-outline',
  },
};
