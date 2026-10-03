import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { View } from 'react-native';
import type { MediaPlaceholder as MediaPlaceholderData } from '../content';
import { radius } from '../theme/tokens';
import { useTheme } from '../theme/ThemeProvider';
import { AppText } from './AppText';

/** Stands in for an image, illustration or video until real media is added. */
export function MediaPlaceholder({ media }: { media: MediaPlaceholderData }) {
  const { colors } = useTheme();
  return (
    <View
      accessible
      accessibilityRole="image"
      accessibilityLabel={`Placeholder for ${media.kind}. ${media.description}`}
      style={{
        minHeight: 140,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        padding: 16,
        borderWidth: 2,
        borderStyle: 'dashed',
        borderColor: colors.border,
        borderRadius: radius.card,
        backgroundColor: colors.surfaceAlt,
      }}
    >
      <Ionicons
        name={media.kind === 'video' ? 'videocam-outline' : 'image-outline'}
        size={32}
        color={colors.textSecondary}
      />
      <AppText variant="small" tone="secondary" style={{ textAlign: 'center' }}>
        {media.caption ?? `${media.kind} placeholder`}
      </AppText>
    </View>
  );
}
