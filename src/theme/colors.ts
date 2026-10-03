// Semantic color tokens for the "Still Water" design language.
// Screens never use raw hex values; they read these names from useTheme().
import type { EvidenceCategoryId } from '../constants/evidence';
import type { SafetyTierId } from '../constants/safetyTiers';

export interface BadgeColors {
  /** Text, icon and border color. */
  fg: string;
  /** Soft background. */
  bg: string;
}

export interface ThemeColors {
  background: string;
  surface: string;
  surfaceAlt: string;
  border: string;
  primary: string;
  primaryDeep: string;
  primarySoft: string;
  onPrimary: string;
  accent: string; // decorative only
  safety: string; // text, borders and icons for safety messages
  safetySoft: string;
  gold: string;
  textPrimary: string;
  textSecondary: string;
  evidence: Record<EvidenceCategoryId, BadgeColors>;
  tier: Record<SafetyTierId, BadgeColors>;
}

export const lightColors: ThemeColors = {
  background: '#FAF6EF',
  surface: '#FFFFFF',
  surfaceAlt: '#F2EBDD',
  border: '#DCD3C2',
  primary: '#0E6B6B',
  primaryDeep: '#0A3F40',
  primarySoft: '#D6EEEC',
  onPrimary: '#FFFFFF',
  accent: '#E2674A',
  safety: '#B8452B',
  safetySoft: '#FBE6DF',
  gold: '#E0A93B',
  textPrimary: '#1B2A2B',
  textSecondary: '#4A5B5C',
  evidence: {
    strong: { fg: '#1F5E45', bg: '#DDF1E7' },
    moderate: { fg: '#2A5A8C', bg: '#E0ECF8' },
    limited: { fg: '#7A5200', bg: '#FBEFD2' },
    traditional: { fg: '#6B3F7D', bg: '#F0E4F5' },
    insufficient: { fg: '#4A5B5C', bg: '#EAE6DC' },
    safetyConcern: { fg: '#9C2A12', bg: '#FBE0D8' },
  },
  tier: {
    general: { fg: '#0A3F40', bg: '#D6EEEC' },
    caution: { fg: '#7A5200', bg: '#FBEFD2' },
    professional: { fg: '#8F3414', bg: '#FCE5DA' },
    urgent: { fg: '#7A1A08', bg: '#F7D4CA' },
  },
};

export const darkColors: ThemeColors = {
  background: '#0F1A1B',
  surface: '#172526',
  surfaceAlt: '#1E3032',
  border: '#2C4345',
  primary: '#5CC4BF',
  primaryDeep: '#8FDAD6',
  primarySoft: '#1F3F40',
  onPrimary: '#0F1A1B',
  accent: '#F08A70',
  safety: '#FF9B82',
  safetySoft: '#3A2420',
  gold: '#F0C060',
  textPrimary: '#E8F0EF',
  textSecondary: '#A9BDBC',
  evidence: {
    strong: { fg: '#8FDDB8', bg: '#1B3A2D' },
    moderate: { fg: '#9CC5F0', bg: '#1B2F47' },
    limited: { fg: '#F0C060', bg: '#3D3014' },
    traditional: { fg: '#D7B0EA', bg: '#36223F' },
    insufficient: { fg: '#C3CFCE', bg: '#2A3637' },
    safetyConcern: { fg: '#FFA58F', bg: '#4A2218' },
  },
  tier: {
    general: { fg: '#8FDAD6', bg: '#1F3F40' },
    caution: { fg: '#F0C060', bg: '#3D3014' },
    professional: { fg: '#FFB197', bg: '#45261B' },
    urgent: { fg: '#FFC2B0', bg: '#5A281C' },
  },
};

export const highContrastColors: ThemeColors = {
  background: '#FFFFFF',
  surface: '#FFFFFF',
  surfaceAlt: '#F0F0F0',
  border: '#000000',
  primary: '#004D4D',
  primaryDeep: '#002B2B',
  primarySoft: '#E0F2F1',
  onPrimary: '#FFFFFF',
  accent: '#A33A20',
  safety: '#8A1F0A',
  safetySoft: '#FFE9E3',
  gold: '#7A5200',
  textPrimary: '#000000',
  textSecondary: '#1A1A1A',
  evidence: {
    strong: { fg: '#0B3D2A', bg: '#FFFFFF' },
    moderate: { fg: '#0D2F57', bg: '#FFFFFF' },
    limited: { fg: '#5C3D00', bg: '#FFFFFF' },
    traditional: { fg: '#4A1F5E', bg: '#FFFFFF' },
    insufficient: { fg: '#1A1A1A', bg: '#FFFFFF' },
    safetyConcern: { fg: '#7A1000', bg: '#FFFFFF' },
  },
  tier: {
    general: { fg: '#002B2B', bg: '#FFFFFF' },
    caution: { fg: '#5C3D00', bg: '#FFFFFF' },
    professional: { fg: '#6B2200', bg: '#FFFFFF' },
    urgent: { fg: '#6B0F00', bg: '#FFFFFF' },
  },
};
