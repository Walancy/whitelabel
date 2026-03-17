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

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const { visualPattern } = useTheme();

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground transition-colors duration-300">
      {visualPattern === 'nexus' && <Sidebar />}
      {visualPattern === 'shopeers' && <ShopeersSidebar />}
      {visualPattern === 'projectli' && <ProjectliSidebar />}
      {visualPattern === 'magika' && <MagikaSidebar />}
      {visualPattern === 'workly' && <WorklySidebar />}
      {visualPattern === 'taskplus' && <TaskplusSidebar />}
      {visualPattern === 'eevo' && <EevoSidebar />}
      {visualPattern === 'quantum' && <QuantumSidebar />}
      {visualPattern === 'resync' && <ReSyncSidebar />}
      
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
        
        <main className="flex-1 overflow-y-auto px-6 py-6 scrollbar-stylized">
          {children}
        </main>
      </div>

      <LayoutSwitcher />
    </div>
  );
};
