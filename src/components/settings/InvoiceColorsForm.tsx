import { useApp } from '../../context/AppContext';
import { PRESET_COLORS, resolveColors } from '../../lib/colorPresets';
import type { InvoiceColorPreset } from '../../types';
import { cn } from '../../lib/utils';

const PRESETS: { id: Exclude<InvoiceColorPreset, 'custom'>; label: string }[] = [
  { id: 'classic', label: 'Classic' },
  { id: 'indigo',  label: 'Indigo' },
  { id: 'slate',   label: 'Slate' },
];

const COLOR_FIELDS: { key: keyof typeof PRESET_COLORS.classic; labelFr: string; labelEn: string }[] = [
  { key: 'black',  labelFr: 'Texte',      labelEn: 'Text' },
  { key: 'muted',  labelFr: 'Accent',     labelEn: 'Accent' },
  { key: 'border', labelFr: 'Bordure',    labelEn: 'Border' },
  { key: 'bg',     labelFr: 'Fond',       labelEn: 'Background' },
];

export function InvoiceColorsForm() {
  const { colorScheme, updateColorScheme, uiLanguage } = useApp();
  const resolved = resolveColors(colorScheme);

  function selectPreset(preset: InvoiceColorPreset) {
    void updateColorScheme({ ...colorScheme, preset });
  }

  function setCustomColor(key: keyof typeof PRESET_COLORS.classic, value: string) {
    void updateColorScheme({
      preset: 'custom',
      custom: { ...colorScheme.custom, [key]: value },
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-4 gap-2">
        {PRESETS.map(({ id, label }) => {
          const c = PRESET_COLORS[id];
          const active = colorScheme.preset === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => selectPreset(id)}
              className={cn(
                'flex flex-col items-start gap-2 rounded-lg border-2 p-2.5 text-left transition-colors',
                active ? 'border-primary' : 'border-border hover:border-muted-foreground/40',
              )}
            >
              <div className="flex gap-1">
                <span className="size-3 rounded-sm" style={{ background: c.black }} />
                <span className="size-3 rounded-sm" style={{ background: c.muted }} />
                <span className="size-3 rounded-sm" style={{ background: c.border }} />
                <span className="size-3 rounded-sm border border-border/60" style={{ background: c.bg }} />
              </div>
              <span className="text-xs font-medium leading-none">{label}</span>
            </button>
          );
        })}

        {/* Custom */}
        <button
          type="button"
          onClick={() => selectPreset('custom')}
          className={cn(
            'flex flex-col items-start gap-2 rounded-lg border-2 p-2.5 text-left transition-colors',
            colorScheme.preset === 'custom' ? 'border-primary' : 'border-border hover:border-muted-foreground/40',
          )}
        >
          <div className="flex gap-1">
            {(['black', 'muted', 'border', 'bg'] as const).map((k) => (
              <span key={k} className="size-3 rounded-sm border border-border/60" style={{ background: colorScheme.custom[k] }} />
            ))}
          </div>
          <span className="text-xs font-medium leading-none">
            {uiLanguage === 'fr' ? 'Perso' : 'Custom'}
          </span>
        </button>
      </div>

      {colorScheme.preset === 'custom' && (
        <div className="flex flex-col gap-2.5">
          {COLOR_FIELDS.map(({ key, labelFr, labelEn }) => (
            <div key={key} className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {uiLanguage === 'fr' ? labelFr : labelEn}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground font-mono">{resolved[key]}</span>
                <input
                  type="color"
                  value={colorScheme.custom[key]}
                  onChange={(e) => setCustomColor(key, e.target.value)}
                  className="size-7 cursor-pointer rounded border border-border bg-transparent p-0.5"
                />
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
