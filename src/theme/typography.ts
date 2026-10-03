import { fontFamilies } from './fonts';

// Type scale. Sizes are unchanged from the foundation.
// display / h1 / h2 use Fraunces. Everything else uses Figtree.
// Note: Fraunces covers Latin text only. Urdu and Hindi text falls back to the
// phone's own font until script-specific fonts are added with translations.
export type TextVariant =
  | 'display'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'body'
  | 'small'
  | 'caption';

export const typeScale: Record<
  TextVariant,
  { fontSize: number; lineHeight: number; fontFamily: string }
> = {
  display: { fontSize: 32, lineHeight: 40, fontFamily: fontFamilies.displayBold },
  h1: { fontSize: 26, lineHeight: 34, fontFamily: fontFamilies.displayBold },
  h2: { fontSize: 22, lineHeight: 30, fontFamily: fontFamilies.displaySemiBold },
  h3: { fontSize: 18, lineHeight: 26, fontFamily: fontFamilies.bodySemiBold },
  body: { fontSize: 17, lineHeight: 26, fontFamily: fontFamilies.body },
  small: { fontSize: 14, lineHeight: 20, fontFamily: fontFamilies.body },
  caption: { fontSize: 12, lineHeight: 16, fontFamily: fontFamilies.body },
};

// In-app text size setting. Applied on top of the phone's own text size setting.
export const textScaleValues = {
  default: 1,
  large: 1.15,
  xlarge: 1.3,
} as const;

export type TextSizeSetting = keyof typeof textScaleValues;

// Extra boost when "Elder-friendly" learning mode is on.
export const elderScaleBoost = 1.2;
