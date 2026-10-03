// The ONLY place screens read content from.
// Today it reads local data. Later these functions can call a database or API
// (and become async) without changing the screens' structure.
import { LESSONS } from './lessons';
import { TOPICS } from './topics';
import type { Lesson, Topic } from './types';

export * from './types';

export function getTopics(): Topic[] {
  return [...TOPICS].sort((a, b) => a.order - b.order);
}

export function getTopic(id: string): Topic | undefined {
  return TOPICS.find((topic) => topic.id === id);
}

export function getLessonsByTopic(topicId: string): Lesson[] {
  return LESSONS.filter((lesson) => lesson.topicId === topicId);
}

export function getLesson(id: string): Lesson | undefined {
  return LESSONS.find((lesson) => lesson.id === id);
}

export function getAllLessons(): Lesson[] {
  return LESSONS;
}
