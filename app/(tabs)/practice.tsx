import React from 'react';
import { PlaceholderScreen } from '../../src/components/PlaceholderScreen';

export default function PracticeScreen() {
  return (
    <PlaceholderScreen
      title="Practice"
      description="Test what you know and build your skills."
      upcoming={[
        'Quizzes and daily missions',
        'Health claim checker',
        'Later: virtual patient scenarios',
      ]}
    />
  );
}
