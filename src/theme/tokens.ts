// Layout tokens: 4pt spacing grid, radii, touch targets.
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
  huge: 64,
} as const;

export const radius = {
  input: 12,
  card: 20,
  sheet: 28,
  pill: 999,
} as const;

export const touchTarget = {
  standard: 48,
  elder: 60,
} as const;

export const layout = {
  screenMargin: 20,
  buttonHeight: 52,
  buttonHeightElder: 60,
  tabBarBaseHeight: 64,
} as const;
