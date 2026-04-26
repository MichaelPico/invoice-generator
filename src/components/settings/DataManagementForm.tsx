import { useRef, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { t } from '../../lib/i18n';
import { exportAllData, importAllData, type AppExport } from '../../lib/db';
import { Button } from '../ui/button';

export function DataManagementForm() {
  const { uiLanguage } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState<{ data: AppExport; fileName: string } | null>(null);
  const [error, setError] = useState(false);
  const [importing, setImporting] = useState(false);

  async function handleExport() {
    const data = await exportAllData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const date = new Date().toISOString().slice(0, 10);
    const a = document.createElement('a');
    a.href = url;
    a.download = `factures-export-${date}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setError(false);
    setPending(null);
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target?.result as string) as AppExport;
        if (data.version !== 1 || !Array.isArray(data.clients)) throw new Error();
        setPending({ data, fileName: file.name });
      } catch {
        setError(true);
      }
    };
    reader.readAsText(file);
  }

  async function handleConfirm() {
    if (!pending) return;
    setImporting(true);
    await importAllData(pending.data);
    window.location.reload();
  }

  return (
    <div className="flex flex-col gap-3">
      <Button variant="outline" size="sm" onClick={handleExport}>
        {t('exportData', uiLanguage)}
      </Button>

      <input
        ref={fileInputRef}
        type="file"
        accept=".json,application/json"
        className="hidden"
        onChange={handleFileChange}
      />
      <Button
        variant="outline"
        size="sm"
        onClick={() => { setPending(null); setError(false); fileInputRef.current?.click(); }}
      >
        {t('importData', uiLanguage)}
      </Button>

      {error && (
        <p className="text-xs text-destructive">{t('importError', uiLanguage)}</p>
      )}

      {pending && (
        <div className="flex flex-col gap-2 rounded-md border border-destructive/40 bg-destructive/10 p-3">
          <p className="text-xs font-medium text-destructive">
            {t('importWarning', uiLanguage)}
          </p>
          <p className="text-xs text-muted-foreground truncate">{pending.fileName}</p>
          <div className="flex gap-2">
            <Button
              variant="destructive"
              size="sm"
              disabled={importing}
              onClick={handleConfirm}
            >
              {t('confirmImport', uiLanguage)}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              disabled={importing}
              onClick={() => setPending(null)}
            >
              {t('cancel', uiLanguage)}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
