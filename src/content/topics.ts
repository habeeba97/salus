import type { Topic } from './types';

// Navigation categories only. Most have no lessons yet.
export const TOPICS: Topic[] = [
  { id: 'nutrition', order: 1, icon: 'nutrition-outline', title: 'Nutrition', description: 'Food, balanced meals and reading labels.' },
  { id: 'hydration', order: 2, icon: 'water-outline', title: 'Hydration', description: 'Fluids, thirst and everyday drinking habits.' },
  { id: 'movement', order: 3, icon: 'walk-outline', title: 'Movement', description: 'Walking, strength, balance and staying active.' },
  { id: 'sleep', order: 4, icon: 'moon-outline', title: 'Sleep', description: 'Rest, routines and sleep habits.' },
  { id: 'skin-self-care', order: 5, icon: 'sparkles-outline', title: 'Skin & Self-Care', description: 'Skin basics, sun care and everyday self-care.' },
  { id: 'womens-health', order: 6, icon: 'flower-outline', title: "Women's Health", description: "Health education for women's life stages." },
  { id: 'medication-safety', order: 7, icon: 'medkit-outline', title: 'Medication Safety', description: 'Using medicines safely and asking the right questions.' },
  { id: 'health-literacy', order: 8, icon: 'school-outline', title: 'Health Literacy', description: 'Finding, understanding and checking health information.' },
  { id: 'traditional-wellness', order: 9, icon: 'leaf-outline', title: 'Traditional Wellness', description: 'Traditional practices, with clear evidence labels.' },
  { id: 'preventive-health', order: 10, icon: 'pulse-outline', title: 'Preventive Health', description: 'Everyday habits that help prevent illness.' },
];
