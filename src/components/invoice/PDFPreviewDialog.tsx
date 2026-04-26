import { useEffect, useRef, useState } from 'react';
import { pdf } from '@react-pdf/renderer';
import { DownloadIcon, XIcon } from 'lucide-react';
import type { CompanySettings, InvoiceDraft } from '../../types';
import { Button } from '../ui/button';
import { Dialog, DialogContent } from '../ui/dialog';
import { InvoiceDocument } from './InvoiceDocument';

interface Props {
  draft: InvoiceDraft;
  company: CompanySettings | null;
  logo?: string | null;
  open: boolean;
  onClose: () => void;
  onDownloaded: () => void;
}

export function PDFPreviewDialog({ draft, company, logo, open, onClose, onDownloaded }: Props) {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  // Capture props at open time so the PDF doesn't regenerate if form changes behind the dialog
  const capturedDraft = useRef(draft);
  const capturedCompany = useRef(company);
  const capturedLogo = useRef(logo);

  useEffect(() => {
    if (!open) return;
    capturedDraft.current = draft;
    capturedCompany.current = company;
    capturedLogo.current = logo;

    let url: string | null = null;
    let cancelled = false;
    setGenerating(true);
    setPdfUrl(null);

    pdf(<InvoiceDocument draft={capturedDraft.current} company={capturedCompany.current} logo={capturedLogo.current} />)
      .toBlob()
      .then((blob) => {
        if (cancelled) return;
        url = URL.createObjectURL(blob);
        setPdfUrl(url);
        setGenerating(false);
      })
      .catch(() => {
        if (!cancelled) setGenerating(false);
      });

    return () => {
      cancelled = true;
      if (url) URL.revokeObjectURL(url);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function handleDownload() {
    if (!pdfUrl) return;
    const a = document.createElement('a');
    a.href = pdfUrl;
    a.download = `Facture-${capturedDraft.current.invoiceNumber}.pdf`;
    a.click();
    onDownloaded();
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent showCloseButton={false} className="flex flex-col w-[90vw] max-w-5xl h-[92vh] p-0 gap-0 sm:max-w-5xl">
        {/* Dialog toolbar */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-border shrink-0">
          <span className="text-sm font-medium">
            {generating ? 'Génération...' : capturedDraft.current.invoiceNumber}
          </span>
          <div className="flex items-center gap-2">
            <Button size="sm" className="gap-1.5" disabled={!pdfUrl} onClick={handleDownload}>
              <DownloadIcon className="size-3.5" />
              Télécharger
            </Button>
            <Button variant="ghost" size="icon" className="size-8" onClick={onClose}>
              <XIcon className="size-4" />
            </Button>
          </div>
        </div>

        {/* Preview area */}
        <div className="flex-1 bg-muted/30 overflow-hidden">
          {generating && (
            <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
              Génération en cours...
            </div>
          )}
          {pdfUrl && (
            <iframe
              src={pdfUrl}
              className="w-full h-full border-0"
              title="Aperçu de la facture"
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
