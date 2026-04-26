import { type ReactNode } from 'react';
import { useApp } from '../../context/AppContext';
import { t } from '../../lib/i18n';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../ui/sheet';
import { Separator } from '../ui/separator';
import { CompanyConstantsForm } from './CompanyConstantsForm';
import { InvoiceNumberingForm } from './InvoiceNumberingForm';
import { InvoiceColorsForm } from './InvoiceColorsForm';
import { DataManagementForm } from './DataManagementForm';

interface SettingsPanelProps {
  trigger: ReactNode;
}

export function SettingsPanel({ trigger }: SettingsPanelProps) {
  const { uiLanguage } = useApp();

  return (
    <Sheet>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent
        side="right"
        className="sm:max-w-[480px] overflow-y-auto flex flex-col gap-0 p-0"
      >
        <SheetHeader className="px-6 pt-6 pb-4">
          <SheetTitle>{t('settings', uiLanguage)}</SheetTitle>
        </SheetHeader>

        <div className="flex flex-col gap-6 px-6 pb-6">
          <section className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold text-foreground">
              {t('companySettings', uiLanguage)}
            </h3>
            <CompanyConstantsForm />
          </section>

          <Separator />

          <section className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold text-foreground">
              {t('invoiceNumberingSettings', uiLanguage)}
            </h3>
            <InvoiceNumberingForm />
          </section>

          <Separator />

          <section className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold text-foreground">
              {t('invoiceAppearance', uiLanguage)}
            </h3>
            <InvoiceColorsForm />
          </section>

          <Separator />

          <section className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold text-foreground">
              {t('dataManagement', uiLanguage)}
            </h3>
            <DataManagementForm />
          </section>
        </div>
      </SheetContent>
    </Sheet>
  );
}
