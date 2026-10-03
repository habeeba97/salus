import { useRouter } from 'expo-router';
import React from 'react';
import { TextInput } from 'react-native';
import { AppText } from '../../src/components/AppText';
import { Button } from '../../src/components/Button';
import { Card } from '../../src/components/Card';
import { ChoiceGroup } from '../../src/components/ChoiceGroup';
import { Screen } from '../../src/components/Screen';
import { useSettings } from '../../src/store/SettingsProvider';
import { LanguageCode, LearningMode } from '../../src/store/types';
import { fontFamilies } from '../../src/theme/fonts';
import { radius } from '../../src/theme/tokens';
import { useTheme } from '../../src/theme/ThemeProvider';
import { typeScale } from '../../src/theme/typography';

export default function MeScreen() {
  const router = useRouter();
  const { colors, touchTarget, textScale } = useTheme();
  const { state, updateProfile } = useSettings();

  return (
    <Screen>
      <AppText variant="h1" header>
        Your profile
      </AppText>

      <Card>
        <AppText variant="h3" header>
          Your name
        </AppText>
        <TextInput
          accessibilityLabel="Your name"
          placeholder="Optional"
          placeholderTextColor={colors.textSecondary}
          value={state.profile.displayName}
          onChangeText={(text) => updateProfile({ displayName: text })}
          maxLength={40}
          autoCapitalize="words"
          returnKeyType="done"
          style={{
            minHeight: touchTarget,
            borderWidth: 1.5,
            borderColor: colors.border,
            borderRadius: radius.input,
            paddingHorizontal: 16,
            color: colors.textPrimary,
            backgroundColor: colors.surface,
            fontFamily: fontFamilies.body,
            fontSize: Math.round(typeScale.body.fontSize * textScale),
          }}
        />
      </Card>

      <ChoiceGroup<LanguageCode>
        label="Language"
        helper="Translations are added in a later step. Your choice is saved."
        value={state.profile.language}
        onChange={(language) => updateProfile({ language })}
        options={[
          { value: 'en', label: 'English' },
          { value: 'ur', label: 'اردو (Urdu)' },
          { value: 'hi', label: 'हिन्दी (Hindi)' },
        ]}
      />

      <ChoiceGroup<LearningMode>
        label="Learning mode"
        value={state.profile.learningMode}
        onChange={(learningMode) => updateProfile({ learningMode })}
        options={[
          { value: 'standard', label: 'Standard' },
          {
            value: 'elder',
            label: 'Elder-friendly',
            description: 'Larger text and bigger buttons',
          },
          {
            value: 'child',
            label: 'Child-friendly',
            description: 'Child layout arrives in a later step',
          },
        ]}
      />

      <Button
        label="Settings"
        icon="settings-outline"
        variant="soft"
        onPress={() => router.push('/settings')}
      />

      <AppText variant="small" tone="secondary">
        Your profile is stored only on this device.
      </AppText>
    </Screen>
  );
}
