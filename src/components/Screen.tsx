import React from 'react';
import { ScrollView } from 'react-native';
import { layout } from '../theme/tokens';
import { useTheme } from '../theme/ThemeProvider';

/** Standard scrolling screen: themed background, 20pt margins, 16pt gaps. */
export function Screen({ children }: { children: React.ReactNode }) {
  const { colors } = useTheme();
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{
        padding: layout.screenMargin,
        paddingBottom: 40,
        gap: 16,
      }}
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </ScrollView>
  );
}
