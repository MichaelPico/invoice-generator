import { AppProvider } from './context/AppContext';
import { Toolbar } from './components/Toolbar';

function App() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-background text-foreground">
        <Toolbar />
        <main className="max-w-4xl mx-auto px-6 py-10">
          <p className="text-muted-foreground text-sm">
            Stage 2: Invoice form coming next.
          </p>
        </main>
      </div>
    </AppProvider>
  );
}

export default App;
