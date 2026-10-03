import React from 'react';
import { StyleProp, Text, TextProps, TextStyle } from 'react-native';
import { fontFamilies } from '../theme/fonts';
import { useTheme } from '../theme/ThemeProvider';
import { TextVariant, typeScale } from '../theme/typography';

export type TextTone = 'primary' | 'secondary' | 'brand' | 'onPrimary' | 'safety';

interface Props extends TextProps {
  variant?: TextVariant;
  tone?: TextTone;
  /** Marks the text as a heading for screen readers. */
  header?: boolean;
  /** Semi-bold weight for Figtree text (labels, selected items). Headings are unaffected. */
  emphasis?: boolean;
  style?: StyleProp<TextStyle>;
}

export function AppText({
  variant = 'body',
  tone = 'primary',
  header = false,
  emphasis = false,
  style,
  ...rest
}: Props) {
  const { colors, textScale } = useTheme();
  const base = typeScale[variant];

  const toneColors: Record<TextTone, string> = {
    primary: colors.textPrimary,
    secondary: colors.textSecondary,
    brand: colors.primaryDeep,
    onPrimary: colors.onPrimary,
    safety: colors.safety,
  };

  const fontFamily =
    emphasis && base.fontFamily === fontFamilies.body
      ? fontFamilies.bodySemiBold
      : base.fontFamily;

  return (
    <Text
      accessibilityRole={header ? 'header' : undefined}
      maxFontSizeMultiplier={2}
      style={[
        {
          fontFamily,
          fontSize: Math.round(base.fontSize * textScale),
          lineHeight: Math.round(base.lineHeight * textScale),
          color: toneColors[tone],
        },
        style,
      ]}
      {...rest}
    />
  );
}
