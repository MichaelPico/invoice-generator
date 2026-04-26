import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type {
  CompanySettings,
  InvoiceNumberingConfig,
  Client,
  InvoiceDraft,
  Theme,
  UILanguage,
} from '../types';
import {
  getCompany,
  saveCompany,
  getNumbering,
  saveNumbering,
  incrementCounter,
  getAllClients,
  addClient,
  updateClient,
  removeClient,
  getDraft,
  saveDraft,
  clearDraft,
} from '../lib/db';
import { getTheme, saveTheme, getUILanguage, saveUILanguage } from '../lib/storage';

export const DEFAULT_NUMBERING: InvoiceNumberingConfig = {
  format: 'YYYY-SEQ',
  customPrefix: '',
  counter: 0,
};

interface AppContextValue {
  loading: boolean;
  theme: Theme;
  uiLanguage: UILanguage;
  company: CompanySettings | null;
  numbering: InvoiceNumberingConfig;
  clients: Client[];
  draft: InvoiceDraft | null;
  resetKey: number;
  setTheme: (t: Theme) => void;
  setUILanguage: (l: UILanguage) => void;
  updateCompany: (c: CompanySettings) => Promise<void>;
  updateNumbering: (n: InvoiceNumberingConfig) => Promise<void>;
  advanceCounter: () => Promise<void>;
  addClientEntry: (c: Omit<Client, 'id'>) => Promise<void>;
  updateClientEntry: (c: Client & { id: number }) => Promise<void>;
  removeClientEntry: (id: number) => Promise<void>;
  updateDraft: (d: InvoiceDraft) => Promise<void>;
  resetDraft: () => Promise<void>;
}

const AppContext = createContext<AppContextValue | null>(null);

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [theme, setThemeState] = useState<Theme>('light');
  const [uiLanguage, setUILanguageState] = useState<UILanguage>('fr');
  const [company, setCompany] = useState<CompanySettings | null>(null);
  const [numbering, setNumbering] = useState<InvoiceNumberingConfig>(DEFAULT_NUMBERING);
  const [clients, setClients] = useState<Client[]>([]);
  const [draft, setDraft] = useState<InvoiceDraft | null>(null);
  const [resetKey, setResetKey] = useState(0);

  useEffect(() => {
    setThemeState(getTheme());
    setUILanguageState(getUILanguage());

    async function load() {
      const [comp, num, cls, drft] = await Promise.all([
        getCompany(),
        getNumbering(),
        getAllClients(),
        getDraft(),
      ]);
      if (comp) setCompany(comp);
      if (num) setNumbering(num);
      setClients(cls);
      if (drft) setDraft(drft);
      setLoading(false);
    }
    load();
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  function setTheme(t: Theme) {
    setThemeState(t);
    saveTheme(t);
  }

  function setUILanguage(l: UILanguage) {
    setUILanguageState(l);
    saveUILanguage(l);
  }

  async function updateCompany(c: CompanySettings) {
    await saveCompany(c);
    setCompany(c);
  }

  async function updateNumbering(n: InvoiceNumberingConfig) {
    await saveNumbering(n);
    setNumbering(n);
  }

  async function advanceCounter() {
    const newCounter = await incrementCounter();
    setNumbering((prev) => ({ ...prev, counter: newCounter }));
  }

  async function addClientEntry(c: Omit<Client, 'id'>) {
    const id = await addClient(c);
    setClients((prev) => [...prev, { ...c, id }]);
  }

  async function updateClientEntry(c: Client & { id: number }) {
    await updateClient(c);
    setClients((prev) => prev.map((cl) => (cl.id === c.id ? c : cl)));
  }

  async function removeClientEntry(id: number) {
    await removeClient(id);
    setClients((prev) => prev.filter((cl) => cl.id !== id));
  }

  async function updateDraft(d: InvoiceDraft) {
    await saveDraft(d);
    setDraft(d);
  }

  async function resetDraft() {
    await clearDraft();
    setDraft(null);
    setResetKey((k) => k + 1);
  }

  const value: AppContextValue = {
    loading,
    theme,
    uiLanguage,
    company,
    numbering,
    clients,
    draft,
    resetKey,
    setTheme,
    setUILanguage,
    updateCompany,
    updateNumbering,
    advanceCounter,
    addClientEntry,
    updateClientEntry,
    removeClientEntry,
    updateDraft,
    resetDraft,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
