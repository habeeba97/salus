// Placeholder lessons used only to test navigation and lists. They contain no health information.
import type { Lesson, TopicId } from '../types';

function makePlaceholderLesson(id: string, topicId: TopicId, title: string): Lesson {
  return {
    id,
    topicId,
    title: `${title} (placeholder)`,
    subtitle: 'Placeholder lesson',
    description: 'Placeholder used to test navigation. Real content will be added later.',
    audience: ['everyone'],
    language: 'en',
    evidence: 'insufficient',
    safetyTier: 'general',
    estimatedMinutes: 1,
    status: 'placeholder',
    review: { lastReviewed: null, reviewerRole: null },
    sources: [
      {
        id: 'src-1',
        title: 'PLACEHOLDER source',
        organization: 'Placeholder organization (not a real source)',
        url: null,
        publishedOrReviewedDate: null,
        type: 'placeholder',
      },
    ],
    sections: [
      {
        id: 'placeholder',
        heading: 'Placeholder',
        body: [
          'This lesson is a placeholder. It exists to test how lessons are listed and opened.',
          'Real content will be written and reviewed before it appears here.',
        ],
      },
    ],
  };
}

export const placeholderLessons: Lesson[] = [
  makePlaceholderLesson('ph-nutrition-labels', 'nutrition', 'Reading a food label'),
  makePlaceholderLesson('ph-sleep-basics', 'sleep', 'Sleep basics'),
  makePlaceholderLesson('ph-health-literacy-questions', 'health-literacy', 'Asking good health questions'),
];
