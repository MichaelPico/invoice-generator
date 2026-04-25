# Invoice Design

## Source

https://entreprendre.service-public.gouv.fr/vosdroits/F31808

---

## Mandatory Fields (Mentions Obligatoires)

Every invoice must include all of the following:

### Dates and Number

- **Invoice date** -- the date the invoice is issued
- **Invoice number** -- unique, sequential; must follow an unbroken sequence
- **Sale/service date** -- the date the goods were delivered or the service was completed (may differ from invoice date)

### Seller Identity

- Full name preceded by **"Entrepreneur individuel"** (for individual sole traders)
- **SIREN number** (or SIRET for the establishment)
- Registered address
- Legal form and share capital (for companies; not applicable for micro-enterprise / EI)

### Buyer Identity

- Company name, or individual's full name + address
- Buyer's VAT identification number if they are a VAT-liable business (optional if invoice total excl. tax is <= EUR 150)

### Product / Service Description

- Nature of goods or services rendered
- Brand, references, quantities as applicable
- **Unit price excl. tax (HT)**
- Applicable VAT rate per line (or exemption mention -- see below)

### Totals

- **Total amount excl. tax (HT)**
- **Total amount due (TTC)** -- for a VAT-exempt seller this equals HT

### Payment Information

- **Payment terms** (due date or number of days)
- **Late payment penalty rate** -- must be stated; cannot be lower than 3x the legal interest rate
- **Flat recovery fee of EUR 40** -- mandatory on B2B invoices (recoverable from business customers in case of late payment)

---

## VAT Exemption Mention (Franchise en Base)

This project operates under franchise en base de TVA (art. 293 B CGI). The following mention is **legally required** and must always appear **in French**, regardless of the invoice language mode:

> **TVA non applicable, art. 293 B du CGI**

No VAT line, no VAT amount, no VAT identification number is shown.

---

## Optional / Conditional Fields

| Field | When required |
|---|---|
| Seller's VAT number | Mandatory unless invoice total (excl. tax) <= EUR 150 |
| Buyer's VAT number | Mandatory if buyer is a VAT-liable business |
| Professional insurance details | Mandatory for artisans (insurer name, guarantor, geographic coverage) |
| Legal conformity guarantee mention (>= 2 years) | Mandatory for B2C sales of appliances, electronics, sporting goods, furniture |
| Eco-participation / private copying fees | Mandatory for electronics and furniture sales |

---

## Upcoming Regulatory Changes (2026-2027)

Progressive mandatory e-invoicing rollout will add four new required fields:

1. **Client SIREN number**
2. **Delivery address** (if different from billing address)
3. **Operation nature** -- goods, services, or mixed
4. **Debit-based payment election** mention (if applicable)

These are not yet required but should be planned for in the field model.

---

## Project-Specific Rules

- **Currency:** EUR only
- **Language modes:** French only, English only, or bilingual (FR + EN side by side)
- Legal mentions (TVA line, penalty clause) always appear in French regardless of selected mode
- Invoice number formats supported:
  - `2026-001` (year + sequence)
  - `FA-2026-001` (prefix + year + sequence)
  - `2026-05-001` (year + month + sequence)
  - `MP-2026-001` (custom prefix + year + sequence)
- Invoice number counter and format choice are persisted in IndexedDB
- Company constants (name, address, SIRET, IBAN, etc.) are persisted in IndexedDB
- Client list (name, address, billing details) is persisted in IndexedDB for quick reuse
- Invoice data is ephemeral; primary output is **PDF export**
