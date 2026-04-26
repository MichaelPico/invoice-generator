import { useState } from 'react';
import { ShieldCheckIcon, ReceiptIcon, LanguagesIcon, HardDriveIcon } from 'lucide-react';
import { t } from '../lib/i18n';
import type { LabelKey } from '../lib/i18n';
import type { UILanguage } from '../types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from './ui/dialog';
import { Button } from './ui/button';
import { ToggleGroup, ToggleGroupItem } from './ui/toggle-group';

interface WelcomeDialogProps {
  open: boolean;
  onClose: () => void;
  defaultLanguage: UILanguage;
}

const features: { icon: React.ElementType; titleKey: LabelKey; bodyKey: LabelKey }[] = [
  { icon: ShieldCheckIcon, titleKey: 'welcomeFeature1Title', bodyKey: 'welcomeFeature1Body' },
  { icon: ReceiptIcon,     titleKey: 'welcomeFeature2Title', bodyKey: 'welcomeFeature2Body' },
  { icon: LanguagesIcon,   titleKey: 'welcomeFeature3Title', bodyKey: 'welcomeFeature3Body' },
  { icon: HardDriveIcon,   titleKey: 'welcomeFeature4Title', bodyKey: 'welcomeFeature4Body' },
];

export function WelcomeDialog({ open, onClose, defaultLanguage }: WelcomeDialogProps) {
  const [lang, setLang] = useState<UILanguage>(defaultLanguage);

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl pr-8">{t('welcomeTitle', lang)}</DialogTitle>
          <DialogDescription>{t('welcomeSubtitle', lang)}</DialogDescription>
          <ToggleGroup
            type="single"
            variant="outline"
            value={lang}
            onValueChange={(v) => v && setLang(v as UILanguage)}
            className="h-8 w-fit"
          >
            <ToggleGroupItem value="fr" className="text-xs px-3 h-8">FR</ToggleGroupItem>
            <ToggleGroupItem value="en" className="text-xs px-3 h-8">EN</ToggleGroupItem>
          </ToggleGroup>
        </DialogHeader>

        <ul className="flex flex-col gap-4 py-2">
          {features.map(({ icon: Icon, titleKey, bodyKey }) => (
            <li key={titleKey} className="flex gap-3">
              <Icon className="size-5 shrink-0 mt-0.5 text-primary" aria-hidden="true" />
              <div>
                <p className="text-sm font-medium leading-snug">{t(titleKey, lang)}</p>
                <p className="text-sm text-muted-foreground leading-snug mt-0.5">{t(bodyKey, lang)}</p>
              </div>
            </li>
          ))}
        </ul>

        <DialogFooter>
          <Button onClick={onClose}>{t('welcomeClose', lang)}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
