import { useEffect, useState } from 'react';
import { PDFViewer } from '@react-pdf/renderer';
import type { CompanySettings, InvoiceDraft } from '../../types';
import type { ResolvedColors } from '../../lib/colorPresets';
import { InvoiceDocument } from './InvoiceDocument';

interface Props {
  draft: InvoiceDraft;
  company: CompanySettings | null;
  logo?: string | null;
  colors?: ResolvedColors;
}

export function PDFPreviewPane({ draft, company, logo, colors }: Props) {
  const [stable, setStable] = useState({ draft, company, logo, colors });

  useEffect(() => {
    const id = setTimeout(() => setStable({ draft, company, logo, colors }), 400);
    return () => clearTimeout(id);
  }, [draft, company, logo, colors]);

  return (
    <PDFViewer width="100%" height="100%" showToolbar={false} className="block">
      <InvoiceDocument
        draft={stable.draft}
        company={stable.company}
        logo={stable.logo}
        colors={stable.colors}
      />
    </PDFViewer>
  );
}
