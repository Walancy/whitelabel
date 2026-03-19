import type { AppPage } from '@/App';

/** Props de navegação compartilhadas por todos os sidebars */
export interface SidebarNavProps {
  activePage?: AppPage;
  onNavigate?: (page: AppPage) => void;
}
