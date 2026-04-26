import type { UILanguage, InvoiceLanguage } from '../types';

const labels = {
  // Toolbar
  settings: { fr: 'Paramètres', en: 'Settings' },
  clearForm: { fr: 'Effacer', en: 'Clear Form' },
  generatePDF: { fr: 'Générer PDF', en: 'Generate PDF' },

  // Settings panel headings
  companySettings: { fr: "Informations de l'entreprise", en: 'Company Information' },
  invoiceNumberingSettings: { fr: 'Numérotation des factures', en: 'Invoice Numbering' },
  invoiceAppearance: { fr: 'Apparence', en: 'Appearance' },

  // Company form
  firstName: { fr: 'Prénom', en: 'First name' },
  lastName: { fr: 'Nom', en: 'Last name' },
  address: { fr: 'Adresse', en: 'Address' },
  siret: { fr: 'SIRET', en: 'SIRET' },
  iban: { fr: 'IBAN', en: 'IBAN' },
  bic: { fr: 'BIC/SWIFT (optionnel)', en: 'BIC/SWIFT (optional)' },
  save: { fr: 'Sauvegarder', en: 'Save' },
  cancel: { fr: 'Annuler', en: 'Cancel' },

  // Numbering form
  numberFormat: { fr: 'Format du numéro', en: 'Number format' },
  customPrefix: { fr: 'Préfixe personnalisé', en: 'Custom prefix' },
  counter: { fr: 'Compteur actuel', en: 'Current counter' },
  nextNumber: { fr: 'Prochain numéro', en: 'Next invoice number' },

  // Invoice form - seller/client
  sellerInfo: { fr: 'Vendeur', en: 'Seller' },
  clientInfo: { fr: 'Client', en: 'Client' },
  clientName: { fr: 'Nom du client', en: 'Client name' },
  clientAddress: { fr: 'Adresse du client', en: 'Client address' },
  clientBusiness: { fr: 'Entreprise', en: 'Business' },
  clientIndividual: { fr: 'Particulier', en: 'Individual' },
  name: { fr: 'Nom', en: 'Name' },
  vatNumber: { fr: 'Numéro de TVA', en: 'VAT number' },
  siren: { fr: 'SIREN', en: 'SIREN' },
  notes: { fr: 'Notes', en: 'Notes' },
  b2b: { fr: 'B2B', en: 'B2B' },
  b2c: { fr: 'B2C', en: 'B2C' },
  manageClients: { fr: 'Gérer les clients', en: 'Manage clients' },
  newClient: { fr: 'Nouveau client', en: 'New client' },
  edit: { fr: 'Modifier', en: 'Edit' },
  delete: { fr: 'Supprimer', en: 'Delete' },

  // Invoice meta
  currency: { fr: 'Devise', en: 'Currency' },
  invoiceNumberLabel: { fr: 'FACTURE N°', en: 'INVOICE N°' },
  invoiceNumber: { fr: 'Numéro de facture', en: 'Invoice number' },
  invoiceLanguage: { fr: 'Langue de la facture', en: 'Invoice language' },
  invoiceDate: { fr: 'Date de facture', en: 'Invoice date' },
  serviceDate: { fr: 'Date de prestation', en: 'Service date' },
  dueDate: { fr: "Date d'échéance", en: 'Due date' },

  // Line items
  description: { fr: 'Description', en: 'Description' },
  quantity: { fr: 'Qté', en: 'Qty' },
  quantityLabel: { fr: 'Unité de quantité', en: 'Quantity unit' },
  unitPrice: { fr: 'Prix unitaire HT', en: 'Unit price (excl. VAT)' },
  lineTotal: { fr: 'Total HT', en: 'Total (excl. VAT)' },
  addLine: { fr: 'Ajouter une ligne', en: 'Add line' },

  // Totals
  totalHT: { fr: 'Total HT', en: 'Total excl. VAT' },
  totalTTC: { fr: 'Total TTC', en: 'Total incl. VAT' },

  // Payment
  paymentSection: { fr: 'Règlement', en: 'Payment details' },
  paymentTerms: { fr: 'Date de règlement', en: 'Payment due date' },
  paymentMethods: { fr: 'Mode de règlement', en: 'Payment method' },
  latePaymentPenalty: { fr: 'Taux de pénalités en cas de retard', en: 'Late payment penalty rate' },
  earlyPaymentDiscount: { fr: "Conditions d'escompte", en: 'Early payment discount' },
  flatRecoveryFee: {
    fr: 'Indemnité forfaitaire pour frais de recouvrement : 40 € (art. D. 441-5 du Code de commerce).',
    en: 'Flat-rate recovery fee for collection costs: EUR 40 (art. D. 441-5 of the French Commercial Code).',
  },

  // Entrepreneur label prefix
  entrepreneurLabel: { fr: 'Entrepreneur individuel', en: 'Individual entrepreneur' },

  // Logo
  companyLogo: { fr: "Logo de l'entreprise", en: 'Company logo' },
  uploadLogo: { fr: 'Télécharger un logo', en: 'Upload logo' },
  removeLogo: { fr: 'Supprimer', en: 'Remove' },
} as const;

export type LabelKey = keyof typeof labels;

/** Translate a UI label based on the app UI language (fr or en only). */
export function t(key: LabelKey, lang: UILanguage): string {
  const entry = labels[key];
  return lang === 'fr' ? entry.fr : entry.en;
}

/**
 * Translate an invoice label based on the invoice language.
 * In fr+en mode returns "French / English" for use in the PDF.
 */
export function ti(key: LabelKey, lang: InvoiceLanguage): string {
  const entry = labels[key];
  if (lang === 'fr+en') return `${entry.fr} / ${entry.en}`;
  return lang === 'fr' ? entry.fr : entry.en;
}
