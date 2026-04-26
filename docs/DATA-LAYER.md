# Data Layer

## Overview

All persistence is client-side. No backend, no network calls. Two storage mechanisms are used:

| Storage | What lives there |
|---|---|
| `localStorage` | Theme, language mode |
| IndexedDB (via `idb`) | Company constants, client list, invoice numbering config, current invoice form state |

---

## localStorage

Two keys, both primitives:

| Key | Type | Values |
|---|---|---|
| `theme` | string | `"light"` \| `"dark"` |
| `uiLanguage` | string | `"fr"` \| `"en"` |

`uiLanguage` controls the app interface only (toolbar labels, form labels, settings panel). Invoice language is a per-invoice setting stored in `invoiceDraft`. Read on app mount. Written immediately on user change.

---

## IndexedDB

Database name: `invoice-generator` (recommended). Wrapped with the `idb` library for async/await access.

### Object Stores

#### `company`

Singleton record. Key: `"settings"`.

```ts
interface CompanySettings {
  name: string;           // shown as "Entrepreneur individuel [name]"
  address: string;
  siret: string;
  iban: string;
}
```

Read on app mount to populate the seller block. Written only when the user saves the Settings panel.

---

#### `invoiceNumbering`

Singleton record. Key: `"config"`.

```ts
type NumberFormat =
  | "YYYY-SEQ"          // 2026-001
  | "YYYY-MM-SEQ"       // 2026-05-001
  | "CUSTOM-YYYY-SEQ";  // MP-2026-001

interface InvoiceNumberingConfig {
  format: NumberFormat;
  customPrefix: string;  // used when format is "CUSTOM-YYYY-SEQ"
  counter: number;       // current sequence value; next invoice = counter + 1
}
```

Counter is incremented **only on successful PDF download**, not on click or generation attempt. The user can manually edit the counter value in the Settings panel.

---

#### `clients`

List of saved clients. Auto-incremented numeric key.

```ts
interface Client {
  id?: number;           // assigned by IndexedDB
  name: string;
  address: string;
  vatNumber?: string;    // buyer VAT ID (optional; required for B2B if total > EUR 150)
  siren?: string;        // for future e-invoicing compliance (2026-2027 rollout)
  notes?: string;
}
```

CRUD operations via the Client Manager overlay. Also written when the user saves a new client from the invoice form combobox.

---

#### `invoiceDraft`

Singleton record. Key: `"current"`. Saves the entire in-progress invoice form on every change so it can be restored after a page reload.

```ts
interface LineItem {
  id: string;            // stable local ID for React key prop
  description: string;
  quantity: number;
  unitPriceHT: number;
}

type InvoiceLanguage = "fr" | "en" | "fr+en";

interface InvoiceDraft {
  invoiceNumber: string;       // may be overridden by user; auto-computed otherwise
  invoiceLanguage: InvoiceLanguage; // PDF output language; independent of the app UI language
  invoiceDate: string;         // ISO date string
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
  paymentMethods: string;      // e.g. "Bank transfer - IBAN: ..."
  latePaymentPenaltyRate: string;
}
```

Cleared and reset to defaults when the user clicks "Clear Form". The invoice number field is then populated from the next computed `invoiceNumbering` value.

---

## Derived / Computed Values

These are never stored; they are computed at render time from the draft state:

| Value | Derivation |
|---|---|
| `totalHT` | Sum of `quantity * unitPriceHT` across all line items |
| `totalTTC` | Equals `totalHT` (no VAT collected under art. 293 B CGI) |
| Next invoice number preview | Formatted from `invoiceNumberingConfig.format`, `customPrefix`, `counter + 1`, and current date |
| PDF filename | `[slugified-client-name]-[invoiceNumber].pdf` |

---

## Access Patterns

| Operation | Store(s) touched |
|---|---|
| App mount | Read `company`, `invoiceNumbering`, `invoiceDraft` |
| User edits any form field | Write `invoiceDraft` |
| User opens Settings | Read `company`, `invoiceNumbering` |
| User saves Settings | Write `company`, `invoiceNumbering` |
| User opens Client Manager | Read `clients` |
| User saves/edits/deletes client | Write `clients` |
| Successful PDF download | Increment `invoiceNumbering.counter`; write `invoiceNumbering` |
| User clicks Clear Form | Reset and write `invoiceDraft`; read `invoiceNumbering` for next number |

---

## Invoice Number Generation

```
format: YYYY-SEQ        -> 2026-001
format: PREFIX-YYYY-SEQ -> FA-2026-001    (customPrefix = "FA")
format: YYYY-MM-SEQ     -> 2026-05-001
format: CUSTOM-YYYY-SEQ -> MP-2026-001   (customPrefix = "MP")
```

Sequence is zero-padded to 3 digits. Year and month are taken from the invoice date field (not the system clock), so backdating an invoice produces the correct number format.

---

## Notes

- **UI language vs invoice language are independent.** `uiLanguage` (`fr` | `en`) is stored in `localStorage` and controls the app interface. `invoiceLanguage` (`fr` | `en` | `fr+en`) is stored inside `invoiceDraft` in IndexedDB and controls the PDF output. Changing the UI language never affects invoice language and vice versa.
- **Draft auto-save is debounced** (300-500ms after last change) to avoid excessive IndexedDB write volume during fast typing.
- **On app load, the draft's `invoiceNumber` is always replaced** with the current computed next number from `invoiceNumbering`. Multi-tab scenarios are out of scope; the draft number is treated as stale.
- **Adding a new client from the combobox opens a mini-form** (name, address, VAT number, SIREN, notes) before saving to the `clients` store. The combobox input pre-fills the name field.
- **Counter always advances by 1 from its current value on successful PDF download**, regardless of whether the user overrode the invoice number field. The displayed/printed number and the counter are independent.
- All other IndexedDB writes are fire-and-forget. A failed write is silent; the draft will be slightly stale on next load but nothing is lost permanently.
- The `idb` library handles database versioning. The initial schema version is `1`. Adding a new object store requires a version bump and an `onupgradeneeded` migration.
- There is no sync, no export, and no cloud backup in the current scope. A future data export/import feature (see DESIGN.md) would serialize all four stores to a single JSON file.
