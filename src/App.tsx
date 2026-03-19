import { useState } from 'react';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { Layout } from './components/layout/Layout';
import { AuthPage } from './pages/AuthPage';
import { NexusDashboard } from './pages/nexus/NexusDashboard';
import { NexusPayments } from './pages/nexus/NexusPayments';
import { ShopeersDashboard } from './pages/shopeers/ShopeersDashboard';
import { ProjectliDashboard } from './pages/projectli/ProjectliDashboard';
import { MagikaDashboard } from './pages/magika/MagikaDashboard';
import { UsersTablePage } from './pages/shared/UsersTablePage';

export type AppPage = 'dashboard' | 'payments' | 'users';

function AppContent({ setIsLoggedIn }: { setIsLoggedIn: (v: boolean) => void }) {
  const { visualPattern } = useTheme();
  const [page, setPage] = useState<AppPage>('dashboard');

  const renderContent = () => {
    // Shared table page works for all layouts
    if (page === 'users') {
      return <div className="h-full"><UsersTablePage /></div>;
    }

    if (visualPattern === 'nexus') {
      return (
        <div className="flex flex-col gap-6 w-full h-full">
          {page === 'dashboard' && <NexusDashboard />}
          {page === 'payments' && <NexusPayments />}
        </div>
      );
    }

    if (visualPattern === 'shopeers') {
      return <div className="h-full"><ShopeersDashboard /></div>;
    }

    if (visualPattern === 'projectli') {
      return <div className="h-full"><ProjectliDashboard /></div>;
    }

    if (visualPattern === 'magika') {
      return <div className="h-full"><MagikaDashboard /></div>;
    }

    return (
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-base font-semibold text-foreground tracking-tight">Dashboard</h1>
          <p className="text-[11px] text-muted-foreground mt-0.5">Bem-vindo de volta.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-5 border rounded-xl bg-card hover:border-foreground/20 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center">
                  <div className="w-4 h-4 bg-foreground/20 rounded-sm" />
                </div>
                <span className="text-[10px] font-bold text-muted-foreground uppercase">+12.5%</span>
              </div>
              <h3 className="text-muted-foreground text-xs font-medium uppercase tracking-wider">Metric {i}</h3>
              <p className="text-xl font-semibold mt-1">$45,231.89</p>
            </div>
          ))}
        </div>
        <div className="border rounded-xl h-40 flex items-center justify-center bg-accent/20 border-dashed">
          <button onClick={() => setIsLoggedIn(false)}
            className="text-muted-foreground text-xs font-medium hover:text-foreground transition-all underline decoration-dashed underline-offset-4">
            Sign out to Test Login Screens
          </button>
        </div>
      </div>
    );
  };

  return (
    <Layout activePage={page} onNavigate={setPage}>
      {renderContent()}
    </Layout>
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <ThemeProvider>
      {!isLoggedIn ? (
        <AuthPage onLogin={() => setIsLoggedIn(true)} />
      ) : (
        <AppContent setIsLoggedIn={setIsLoggedIn} />
      )}
    </ThemeProvider>
  );
}

export default App;
