import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { View } from 'react-native';
import type { Callout } from '../content';
import { CALLOUT_KINDS } from '../content/labels';
import { radius } from '../theme/tokens';
import { useTheme } from '../theme/ThemeProvider';
import { AppText } from './AppText';

/** A highlighted note inside a lesson. Kind is shown by icon and title, not color. */
export function CalloutBox({ callout }: { callout: Callout }) {
  const { colors, textScale } = useTheme();
  const kind = CALLOUT_KINDS[callout.kind];
  const title = callout.title ?? kind.label;

  return (
    <View
      accessible
      accessibilityRole="text"
      accessibilityLabel={`${title}. ${callout.body}`}
      style={{
        backgroundColor: callout.kind === 'myth' ? colors.surfaceAlt : colors.primarySoft,
        borderColor: colors.primary,
        borderWidth: 1,
        borderLeftWidth: 5,
        borderRadius: radius.input,
        padding: 16,
        gap: 6,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Ionicons name={kind.icon} size={Math.round(20 * textScale)} color={colors.primaryDeep} />
        <AppText emphasis tone="brand" style={{ flexShrink: 1 }}>
          {title}
        </AppText>
      </View>
      <AppText>{callout.body}</AppText>
    </View>
  );
}
