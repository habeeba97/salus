// Display labels for content metadata. Centralized so wording stays consistent.
import type { IconName } from '../constants/iconTypes';
import type { AudienceId, CalloutKind, ContentStatus, SourceType } from './types';

export const CONTENT_STATUS_INFO: Record<
  ContentStatus,
  { label: string; readerNotice: string | null }
> = {
  placeholder: {
    label: 'Placeholder',
    readerNotice: 'This is placeholder content for testing the app. It is not health information.',
  },
  draft: {
    label: 'Draft',
    readerNotice:
      'This lesson is a draft for testing. It has not been reviewed by a health professional.',
  },
  inReview: {
    label: 'In review',
    readerNotice: 'This lesson is waiting for review by a health professional.',
  },
  approved: { label: 'Reviewed', readerNotice: null },
};

export const AUDIENCE_LABELS: Record<AudienceId, string> = {
  everyone: 'Everyone',
  adults: 'Adults',
  olderAdults: 'Older adults',
  children: 'Children',
  caregivers: 'Caregivers',
};

export const SOURCE_TYPE_LABELS: Record<SourceType, string> = {
  placeholder: 'Placeholder source',
  guideline: 'Guideline',
  systematicReview: 'Systematic review',
  study: 'Research study',
  governmentAgency: 'Government agency',
  textbook: 'Textbook',
  traditionalText: 'Traditional text',
  other: 'Other',
};

export const CALLOUT_KINDS: Record<CalloutKind, { label: string; icon: IconName }> = {
  note: { label: 'Good to know', icon: 'information-circle-outline' },
  tip: { label: 'Tip', icon: 'bulb-outline' },
  myth: { label: 'Common myth', icon: 'chatbubble-ellipses-outline' },
  remember: { label: 'Remember', icon: 'bookmark-outline' },
};
