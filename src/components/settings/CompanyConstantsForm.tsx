import { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { t } from '../../lib/i18n';
import type { CompanySettings } from '../../types';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';

const EMPTY: CompanySettings = { firstName: '', lastName: '', address: '', siret: '', iban: '' };

export function CompanyConstantsForm() {
  const { company, uiLanguage, updateCompany } = useApp();
  const [form, setForm] = useState<CompanySettings>(company ?? EMPTY);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

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

  return (
    <div className="flex flex-col gap-4">
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

      <Button onClick={handleSave} disabled={saving} className="self-end">
        {saved ? '✓ ' : ''}{t('save', uiLanguage)}
      </Button>
    </div>
  );
}
