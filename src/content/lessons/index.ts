import type { Lesson } from '../types';
import { hydrationBasicsLesson } from './hydrationBasics';
import { placeholderLessons } from './placeholders';

// Add new lessons here. Lesson IDs must be unique.
export const LESSONS: Lesson[] = [hydrationBasicsLesson, ...placeholderLessons];
