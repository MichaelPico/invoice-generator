import { AppProvider } from './context/AppContext';
import { useApp } from './context/AppContext';
import { Toolbar } from './components/Toolbar';
import { InvoiceForm } from './components/invoice/InvoiceForm';

function AppContent() {
  const { resetKey } = useApp();
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Toolbar />
      <main className="max-w-4xl mx-auto px-6 py-10">
        <InvoiceForm key={resetKey} />
      </main>
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
