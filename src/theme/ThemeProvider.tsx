import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { AccessibilityInfo, useColorScheme } from 'react-native';
import { useSettings } from '../store/SettingsProvider';
import {
  ThemeColors,
  darkColors,
  highContrastColors,
  lightColors,
} from './colors';
import { layout, touchTarget } from './tokens';
import { elderScaleBoost, textScaleValues } from './typography';

export interface Theme {
  colors: ThemeColors;
  isDark: boolean;
  textScale: number;
  touchTarget: number;
  buttonHeight: number;
  reduceMotion: boolean;
}

const ThemeContext = createContext<Theme | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { state } = useSettings();
  const systemScheme = useColorScheme();
  const [systemReduceMotion, setSystemReduceMotion] = useState(false);

  useEffect(() => {
    let mounted = true;
    AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
      if (mounted) setSystemReduceMotion(enabled);
    });
    const subscription = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      setSystemReduceMotion
    );
    return () => {
      mounted = false;
      subscription.remove();
    };
  }, []);

  const { themeMode, textSize, reduceMotion } = state.settings;
  const { learningMode } = state.profile;

  const theme = useMemo<Theme>(() => {
    const resolved =
      themeMode === 'system'
        ? systemScheme === 'dark'
          ? 'dark'
          : 'light'
        : themeMode;

    const colors =
      resolved === 'dark'
        ? darkColors
        : resolved === 'highContrast'
        ? highContrastColors
        : lightColors;

    const elder = learningMode === 'elder';
    const baseScale = textScaleValues[textSize] ?? 1;

    return {
      colors,
      isDark: resolved === 'dark',
      textScale: elder ? baseScale * elderScaleBoost : baseScale,
      touchTarget: elder ? touchTarget.elder : touchTarget.standard,
      buttonHeight: elder ? layout.buttonHeightElder : layout.buttonHeight,
      reduceMotion: reduceMotion || systemReduceMotion,
    };
  }, [themeMode, textSize, reduceMotion, learningMode, systemScheme, systemReduceMotion]);

  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}

export function useTheme(): Theme {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
  return ctx;
}
