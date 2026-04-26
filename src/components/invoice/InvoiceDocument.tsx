import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { format, parseISO } from 'date-fns';
import type { CompanySettings, InvoiceDraft, InvoiceLanguage } from '../../types';
import type { ResolvedColors } from '../../lib/colorPresets';
import { PRESET_COLORS } from '../../lib/colorPresets';
import { ti } from '../../lib/i18n';
import { formatAmount } from '../../lib/currencies';

const DANGER = '#ef4444';

function makeStyles(C: ResolvedColors & { danger: string }) {
  return StyleSheet.create({
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
    logo: { maxHeight: 40, maxWidth: 120, marginBottom: 8, objectFit: 'contain', alignSelf: 'flex-start' },
    title: { fontSize: 22, fontFamily: 'Helvetica-Bold', letterSpacing: 1.5 },
    infoBlock: { alignItems: 'flex-end' },
    invoiceNum: {
      fontSize: 10,
      fontFamily: 'Helvetica-Bold',
      marginBottom: 8,
      borderWidth: 1,
      borderColor: C.muted,
      paddingHorizontal: 8,
      paddingVertical: 5,
    },
    infoLine: { fontSize: 8.5, marginBottom: 2 },
    infoMuted: { fontFamily: 'Helvetica-Bold' },

    // Parties
    parties: { flexDirection: 'row', marginBottom: 20 },
    party: { flex: 1 },
    partyRight: { flex: 1, paddingLeft: 24 },
    partyHeading: {
      fontSize: 9,
      fontFamily: 'Helvetica-Bold',
      textTransform: 'uppercase',
      letterSpacing: 0.8,
      color: C.muted,
      marginBottom: 6,
    },
    partyPrimary: { fontFamily: 'Helvetica-Bold', marginBottom: 2 },
    partySecondary: { fontSize: 8.5, fontFamily: 'Helvetica-Bold' },

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
    colQty: { width: 52, textAlign: 'right', paddingHorizontal: 4, borderLeftWidth: 0.5, borderLeftColor: C.border },
    colUnit: { width: 70, textAlign: 'right', paddingHorizontal: 4, borderLeftWidth: 0.5, borderLeftColor: C.border },
    colTotal: { width: 70, textAlign: 'right', paddingLeft: 4, borderLeftWidth: 0.5, borderLeftColor: C.border },
    thText: { fontSize: 7.5, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', color: C.muted },

    // Totals
    totalsOuter: { alignItems: 'flex-end', marginTop: 10 },
    totalsBlock: { width: 220 },
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
    vatMention: { fontSize: 7.5, fontStyle: 'italic', marginTop: 6, textAlign: 'right' },

    // Seller fields
    sellerRow: { flexDirection: 'row', marginBottom: 2 },
    sellerLabel: { width: 88, fontSize: 8.5, fontFamily: 'Helvetica-Bold' },
    clientLabel: { width: 130, fontSize: 8.5, fontFamily: 'Helvetica-Bold' },
    sellerValue: { flex: 1, fontSize: 8.5 },

    // Payment
    paySection: { marginTop: 8 },
    sectionHeading: {
      fontSize: 9,
      fontFamily: 'Helvetica-Bold',
      textTransform: 'uppercase',
      letterSpacing: 0.8,
      color: C.muted,
      marginBottom: 8,
    },
    payRow: { flexDirection: 'row', marginBottom: 3 },
    payLabel: { width: 96, fontSize: 8.5, fontFamily: 'Helvetica-Bold' },
    payLabelWide: { width: 220, fontSize: 8.5, paddingRight: 8, fontFamily: 'Helvetica-Bold' },
    payValue: { flex: 1, fontSize: 8.5 },
    legalNote: { fontSize: 7.5, marginTop: 10, lineHeight: 1.6 },
  });
}

function fmtDate(dateStr: string, _lang: InvoiceLanguage): string {
  if (!dateStr) return '';
  try {
    return format(parseISO(dateStr), 'dd-MM-yyyy');
  } catch {
    return dateStr;
  }
}


function invoiceTitle(lang: InvoiceLanguage): string {
  if (lang === 'fr') return 'FACTURE';
  if (lang === 'en') return 'INVOICE';
  return 'FACTURE / INVOICE';
}

interface Props {
  draft: InvoiceDraft;
  company: CompanySettings | null;
  logo?: string | null;
  colors?: ResolvedColors;
}

export function InvoiceDocument({ draft, company, logo, colors = PRESET_COLORS.classic }: Props) {
  const lang = draft.invoiceLanguage;
  const totalHT = draft.lineItems.reduce((sum, li) => sum + li.quantity * li.unitPriceHT, 0);

  const C = { ...colors, danger: DANGER };
  const s = makeStyles(C);
  const missing = { color: C.danger } as const;
  function p(value: string | undefined | null) {
    return value ? {} : missing;
  }

  return (
    <Document>
      <Page size="A4" style={s.page}>

        {/* Header */}
        <View style={s.header}>
          <View>
            {logo ? <Image src={logo} style={s.logo} /> : null}
            <Text style={s.title}>{invoiceTitle(lang)}</Text>
          </View>
          <View style={s.infoBlock}>
            <Text style={s.invoiceNum}>
              <Text style={s.infoMuted}>{ti('invoiceNumberLabel', lang)} : </Text>
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
              <Text style={s.sellerLabel}>{ti('siret', lang)} :</Text>
              <Text style={[s.sellerValue, p(company?.siret)]}>{company?.siret || '<SIRET>'}</Text>
            </View>
            <View style={s.sellerRow}>
              <Text style={s.sellerLabel}>{ti('address', lang)} :</Text>
              <Text style={[s.sellerValue, p(company?.address)]}>{company?.address || '<ADRESSE>'}</Text>
            </View>
          </View>

          <View style={s.partyRight}>
            <Text style={s.partyHeading}>{ti('clientInfo', lang)}</Text>
            <Text style={[s.partySecondary, { marginBottom: 6 }]}>{ti(draft.isB2B ? 'clientBusiness' : 'clientIndividual', lang)}</Text>
            <View style={s.sellerRow}>
              <Text style={s.clientLabel}>{ti('name', lang)} :</Text>
              <Text style={[s.sellerValue, p(draft.client.name)]}>{draft.client.name || '<NOM>'}</Text>
            </View>
            <View style={s.sellerRow}>
              <Text style={s.clientLabel}>{ti('address', lang)} :</Text>
              <Text style={[s.sellerValue, p(draft.client.address)]}>{draft.client.address || '<ADRESSE>'}</Text>
            </View>
            {draft.isB2B && draft.client.siren ? (
              <View style={s.sellerRow}>
                <Text style={s.clientLabel}>SIREN :</Text>
                <Text style={s.sellerValue}>{draft.client.siren}</Text>
              </View>
            ) : null}
            {draft.isB2B && draft.client.vatNumber ? (
              <View style={s.sellerRow}>
                <Text style={s.clientLabel}>{ti('vatNumber', lang)} :</Text>
                <Text style={s.sellerValue}>{draft.client.vatNumber}</Text>
              </View>
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
              <Text style={s.colQty}>{draft.quantityLabel ? `${li.quantity} ${draft.quantityLabel}` : li.quantity}</Text>
              <Text style={s.colUnit}>{formatAmount(li.unitPriceHT, draft.currency)}</Text>
              <Text style={s.colTotal}>{formatAmount(li.quantity * li.unitPriceHT, draft.currency)}</Text>
            </View>
          ))}
        </View>

        {/* Totals */}
        <View style={s.totalsOuter}>
          <View style={s.totalsBlock}>
            <View style={s.ttcRow}>
              <Text style={s.ttcLabel}>{ti('totalTTC', lang)}</Text>
              <Text style={s.ttcValue}>{formatAmount(totalHT, draft.currency)}</Text>
            </View>
          </View>
          <Text style={s.vatMention}>
            {lang === 'en'
              ? 'Not subject to VAT (Art. 293 B of the French Tax Code)'
              : lang === 'fr+en'
              ? 'TVA non applicable, art. 293 B du CGI / Not subject to VAT (Art. 293 B of the French Tax Code)'
              : 'TVA non applicable, art. 293 B du CGI'}
          </Text>
        </View>

        <View style={s.divider} />

        {/* Payment */}
        <View style={s.paySection}>
          <Text style={s.sectionHeading}>{ti('paymentSection', lang)}</Text>

          <View style={s.payRow}>
            <Text style={lang === 'fr+en' ? s.payLabelWide : s.payLabel}>{ti('paymentTerms', lang)} :</Text>
            <Text style={s.payValue}>{draft.paymentTerms || (lang === 'en' ? '30 days net' : lang === 'fr+en' ? '30 jours nets / 30 days net' : '30 jours nets')}</Text>
          </View>
          <View style={s.payRow}>
            <Text style={lang === 'fr+en' ? s.payLabelWide : s.payLabel}>{ti('paymentMethods', lang)} :</Text>
            <Text style={s.payValue}>{draft.paymentMethods || (lang === 'en' ? 'Bank transfer' : lang === 'fr+en' ? 'Virement bancaire / Bank transfer' : 'Virement bancaire')}</Text>
          </View>
          <View style={s.payRow}>
            <Text style={s.payLabel}>IBAN :</Text>
            <Text style={[s.payValue, p(company?.iban)]}>{company?.iban || '<IBAN>'}</Text>
          </View>
          {company?.bic ? (
            <View style={s.payRow}>
              <Text style={s.payLabel}>BIC/SWIFT :</Text>
              <Text style={s.payValue}>{company.bic}</Text>
            </View>
          ) : null}
          <View style={s.payRow}>
            <Text style={lang === 'fr+en' ? s.payLabelWide : s.payLabel}>{ti('earlyPaymentDiscount', lang)} :</Text>
            <Text style={s.payValue}>{draft.earlyPaymentDiscount || (lang === 'fr' ? 'néant' : lang === 'fr+en' ? 'néant / none' : 'none')}</Text>
          </View>
          <View style={s.payRow}>
            <Text style={lang === 'fr+en' ? s.payLabelWide : s.payLabel}>{ti('latePaymentPenalty', lang)} :</Text>
            <Text style={s.payValue}>{draft.latePaymentPenaltyRate || (lang === 'en' ? "12% per year (3× the French legal interest rate)" : lang === 'fr+en' ? "12% par an (3× le taux d'intérêt légal) / 12% per year (3× the French legal interest rate)" : "12% par an (3× le taux d'intérêt légal)")}</Text>
          </View>

          {draft.isB2B ? (
            <Text style={s.legalNote}>{ti('flatRecoveryFee', lang)}</Text>
          ) : null}
        </View>

      </Page>
    </Document>
  );
}
