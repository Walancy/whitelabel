import { MapPin, Tv2, Wifi, WifiOff, Megaphone, CheckCircle2, LayoutGrid, BarChart3, LineChart, PieChart, Table, AlertTriangle } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

/* ─── Recursive layout tree ─── */
export interface LayoutNode {
  id: string;
  dir: 'row' | 'col';
  children: LayoutNode[];
  widgets: { id: string; type: string }[];
  contentDir: 'row' | 'col';
  size: number;
}

/* ─── Global Dashboard Config ─── */
export interface DashboardTheme {
  gap: number;
  borderRadius: number;
  padding: number;
  opacity: number;
  blur: number;
  borderWidth: number;
}

export const DEFAULT_THEME: DashboardTheme = {
  gap: 15,
  borderRadius: 16,
  padding: 20,
  opacity: 100,
  blur: 0,
  borderWidth: 1,
};

/* ─── Widget catalog ─── */
export type WidgetCategory = 'kpis' | 'gráficos' | 'tabelas';

export interface WidgetDef {
  type: string;
  category: WidgetCategory;
  label: string;
  description: string;
  icon: LucideIcon;
}

export const WIDGET_CATALOG: WidgetDef[] = [
  // KPIs
  { type: 'kpi-pontos',       category: 'kpis', label: 'Pontos de anúncio',     description: 'Total de pontos cadastrados', icon: MapPin       },
  { type: 'kpi-dispositivos', category: 'kpis', label: 'Dispositivos ativos',   description: 'Players transmitindo',      icon: Tv2          },
  { type: 'kpi-online',       category: 'kpis', label: 'Dispositivos online',   description: 'Equipamentos com conexão',  icon: Wifi         },
  { type: 'kpi-offline',      category: 'kpis', label: 'Dispositivos offline',  description: 'Sem comunicação de rede',   icon: WifiOff      },
  { type: 'kpi-camp-ativas',  category: 'kpis', label: 'Campanhas ativas',      description: 'Anúncios veiculados agora', icon: Megaphone    },
  { type: 'kpi-camp-fin',     category: 'kpis', label: 'Campanhas finalizadas', description: 'Ciclos que foram concluídos',icon: CheckCircle2 },
  { type: 'kpi-inv-disp',     category: 'kpis', label: 'Inventário livre',      description: 'Espaço disponível',         icon: LayoutGrid   },
  { type: 'kpi-inv-vendido',  category: 'kpis', label: 'Inventário faturado',   description: 'Lotes comercializados',     icon: BarChart3    },

  // Gráficos
  { type: 'chart-views',      category: 'gráficos', label: 'Audiência gerada',  description: 'Impactos por dia/hora',     icon: LineChart },
  { type: 'chart-devices',    category: 'gráficos', label: 'Status da rede',    description: 'Proporção de conectividade', icon: PieChart },
  { type: 'chart-growth',     category: 'gráficos', label: 'Crescimento',       description: 'Gráfico mensal de novos pontos', icon: LineChart },
  { type: 'chart-revenue',    category: 'gráficos', label: 'Receita Total',     description: 'Valor acumulado do período', icon: BarChart3 },

  // Tabelas
  { type: 'table-campaigns',  category: 'tabelas', label: 'Painel de Campanhas',description: 'Listagem dos clientes atuais', icon: Table },
  { type: 'table-points',     category: 'tabelas', label: 'Log de Ocorrências', description: 'Telas que reportaram falhas',  icon: AlertTriangle },
  { type: 'table-regions',    category: 'tabelas', label: 'Status por Região',  description: 'Tabela de pontos por cidade', icon: MapPin },
  { type: 'table-offline',    category: 'tabelas', label: 'Equipamentos Offline', description: 'Dispositivos com problema', icon: WifiOff },
  
  // Listas
  { type: 'list-alerts',      category: 'tabelas', label: 'Alertas Críticos',   description: 'Alertas recentes da operação', icon: AlertTriangle },
  { type: 'list-activity',    category: 'tabelas', label: 'Atividade Recente',  description: 'Eventos da plataforma', icon: LayoutGrid },
];

export const KPI_VALUES: Record<string, { value: string; change: string; up: boolean }> = {
  'kpi-pontos':       { value: '295',  change: '+5% vs mês anterior',  up: true  },
  'kpi-dispositivos': { value: '740',  change: '+7% vs mês anterior',  up: true  },
  'kpi-online':       { value: '698',  change: '+2% vs mês anterior',  up: true  },
  'kpi-offline':      { value: '42',   change: '+3 este mês',          up: false },
  'kpi-camp-ativas':  { value: '63',   change: '+12% vs mês anterior', up: true  },
  'kpi-camp-fin':     { value: '410',  change: '+8% vs mês anterior',  up: true  },
  'kpi-inv-disp':     { value: '28%',  change: '-4% vs mês anterior',  up: false },
  'kpi-inv-vendido':  { value: '72%',  change: '+4% vs mês anterior',  up: true  },
};
