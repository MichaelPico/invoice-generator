import type { Theme, UILanguage } from '../types';

export function getTheme(): Theme {
  return (localStorage.getItem('theme') as Theme) ?? 'light';
}

export function saveTheme(theme: Theme): void {
  localStorage.setItem('theme', theme);
}

export function getUILanguage(): UILanguage {
  return (localStorage.getItem('uiLanguage') as UILanguage) ?? 'fr';
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
