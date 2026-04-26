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
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Separator } from '../ui/separator';
import { useApp } from '../../context/AppContext';
import { t } from '../../lib/i18n';
import type { Client } from '../../types';

type FormState = Omit<Client, 'id'> & { id?: number };

const emptyForm = (): FormState => ({
  name: '',
  address: '',
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
    setEditing({ id: c.id, name: c.name, address: c.address, vatNumber: c.vatNumber ?? '', siren: c.siren ?? '', notes: c.notes ?? '' });
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

  function patch(field: keyof FormState, value: string) {
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
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="cm-vat">{t('vatNumber', uiLanguage)}</Label>
                <Input id="cm-vat" value={editing.vatNumber ?? ''} onChange={(e) => patch('vatNumber', e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="cm-siren">{t('siren', uiLanguage)}</Label>
                <Input id="cm-siren" value={editing.siren ?? ''} onChange={(e) => patch('siren', e.target.value)} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cm-notes">{t('notes', uiLanguage)}</Label>
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
