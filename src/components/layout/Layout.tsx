import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { ShopeersSidebar } from './ShopeersSidebar';
import { ShopeersHeader } from './ShopeersHeader';
import { useTheme } from '@/context/ThemeContext';
import { LayoutSwitcher } from '../ui/LayoutSwitcher';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const { visualPattern } = useTheme();

  const isNexus = visualPattern === 'nexus';

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground transition-colors duration-300">
      {isNexus ? <Sidebar /> : <ShopeersSidebar />}
      
      <div className="flex-1 flex flex-col min-w-0 h-full">
        {isNexus ? <Header /> : <ShopeersHeader />}
        <main className="flex-1 overflow-y-auto px-6 py-6 scrollbar-stylized">
          {children}
        </main>
      </div>

      <LayoutSwitcher />
    </div>
  );
};
