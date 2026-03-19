import { Sidebar } from './nexus/Sidebar';
import { Header } from './nexus/Header';
import { ShopeersSidebar } from './shopeers/ShopeersSidebar';
import { ShopeersHeader } from './shopeers/ShopeersHeader';
import { ProjectliSidebar } from './projectli/ProjectliSidebar';
import { ProjectliHeader } from './projectli/ProjectliHeader';
import { MagikaSidebar } from './magika/MagikaSidebar';
import { MagikaHeader } from './magika/MagikaHeader';
import { WorklySidebar } from './workly/WorklySidebar';
import { WorklyHeader } from './workly/WorklyHeader';
import { TaskplusSidebar } from './taskplus/TaskplusSidebar';
import { TaskplusHeader } from './taskplus/TaskplusHeader';
import { EevoSidebar } from './eevo/EevoSidebar';
import { EevoHeader } from './eevo/EevoHeader';
import { QuantumSidebar } from './quantum/QuantumSidebar';
import { QuantumHeader } from './quantum/QuantumHeader';
import { ReSyncSidebar } from './resync/ReSyncSidebar';
import { ReSyncHeader } from './resync/ReSyncHeader';
import { useTheme } from '@/context/ThemeContext';
import { LayoutSwitcher } from '../ui/LayoutSwitcher';
import { DashboardBackground } from '../ui/DashboardBackground';

import { type AppPage } from '@/App';

interface LayoutProps {
  children: React.ReactNode;
  activePage?: AppPage;
  onNavigate?: (page: AppPage) => void;
}

export const Layout = ({ children, activePage, onNavigate }: LayoutProps) => {
  const { visualPattern, dashboardConfig } = useTheme();

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground transition-colors duration-300 relative">
      {/* Background layer – sits behind everything */}
      <DashboardBackground />

      {dashboardConfig.layoutMode === 'sidebar' && (
        <>
          {visualPattern === 'nexus' && <Sidebar activePage={activePage} onNavigate={onNavigate} />}
          {visualPattern === 'shopeers' && <ShopeersSidebar activePage={activePage} onNavigate={onNavigate} />}
          {visualPattern === 'projectli' && <ProjectliSidebar activePage={activePage} onNavigate={onNavigate} />}
          {visualPattern === 'magika' && <MagikaSidebar activePage={activePage} onNavigate={onNavigate} />}
          {visualPattern === 'workly' && <WorklySidebar activePage={activePage} onNavigate={onNavigate} />}
          {visualPattern === 'taskplus' && <TaskplusSidebar activePage={activePage} onNavigate={onNavigate} />}
          {visualPattern === 'eevo' && <EevoSidebar activePage={activePage} onNavigate={onNavigate} />}
          {visualPattern === 'quantum' && <QuantumSidebar activePage={activePage} onNavigate={onNavigate} />}
          {visualPattern === 'resync' && <ReSyncSidebar activePage={activePage} onNavigate={onNavigate} />}
        </>
      )}
      
      <div className="flex-1 flex flex-col min-w-0 h-full">
        {visualPattern === 'nexus' && <Header />}
        {visualPattern === 'shopeers' && <ShopeersHeader />}
        {visualPattern === 'projectli' && <ProjectliHeader />}
        {visualPattern === 'magika' && <MagikaHeader />}
        {visualPattern === 'workly' && <WorklyHeader />}
        {visualPattern === 'taskplus' && <TaskplusHeader />}
        {visualPattern === 'eevo' && <EevoHeader />}
        {visualPattern === 'quantum' && <QuantumHeader />}
        {visualPattern === 'resync' && <ReSyncHeader />}
        
        <main className="flex-1 flex flex-col min-h-0 overflow-hidden px-5 py-4 xl:py-5 scrollbar-stylized relative z-10">
          <div className="flex-1 min-h-0 overflow-y-auto scrollbar-stylized">
            {children}
          </div>
        </main>
      </div>

      <LayoutSwitcher />
    </div>
  );
};
