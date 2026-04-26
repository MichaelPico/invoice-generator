import { useState } from 'react';
import { MoonIcon, SunIcon, SettingsIcon, Trash2Icon, FileDownIcon, CircleHelpIcon } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { t } from '../lib/i18n';
import type { UILanguage } from '../types';
import { resolveColors } from '../lib/colorPresets';
import { Button } from './ui/button';
import { ToggleGroup, ToggleGroupItem } from './ui/toggle-group';
import { SettingsPanel } from './settings/SettingsPanel';
import { PDFPreviewDialog } from './invoice/PDFPreviewDialog';

interface ToolbarProps {
  onHelpClick: () => void;
}

export function Toolbar({ onHelpClick }: ToolbarProps) {
  const { theme, uiLanguage, setTheme, setUILanguage, resetDraft, draft, company, logo, colorScheme, advanceCounter } = useApp();
  const colors = resolveColors(colorScheme);
  const [pdfOpen, setPdfOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-border bg-background/95 backdrop-blur px-6 h-14 gap-4">
        <span className="font-semibold text-foreground tracking-tight shrink-0">
          Factures
        </span>

        <div className="flex items-center gap-2 ml-auto">
          {/* GitHub source link */}
          <Button variant="ghost" size="sm" className="gap-1.5" asChild>
            <a href="https://github.com/MichaelPico/invoice-generator" target="_blank" rel="noopener noreferrer">
              <svg viewBox="0 0 1024 1024" className="size-4" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" clipRule="evenodd" d="M8 0C3.58 0 0 3.58 0 8C0 11.54 2.29 14.53 5.47 15.59C5.87 15.66 6.02 15.42 6.02 15.21C6.02 15.02 6.01 14.39 6.01 13.72C4 14.09 3.48 13.23 3.32 12.78C3.23 12.55 2.84 11.84 2.5 11.65C2.22 11.5 1.82 11.13 2.49 11.12C3.12 11.11 3.57 11.7 3.72 11.94C4.44 13.15 5.59 12.81 6.05 12.6C6.12 12.08 6.33 11.73 6.56 11.53C4.78 11.33 2.92 10.64 2.92 7.58C2.92 6.71 3.23 5.99 3.74 5.43C3.66 5.23 3.38 4.41 3.82 3.31C3.82 3.31 4.49 3.1 6.02 4.13C6.66 3.95 7.34 3.86 8.02 3.86C8.7 3.86 9.38 3.95 10.02 4.13C11.55 3.09 12.22 3.31 12.22 3.31C12.66 4.41 12.38 5.23 12.3 5.43C12.81 5.99 13.12 6.7 13.12 7.58C13.12 10.65 11.25 11.33 9.47 11.53C9.76 11.78 10.01 12.26 10.01 13.01C10.01 14.08 10 14.94 10 15.21C10 15.42 10.15 15.67 10.55 15.59C13.71 14.53 16 11.53 16 8C16 3.58 12.42 0 8 0Z" transform="scale(64)" />
              </svg>
              Source
            </a>
          </Button>

          {/* Help / about */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onHelpClick}
            aria-label={t('helpButton', uiLanguage)}
          >
            <CircleHelpIcon className="size-4" />
          </Button>

          <div className="w-px h-5 bg-border mx-1" />

          {/* UI language toggle */}
          <ToggleGroup
            type="single"
            variant="outline"
            value={uiLanguage}
            onValueChange={(v) => v && setUILanguage(v as UILanguage)}
            className="h-8"
          >
            <ToggleGroupItem value="fr" className="text-xs px-3 h-8">
              FR
            </ToggleGroupItem>
            <ToggleGroupItem value="en" className="text-xs px-3 h-8">
              EN
            </ToggleGroupItem>
          </ToggleGroup>

          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          >
            {theme === 'light' ? (
              <MoonIcon className="size-4" />
            ) : (
              <SunIcon className="size-4" />
            )}
          </Button>

          <div className="w-px h-5 bg-border mx-1" />

          {/* Settings */}
          <SettingsPanel
            trigger={
              <Button variant="ghost" size="sm" className="gap-1.5">
                <SettingsIcon className="size-4" />
                {t('settings', uiLanguage)}
              </Button>
            }
          />

          {/* Clear Form */}
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 text-muted-foreground"
            onClick={() => void resetDraft()}
          >
            <Trash2Icon className="size-4" />
            {t('clearForm', uiLanguage)}
          </Button>

          {/* Generate PDF */}
          <Button
            size="sm"
            className="gap-1.5"
            disabled={!draft}
            onClick={() => setPdfOpen(true)}
          >
            <FileDownIcon className="size-4" />
            {t('generatePDF', uiLanguage)}
          </Button>
        </div>
      </header>

      {draft && (
        <PDFPreviewDialog
          draft={draft}
          company={company}
          logo={logo}
          colors={colors}
          open={pdfOpen}
          onClose={() => setPdfOpen(false)}
          onDownloaded={() => void advanceCounter()}
        />
      )}
    </>
  );
}
