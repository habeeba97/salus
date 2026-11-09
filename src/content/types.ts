// Content model for all Salus health content.
// Content is plain typed data: no UI code, no styling. The same shapes can later
// come from a database or API, and be reused by AI answers, quizzes and search.
import type { EvidenceCategoryId } from '../constants/evidence';
import type { IconName } from '../constants/iconTypes';
import type { SafetyTierId } from '../constants/safetyTiers';
import type { LanguageCode } from '../store/types';

export const TOPIC_IDS = [
  'nutrition',
  'hydration',
  'movement',
  'sleep',
  'skin-self-care',
  'womens-health',
  'medication-safety',
  'health-literacy',
  'traditional-wellness',
  'preventive-health',
] as const;
export type TopicId = (typeof TOPIC_IDS)[number];

export type ContentStatus = 'placeholder' | 'draft' | 'inReview' | 'approved';
export type AudienceId = 'everyone' | 'adults' | 'olderAdults' | 'children' | 'caregivers';

export type SourceType =
  | 'placeholder'
  | 'guideline'
  | 'systematicReview'
  | 'study'
  | 'governmentAgency'
  | 'textbook'
  | 'traditionalText'
  | 'other';

export interface SourceReference {
  id: string;
  title: string;
  organization: string;
  /** Placeholder or real link. Not opened by the app yet. */
  url: string | null;
  /** ISO date (YYYY-MM-DD) the source was published or last reviewed, if known. */
  publishedOrReviewedDate: string | null;
  type: SourceType;
}

export type CalloutKind = 'note' | 'tip' | 'myth' | 'remember';

export interface Callout {
  kind: CalloutKind;
  /** Defaults to the label for the kind. */
  title?: string;
  body: string;
}

export interface MediaPlaceholder {
  kind: 'image' | 'illustration' | 'video';
  /** Describes the media. Used as the text alternative for screen readers. */
  description: string;
  caption?: string;
}

export interface LessonSection {
  id: string;
  heading: string;
  /** One string per paragraph. */
  body: string[];
  bullets?: string[];
  evidence?: EvidenceCategoryId;
  safetyTier?: SafetyTierId;
  /** Extra sentence shown with the safety tier. */
  safetyNote?: string;
  callout?: Callout;
  media?: MediaPlaceholder;
  /** IDs from the lesson's `sources`. */
  sourceIds?: string[];
}

export interface ReviewInfo {
  /** ISO date (YYYY-MM-DD). Null until a qualified reviewer has signed off. */
  lastReviewed: string | null;
  /** For example "Registered dietitian". Null until reviewed. */
  reviewerRole: string | null;
  notes?: string;
}

export interface Lesson {
  id: string;
  topicId: TopicId;
  title: string;
  subtitle?: string;
  description: string;
  audience: AudienceId[];
  language: LanguageCode;
  /** Overall evidence for the lesson. Sections can carry their own. */
  evidence: EvidenceCategoryId;
  safetyTier: SafetyTierId;
  safetyNote?: string;
  estimatedMinutes: number;
  sections: LessonSection[];
  sources: SourceReference[];
  review: ReviewInfo;
  status: ContentStatus;
}

export interface Topic {
  id: TopicId;
  title: string;
  description: string;
  icon: IconName;
  order: number;
}

export interface QuizOption {
  id: string;
  text: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
  correctOptionId: string;
  explanation: string;
}

export interface LessonQuiz {
  title: string;
  description: string;
  questions: QuizQuestion[];
}

