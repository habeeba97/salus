import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { AppState, Profile, Settings, defaultState } from './types';

// Profile and settings are stored only on this device.
const STORAGE_KEY = 'salus.state.v1';

interface SettingsContextValue {
  state: AppState;
  loaded: boolean;
  updateProfile: (changes: Partial<Profile>) => void;
  updateSettings: (changes: Partial<Settings>) => void;
  resetAll: () => void;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

function mergeWithDefaults(saved: Partial<AppState> | null): AppState {
  return {
    profile: { ...defaultState.profile, ...(saved?.profile ?? {}) },
    settings: { ...defaultState.settings, ...(saved?.settings ?? {}) },
  };
}

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(defaultState);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw && !cancelled) {
          setState(mergeWithDefaults(JSON.parse(raw)));
        }
      } catch (error) {
        console.warn('Could not load saved settings', error);
      } finally {
        if (!cancelled) setLoaded(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch((error) =>
      console.warn('Could not save settings', error)
    );
  }, [state, loaded]);

  const updateProfile = useCallback((changes: Partial<Profile>) => {
    setState((s) => ({ ...s, profile: { ...s.profile, ...changes } }));
  }, []);

  const updateSettings = useCallback((changes: Partial<Settings>) => {
    setState((s) => ({ ...s, settings: { ...s.settings, ...changes } }));
  }, []);

  const resetAll = useCallback(() => setState(defaultState), []);

  const value = useMemo(
    () => ({ state, loaded, updateProfile, updateSettings, resetAll }),
    [state, loaded, updateProfile, updateSettings, resetAll]
  );

  return (
    <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
  );
}

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used inside SettingsProvider');
  return ctx;
}
