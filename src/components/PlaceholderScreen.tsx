import React from 'react';
import { AppText } from './AppText';
import { Card } from './Card';
import { Screen } from './Screen';
import { Tag } from './Tag';

interface Props {
  title: string;
  description: string;
  upcoming: string[];
}

/** Used by tabs whose features are built in later steps. */
export function PlaceholderScreen({ title, description, upcoming }: Props) {
  return (
    <Screen>
      <AppText variant="h1" header>
        {title}
      </AppText>
      <AppText tone="secondary">{description}</AppText>
      <Card>
        <Tag label="Coming soon" />
        <AppText variant="h3" header>
          What will be here
        </AppText>
        {upcoming.map((item) => (
          <AppText key={item}>{`\u2022  ${item}`}</AppText>
        ))}
      </Card>
    </Screen>
  );
}
