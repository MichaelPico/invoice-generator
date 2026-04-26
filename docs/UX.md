# UX

## App Structure

Single-page app, no routing. Three conceptual zones:

1. **Invoice Form** - the main workspace (always visible)
2. **Settings Panel** - drawer/modal for company constants and invoice numbering config
3. **Client Manager** - drawer/modal for the saved client list

The app never navigates away. Settings and client management open as overlays over the form.

---

## Views

### Invoice Form (main view)

The form is the primary surface. It is always present and fills the viewport. Sections top to bottom:

```
[ Toolbar ]                  language toggle | theme toggle | Settings | Clear Form | Generate PDF

[ Header ]
  Seller block               auto-filled from IndexedDB (company constants)
  Client block               B2B/B2C toggle | dropdown to pick a saved client, or type a new one

[ Invoice Meta ]
  Invoice number             auto-incremented, format shown, editable override
  Invoice date               date picker, defaults to today
  Service date               date picker, separate from invoice date
  Due date                   date picker

[ Line Items ]
  Table with rows:           Description | Qty | Unit Price (HT) | Total (HT)
  + Add line button
  x Remove per row

[ Totals ]
  Total HT                   computed
  TVA mention                "TVA non applicable, art. 293 B du CGI" (always FR)
  Total TTC = Total HT

[ Payment Block ]
  Payment terms              text (e.g. "30 days net", "Due on receipt")
  Accepted methods           text (e.g. "Bank transfer – IBAN: ...")
  Late payment penalty rate  text (legally required)
  Flat recovery fee          EUR 40 mention -- shown only when B2B is selected

[ Generate PDF button ]      prominent, bottom of form
```

---

### Settings Panel (overlay)

Opened from toolbar. Two sub-sections:

**Company Constants**
- Entrepreneur name (shown as "Entrepreneur individuel [name]" on invoice)
- Address
- SIRET / SIREN
- IBAN
- (future: professional insurance details)

**Invoice Numbering**
- Format selector: `YYYY-SEQ` | `YYYY-MM-SEQ` | `CUSTOM-YYYY-SEQ`
- Custom prefix input (shown/hidden based on format choice)
- Current counter value (editable for manual adjustment)
- Preview of next invoice number

Changes persist to IndexedDB on save.

---

### Client Manager (overlay)

Opened by a "Manage clients" link in the client dropdown. Shows a list of saved clients. Actions per row: edit, delete. A "New client" button opens an inline form:

- Client name
- Address
- VAT number (optional)
- SIREN (optional, for future e-invoicing compliance)
- Notes (free text)

---

## Key UX Decisions

**No live PDF preview.** The form IS the preview. The user fills fields and clicks Generate. A spinner/loading state covers the delay while @react-pdf/renderer builds the file.

**Client selection UX.** The client field is a combobox: typing filters saved clients; if no match, the entered text is used as a one-off client name with an option to save it. This avoids a mandatory "add client first" flow.

**Invoice number is auto but overridable.** The field shows the computed next number but is editable. Editing it does not auto-advance the counter; that only happens on successful PDF download.

**Counter advances on download, not on click.** If the PDF generation fails or the user cancels, the counter does not move. The same invoice number is reused on the next attempt.

**Form persists across sessions.** The current invoice form state is saved to IndexedDB on every change (debounced 300-500ms to avoid excessive write volume during fast typing). Closing and reopening the browser restores the last in-progress invoice. A "Clear Form" button in the toolbar resets all fields and starts fresh with the next auto-incremented number.

**B2B / B2C toggle on the client block.** Defaults to B2B. When B2C is selected, the EUR 40 flat recovery fee mention and the buyer VAT number field are hidden. The toggle is part of the invoice state and persists with the form.

**Unfilled required fields render as placeholders in the PDF.** Instead of blocking generation, empty required fields appear as `<CLIENT_NAME>`, `<ADDRESS>`, etc. in the output. This lets the user generate a draft to review the layout without completing every field first. The user is responsible for filling everything before sending.

**PDF filename format:** `[client-name]-[invoice-number].pdf` (e.g. `acme-corp-2026-001.pdf`). If the client field is empty the placeholder `CLIENT_NAME` is used in the filename.

**Seller block is read-only on the form.** Company data is only editable in Settings. This avoids accidental edits and keeps the form focused on invoice-specific data.

**Language toggle is in the toolbar.** Three states: FR | EN | FR+EN. Switching immediately re-labels all form fields and the PDF output. Legal mentions always stay in French.

**Desktop only.** No responsive/mobile layout. Minimum supported viewport is 1280px wide.

---

## Component Map

```
App
├── Toolbar
│   ├── LanguageToggle
│   ├── ThemeToggle
│   ├── SettingsButton  -->  SettingsPanel (Sheet)
│   ├── ClearFormButton
│   └── GeneratePDFButton
│
├── InvoiceForm
│   ├── SellerBlock (read-only, from IndexedDB)
│   ├── ClientBlock
│   │   ├── B2BToggle
│   │   └── ClientCombobox  -->  ClientManager (Sheet)
│   ├── InvoiceMeta
│   │   ├── InvoiceNumberField
│   │   ├── InvoiceDatePicker
│   │   ├── ServiceDatePicker
│   │   └── DueDatePicker
│   ├── LineItemsTable
│   │   ├── LineItemRow (×n)
│   │   └── AddLineButton
│   ├── TotalsBlock
│   └── PaymentBlock
│
├── SettingsPanel (Sheet)
│   ├── CompanyConstantsForm
│   └── InvoiceNumberingForm
│
└── ClientManager (Sheet)
    ├── ClientList
    └── ClientForm
```

---

## State Model

| State | Where |
|---|---|
| Theme | localStorage |
| Language mode | localStorage |
| Company constants | IndexedDB |
| Client list | IndexedDB |
| Invoice number counter + format | IndexedDB |
| Current invoice form data | IndexedDB (persisted, restored on load) |

---

## PDF Output Layout

The generated PDF mirrors the form sections:

- Top-left: seller identity block
- Top-right: invoice number, dates
- Below header: client block
- Line items table
- Totals block (HT, TVA mention, TTC)
- Payment block
- Footer: legal mention (TVA non applicable...) always in FR

Bilingual mode renders each label as "FR label / EN label" in the PDF.
