import { useRouter } from 'expo-router';
import React from 'react';
import { AppText } from '../../src/components/AppText';
import { Button } from '../../src/components/Button';
import { Card } from '../../src/components/Card';
import { Screen } from '../../src/components/Screen';
import { Tag } from '../../src/components/Tag';
import { APP_NAME, EDUCATION_DISCLAIMER } from '../../src/constants/app';
import { useSettings } from '../../src/store/SettingsProvider';

export default function HomeScreen() {
  const router = useRouter();
  const { state } = useSettings();
  const name = state.profile.displayName.trim();

  return (
    <Screen>
      <AppText variant="display" header>
        {name ? `Hello, ${name}` : `Welcome to ${APP_NAME}`}
      </AppText>
      <AppText tone="secondary">Learn about health at your own pace.</AppText>

      <Card tone="soft">
        <Tag label="Coming soon" />
        <AppText variant="h3" header>
          Today's mission
        </AppText>
        <AppText>Your daily learning mission will appear here.</AppText>
      </Card>

      <Card>
        <Tag label="Coming soon" />
        <AppText variant="h3" header>
          Your learning ripples
        </AppText>
        <AppText>
          Ripples grow with each day you learn. They start with your first lesson.
        </AppText>
      </Card>

      <Card
        onPress={() => router.push('/learn')}
        accessibilityLabel="Continue learning"
        accessibilityHint="Opens the Learn tab"
      >
        <AppText variant="h3" header>
          Continue learning
        </AppText>
        <AppText>Lessons are on their way. Tap to see what is planned.</AppText>
      </Card>

      <Card>
        <AppText variant="h3" header>
          Check a health claim
        </AppText>
        <AppText>Heard something about health and not sure it is true? You will be able to check it here.</AppText>
        <Button
          label="See Practice"
          variant="secondary"
          onPress={() => router.push('/practice')}
        />
      </Card>

      <Card tone="safety">
        <AppText variant="h3" tone="safety" header>
          Not sure when to get help?
        </AppText>
        <AppText>Some symptoms need care right away.</AppText>
        <Button
          label="When to get help"
          variant="safety"
          icon="alert-circle-outline"
          onPress={() => router.push('/help')}
        />
      </Card>

      <AppText variant="small" tone="secondary">
        {EDUCATION_DISCLAIMER}
      </AppText>
    </Screen>
  );
}
