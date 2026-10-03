// DEMONSTRATION LESSON. Written to test the content model and the lesson reader.
// It is a draft: sources are placeholders and it has not been reviewed by a health professional.
import type { Lesson, SourceReference } from '../types';

const sources: SourceReference[] = [
  {
    id: 'src-1',
    title: 'PLACEHOLDER: General guidance on fluid intake',
    organization: 'Placeholder organization (not a real source)',
    url: 'https://example.org/placeholder-fluid-guidance',
    publishedOrReviewedDate: null,
    type: 'placeholder',
  },
  {
    id: 'src-2',
    title: 'PLACEHOLDER: Review of research on flavored water',
    organization: 'Placeholder authors (not a real source)',
    url: 'https://example.org/placeholder-flavored-water',
    publishedOrReviewedDate: null,
    type: 'placeholder',
  },
];

export const hydrationBasicsLesson: Lesson = {
  id: 'hydration-understanding',
  topicId: 'hydration',
  title: 'Understanding Hydration',
  subtitle: 'What fluids do for your body, and how to think about your own needs',
  description:
    'A short introduction to why fluids matter, what changes how much you need, and one common myth.',
  audience: ['everyone'],
  language: 'en',
  evidence: 'moderate',
  safetyTier: 'caution',
  safetyNote:
    'Some people are given personal fluid advice by a health professional. If that is you, follow that advice.',
  estimatedMinutes: 4,
  status: 'draft',
  review: {
    lastReviewed: null,
    reviewerRole: null,
    notes: 'Demonstration lesson. Not yet reviewed by a health professional.',
  },
  sources,
  sections: [
    {
      id: 'why-fluids-matter',
      heading: 'Why fluids matter',
      media: {
        kind: 'illustration',
        description: 'A simple drawing of a glass of water next to a plant',
        caption: 'Illustration placeholder',
      },
      body: [
        'Water makes up a large part of the human body. The body uses fluids to help control temperature, move nutrients around and remove waste.',
        'The body loses fluid every day through sweat, breathing and urine, so it needs to be replaced regularly.',
      ],
      evidence: 'strong',
      sourceIds: ['src-1'],
    },
    {
      id: 'how-much',
      heading: 'How much is enough?',
      body: [
        'There is no single amount that suits everyone. How much you need depends on things like your size, how active you are, the weather and your health.',
        'Fluids come from drinks and from food. Water, milk, tea and many other drinks all count.',
      ],
      bullets: [
        'Hot weather and exercise can increase how much you need',
        'Illness with fever, vomiting or diarrhea can increase fluid loss',
        'Some people are told by a health professional to limit fluids',
      ],
      callout: {
        kind: 'remember',
        body: 'A general guide may not fit your own needs. A health professional can advise you if you are unsure.',
      },
      evidence: 'moderate',
      sourceIds: ['src-1'],
    },
    {
      id: 'signs',
      heading: 'Signs your body may need more fluid',
      body: [
        'For most healthy adults, thirst is a useful signal to drink. Darker urine can also be a rough sign that you need more fluid.',
        'These signs are not exact. Some medicines and foods change urine color, and older adults may feel less thirsty even when they need fluids.',
      ],
      evidence: 'moderate',
      safetyTier: 'caution',
      safetyNote:
        'Babies, young children and older adults can run short of fluid more quickly. Ask a health professional if you are worried.',
      sourceIds: ['src-1'],
    },
    {
      id: 'infused-water',
      heading: 'Flavored and infused water',
      body: [
        'Adding slices of fruit, cucumber or herbs to water is a popular way to change its taste. For some people, a pleasant taste makes it easier to drink through the day.',
        'Infused water is mainly about taste. Plain water and infused water both count as fluid.',
      ],
      bullets: [
        'Wash fruit and herbs first',
        'Keep infused water in the fridge and drink it within a short time',
        'Avoid ingredients you are allergic to',
      ],
      evidence: 'limited',
      sourceIds: ['src-2'],
    },
    {
      id: 'detox-claim',
      heading: 'A common claim: "detox water"',
      body: [
        'Some products say that special waters or drinks can remove toxins from the body. The body already has organs, such as the liver and kidneys, that process and remove waste.',
        'There is not enough good research to show that detox drinks do more than plain water.',
      ],
      callout: {
        kind: 'myth',
        body: 'Be careful with claims that a drink will "cleanse" your body or cause quick weight loss. Ask what evidence is behind them.',
      },
      evidence: 'insufficient',
      sourceIds: ['src-2'],
    },
    {
      id: 'when-to-ask',
      heading: 'When to get advice',
      body: [
        'Talk to a doctor, nurse or pharmacist if you have been told to limit fluids, take medicines that affect fluids, or have a long-term health condition that affects how your body handles fluid.',
        'Get advice if you notice signs like these:',
      ],
      bullets: [
        'Severe or ongoing vomiting or diarrhea',
        'A baby or young child who is not drinking, or has fewer wet diapers than usual',
        'Feeling very weak, confused or faint',
      ],
      safetyTier: 'professional',
      safetyNote:
        'These signs can need medical care. If someone is very unwell, use the "Get help" button at the top of the screen.',
    },
  ],
};
