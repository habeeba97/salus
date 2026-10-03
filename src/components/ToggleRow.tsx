import React from 'react';
import { Pressable, Switch, View } from 'react-native';
import { radius } from '../theme/tokens';
import { useTheme } from '../theme/ThemeProvider';
import { AppText } from './AppText';

interface Props {
  label: string;
  description?: string;
  value: boolean;
  onChange: (value: boolean) => void;
}

/** A full-width row that toggles a setting. The whole row is the tap target. */
export function ToggleRow({ label, description, value, onChange }: Props) {
  const { colors, touchTarget } = useTheme();

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityLabel={description ? `${label}. ${description}` : label}
      accessibilityState={{ checked: value }}
      onPress={() => onChange(!value)}
      style={{
        minHeight: touchTarget,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: radius.input,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.surface,
      }}
    >
      <View style={{ flex: 1 }}>
        <AppText emphasis>{label}</AppText>
        {description ? (
          <AppText variant="small" tone="secondary">
            {description}
          </AppText>
        ) : null}
      </View>
      <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        <Switch
          value={value}
          onValueChange={onChange}
          trackColor={{ false: colors.border, true: colors.primary }}
          thumbColor="#FFFFFF"
        />
      </View>
    </Pressable>
  );
}
