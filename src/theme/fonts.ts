// Font loading. Figtree for UI text, Fraunces for display headings.
// React Native needs one font family per weight, so weights are separate names.
import {
  Figtree_400Regular,
  Figtree_600SemiBold,
  Figtree_700Bold,
} from '@expo-google-fonts/figtree';
import { Fraunces_600SemiBold, Fraunces_700Bold } from '@expo-google-fonts/fraunces';

export const fontAssets = {
  Figtree_400Regular,
  Figtree_600SemiBold,
  Figtree_700Bold,
  Fraunces_600SemiBold,
  Fraunces_700Bold,
};

export const fontFamilies = {
  body: 'Figtree_400Regular',
  bodySemiBold: 'Figtree_600SemiBold',
  bodyBold: 'Figtree_700Bold',
  displaySemiBold: 'Fraunces_600SemiBold',
  displayBold: 'Fraunces_700Bold',
} as const;
