import React from 'react';
import { View } from 'react-native';
import { radius } from '../theme/tokens';
import { useTheme } from '../theme/ThemeProvider';
import { AppText } from './AppText';

/** Small text pill, for example "Coming soon". Always text, never color alone. */
export function Tag({ label }: { label: string }) {
  const { colors } = useTheme();
  return (
    <View
      style={{
        alignSelf: 'flex-start',
        backgroundColor: colors.surfaceAlt,
        borderColor: colors.border,
        borderWidth: 1,
        borderRadius: radius.pill,
        paddingHorizontal: 12,
        paddingVertical: 4,
      }}
    >
      <AppText variant="small" tone="secondary">
        {label}
      </AppText>
    </View>
  );
}
