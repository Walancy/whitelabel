import { useMemo } from 'react';
import { DataTable, type Column, type TableVariant } from '@/components/ui/DataTable';
import { useTheme } from '@/context/ThemeContext';

// ─── Types ────────────────────────────────────────────────────────────────────
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'Ativo' | 'Inativo' | 'Pendente';
  department: string;
  joinedAt: string;
  revenue: number;
}

// ─── Variant map: visual pattern → table style ────────────────────────────────
const PATTERN_VARIANT: Record<string, TableVariant> = {
  nexus:     'default',
  shopeers:  'minimal',
  projectli: 'bordered',
  magika:    'pill',
  workly:    'striped',
  taskplus:  'compact',
  eevo:      'soft',
  quantum:   'neon',
  resync:    'clean',
};

// ─── Mock Data ────────────────────────────────────────────────────────────────
const DEPARTMENTS = ['Engenharia', 'Marketing', 'Design', 'Vendas', 'Suporte', 'RH', 'Financeiro'];
const ROLES = ['Admin', 'Editor', 'Viewer', 'Manager', 'Developer'];
const STATUS: User['status'][] = ['Ativo', 'Inativo', 'Pendente'];

const NAMES = [
  'Ana Silva', 'Bruno Costa', 'Carla Mendes', 'Diego Ferreira', 'Elena Rocha',
  'Fabio Lima', 'Gabriela Nunes', 'Henrique Souza', 'Isabela Oliveira', 'João Pedro',
  'Karen Alves', 'Lucas Santos', 'Marina Torres', 'Nicolas Martins', 'Olivia Barros',
  'Paulo Reis', 'Quiteria Andrade', 'Rafael Moura', 'Sabrina Cardoso', 'Thiago Barbosa',
  'Ursula Figueiredo', 'Victor Pereira', 'Wanda Carvalho', 'Xavier Ribeiro', 'Yasmin Castro',
  'Zara Monteiro', 'André Gonçalves', 'Beatriz Correia', 'Carlos Eduardo', 'Daniela Nogueira',
];

function generateData(count: number): User[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: NAMES[i % NAMES.length],
    email: `${NAMES[i % NAMES.length].toLowerCase().replace(' ', '.')}@empresa.com`,
    role: ROLES[i % ROLES.length],
    status: STATUS[i % STATUS.length],
    department: DEPARTMENTS[i % DEPARTMENTS.length],
    joinedAt: new Date(2022, i % 12, (i % 28) + 1).toLocaleDateString('pt-BR'),
    revenue: Math.round((i + 1) * 1234.56 + (i % 7) * 891.23),
  }));
}

const STATUS_COLORS: Record<User['status'], string> = {
  Ativo: 'bg-green-500/10 text-green-600 dark:text-green-400',
  Inativo: 'bg-muted text-muted-foreground',
  Pendente: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
};

// ─── Columns ──────────────────────────────────────────────────────────────────
const COLUMNS: Column<User>[] = [
  {
    key: 'name', label: 'Nome', sortable: true,
    render: (v, row) => (
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-[var(--radius)] bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center shrink-0">
          {String(row.name).split(' ').map(n => n[0]).slice(0, 2).join('')}
        </div>
        <div>
          <p className="text-[11px] font-semibold text-foreground leading-none">{String(v)}</p>
          <p className="text-[10px] text-muted-foreground mt-0.5">{row.email}</p>
        </div>
      </div>
    ),
  },
  { key: 'role', label: 'Cargo', sortable: true },
  { key: 'department', label: 'Departamento', sortable: true },
  {
    key: 'status', label: 'Status', sortable: true,
    render: (v) => (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-[calc(var(--radius)/2)] text-[10px] font-semibold ${STATUS_COLORS[v as User['status']]}`}>
        {String(v)}
      </span>
    ),
  },
  {
    key: 'revenue', label: 'Receita', sortable: true,
    render: (v) => (
      <span className="font-semibold text-foreground text-[11px]">
        R$ {Number(v).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
      </span>
    ),
  },
  { key: 'joinedAt', label: 'Entrada', sortable: true },
];

const FILTER_OPTIONS = [
  { key: 'status' as keyof User, label: 'Status', options: ['Ativo', 'Inativo', 'Pendente'] },
  { key: 'department' as keyof User, label: 'Departamento', options: DEPARTMENTS },
  { key: 'role' as keyof User, label: 'Cargo', options: ROLES },
];

// ─── Page ────────────────────────────────────────────────────────────────────
export const UsersTablePage = () => {
  const { visualPattern } = useTheme();
  const data = useMemo(() => generateData(30), []);
  const variant = PATTERN_VARIANT[visualPattern] ?? 'default';

  return (
    <div className="h-full flex flex-col gap-4 min-h-0 animate-in fade-in duration-300">
      <div className="shrink-0">
        <h1 className="text-base font-semibold text-foreground tracking-tight">Usuários</h1>
        <p className="text-[11px] text-muted-foreground mt-0.5">Gerencie os usuários do sistema</p>
      </div>
      <div className="flex-1 min-h-0">
        <DataTable
          data={data}
          columns={COLUMNS}
          filterOptions={FILTER_OPTIONS}
          pageSize={8}
          variant={variant}
        />
      </div>
    </div>
  );
};
