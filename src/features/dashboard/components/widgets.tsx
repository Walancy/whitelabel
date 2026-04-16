import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { cn } from '@/lib/utils';
import { AlertTriangle, CheckCircle2, Info, ArrowUpRight, WifiOff } from 'lucide-react';

/* --- Data Mocks --- */
const growthData = [
  { name: 'Jan', pontos: 120, dispositivos: 200, receita: 15000 },
  { name: 'Fev', pontos: 150, dispositivos: 280, receita: 22000 },
  { name: 'Mar', pontos: 210, dispositivos: 390, receita: 38000 },
  { name: 'Abr', pontos: 295, dispositivos: 550, receita: 54000 },
  { name: 'Mai', pontos: 350, dispositivos: 680, receita: 68000 },
  { name: 'Jun', pontos: 420, dispositivos: 800, receita: 85000 },
];

const devicesData = [
  { name: 'Online', value: 698, color: '#16a34a' },
  { name: 'Offline', value: 42, color: '#dc2626' },
  { name: 'Manutenção', value: 12, color: '#eab308' },
];

const viewsData = [
  { time: '06:00', views: 1200 },
  { time: '09:00', views: 4500 },
  { time: '12:00', views: 8900 },
  { time: '15:00', views: 6500 },
  { time: '18:00', views: 11000 },
  { time: '21:00', views: 3200 },
];

/* --- CHARTS --- */

export function ChartGrowth() {
  return (
    <div className="flex-1 w-full h-full min-h-[150px] mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={growthData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorPontos" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#FCB537" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#FCB537" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorReceita" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#23B8CC" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#23B8CC" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={10} tickLine={false} axisLine={false} />
          <YAxis stroke="var(--muted-foreground)" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `${v / 1000}k`} />
          <Tooltip 
            contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '8px', fontSize: '12px' }}
            itemStyle={{ color: 'var(--foreground)' }}
          />
          <Area type="monotone" dataKey="pontos" stroke="#FCB537" strokeWidth={2} fillOpacity={1} fill="url(#colorPontos)" />
          <Area type="monotone" dataKey="receita" stroke="#23B8CC" strokeWidth={2} fillOpacity={1} fill="url(#colorReceita)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}


export function ChartViews() {
  return (
    <div className="flex-1 w-full h-full min-h-[150px] mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={viewsData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis dataKey="time" stroke="var(--muted-foreground)" fontSize={10} tickLine={false} axisLine={false} />
          <YAxis stroke="var(--muted-foreground)" fontSize={10} tickLine={false} axisLine={false} tickFormatter={v => `${(v/1000).toFixed(1)}k`}/>
          <Tooltip cursor={{ fill: 'var(--accent)' }} contentStyle={{ backgroundColor: 'var(--card)', borderRadius: '8px' }} />
          <Bar dataKey="views" fill="#FCB537" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ChartDevices() {
  return (
    <div className="flex-1 w-full h-full min-h-[150px] mt-2 flex items-center justify-center relative">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={devicesData}
            cx="50%"
            cy="50%"
            innerRadius={45}
            outerRadius={65}
            paddingAngle={5}
            dataKey="value"
            stroke="transparent"
          >
            {devicesData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip contentStyle={{ backgroundColor: 'var(--card)', borderRadius: '8px', fontSize: '11px', border: '1px solid var(--border)' }} itemStyle={{color: '#fff'}} />
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-2xl font-bold tracking-tight text-foreground">93%</span>
        <span className="text-[10px] text-muted-foreground uppercase font-semibold">Online</span>
      </div>
    </div>
  );
}

export function ChartRevenue() {
  return (
    <div className="flex flex-col flex-1 mt-4">
      <div className="flex items-baseline gap-2 mb-4">
        <span className="text-3xl font-bold text-foreground tracking-tight">R$ 142.500</span>
        <span className="text-xs font-semibold text-[#16a34a] flex items-center"><ArrowUpRight size={14}/> 12.5%</span>
      </div>
      <div className="flex-1 w-full h-full min-h-[100px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={growthData} margin={{ top: 5, right: 5, left: 5, bottom: 0 }}>
            <Tooltip contentStyle={{ backgroundColor: 'var(--card)', borderRadius: '8px' }} />
            <Line type="monotone" dataKey="receita" stroke="#16a34a" strokeWidth={3} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

/* --- TABLES & LISTS --- */

export function TableRegions() {
  const data = [
    { city: 'São Paulo, SP', points: 145, screens: 290, status: '98%' },
    { city: 'Rio de Janeiro, RJ', points: 85, screens: 120, status: '92%' },
    { city: 'Belo Horizonte, MG', points: 40, screens: 65, status: '100%' },
    { city: 'Curitiba, PR', points: 25, screens: 40, status: '85%' },
  ];
  return (
    <div className="flex flex-col flex-1 mt-4 overflow-y-auto scrollbar-stylized pr-2">
      <table className="w-full text-left border-collapse text-[12px]">
        <thead>
          <tr className="border-b border-border text-muted-foreground">
            <th className="pb-2 font-semibold">Região</th>
            <th className="pb-2 font-semibold text-right">Pontos</th>
            <th className="pb-2 font-semibold text-right">Telas</th>
            <th className="pb-2 font-semibold text-right">Saúde</th>
          </tr>
        </thead>
        <tbody className="text-foreground">
          {data.map(d => (
            <tr key={d.city} className="border-b border-border/50 last:border-0 hover:bg-accent/30 transition-colors">
              <td className="py-2.5 font-medium">{d.city}</td>
              <td className="py-2.5 text-right text-muted-foreground">{d.points}</td>
              <td className="py-2.5 text-right text-muted-foreground">{d.screens}</td>
              <td className="py-2.5 text-right">
                <span className={cn("px-2 py-0.5 rounded text-[10px] font-bold", parseInt(d.status) > 95 ? "bg-[#16a34a]/10 text-[#16a34a]" : "bg-[#eab308]/10 text-[#eab308]")}>
                  {d.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function TableOffline() {
  const data = [
    { id: 'TELA-0042', local: 'Shopping Bourbon', since: '1h 20m' },
    { id: 'TELA-0105', local: 'Estação Luz', since: '3h 45m' },
    { id: 'TELA-0888', local: 'Parque Ibirapuera', since: '12h 10m' },
  ];
  return (
    <div className="flex flex-col flex-1 mt-4 overflow-y-auto scrollbar-stylized pr-2">
      <div className="flex flex-col gap-2">
        {data.map(d => (
          <div key={d.id} className="flex items-center justify-between p-2.5 rounded-lg border border-border bg-card hover:border-red-500/30 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 shrink-0">
                <WifiOff size={14} />
              </div>
              <div className="flex flex-col">
                <span className="text-[12px] font-bold text-foreground">{d.id}</span>
                <span className="text-[11px] text-muted-foreground">{d.local}</span>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-semibold text-red-500 bg-red-500/10 px-1.5 rounded">Off há {d.since}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ListAlerts() {
  const alerts = [
    { type: 'critical', msg: 'Falha no player (HDMI Desconectado)', origin: 'TELA-0042', time: '10 min ago' },
    { type: 'critical', msg: 'Split financeiro não processado', origin: 'Campanha #4102', time: '1 hr ago' },
    { type: 'warning', msg: 'Lentidão na rede identificada', origin: 'Região Sul (PR/SC/RS)', time: '2 hrs ago' },
  ];
  return (
    <div className="flex flex-col flex-1 mt-4 overflow-y-auto scrollbar-stylized pr-2">
      <div className="flex flex-col gap-3">
        {alerts.map((a, i) => (
          <div key={i} className="flex items-start gap-3 relative before:absolute before:left-[15px] before:top-[30px] before:bottom-[-15px] before:w-[2px] before:bg-border last:before:hidden">
            <div className={cn("w-8 h-8 rounded-full shrink-0 flex items-center justify-center z-10", a.type === 'critical' ? 'bg-red-500/10 text-red-500' : 'bg-yellow-500/10 text-yellow-500')}>
              <AlertTriangle size={14} />
            </div>
            <div className="flex flex-col pt-1">
              <span className="text-[12px] font-semibold text-foreground dark:text-white leading-tight">{a.msg}</span>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] font-medium text-foreground/80 dark:text-white/80">{a.origin}</span>
                <span className="w-1 h-1 rounded-full bg-border" />
                <span className="text-[10px] font-medium text-foreground/60 dark:text-white/60">{a.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ListActivity() {
  const activities = [
    { type: 'success', msg: 'Novo ponto de anúncio aprovado', desc: 'Neooh Paulista (Av. Paulista, 1000)', time: 'Agora' },
    { type: 'info', msg: 'Campanha "Inverno 2026" iniciada', desc: 'Veiculando em 120 telas', time: 'Há 15 min' },
    { type: 'success', msg: 'Repasse efetuado com sucesso', desc: 'R$ 14.250 para Afiliado ID #889', time: 'Há 2 hrs' },
    { type: 'info', msg: 'Nova versão de player liberada', desc: 'v4.2.0-stable pronta para OTA', time: 'Há 5 hrs' },
  ];
  return (
    <div className="flex flex-col flex-1 mt-4 overflow-y-auto scrollbar-stylized pr-2">
      <div className="flex flex-col gap-3">
        {activities.map((a, i) => (
          <div key={i} className="flex items-start gap-3 relative before:absolute before:left-[15px] before:top-[30px] before:bottom-[-15px] before:w-[2px] before:bg-border last:before:hidden">
            <div className={cn("w-8 h-8 rounded-full shrink-0 flex items-center justify-center z-10", a.type === 'success' ? 'bg-[#16a34a]/10 text-[#16a34a]' : 'bg-[#23B8CC]/10 text-[#23B8CC]')}>
              {a.type === 'success' ? <CheckCircle2 size={14} /> : <Info size={14} />}
            </div>
            <div className="flex flex-col pt-1">
              <span className="text-[12px] font-semibold text-foreground dark:text-white leading-tight">{a.msg}</span>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] font-medium text-foreground/80 dark:text-white/80">{a.desc}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function TableCampaigns() {
  const data = [
    { id: '#4090', client: 'Nike Brasil', status: 'Ativo', impr: '1.2M', cpm: 'R$ 4,50' },
    { id: '#4092', client: 'Coca-Cola', status: 'Ativo', impr: '850K', cpm: 'R$ 5,00' },
    { id: '#4098', client: 'Banco Itaú', status: 'Pendente', impr: '-', cpm: '-' },
  ];
  return (
    <div className="flex flex-col flex-1 mt-4 overflow-y-auto scrollbar-stylized pr-2">
      <table className="w-full text-left border-collapse text-[12px]">
        <thead>
          <tr className="border-b border-border text-muted-foreground">
            <th className="pb-2 font-semibold">Campanha</th>
            <th className="pb-2 font-semibold">Status</th>
            <th className="pb-2 font-semibold text-right">Impressões</th>
            <th className="pb-2 font-semibold text-right">CPM</th>
          </tr>
        </thead>
        <tbody className="text-foreground">
          {data.map(d => (
            <tr key={d.id} className="border-b border-border/50 last:border-0 hover:bg-accent/30 transition-colors cursor-pointer">
              <td className="py-2.5">
                <div className="flex flex-col">
                  <span className="font-semibold text-foreground">{d.client}</span>
                  <span className="text-[10px] text-muted-foreground">{d.id}</span>
                </div>
              </td>
              <td className="py-2.5">
                <span className={cn("px-2 py-0.5 rounded text-[10px] font-bold", d.status === 'Ativo' ? "bg-[#16a34a]/10 text-[#16a34a]" : "bg-[#eab308]/10 text-[#eab308]")}>
                  {d.status}
                </span>
              </td>
              <td className="py-2.5 text-right font-medium">{d.impr}</td>
              <td className="py-2.5 text-right text-muted-foreground">{d.cpm}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function TablePoints() {
  return <TableOffline />; // Reuse for now or create specific
}
