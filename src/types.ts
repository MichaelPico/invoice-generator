export type Theme = 'light' | 'dark';
export type UILanguage = 'fr' | 'en';
export type InvoiceLanguage = 'fr' | 'en' | 'fr+en';
export type NumberFormat = 'YYYY-SEQ' | 'YYYY-MM-SEQ' | 'CUSTOM-YYYY-SEQ';

export interface CompanySettings {
  name: string;
  address: string;
  siret: string;
  iban: string;
}

export interface InvoiceNumberingConfig {
  format: NumberFormat;
  customPrefix: string;
  counter: number;
}

export interface Client {
  id?: number;
  name: string;
  address: string;
  vatNumber?: string;
  siren?: string;
  notes?: string;
}

export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPriceHT: number;
}

export interface InvoiceDraft {
  invoiceNumber: string;
  invoiceLanguage: InvoiceLanguage;
  invoiceDate: string;
  serviceDate: string;
  dueDate: string;
  isB2B: boolean;
  client: {
    name: string;
    address: string;
    vatNumber?: string;
    siren?: string;
  };
  lineItems: LineItem[];
  paymentTerms: string;
  paymentMethods: string;
  latePaymentPenaltyRate: string;
  earlyPaymentDiscount: string;
}
