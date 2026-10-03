import { useRouter } from 'expo-router';
import React from 'react';
import { Button } from './Button';

/** Always available in the header. Opens the "When to get help" screen. */
export function SafetyHelpButton() {
  const router = useRouter();
  return (
    <Button
      label="Get help"
      icon="alert-circle-outline"
      variant="safety"
      size="compact"
      fullWidth={false}
      accessibilityHint="Opens guidance on when to seek urgent medical care"
      onPress={() => router.push('/help')}
    />
  );
}
