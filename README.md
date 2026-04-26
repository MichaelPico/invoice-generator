# Invoice Generator

React app for issuing invoices as a French auto-entrepreneur (micro-enterprise). Runs entirely in the browser -- no backend, no account, no data leaves your machine.

Company info (SIRET, address, IBAN, etc.) and your client list are persisted in localStorage.

## Features

- Invoice output in French, English, or bilingual (FR/EN) -- legal mentions always in French as required
- VAT exemption notice auto-included: *TVA non applicable, art. 293 B du CGI*
- Saved client list with quick-select combobox
- Customizable invoice colors and numbering scheme
- Multi-currency support
- Live PDF preview and one-click PDF export
- Deployable as a static site (GitHub Pages, Netlify, etc.)

## Getting started

Requires Node.js and npm.

```bash
npm install
npm run dev
```

## Docs

- [Design & Context](docs/DESIGN.md) - architecture, tech stack, business context, and planned improvements
- [Invoice Design](docs/INVOICE-DESIGN.md) - French legal requirements (mentions obligatoires), VAT exemption rules, and project-specific invoice rules
