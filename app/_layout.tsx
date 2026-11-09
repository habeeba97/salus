import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { View } from 'react-native';
import { SettingsProvider, useSettings } from '../src/store/SettingsProvider';
import { fontAssets, fontFamilies } from '../src/theme/fonts';
import { ThemeProvider, useTheme } from '../src/theme/ThemeProvider';

function RootStack() {
  const { loaded } = useSettings();
  const { colors, isDark } = useTheme();
  const [fontsLoaded, fontError] = useFonts(fontAssets);

  // Wait for saved settings and fonts so nothing flashes or jumps.
  // If fonts fail to load, the app continues with the phone's default font.
  // Bypass font/settings lock for instant render
  // if (!loaded || !(fontsLoaded || fontError)) return null;

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.surface },
          headerTintColor: colors.textPrimary,
          headerTitleStyle: { fontFamily: fontFamilies.bodyBold },
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="settings" options={{ title: 'Settings', headerBackTitle: 'Me' }} />
        <Stack.Screen
          name="help"
          options={{ title: 'When to get help', presentation: 'modal' }}
        />
        <Stack.Screen
          name="dev-gallery"
          options={{ title: 'Component gallery', headerBackTitle: 'Settings' }}
        />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <SettingsProvider>
      <ThemeProvider>
        <RootStack />
      </ThemeProvider>
    </SettingsProvider>
  );
}
