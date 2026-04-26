import { useState } from 'react';
import { ChevronsUpDownIcon } from 'lucide-react';
import { Button } from '../ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '../ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import type { Client, UILanguage } from '../../types';

interface Props {
  clients: Client[];
  uiLanguage: UILanguage;
  onSelect: (client: Client) => void;
  initialClientId?: number | null;
}

export function ClientCombobox({ clients, uiLanguage, onSelect, initialClientId }: Props) {
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(initialClientId ?? null);

  const selectedName = selectedId != null
    ? (clients.find((c) => c.id === selectedId)?.name ?? null)
    : null;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between font-normal text-sm"
        >
          <span className="truncate">
            {selectedName ?? (uiLanguage === 'fr' ? 'Sélectionner un client…' : 'Select a client…')}
          </span>
          <ChevronsUpDownIcon className="ml-2 size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start">
        <Command>
          <CommandInput placeholder={uiLanguage === 'fr' ? 'Rechercher…' : 'Search…'} />
          <CommandList>
            <CommandEmpty>
              {uiLanguage === 'fr' ? 'Aucun client trouvé.' : 'No client found.'}
            </CommandEmpty>
            <CommandGroup>
              {clients.map((c) => (
                <CommandItem
                  key={c.id}
                  value={c.name}
                  data-checked={selectedId === c.id}
                  onSelect={() => {
                    setSelectedId(c.id ?? null);
                    onSelect(c);
                    setOpen(false);
                  }}
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{c.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{c.address}</p>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
