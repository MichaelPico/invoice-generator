import { useEffect, useRef, useState } from 'react';
import { PlusIcon, Trash2Icon } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { t } from '../../lib/i18n';
import { formatInvoiceNumber } from '../../lib/invoiceNumber';
import type { InvoiceDraft, InvoiceLanguage, LineItem } from '../../types';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Separator } from '../ui/separator';
import { Textarea } from '../ui/textarea';
import { ToggleGroup, ToggleGroupItem } from '../ui/toggle-group';
import { ClientCombobox } from './ClientCombobox';
import { ClientManagerDialog } from './ClientManagerDialog';
import { DateInput } from './DateInput';

function today() {
  return new Date().toISOString().split('T')[0];
}

function plusDays(days: number) {
  return new Date(Date.now() + days * 864e5).toISOString().split('T')[0];
}


function freshDraft(
  numbering: Parameters<typeof formatInvoiceNumber>[0],
  iban?: string,
): InvoiceDraft {
  return {
    invoiceNumber: formatInvoiceNumber(numbering),
    invoiceLanguage: 'fr',
    invoiceDate: today(),
    serviceDate: today(),
    dueDate: plusDays(30),
    isB2B: false,
    client: { name: '', address: '' },
    lineItems: [{ id: crypto.randomUUID(), description: '', quantity: 1, unitPriceHT: 0 }],
    paymentTerms: '',
    paymentMethods: iban ? `Virement bancaire - IBAN : ${iban}` : '',
    latePaymentPenaltyRate: '',
  };
}

export function InvoiceForm() {
  const { numbering, company, clients, draft, uiLanguage, updateDraft } = useApp();

  const [form, setForm] = useState<InvoiceDraft>(
    () => draft ?? freshDraft(numbering, company?.iban),
  );

  const updateDraftRef = useRef(updateDraft);
  updateDraftRef.current = updateDraft;

  useEffect(() => {
    const timer = setTimeout(() => void updateDraftRef.current(form), 400);
    return () => clearTimeout(timer);
  }, [form]);

  function update(patch: Partial<InvoiceDraft>) {
    setForm((prev) => ({ ...prev, ...patch }));
  }

  function updateClient(patch: Partial<InvoiceDraft['client']>) {
    setForm((prev) => ({ ...prev, client: { ...prev.client, ...patch } }));
  }

  function addLine() {
    const line: LineItem = {
      id: crypto.randomUUID(),
      description: '',
      quantity: 1,
      unitPriceHT: 0,
    };
    update({ lineItems: [...form.lineItems, line] });
  }

  function updateLine(id: string, patch: Partial<LineItem>) {
    update({ lineItems: form.lineItems.map((li) => (li.id === id ? { ...li, ...patch } : li)) });
  }

  function removeLine(id: string) {
    if (form.lineItems.length === 1) return;
    update({ lineItems: form.lineItems.filter((li) => li.id !== id) });
  }

  const totalHT = form.lineItems.reduce((sum, li) => sum + li.quantity * li.unitPriceHT, 0);

  const fmtEUR = (n: number) =>
    n.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';

  return (
    <div className="space-y-10">
      {/* ---- Invoice meta ---- */}
      <section className="space-y-4">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-48 space-y-1.5">
            <Label htmlFor="invoiceNumber">{t('invoiceNumber', uiLanguage)}</Label>
            <Input
              id="invoiceNumber"
              value={form.invoiceNumber}
              onChange={(e) => update({ invoiceNumber: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <Label>{t('invoiceLanguage', uiLanguage)}</Label>
            <ToggleGroup
              type="single"
              variant="outline"
              value={form.invoiceLanguage}
              onValueChange={(v) => v && update({ invoiceLanguage: v as InvoiceLanguage })}
              className="h-9"
            >
              <ToggleGroupItem value="fr" className="text-xs px-3 h-9">FR</ToggleGroupItem>
              <ToggleGroupItem value="en" className="text-xs px-3 h-9">EN</ToggleGroupItem>
              <ToggleGroupItem value="fr+en" className="text-xs px-3 h-9">FR+EN</ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-36 space-y-1.5">
            <Label htmlFor="invoiceDate">{t('invoiceDate', uiLanguage)}</Label>
            <DateInput id="invoiceDate" value={form.invoiceDate} onChange={(v) => update({ invoiceDate: v })} />
          </div>
          <div className="flex-1 min-w-36 space-y-1.5">
            <Label htmlFor="serviceDate">{t('serviceDate', uiLanguage)}</Label>
            <DateInput id="serviceDate" value={form.serviceDate} onChange={(v) => update({ serviceDate: v })} />
          </div>
          <div className="flex-1 min-w-36 space-y-1.5">
            <Label htmlFor="dueDate">{t('dueDate', uiLanguage)}</Label>
            <DateInput id="dueDate" value={form.dueDate} onChange={(v) => update({ dueDate: v })} />
          </div>
        </div>
      </section>

      <Separator />

      {/* ---- Parties ---- */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Seller */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {t('sellerInfo', uiLanguage)}
          </h3>
          {company ? (
            <div className="text-sm space-y-0.5">
              <p className="font-medium">{company.name}</p>
              <p className="text-muted-foreground whitespace-pre-line">{company.address}</p>
              <p className="text-muted-foreground">SIRET : {company.siret}</p>
              {company.iban && (
                <p className="text-muted-foreground">IBAN : {company.iban}</p>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground italic">
              {uiLanguage === 'fr'
                ? 'Configurez vos informations dans Paramètres.'
                : 'Configure your company info in Settings.'}
            </p>
          )}
        </div>

        {/* Client */}
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {t('clientInfo', uiLanguage)}
            </h3>
            <div className="flex items-center gap-2">
              <ToggleGroup
                type="single"
                variant="outline"
                value={form.isB2B ? 'b2b' : 'b2c'}
                onValueChange={(v) => v && update({ isB2B: v === 'b2b' })}
                className="h-7"
              >
                <ToggleGroupItem value="b2b" className="text-xs px-2.5 h-7">
                  {t('b2b', uiLanguage)}
                </ToggleGroupItem>
                <ToggleGroupItem value="b2c" className="text-xs px-2.5 h-7">
                  {t('b2c', uiLanguage)}
                </ToggleGroupItem>
              </ToggleGroup>
              <ClientManagerDialog />
            </div>
          </div>

          {clients.length > 0 && (
            <ClientCombobox
              clients={clients}
              uiLanguage={uiLanguage}
              onSelect={(c) =>
                updateClient({
                  name: c.name,
                  address: c.address,
                  vatNumber: c.vatNumber,
                  siren: c.siren,
                })
              }
            />
          )}

          <div className="space-y-2">
            <div className="space-y-1.5">
              <Label htmlFor="clientName">{t('clientName', uiLanguage)}</Label>
              <Input
                id="clientName"
                value={form.client.name}
                onChange={(e) => updateClient({ name: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="clientAddress">{t('clientAddress', uiLanguage)}</Label>
              <Textarea
                id="clientAddress"
                rows={2}
                className="resize-none"
                value={form.client.address}
                onChange={(e) => updateClient({ address: e.target.value })}
              />
            </div>
            {form.isB2B && (
              <>
                <div className="space-y-1.5">
                  <Label htmlFor="vatNumber">{t('vatNumber', uiLanguage)}</Label>
                  <Input
                    id="vatNumber"
                    value={form.client.vatNumber ?? ''}
                    onChange={(e) => updateClient({ vatNumber: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="siren">{t('siren', uiLanguage)}</Label>
                  <Input
                    id="siren"
                    value={form.client.siren ?? ''}
                    onChange={(e) => updateClient({ siren: e.target.value })}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      <Separator />

      {/* ---- Line items ---- */}
      <section className="space-y-3">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {uiLanguage === 'fr' ? 'Prestations' : 'Services'}
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="pb-2 pr-3 font-medium">{t('description', uiLanguage)}</th>
                <th className="pb-2 px-2 font-medium w-20 text-right">{t('quantity', uiLanguage)}</th>
                <th className="pb-2 px-2 font-medium w-36 text-right">{t('unitPrice', uiLanguage)}</th>
                <th className="pb-2 pl-2 font-medium w-32 text-right">{t('lineTotal', uiLanguage)}</th>
                <th className="w-9" />
              </tr>
            </thead>
            <tbody>
              {form.lineItems.map((li) => {
                const lineTotal = li.quantity * li.unitPriceHT;
                return (
                  <tr key={li.id} className="group border-b border-border/40 last:border-0">
                    <td className="py-1.5 pr-3">
                      <Input
                        value={li.description}
                        onChange={(e) => updateLine(li.id, { description: e.target.value })}
                        placeholder={uiLanguage === 'fr' ? 'Prestation…' : 'Service…'}
                        className="h-8"
                      />
                    </td>
                    <td className="py-1.5 px-2">
                      <Input
                        type="number"
                        min={0}
                        step={1}
                        value={li.quantity}
                        onChange={(e) =>
                          updateLine(li.id, { quantity: parseFloat(e.target.value) || 0 })
                        }
                        className="h-8 text-right"
                      />
                    </td>
                    <td className="py-1.5 px-2">
                      <Input
                        type="number"
                        min={0}
                        step={0.01}
                        value={li.unitPriceHT}
                        onChange={(e) =>
                          updateLine(li.id, { unitPriceHT: parseFloat(e.target.value) || 0 })
                        }
                        className="h-8 text-right"
                      />
                    </td>
                    <td className="py-1.5 pl-2 text-right tabular-nums font-medium">
                      {fmtEUR(lineTotal)}
                    </td>
                    <td className="py-1.5 pl-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-7 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeLine(li.id)}
                        disabled={form.lineItems.length === 1}
                        tabIndex={-1}
                      >
                        <Trash2Icon className="size-3.5" />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <Button variant="outline" size="sm" onClick={addLine} className="gap-1.5">
          <PlusIcon className="size-3.5" />
          {t('addLine', uiLanguage)}
        </Button>
      </section>

      <Separator />

      {/* ---- Totals ---- */}
      <section className="flex justify-end">
        <div className="w-64 space-y-2">
          <div className="flex justify-between text-sm font-semibold">
            <span>{t('totalHT', uiLanguage)}</span>
            <span className="tabular-nums">{fmtEUR(totalHT)}</span>
          </div>
          <p className="text-xs text-muted-foreground italic">
            TVA non applicable, art. 293 B du CGI
          </p>
        </div>
      </section>

      <Separator />

      {/* ---- Payment ---- */}
      <section className="space-y-4">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {t('paymentTerms', uiLanguage)}
        </h3>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="paymentTerms">{t('paymentTerms', uiLanguage)}</Label>
            <Input
              id="paymentTerms"
              value={form.paymentTerms}
              onChange={(e) => update({ paymentTerms: e.target.value })}
              placeholder={uiLanguage === 'fr' ? 'Ex : 30 jours nets' : 'e.g. Net 30 days'}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="paymentMethods">{t('paymentMethods', uiLanguage)}</Label>
            <Input
              id="paymentMethods"
              value={form.paymentMethods}
              onChange={(e) => update({ paymentMethods: e.target.value })}
              placeholder={
                uiLanguage === 'fr'
                  ? 'Ex : Virement bancaire'
                  : 'e.g. Bank transfer'
              }
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="latePaymentPenaltyRate">{t('latePaymentPenalty', uiLanguage)}</Label>
            <Input
              id="latePaymentPenaltyRate"
              value={form.latePaymentPenaltyRate}
              onChange={(e) => update({ latePaymentPenaltyRate: e.target.value })}
              placeholder={uiLanguage === 'fr' ? 'Ex : 3x le taux légal' : 'e.g. 3x legal rate'}
            />
          </div>
          {form.isB2B && (
            <p className="text-xs text-muted-foreground">{t('flatRecoveryFee', uiLanguage)}</p>
          )}
        </div>
      </section>
    </div>
  );
}
