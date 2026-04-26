import { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { t } from '../../lib/i18n';
import { formatInvoiceNumber } from '../../lib/invoiceNumber';
import type { InvoiceNumberingConfig, NumberFormat } from '../../types';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { ToggleGroup, ToggleGroupItem } from '../ui/toggle-group';

const FORMAT_LABELS: Record<NumberFormat, string> = {
  'YYYY-SEQ': 'YYYY-001',
  'YYYY-MM-SEQ': 'YYYY-MM-001',
  'CUSTOM-YYYY-SEQ': 'PREFIX-YYYY-001',
};

export function InvoiceNumberingForm() {
  const { numbering, uiLanguage, updateNumbering, draft } = useApp();
  const [form, setForm] = useState<InvoiceNumberingConfig>({ ...numbering });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setForm({ ...numbering });
  }, [numbering]);

  function set<K extends keyof InvoiceNumberingConfig>(
    field: K,
    value: InvoiceNumberingConfig[K],
  ) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  }

  async function handleSave() {
    setSaving(true);
    await updateNumbering(form);
    setSaving(false);
    setSaved(true);
  }

  const preview = formatInvoiceNumber(form, draft?.invoiceDate);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label>{t('numberFormat', uiLanguage)}</Label>
        <ToggleGroup
          type="single"
          variant="outline"
          value={form.format}
          onValueChange={(v) => v && set('format', v as NumberFormat)}
          className="flex-wrap justify-start"
        >
          {(Object.keys(FORMAT_LABELS) as NumberFormat[]).map((fmt) => (
            <ToggleGroupItem key={fmt} value={fmt} className="text-xs">
              {FORMAT_LABELS[fmt]}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      {form.format === 'CUSTOM-YYYY-SEQ' && (
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="custom-prefix">{t('customPrefix', uiLanguage)}</Label>
          <Input
            id="custom-prefix"
            value={form.customPrefix}
            onChange={(e) => set('customPrefix', e.target.value)}
            placeholder="FA"
            className="w-32"
          />
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="counter">{t('counter', uiLanguage)}</Label>
        <Input
          id="counter"
          type="number"
          min={0}
          value={form.counter}
          onChange={(e) => set('counter', parseInt(e.target.value, 10) || 0)}
          className="w-32"
        />
      </div>

      <div className="flex items-center gap-2 text-sm">
        <span className="text-muted-foreground">{t('nextNumber', uiLanguage)}:</span>
        <span className="font-mono font-medium">{preview}</span>
      </div>

      <Button onClick={handleSave} disabled={saving} className="self-end">
        {saved ? '✓ ' : ''}{t('save', uiLanguage)}
      </Button>
    </div>
  );
}
