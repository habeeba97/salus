import { useRouter } from 'expo-router';
import React from 'react';
import { Alert } from 'react-native';
import { AppText } from '../src/components/AppText';
import { Button } from '../src/components/Button';
import { Card } from '../src/components/Card';
import { ChoiceGroup } from '../src/components/ChoiceGroup';
import { Screen } from '../src/components/Screen';
import { ToggleRow } from '../src/components/ToggleRow';
import { useSettings } from '../src/store/SettingsProvider';
import { ThemeMode } from '../src/store/types';
import { TextSizeSetting } from '../src/theme/typography';

export default function SettingsScreen() {
  const router = useRouter();
  const { state, updateSettings, resetAll } = useSettings();
  const { themeMode, textSize, reduceMotion } = state.settings;

  const confirmReset = () => {
    Alert.alert('Reset everything?', 'This clears your profile and returns all settings to their defaults.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Reset', style: 'destructive', onPress: resetAll },
    ]);
  };

  return (
    <Screen>
      <ChoiceGroup<ThemeMode>
        label="Appearance"
        value={themeMode}
        onChange={(value) => updateSettings({ themeMode: value })}
        options={[
          { value: 'system', label: 'Match my phone' },
          { value: 'light', label: 'Light' },
          { value: 'dark', label: 'Dark' },
          { value: 'highContrast', label: 'High contrast', description: 'Black text on white, strong borders' },
        ]}
      />

      <ChoiceGroup<TextSizeSetting>
        label="Text size"
        helper="Adds to your phone's own text size setting."
        value={textSize}
        onChange={(value) => updateSettings({ textSize: value })}
        options={[
          { value: 'default', label: 'Default' },
          { value: 'large', label: 'Large' },
          { value: 'xlarge', label: 'Extra large' },
        ]}
      />

      <Card tone="soft">
        <AppText variant="h3" header>
          Preview
        </AppText>
        <AppText>Drinking enough water helps your body work well. This is how your text will look.</AppText>
      </Card>

      <ToggleRow
        label="Reduce motion"
        description="Turns off small animations. Also follows your phone's setting."
        value={reduceMotion}
        onChange={(value) => updateSettings({ reduceMotion: value })}
      />

      <Button label="Reset everything" variant="tertiary" onPress={confirmReset} />

      {__DEV__ ? (
        <Button
          label="Developer: component gallery"
          variant="secondary"
          onPress={() => router.push('/dev-gallery')}
        />
      ) : null}
    </Screen>
  );
}
