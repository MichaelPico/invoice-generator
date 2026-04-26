import { useState } from 'react';
import { UsersIcon, PlusIcon, PencilIcon, Trash2Icon, ArrowLeftIcon } from 'lucide-react';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { FieldHint, OptionalBadge } from '../ui/field-hint';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Separator } from '../ui/separator';
import { ToggleGroup, ToggleGroupItem } from '../ui/toggle-group';
import { useApp } from '../../context/AppContext';
import { t } from '../../lib/i18n';
import type { Client } from '../../types';

type FormState = Omit<Client, 'id'> & { id?: number };

const emptyForm = (): FormState => ({
  name: '',
  address: '',
  isB2B: false,
  vatNumber: '',
  siren: '',
  notes: '',
});

export function ClientManagerDialog() {
  const { clients, uiLanguage, addClientEntry, updateClientEntry, removeClientEntry } = useApp();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<FormState | null>(null);

  function startNew() {
    setEditing(emptyForm());
  }

  function startEdit(c: Client) {
    setEditing({ id: c.id, name: c.name, address: c.address, isB2B: c.isB2B ?? false, vatNumber: c.vatNumber ?? '', siren: c.siren ?? '', notes: c.notes ?? '' });
  }

  function cancelEdit() {
    setEditing(null);
  }

  async function save() {
    if (!editing) return;
    const { id, ...data } = editing;
    const payload = {
      name: data.name.trim(),
      address: data.address.trim(),
      isB2B: data.isB2B ?? false,
      vatNumber: data.vatNumber?.trim() || undefined,
      siren: data.siren?.trim() || undefined,
      notes: data.notes?.trim() || undefined,
    };
    if (!payload.name) return;
    if (id != null) {
      await updateClientEntry({ ...payload, id });
    } else {
      await addClientEntry(payload);
    }
    setEditing(null);
  }

  async function remove(id: number) {
    await removeClientEntry(id);
  }

  function patch(field: keyof FormState, value: string | boolean) {
    setEditing((prev) => prev ? { ...prev, [field]: value } : prev);
  }

  const isNew = editing != null && editing.id == null;

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setEditing(null); }}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-1.5 h-7 text-xs px-2">
          <UsersIcon className="size-3.5" />
          {t('manageClients', uiLanguage)}
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {editing != null
              ? (isNew ? t('newClient', uiLanguage) : t('edit', uiLanguage))
              : t('manageClients', uiLanguage)}
          </DialogTitle>
        </DialogHeader>

        {editing != null ? (
          <div className="space-y-4 pt-1">
            <div className="space-y-1.5">
              <Label htmlFor="cm-name">{t('clientName', uiLanguage)}</Label>
              <Input id="cm-name" value={editing.name} onChange={(e) => patch('name', e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cm-address">{t('clientAddress', uiLanguage)}</Label>
              <Textarea id="cm-address" rows={2} className="resize-none" value={editing.address} onChange={(e) => patch('address', e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>
                {uiLanguage === 'fr' ? 'Type de client' : 'Client type'}{' '}
                <FieldHint text={uiLanguage === 'fr'
                  ? 'B2B : entreprise (affiche les champs TVA et SIREN). B2C : particulier.'
                  : 'B2B: business client (shows VAT and SIREN fields). B2C: individual.'} />
              </Label>
              <ToggleGroup
                type="single"
                variant="outline"
                value={editing.isB2B ? 'b2b' : 'b2c'}
                onValueChange={(v) => v && patch('isB2B', v === 'b2b')}
                className="h-8 justify-start"
              >
                <ToggleGroupItem value="b2b" className="text-xs px-2.5 h-8">{t('b2b', uiLanguage)}</ToggleGroupItem>
                <ToggleGroupItem value="b2c" className="text-xs px-2.5 h-8">{t('b2c', uiLanguage)}</ToggleGroupItem>
              </ToggleGroup>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="cm-vat">
                  {t('vatNumber', uiLanguage)}<OptionalBadge label={uiLanguage === 'fr' ? 'optionnel' : 'optional'} />{' '}
                  <FieldHint text={uiLanguage === 'fr'
                    ? 'Numéro de TVA intracommunautaire (ex. FR12345678901). Obligatoire pour les factures B2B transfrontalières en UE.'
                    : 'EU VAT identification number (e.g. FR12345678901). Required for cross-border EU B2B invoices.'} />
                </Label>
                <Input id="cm-vat" value={editing.vatNumber ?? ''} onChange={(e) => patch('vatNumber', e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="cm-siren">
                  {t('siren', uiLanguage)}<OptionalBadge label={uiLanguage === 'fr' ? 'optionnel' : 'optional'} />{' '}
                  <FieldHint text={uiLanguage === 'fr'
                    ? 'Numéro d\'identification de l\'entreprise — les 9 premiers chiffres du SIRET.'
                    : 'French business register number — the first 9 digits of the SIRET.'} />
                </Label>
                <Input id="cm-siren" value={editing.siren ?? ''} onChange={(e) => patch('siren', e.target.value)} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cm-notes">
                {t('notes', uiLanguage)}<OptionalBadge label={uiLanguage === 'fr' ? 'optionnel' : 'optional'} />{' '}
                <FieldHint text={uiLanguage === 'fr'
                  ? 'Notes internes sur ce client. Non affichées sur la facture.'
                  : 'Internal notes about this client. Not shown on the invoice.'} />
              </Label>
              <Textarea id="cm-notes" rows={2} className="resize-none" value={editing.notes ?? ''} onChange={(e) => patch('notes', e.target.value)} />
            </div>

            <div className="flex gap-2 pt-1">
              <Button variant="outline" size="sm" onClick={cancelEdit} className="gap-1.5">
                <ArrowLeftIcon className="size-3.5" />
                {t('cancel', uiLanguage)}
              </Button>
              <Button size="sm" onClick={save} disabled={!editing.name.trim()} className="ml-auto">
                {t('save', uiLanguage)}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-3 pt-1">
            {clients.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">
                {uiLanguage === 'fr' ? 'Aucun client enregistré.' : 'No saved clients.'}
              </p>
            ) : (
              <ul className="space-y-1">
                {clients.map((c, i) => (
                  <li key={c.id}>
                    {i > 0 && <Separator className="mb-1" />}
                    <div className="flex items-center gap-2 py-1">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{c.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{c.address}</p>
                      </div>
                      <Button variant="ghost" size="icon" className="size-7 shrink-0" onClick={() => startEdit(c)}>
                        <PencilIcon className="size-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="size-7 shrink-0 text-destructive hover:text-destructive" onClick={() => remove(c.id!)}>
                        <Trash2Icon className="size-3.5" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <Button variant="outline" size="sm" onClick={startNew} className="gap-1.5 w-full">
              <PlusIcon className="size-3.5" />
              {t('newClient', uiLanguage)}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
