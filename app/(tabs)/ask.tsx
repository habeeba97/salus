import React from 'react';
import { PlaceholderScreen } from '../../src/components/PlaceholderScreen';

export default function AskScreen() {
  return (
    <PlaceholderScreen
      title="Ask"
      description="Ask a health question and get a clear answer."
      upcoming={[
        'Answers in simple, detailed, child-friendly or elder-friendly style',
        'Evidence labels and sources on every answer',
        'Guidance on when to see a health professional',
      ]}
    />
  );
}
