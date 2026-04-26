import { useState } from 'react';
import { AppProvider } from './context/AppContext';
import { useApp } from './context/AppContext';
import { Toolbar } from './components/Toolbar';
import { InvoiceForm } from './components/invoice/InvoiceForm';
import { WelcomeDialog } from './components/WelcomeDialog';
import { hasSeenWelcome, markWelcomeSeen } from './lib/storage';

function AppContent() {
  const { loading, resetKey, uiLanguage } = useApp();
  const [welcomeOpen, setWelcomeOpen] = useState(() => !hasSeenWelcome());

  function closeWelcome() {
    markWelcomeSeen();
    setWelcomeOpen(false);
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Toolbar onHelpClick={() => setWelcomeOpen(true)} />
      <main className="max-w-4xl mx-auto px-6 py-10">
        {!loading && <InvoiceForm key={resetKey} />}
      </main>
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
