import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet } from 'react-native';
import { radius } from '../theme/tokens';
import { useTheme } from '../theme/ThemeProvider';
import { AppText } from './AppText';

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'soft' | 'safety';
type IconName = React.ComponentProps<typeof Ionicons>['name'];

interface Props {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: 'regular' | 'compact';
  icon?: IconName;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  accessibilityHint?: string;
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'regular',
  icon,
  disabled = false,
  loading = false,
  fullWidth = true,
  accessibilityHint,
}: Props) {
  const { colors, buttonHeight, touchTarget, reduceMotion, textScale } = useTheme();

  const palettes = {
    primary: { bg: colors.primary, fg: colors.onPrimary, border: colors.primary },
    secondary: { bg: 'transparent', fg: colors.primary, border: colors.primary },
    tertiary: { bg: 'transparent', fg: colors.primary, border: 'transparent' },
    soft: { bg: colors.primarySoft, fg: colors.primaryDeep, border: colors.primarySoft },
    safety: { bg: 'transparent', fg: colors.safety, border: colors.safety },
  };
  const palette = palettes[variant];
  const inactive = disabled || loading;
  const height = size === 'compact' ? touchTarget : buttonHeight;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: inactive, busy: loading }}
      disabled={inactive}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        {
          minHeight: height,
          paddingHorizontal: size === 'compact' ? 16 : 24,
          backgroundColor: palette.bg,
          borderColor: palette.border,
          alignSelf: fullWidth ? 'stretch' : 'flex-start',
          opacity: disabled ? 0.45 : pressed ? 0.85 : 1,
          transform: pressed && !reduceMotion ? [{ scale: 0.98 }] : [],
        },
      ]}
    >
      {loading ? (
        <ActivityIndicator color={palette.fg} />
      ) : (
        <>
          {icon ? (
            <Ionicons
              name={icon}
              size={Math.round(20 * textScale)}
              color={palette.fg}
              style={styles.icon}
            />
          ) : null}
          <AppText emphasis style={{ color: palette.fg }}>
            {label}
          </AppText>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderRadius: radius.pill,
  },
  icon: { marginRight: 8 },
});
