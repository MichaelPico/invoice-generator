import { useState } from 'react';
import { MoonIcon, SunIcon, SettingsIcon, Trash2Icon, FileDownIcon } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { t } from '../lib/i18n';
import type { UILanguage } from '../types';
import { Button } from './ui/button';
import { ToggleGroup, ToggleGroupItem } from './ui/toggle-group';
import { SettingsPanel } from './settings/SettingsPanel';
import { PDFPreviewDialog } from './invoice/PDFPreviewDialog';

export function Toolbar() {
  const { theme, uiLanguage, setTheme, setUILanguage, resetDraft, draft, company, logo, advanceCounter } = useApp();
  const [pdfOpen, setPdfOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-border bg-background/95 backdrop-blur px-6 h-14 gap-4">
        <span className="font-semibold text-foreground tracking-tight shrink-0">
          Factures
        </span>

        <div className="flex items-center gap-2 ml-auto">
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
          open={pdfOpen}
          onClose={() => setPdfOpen(false)}
          onDownloaded={() => void advanceCounter()}
        />
      )}
    </>
  );
}
