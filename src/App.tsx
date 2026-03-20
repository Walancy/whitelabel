import { useState } from 'react';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { Layout } from './components/layout/Layout';
import { AuthPage } from './pages/AuthPage';
import { NexusDashboard } from './pages/nexus/NexusDashboard';
import { NexusPayments } from './pages/nexus/NexusPayments';
import { ShopeersDashboard } from './pages/shopeers/ShopeersDashboard';
import { ProjectliDashboard } from './pages/projectli/ProjectliDashboard';
import { WorklyDashboard } from './pages/workly/WorklyDashboard';
import { UsersTablePage } from './pages/shared/UsersTablePage';

export type AppPage = 'dashboard' | 'payments' | 'users';

function AppContent({ setIsLoggedIn }: { setIsLoggedIn: (v: boolean) => void }) {
  const { dashboardModel } = useTheme();
  const [page, setPage] = useState<AppPage>('dashboard');

  const renderContent = () => {
    // Shared table page works for all layouts
    if (page === 'users') {
      return <div className="h-full"><UsersTablePage /></div>;
    }

    if (dashboardModel === 'nexus') {
      return (
        <div className="flex flex-col gap-6 w-full h-full">
          {page === 'dashboard' && <NexusDashboard />}
          {page === 'payments' && <NexusPayments />}
        </div>
      );
    }

    if (dashboardModel === 'shopeers') {
      return <div className="h-full"><ShopeersDashboard /></div>;
    }

    if (dashboardModel === 'projectli') {
      return <div className="h-full"><ProjectliDashboard /></div>;
    }

    if (dashboardModel === 'workly') {
      return <div className="h-full"><WorklyDashboard /></div>;
    }

    return (
      <div className="flex flex-col gap-6 w-full h-full">
        {page === 'dashboard' && <NexusDashboard />}
        {page === 'payments' && <NexusPayments />}
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
