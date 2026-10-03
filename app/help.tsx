import React from 'react';
import { AppText } from '../src/components/AppText';
import { Card } from '../src/components/Card';
import { Screen } from '../src/components/Screen';
import { EDUCATION_DISCLAIMER } from '../src/constants/app';

const URGENT_SIGNS = [
  'Chest pain or pressure',
  'Trouble breathing',
  'Signs of a stroke: face drooping, arm weakness, trouble speaking',
  'Severe bleeding that will not stop',
  'Suspected poisoning or medicine overdose',
  'Thoughts of harming yourself or someone else',
];

export default function HelpScreen() {
  return (
    <Screen>
      <Card tone="safety">
        <AppText variant="h2" tone="safety" header>
          In an emergency, call your local emergency number now.
        </AppText>
        <AppText>Do not wait for an app, and do not wait to see if it gets better.</AppText>
      </Card>

      <Card>
        <AppText variant="h3" header>
          Get urgent care for signs like these
        </AppText>
        {URGENT_SIGNS.map((sign) => (
          <AppText key={sign}>{`\u2022  ${sign}`}</AppText>
        ))}
      </Card>

      <Card>
        <AppText variant="h3" header>
          Talk to a health professional soon if
        </AppText>
        <AppText>{'\u2022  Symptoms are getting worse or will not go away'}</AppText>
        <AppText>{'\u2022  You have questions about your medicines. Ask a pharmacist or doctor before changing anything'}</AppText>
        <AppText>{'\u2022  A baby, an older adult or a pregnant person is unwell'}</AppText>
      </Card>

      <AppText variant="small" tone="secondary">
        Emergency numbers for your country will be added in a later step. {EDUCATION_DISCLAIMER}
      </AppText>
    </Screen>
  );
}
