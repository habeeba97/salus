import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, View } from 'react-native';
import { radius } from '../theme/tokens';
import { useTheme } from '../theme/ThemeProvider';
import { AppText } from './AppText';

export interface ChoiceOption<T extends string> {
  value: T;
  label: string;
  description?: string;
}

interface Props<T extends string> {
  label: string;
  helper?: string;
  options: ChoiceOption<T>[];
  value: T;
  onChange: (value: T) => void;
}

/** Large, single-choice tiles. Easier to tap and read than small radio buttons. */
export function ChoiceGroup<T extends string>({
  label,
  helper,
  options,
  value,
  onChange,
}: Props<T>) {
  const { colors, touchTarget } = useTheme();

  return (
    <View accessibilityRole="radiogroup" style={{ gap: 8 }}>
      <AppText variant="h3" header>
        {label}
      </AppText>
      {helper ? (
        <AppText variant="small" tone="secondary">
          {helper}
        </AppText>
      ) : null}
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <Pressable
            key={option.value}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
            accessibilityLabel={
              option.description ? `${option.label}. ${option.description}` : option.label
            }
            onPress={() => onChange(option.value)}
            style={{
              minHeight: touchTarget,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 12,
              paddingHorizontal: 16,
              paddingVertical: 10,
              borderRadius: radius.input,
              borderWidth: 2,
              borderColor: selected ? colors.primary : colors.border,
              backgroundColor: selected ? colors.primarySoft : colors.surface,
            }}
          >
            <Ionicons
              name={selected ? 'radio-button-on' : 'radio-button-off'}
              size={24}
              color={selected ? colors.primary : colors.textSecondary}
            />
            <View style={{ flex: 1 }}>
              <AppText emphasis={selected}>{option.label}</AppText>
              {option.description ? (
                <AppText variant="small" tone="secondary">
                  {option.description}
                </AppText>
              ) : null}
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}
