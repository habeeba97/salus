import { TextSizeSetting } from '../theme/typography';

export type ThemeMode = 'system' | 'light' | 'dark' | 'highContrast';
export type LearningMode = 'standard' | 'elder' | 'child';
export type LanguageCode = 'en' | 'ur' | 'hi';

export interface Profile {
  displayName: string;
  language: LanguageCode;
  learningMode: LearningMode;
}

export interface Settings {
  themeMode: ThemeMode;
  textSize: TextSizeSetting;
  reduceMotion: boolean;
}

export interface AppState {
  profile: Profile;
  settings: Settings;
}

export const defaultState: AppState = {
  profile: {
    displayName: '',
    language: 'en',
    learningMode: 'standard',
  },
  settings: {
    themeMode: 'system',
    textSize: 'default',
    reduceMotion: false,
  },
};
