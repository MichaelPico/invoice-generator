# Design

## Context

This project is a static invoice generator built for a French micro-enterprise (auto-entrepreneur). The owner needs to issue invoices to clients quickly, without relying on a SaaS tool or exposing business data to a third party.

**Business context:**

- Registered as a micro-enterprise in France
- Invoices must comply with French legal requirements (mentions obligatoires)
- Some clients may be international, so bilingual (French/English) invoices are needed
- Invoice amounts are typically small; no VAT collected (franchise en base de TVA). This must be stated on invoices.

**Technical context:**

- Fully static: HTML, CSS, and TypeScript only, deployable on any static host (GitHub Pages, Netlify, etc.)
- No backend, no database, no authentication
- Theme and language mode are persisted in `localStorage` (small primitive values)
- Company constants (SIRET, name, address, IBAN, etc.) are persisted in **IndexedDB** so the user does not re-enter them each session
- A client list is persisted in **IndexedDB**. Each entry stores the client's name, address, and any other billing details so recurring clients can be selected from a dropdown rather than re-entered.
- IndexedDB access is wrapped with the `idb` library for a clean async/await API
- Invoice data is ephemeral by default; export to PDF is the primary output

**Invoice requirements (French law):**

- Seller identity: name, address, SIRET number
- Buyer identity: name and address
- Invoice number (sequential, unique); the counter is persisted in IndexedDB and can be manually adjusted by the user
- The invoice number format is configurable by the user. Supported formats:
  - Year + sequence: `2026-001`
  - Prefix + year + sequence: `FA-2026-001`
  - Year + month + sequence: `2026-05-001`
  - Custom prefix + year + sequence: `MP-2026-001`
- Format choice and custom prefix are persisted in IndexedDB alongside the counter
- Invoice date and due date
- Description, quantity, unit price, and total for each line item
- Total amount (HT = sans TVA)
- Mention: *"TVA non applicable, art. 293 B du CGI"* (franchise en base)
- Payment terms and accepted methods

**Currency:**

- EUR only

**PDF generation:**

- No live preview; the user fills the form and clicks a button to generate and download the PDF

**Language support:**

- Single language mode: all labels in either French or English, user's choice
- Bilingual mode: labels shown in both French and English side by side
- Legal mentions (e.g. "TVA non applicable, art. 293 B du CGI") always appear in French regardless of the selected mode, as required by French law

## Tech Stack

- **Vite + React + TypeScript** - fast static builds, no backend needed
- **shadcn/ui** - Tailwind-based component library, no bloat
- **@react-pdf/renderer** - define invoice layouts as React components that render directly to PDF
- **idb** - thin async/await wrapper over IndexedDB for structured client/company data

## Deployment

GitHub Pages. Vite base path and any required config will be set up at the end once the app is feature-complete.

## Improvements

- **Invoice history** - store past invoices in IndexedDB so the user can reopen, duplicate, or reference them later
- **Multi-currency** - support currencies beyond EUR for international clients
- **Data export/import** - allow the user to export all IndexedDB data (clients, company constants, invoice counter) to a JSON file and re-import it, as a backup and migration mechanism
