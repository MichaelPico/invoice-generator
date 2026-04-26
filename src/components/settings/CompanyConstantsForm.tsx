import { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { t } from '../../lib/i18n';
import type { CompanySettings } from '../../types';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';

const EMPTY: CompanySettings = { firstName: '', lastName: '', address: '', siret: '', iban: '', bic: '' };

export function CompanyConstantsForm() {
  const { company, logo, uiLanguage, updateCompany, updateLogo } = useApp();
  const [form, setForm] = useState<CompanySettings>(company ?? EMPTY);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setForm(company ?? EMPTY);
  }, [company]);

  function set(field: keyof CompanySettings, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  }

  async function handleSave() {
    setSaving(true);
    await updateCompany(form);
    setSaving(false);
    setSaved(true);
  }

  function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      void updateLogo(reader.result as string);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Logo */}
      <div className="flex flex-col gap-1.5">
        <Label>{t('companyLogo', uiLanguage)}</Label>
        <div className="flex items-center gap-3">
          {logo ? (
            <img
              src={logo}
              alt="logo"
              className="h-12 max-w-[120px] object-contain rounded border border-border bg-muted/30"
            />
          ) : null}
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
            >
              {t('uploadLogo', uiLanguage)}
            </Button>
            {logo ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-muted-foreground"
                onClick={() => void updateLogo(null)}
              >
                {t('removeLogo', uiLanguage)}
              </Button>
            ) : null}
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/svg+xml"
          className="hidden"
          onChange={handleLogoChange}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="company-lastname">{t('lastName', uiLanguage)}</Label>
        <Input
          id="company-lastname"
          value={form.lastName}
          onChange={(e) => set('lastName', e.target.value)}
          placeholder="Dupont"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="company-firstname">{t('firstName', uiLanguage)}</Label>
        <Input
          id="company-firstname"
          value={form.firstName}
          onChange={(e) => set('firstName', e.target.value)}
          placeholder="Jean"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="company-address">{t('address', uiLanguage)}</Label>
        <Textarea
          id="company-address"
          value={form.address}
          onChange={(e) => set('address', e.target.value)}
          placeholder={"12 rue de la Paix\n75001 Paris"}
          rows={3}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="company-siret">{t('siret', uiLanguage)}</Label>
        <Input
          id="company-siret"
          value={form.siret}
          onChange={(e) => set('siret', e.target.value)}
          placeholder="123 456 789 00012"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="company-iban">{t('iban', uiLanguage)}</Label>
        <Input
          id="company-iban"
          value={form.iban}
          onChange={(e) => set('iban', e.target.value)}
          placeholder="FR76 3000 6000 0112 3456 7890 189"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="company-bic">{t('bic', uiLanguage)}</Label>
        <Input
          id="company-bic"
          value={form.bic ?? ''}
          onChange={(e) => set('bic', e.target.value)}
          placeholder="BNPAFRPP"
        />
      </div>

      <Button onClick={handleSave} disabled={saving} className="self-end">
        {saved ? '✓ ' : ''}{t('save', uiLanguage)}
      </Button>
    </div>
  );
}
