import { useState } from 'react';
import { AppProvider } from './context/AppContext';
import { useApp } from './context/AppContext';
import { Toolbar } from './components/Toolbar';
import { InvoiceForm } from './components/invoice/InvoiceForm';
import { PDFPreviewPane } from './components/invoice/PDFPreviewPane';
import { WelcomeDialog } from './components/WelcomeDialog';
import { hasSeenWelcome, markWelcomeSeen } from './lib/storage';
import { resolveColors } from './lib/colorPresets';
import { cn } from './lib/utils';

function AppContent() {
  const { loading, resetKey, uiLanguage, draft, company, logo, colorScheme } = useApp();
  const [welcomeOpen, setWelcomeOpen] = useState(() => !hasSeenWelcome());
  const [previewOpen, setPreviewOpen] = useState(false);
  const colors = resolveColors(colorScheme);

  function closeWelcome() {
    markWelcomeSeen();
    setWelcomeOpen(false);
  }

  return (
    <div className={cn('bg-background text-foreground', previewOpen ? 'flex flex-col h-screen' : 'min-h-screen')}>
      <Toolbar
        onHelpClick={() => setWelcomeOpen(true)}
        previewOpen={previewOpen}
        onTogglePreview={() => setPreviewOpen((o) => !o)}
      />
      <div className={cn('flex', previewOpen ? 'flex-1 overflow-hidden' : '')}>
        <main className={cn(previewOpen ? 'flex-1 overflow-y-auto px-6 py-10' : 'max-w-4xl mx-auto px-6 py-10 w-full')}>
          {!loading && <InvoiceForm key={resetKey} />}
        </main>
        {previewOpen && draft && !loading && (
          <div className="w-1/2 border-l border-border shrink-0 h-full">
            <PDFPreviewPane draft={draft} company={company} logo={logo} colors={colors} />
          </div>
        )}
      </div>
      <WelcomeDialog open={welcomeOpen} onClose={closeWelcome} defaultLanguage={uiLanguage} />
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
