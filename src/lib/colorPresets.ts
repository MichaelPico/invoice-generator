import type { InvoiceColorPreset, InvoiceColorScheme } from '../types';

export type ResolvedColors = {
  black: string;
  muted: string;
  border: string;
  bg: string;
};

export const PRESET_COLORS: Record<Exclude<InvoiceColorPreset, 'custom'>, ResolvedColors> = {
  classic: { black: '#111111', muted: '#71717a', border: '#e4e4e7', bg: '#f9fafb' },
  indigo:  { black: '#1e1b4b', muted: '#4f46e5', border: '#c7d2fe', bg: '#eef2ff' },
  slate:   { black: '#0f172a', muted: '#64748b', border: '#e2e8f0', bg: '#f8fafc' },
};

export const DEFAULT_COLOR_SCHEME: InvoiceColorScheme = {
  preset: 'classic',
  custom: { ...PRESET_COLORS.classic },
};

export function resolveColors(scheme: InvoiceColorScheme): ResolvedColors {
  if (scheme.preset === 'custom') return scheme.custom;
  return PRESET_COLORS[scheme.preset];
}
