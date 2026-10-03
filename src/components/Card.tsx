import React from 'react';
import { Pressable, StyleProp, View, ViewStyle } from 'react-native';
import { radius } from '../theme/tokens';
import { useTheme } from '../theme/ThemeProvider';

interface Props {
  children: React.ReactNode;
  /** 'safety' cards have a coral edge so they never look like ordinary content. */
  tone?: 'default' | 'soft' | 'safety';
  onPress?: () => void;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  style?: StyleProp<ViewStyle>;
}

export function Card({
  children,
  tone = 'default',
  onPress,
  accessibilityLabel,
  accessibilityHint,
  style,
}: Props) {
  const { colors, isDark } = useTheme();

  const background =
    tone === 'soft' ? colors.primarySoft : tone === 'safety' ? colors.safetySoft : colors.surface;

  const cardStyle: ViewStyle = {
    backgroundColor: background,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 20,
    gap: 8,
    ...(tone === 'safety' ? { borderLeftWidth: 5, borderLeftColor: colors.safety } : {}),
    ...(isDark
      ? {}
      : {
          shadowColor: '#000000',
          shadowOpacity: 0.06,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 2 },
          elevation: 1,
        }),
  };

  if (onPress) {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
        onPress={onPress}
        style={({ pressed }) => [cardStyle, { opacity: pressed ? 0.9 : 1 }, style]}
      >
        {children}
      </Pressable>
    );
  }

  return <View style={[cardStyle, style]}>{children}</View>;
}
