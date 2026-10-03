// Single source of truth for safety tiers. Plain, calm language on purpose.
// Colors live in the theme (colors.tier[id]).
import { IconName } from './iconTypes';

export const SAFETY_TIER_IDS = ['general', 'caution', 'professional', 'urgent'] as const;

export type SafetyTierId = (typeof SAFETY_TIER_IDS)[number];

export interface SafetyTierInfo {
  id: SafetyTierId;
  /** 1 (lowest) to 4 (highest). */
  level: 1 | 2 | 3 | 4;
  label: string;
  shortExplanation: string;
  accessibilityLabel: string;
  icon: IconName;
}

export const SAFETY_TIERS: Record<SafetyTierId, SafetyTierInfo> = {
  general: {
    id: 'general',
    level: 1,
    label: 'General information',
    shortExplanation: 'This is for learning. It is not advice for one person.',
    accessibilityLabel:
      'Safety level 1 of 4: general information. This is for learning. It is not advice for one person.',
    icon: 'information-circle-outline',
  },
  caution: {
    id: 'caution',
    level: 2,
    label: 'Use caution',
    shortExplanation: 'Some people need to be careful with this. Read the details first.',
    accessibilityLabel:
      'Safety level 2 of 4: use caution. Some people need to be careful with this. Read the details first.',
    icon: 'warning-outline',
  },
  professional: {
    id: 'professional',
    level: 3,
    label: 'Professional guidance recommended',
    shortExplanation:
      'Please talk to a doctor, nurse or pharmacist before you act on this.',
    accessibilityLabel:
      'Safety level 3 of 4: professional guidance recommended. Please talk to a doctor, nurse or pharmacist before you act on this.',
    icon: 'people-outline',
  },
  urgent: {
    id: 'urgent',
    level: 4,
    label: 'Urgent professional attention',
    shortExplanation:
      'Get help from a health professional or emergency service as soon as you can. Do not wait.',
    accessibilityLabel:
      'Safety level 4 of 4: urgent professional attention. Get help from a health professional or emergency service as soon as you can. Do not wait.',
    icon: 'call-outline',
  },
};
