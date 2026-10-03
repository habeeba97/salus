import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { EVIDENCE_CATEGORIES, EvidenceCategoryId } from '../constants/evidence';
import { radius } from '../theme/tokens';
import { useTheme } from '../theme/ThemeProvider';
import { AppText } from './AppText';

interface Props {
  category: EvidenceCategoryId;
  /** 'compact' for lists, search results and cards. 'regular' for article headers. */
  size?: 'compact' | 'regular';
  /** Shows the one-sentence explanation under the badge. */
  showExplanation?: boolean;
  style?: StyleProp<ViewStyle>;
}

/**
 * Shows how strong the evidence is for a claim, practice or ingredient.
 * Meaning is carried by the text label and the icon shape, never by color alone.
 */
export function EvidenceBadge({
  category,
  size = 'regular',
  showExplanation = false,
  style,
}: Props) {
  const { colors, textScale } = useTheme();
  const info = EVIDENCE_CATEGORIES[category];
  const palette = colors.evidence[category];
  const compact = size === 'compact';

  return (
    <View
      accessible
      accessibilityRole="text"
      accessibilityLabel={info.accessibilityLabel}
      style={[{ alignSelf: 'flex-start', maxWidth: '100%', gap: 6 }, style]}
    >
      <View
        style={{
          alignSelf: 'flex-start',
          maxWidth: '100%',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6,
          backgroundColor: palette.bg,
          borderColor: palette.fg,
          borderWidth: 1.5,
          borderRadius: radius.pill,
          paddingHorizontal: compact ? 10 : 12,
          paddingVertical: compact ? 4 : 6,
        }}
      >
        <Ionicons
          name={info.icon}
          size={Math.round((compact ? 16 : 20) * textScale)}
          color={palette.fg}
        />
        <AppText variant="small" emphasis style={{ color: palette.fg, flexShrink: 1 }}>
          {info.label}
        </AppText>
      </View>
      {showExplanation ? (
        <AppText variant="small" tone="secondary">
          {info.shortExplanation}
        </AppText>
      ) : null}
    </View>
  );
}
