# Invoice Generator

A static web app for generating professional invoices, built for a French micro-enterprise. Supports French-only and bilingual (French/English) invoice formats.

Client and company data (SIRET, name, address, etc.) are stored locally in the browser. No backend, no account required.

## Features

- Generate invoices compliant with French micro-enterprise requirements
- Single language (FR or EN) or bilingual (FR/EN) invoice output
- Local storage for company constants (SIRET, name, address, payment info)
- Local client list: save and reuse recurring client details
- Export to PDF
- Runs entirely in the browser, no server, no data sent anywhere

## Docs

- [Design & Context](docs/DESIGN.md) - architecture, tech stack, business context, and planned improvements
- [Invoice Design](docs/INVOICE-DESIGN.md) - French legal requirements (mentions obligatoires), VAT exemption rules, and project-specific invoice rules
