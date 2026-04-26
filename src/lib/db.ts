import { openDB } from 'idb';
import type { DBSchema } from 'idb';
import type {
  CompanySettings,
  InvoiceNumberingConfig,
  Client,
  InvoiceDraft,
  InvoiceColorScheme,
} from '../types';

interface InvoiceDB extends DBSchema {
  company: {
    key: string;
    value: CompanySettings;
  };
  invoiceNumbering: {
    key: string;
    value: InvoiceNumberingConfig;
  };
  clients: {
    key: number;
    value: Client & { id: number };
  };
  invoiceDraft: {
    key: string;
    value: InvoiceDraft;
  };
  logo: {
    key: string;
    value: string;
  };
  invoiceColors: {
    key: string;
    value: InvoiceColorScheme;
  };
}

const DB_NAME = 'invoice-generator';
const DB_VERSION = 3;

function getDB() {
  return openDB<InvoiceDB>(DB_NAME, DB_VERSION, {
    upgrade(db, oldVersion) {
      if (oldVersion < 1) {
        db.createObjectStore('company');
        db.createObjectStore('invoiceNumbering');
        db.createObjectStore('clients', { autoIncrement: true, keyPath: 'id' });
        db.createObjectStore('invoiceDraft');
      }
      if (oldVersion < 2) {
        db.createObjectStore('logo');
      }
      if (oldVersion < 3) {
        db.createObjectStore('invoiceColors');
      }
    },
  });
}

export async function getCompany(): Promise<CompanySettings | undefined> {
  const db = await getDB();
  return db.get('company', 'settings');
}

export async function saveCompany(data: CompanySettings): Promise<void> {
  const db = await getDB();
  await db.put('company', data, 'settings');
}

export async function getNumbering(): Promise<InvoiceNumberingConfig | undefined> {
  const db = await getDB();
  return db.get('invoiceNumbering', 'config');
}

export async function saveNumbering(data: InvoiceNumberingConfig): Promise<void> {
  const db = await getDB();
  await db.put('invoiceNumbering', data, 'config');
}

export async function incrementCounter(): Promise<number> {
  const db = await getDB();
  const current = await db.get('invoiceNumbering', 'config');
  if (!current) return 1;
  const next = { ...current, counter: current.counter + 1 };
  await db.put('invoiceNumbering', next, 'config');
  return next.counter;
}

export async function getAllClients(): Promise<Client[]> {
  const db = await getDB();
  return db.getAll('clients');
}

export async function addClient(client: Omit<Client, 'id'>): Promise<number> {
  const db = await getDB();
  return db.add('clients', client as Client & { id: number });
}

export async function updateClient(client: Client & { id: number }): Promise<void> {
  const db = await getDB();
  await db.put('clients', client);
}

export async function removeClient(id: number): Promise<void> {
  const db = await getDB();
  await db.delete('clients', id);
}

export async function getDraft(): Promise<InvoiceDraft | undefined> {
  const db = await getDB();
  return db.get('invoiceDraft', 'current');
}

export async function saveDraft(draft: InvoiceDraft): Promise<void> {
  const db = await getDB();
  await db.put('invoiceDraft', draft, 'current');
}

export async function clearDraft(): Promise<void> {
  const db = await getDB();
  await db.delete('invoiceDraft', 'current');
}

export async function getLogo(): Promise<string | undefined> {
  const db = await getDB();
  return db.get('logo', 'data');
}

export async function saveLogo(dataUrl: string): Promise<void> {
  const db = await getDB();
  await db.put('logo', dataUrl, 'data');
}

export async function clearLogo(): Promise<void> {
  const db = await getDB();
  await db.delete('logo', 'data');
}

export async function getColorScheme(): Promise<InvoiceColorScheme | undefined> {
  const db = await getDB();
  return db.get('invoiceColors', 'config');
}

export async function saveColorScheme(data: InvoiceColorScheme): Promise<void> {
  const db = await getDB();
  await db.put('invoiceColors', data, 'config');
}
