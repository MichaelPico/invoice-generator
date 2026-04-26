import type { InvoiceNumberingConfig } from '../types';

export function formatInvoiceNumber(
  config: InvoiceNumberingConfig,
  invoiceDate?: string,
): string {
  const seq = String(config.counter + 1).padStart(3, '0');
  const date = invoiceDate ? new Date(invoiceDate) : new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');

  switch (config.format) {
    case 'YYYY-SEQ':
      return `${year}-${seq}`;
    case 'YYYY-MM-SEQ':
      return `${year}-${month}-${seq}`;
    case 'CUSTOM-YYYY-SEQ':
      return config.customPrefix
        ? `${config.customPrefix}-${year}-${seq}`
        : `${year}-${seq}`;
  }
}
