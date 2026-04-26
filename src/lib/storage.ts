import type { Theme, UILanguage } from '../types';

export function getTheme(): Theme {
  return (localStorage.getItem('theme') as Theme) ?? 'light';
}

export function saveTheme(theme: Theme): void {
  localStorage.setItem('theme', theme);
}

function detectDefaultLanguage(): UILanguage {
  const lang = navigator.language ?? navigator.languages?.[0] ?? '';
  return lang.toLowerCase().startsWith('fr') ? 'fr' : 'en';
}

export function getUILanguage(): UILanguage {
  return (localStorage.getItem('uiLanguage') as UILanguage) ?? detectDefaultLanguage();
}

export function saveUILanguage(lang: UILanguage): void {
  localStorage.setItem('uiLanguage', lang);
}

export function getLastClientId(): number | null {
  const v = localStorage.getItem('lastClientId');
  return v !== null ? Number(v) : null;
}

export function saveLastClientId(id: number): void {
  localStorage.setItem('lastClientId', String(id));
}

export function hasSeenWelcome(): boolean {
  return localStorage.getItem('hasSeenWelcome') === 'true';
}

export function markWelcomeSeen(): void {
  localStorage.setItem('hasSeenWelcome', 'true');
}
