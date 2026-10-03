import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { SAFETY_TIERS, SafetyTierId } from '../constants/safetyTiers';
import { radius } from '../theme/tokens';
import { useTheme } from '../theme/ThemeProvider';
import { AppText } from './AppText';
import { Button } from './Button';

interface Props {
  tier: SafetyTierId;
  /** 'badge' is a small label. 'banner' is a full message block. */
  variant?: 'badge' | 'banner';
  /** Optional extra sentence about this specific situation (banner only). */
  message?: string;
  /** Adds a "When to get help" button (banner only). Defaults to on for the urgent tier. */
  showHelpLink?: boolean;
  style?: StyleProp<ViewStyle>;
}

/**
 * Tells the reader how careful to be, and whether to talk to a professional.
 * Calm wording and a rounded-rectangle shape, so it never looks like an evidence badge.
 * Meaning is carried by the text and the icon, never by color alone.
 */
export function SafetyTier({
  tier,
  variant = 'badge',
  message,
  showHelpLink,
  style,
}: Props) {
  const router = useRouter();
  const { colors, textScale } = useTheme();
  const info = SAFETY_TIERS[tier];
  const palette = colors.tier[tier];

  if (variant === 'badge') {
    return (
      <View
        accessible
        accessibilityRole="text"
        accessibilityLabel={info.accessibilityLabel}
        style={[
          {
            alignSelf: 'flex-start',
            maxWidth: '100%',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
            backgroundColor: palette.bg,
            borderColor: palette.fg,
            borderWidth: 1.5,
            borderRadius: radius.input,
            paddingHorizontal: 10,
            paddingVertical: 6,
          },
          style,
        ]}
      >
        <Ionicons name={info.icon} size={Math.round(18 * textScale)} color={palette.fg} />
        <AppText variant="small" emphasis style={{ color: palette.fg, flexShrink: 1 }}>
          {info.label}
        </AppText>
      </View>
    );
  }

  const withLink = showHelpLink ?? tier === 'urgent';
  const fullLabel = message ? `${info.accessibilityLabel} ${message}` : info.accessibilityLabel;

  return (
    <View
      // Grouped for screen readers only when it has no button inside.
      accessible={!withLink}
      accessibilityRole={withLink ? undefined : 'text'}
      accessibilityLabel={withLink ? undefined : fullLabel}
      style={[
        {
          backgroundColor: palette.bg,
          borderColor: palette.fg,
          borderWidth: 1.5,
          borderLeftWidth: 6,
          borderRadius: radius.card,
          padding: 16,
          gap: 10,
        },
        style,
      ]}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <Ionicons name={info.icon} size={Math.round(24 * textScale)} color={palette.fg} />
        <AppText
          variant="h3"
          header
          style={{ color: palette.fg, flexShrink: 1 }}
        >
          {info.label}
        </AppText>
      </View>
      <AppText>{info.shortExplanation}</AppText>
      {message ? <AppText>{message}</AppText> : null}
      {withLink ? (
        <Button
          label="When to get help"
          variant="soft"
          fullWidth={false}
          onPress={() => router.push('/help')}
        />
      ) : null}
    </View>
  );
}
