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
