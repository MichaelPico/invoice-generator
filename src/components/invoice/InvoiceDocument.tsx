import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { format, parseISO } from 'date-fns';
import type { CompanySettings, InvoiceDraft, InvoiceLanguage } from '../../types';
import { ti } from '../../lib/i18n';

const C = {
  black: '#111111',
  muted: '#71717a',
  border: '#e4e4e7',
  bg: '#f9fafb',
  danger: '#ef4444',
} as const;

const missing = { color: C.danger } as const;
function p(value: string | undefined | null) {
  return value ? undefined : missing;
}

const s = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 9,
    color: C.black,
    paddingHorizontal: 48,
    paddingTop: 48,
    paddingBottom: 60,
    lineHeight: 1.5,
  },

  // Header
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 },
  title: { fontSize: 22, fontFamily: 'Helvetica-Bold', letterSpacing: 1.5 },
  infoBlock: { alignItems: 'flex-end' },
  invoiceNum: { fontSize: 10, fontFamily: 'Helvetica-Bold', marginBottom: 4 },
  infoLine: { fontSize: 8.5, marginBottom: 2 },
  infoMuted: { color: C.muted },

  // Parties
  parties: { flexDirection: 'row', marginBottom: 20 },
  party: { flex: 1 },
  partyRight: { flex: 1, paddingLeft: 24 },
  partyHeading: {
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    color: C.muted,
    marginBottom: 6,
  },
  partyPrimary: { fontFamily: 'Helvetica-Bold', marginBottom: 2 },
  partySecondary: { color: C.muted, fontSize: 8.5 },

  // Divider
  divider: { borderBottomWidth: 1, borderBottomColor: C.border, marginVertical: 16 },

  // Table
  tableHeaderRow: {
    flexDirection: 'row',
    paddingVertical: 6,
    paddingHorizontal: 6,
    backgroundColor: C.bg,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 5,
    paddingHorizontal: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: C.border,
  },
  colDesc: { flex: 1, paddingRight: 8 },
  colQty: { width: 32, textAlign: 'right', paddingHorizontal: 4 },
  colUnit: { width: 70, textAlign: 'right', paddingHorizontal: 4 },
  colTotal: { width: 70, textAlign: 'right', paddingLeft: 4 },
  thText: { fontSize: 7.5, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', color: C.muted },

  // Totals
  totalsOuter: { alignItems: 'flex-end', marginTop: 10 },
  totalsBlock: { width: 220 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 2 },
  totalLabel: { color: C.muted },
  totalValue: { fontFamily: 'Helvetica-Bold' },
  ttcRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
    marginTop: 3,
    borderTopWidth: 1,
    borderTopColor: C.border,
  },
  ttcLabel: { fontFamily: 'Helvetica-Bold', fontSize: 10 },
  ttcValue: { fontFamily: 'Helvetica-Bold', fontSize: 10 },
  vatMention: { fontSize: 7.5, color: C.muted, fontStyle: 'italic', marginTop: 6, textAlign: 'right' },

  // Seller fields
  sellerRow: { flexDirection: 'row', marginBottom: 2 },
  sellerLabel: { color: C.muted, width: 88, fontSize: 8.5 },
  sellerValue: { flex: 1, fontSize: 8.5 },

  // Payment
  paySection: { marginTop: 8 },
  sectionHeading: {
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    color: C.muted,
    marginBottom: 8,
  },
  payRow: { flexDirection: 'row', marginBottom: 3 },
  payLabel: { color: C.muted, width: 96, fontSize: 8.5 },
  payLabelWide: { color: C.muted, width: 220, fontSize: 8.5, paddingRight: 8 },
  payValue: { flex: 1, fontSize: 8.5 },
  legalNote: { fontSize: 7.5, color: C.muted, marginTop: 10, lineHeight: 1.6 },
});

function fmtDate(dateStr: string, _lang: InvoiceLanguage): string {
  if (!dateStr) return '';
  try {
    return format(parseISO(dateStr), 'dd-MM-yyyy');
  } catch {
    return dateStr;
  }
}

function fmtAmount(n: number): string {
  const abs = Math.abs(n).toFixed(2);
  const [int, dec] = abs.split('.');
  const intFmt = int.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return (n < 0 ? '- ' : '') + intFmt + ',' + dec + ' €';
}

function invoiceTitle(lang: InvoiceLanguage): string {
  if (lang === 'fr') return 'FACTURE';
  if (lang === 'en') return 'INVOICE';
  return 'FACTURE / INVOICE';
}

interface Props {
  draft: InvoiceDraft;
  company: CompanySettings | null;
}

export function InvoiceDocument({ draft, company }: Props) {
  const lang = draft.invoiceLanguage;
  const totalHT = draft.lineItems.reduce((sum, li) => sum + li.quantity * li.unitPriceHT, 0);

  return (
    <Document>
      <Page size="A4" style={s.page}>

        {/* Header */}
        <View style={s.header}>
          <Text style={s.title}>{invoiceTitle(lang)}</Text>
          <View style={s.infoBlock}>
            <Text style={s.invoiceNum}>
              <Text style={s.infoMuted}>{ti('invoiceNumberLabel', lang)} </Text>
              <Text style={p(draft.invoiceNumber)}>{draft.invoiceNumber || '<INVOICE_NUMBER>'}</Text>
            </Text>
            <Text style={s.infoLine}>
              <Text style={s.infoMuted}>{ti('invoiceDate', lang)} : </Text>
              {fmtDate(draft.invoiceDate, lang)}
            </Text>
            {draft.serviceDate ? (
              <Text style={s.infoLine}>
                <Text style={s.infoMuted}>{ti('serviceDate', lang)} : </Text>
                {fmtDate(draft.serviceDate, lang)}
              </Text>
            ) : null}
            {draft.dueDate ? (
              <Text style={s.infoLine}>
                <Text style={s.infoMuted}>{ti('dueDate', lang)} : </Text>
                {fmtDate(draft.dueDate, lang)}
              </Text>
            ) : null}
          </View>
        </View>

        {/* Parties */}
        <View style={s.parties}>
          <View style={s.party}>
            <Text style={s.partyHeading}>{ti('sellerInfo', lang)}</Text>
            <Text style={[s.partySecondary, { marginBottom: 6 }]}>{ti('entrepreneurLabel', lang)}</Text>
            <View style={s.sellerRow}>
              <Text style={s.sellerLabel}>{ti('lastName', lang)} :</Text>
              <Text style={[s.sellerValue, p(company?.lastName)]}>{company?.lastName || '<NOM>'}</Text>
            </View>
            <View style={s.sellerRow}>
              <Text style={s.sellerLabel}>{ti('firstName', lang)} :</Text>
              <Text style={[s.sellerValue, p(company?.firstName)]}>{company?.firstName || '<PRÉNOM>'}</Text>
            </View>
            <View style={s.sellerRow}>
              <Text style={s.sellerLabel}>Numéro de Siret :</Text>
              <Text style={[s.sellerValue, p(company?.siret)]}>{company?.siret || '<SIRET>'}</Text>
            </View>
            <View style={s.sellerRow}>
              <Text style={s.sellerLabel}>{ti('address', lang)} :</Text>
              <Text style={[s.sellerValue, p(company?.address)]}>{company?.address || '<ADRESSE>'}</Text>
            </View>
          </View>

          <View style={s.partyRight}>
            <Text style={s.partyHeading}>{ti('clientInfo', lang)}</Text>
            <Text style={[s.partyPrimary, p(draft.client.name)]}>{draft.client.name || '<CLIENT_NAME>'}</Text>
            <Text style={[s.partySecondary, p(draft.client.address)]}>{draft.client.address || '<ADDRESS>'}</Text>
            {draft.isB2B && draft.client.siren ? (
              <Text style={s.partySecondary}>SIREN : {draft.client.siren}</Text>
            ) : null}
            {draft.isB2B && draft.client.vatNumber ? (
              <Text style={s.partySecondary}>
                {ti('vatNumber', lang)} : {draft.client.vatNumber}
              </Text>
            ) : null}
          </View>
        </View>

        <View style={s.divider} />

        {/* Line items */}
        <View>
          <View style={s.tableHeaderRow}>
            <Text style={[s.colDesc, s.thText]}>{ti('description', lang)}</Text>
            <Text style={[s.colQty, s.thText]}>{ti('quantity', lang)}</Text>
            <Text style={[s.colUnit, s.thText]}>{ti('unitPrice', lang)}</Text>
            <Text style={[s.colTotal, s.thText]}>{ti('lineTotal', lang)}</Text>
          </View>
          {draft.lineItems.map((li) => (
            <View key={li.id} style={s.tableRow}>
              <Text style={[s.colDesc, p(li.description)]}>{li.description || '<DESCRIPTION>'}</Text>
              <Text style={s.colQty}>{li.quantity}</Text>
              <Text style={s.colUnit}>{fmtAmount(li.unitPriceHT)}</Text>
              <Text style={s.colTotal}>{fmtAmount(li.quantity * li.unitPriceHT)}</Text>
            </View>
          ))}
        </View>

        {/* Totals */}
        <View style={s.totalsOuter}>
          <View style={s.totalsBlock}>
            <View style={s.ttcRow}>
              <Text style={s.ttcLabel}>{ti('totalTTC', lang)}</Text>
              <Text style={s.ttcValue}>{fmtAmount(totalHT)}</Text>
            </View>
          </View>
          <Text style={s.vatMention}>TVA non applicable, art. 293 B du CGI</Text>
        </View>

        <View style={s.divider} />

        {/* Payment */}
        <View style={s.paySection}>
          <Text style={s.sectionHeading}>{ti('paymentTerms', lang)}</Text>

          <View style={s.payRow}>
            <Text style={lang === 'fr+en' ? s.payLabelWide : s.payLabel}>{ti('paymentTerms', lang)}</Text>
            <Text style={s.payValue}>{draft.paymentTerms || (lang === 'en' ? '30 days net' : lang === 'fr+en' ? '30 jours nets / 30 days net' : '30 jours nets')}</Text>
          </View>
          <View style={s.payRow}>
            <Text style={lang === 'fr+en' ? s.payLabelWide : s.payLabel}>{ti('paymentMethods', lang)}</Text>
            <Text style={s.payValue}>{draft.paymentMethods || (lang === 'en' ? 'Bank transfer' : lang === 'fr+en' ? 'Virement bancaire / Bank transfer' : 'Virement bancaire')}</Text>
          </View>
          <View style={s.payRow}>
            <Text style={s.payLabel}>IBAN</Text>
            <Text style={[s.payValue, p(company?.iban)]}>{company?.iban || '<IBAN>'}</Text>
          </View>
          {company?.bic ? (
            <View style={s.payRow}>
              <Text style={s.payLabel}>BIC/SWIFT</Text>
              <Text style={s.payValue}>{company.bic}</Text>
            </View>
          ) : null}
          <View style={s.payRow}>
            <Text style={lang === 'fr+en' ? s.payLabelWide : s.payLabel}>{ti('earlyPaymentDiscount', lang)}</Text>
            <Text style={s.payValue}>{draft.earlyPaymentDiscount || (lang === 'fr+en' ? 'néant / none' : 'néant')}</Text>
          </View>
          <View style={s.payRow}>
            <Text style={lang === 'fr+en' ? s.payLabelWide : s.payLabel}>{ti('latePaymentPenalty', lang)}</Text>
            <Text style={s.payValue}>{draft.latePaymentPenaltyRate || (lang === 'en' ? "12% per year (3× the French legal interest rate)" : lang === 'fr+en' ? "12% par an (3× le taux d'intérêt légal) / 12% per year (3× the French legal interest rate)" : "12% par an (3× le taux d'intérêt légal)")}</Text>
          </View>

          {draft.isB2B ? (
            <Text style={s.legalNote}>
              {lang === 'en'
                ? 'Flat recovery fee: EUR 40 in the event of late payment (art. D. 441-5 of the French Commercial Code).'
                : lang === 'fr+en'
                ? 'Indemnite forfaitaire de recouvrement : 40 EUR en cas de retard de paiement (art. D. 441-5 du Code de commerce). / Flat recovery fee: EUR 40 in the event of late payment (art. D. 441-5 of the French Commercial Code).'
                : 'Indemnite forfaitaire de recouvrement : 40 EUR en cas de retard de paiement (art. D. 441-5 du Code de commerce).'}
            </Text>
          ) : null}
        </View>

      </Page>
    </Document>
  );
}
