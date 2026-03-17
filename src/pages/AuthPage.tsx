import { useTheme } from '@/context/ThemeContext';
import { NexusAuth } from '@/components/auth/nexus/NexusAuth';
import { ShopeersAuth } from '@/components/auth/shopeers/ShopeersAuth';
import { ProjectliAuth } from '@/components/auth/projectli/ProjectliAuth';
import { MagikaAuth } from '@/components/auth/magika/MagikaAuth';
import { WorklyAuth } from '@/components/auth/workly/WorklyAuth';
import { TaskplusAuth } from '@/components/auth/taskplus/TaskplusAuth';
import { EevoAuth } from '@/components/auth/eevo/EevoAuth';
import { QuantumAuth } from '@/components/auth/quantum/QuantumAuth';
import { ReSyncAuth } from '@/components/auth/resync/ReSyncAuth';
import { LayoutSwitcher } from '@/components/ui/LayoutSwitcher';

interface AuthPageProps {
  onLogin: () => void;
}

export const AuthPage = ({ onLogin }: AuthPageProps) => {
  const { visualPattern } = useTheme();

  return (
    <div className="relative">
      <LayoutSwitcher showFormWidthOption />

      {visualPattern === 'nexus' && <NexusAuth onLogin={onLogin} />}
      {visualPattern === 'shopeers' && <ShopeersAuth onLogin={onLogin} />}
      {visualPattern === 'projectli' && <ProjectliAuth onLogin={onLogin} />}
      {visualPattern === 'magika' && <MagikaAuth onLogin={onLogin} />}
      {visualPattern === 'workly' && <WorklyAuth onLogin={onLogin} />}
      {visualPattern === 'taskplus' && <TaskplusAuth onLogin={onLogin} />}
      {visualPattern === 'eevo' && <EevoAuth onLogin={onLogin} />}
      {visualPattern === 'quantum' && <QuantumAuth onLogin={onLogin} />}
      {visualPattern === 'resync' && <ReSyncAuth onLogin={onLogin} />}
    </div>
  );
};
