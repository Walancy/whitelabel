import { useState } from 'react';
import {
  Plus, MoreHorizontal, Bell, Paperclip, Clock,
  CheckCircle2, Folder,
  TrendingUp, FileText, AlertCircle, ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCardStyle } from '@/context/ThemeContext';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Task {
  id: number;
  title: string;
  description: string;
  date: string;
  timeRange: string;
  people: number;
  files?: number;
  tags?: string[];
  progress?: number;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
}

// ─── Mock Data ─────────────────────────────────────────────────────────────────
const TASKS: Task[] = [
  {
    id: 1, title: 'Meeting with Pela Members',
    description: 'Meeting to review the new project design with updated features',
    date: 'Today', timeRange: '08:00 Am  10:00 Am', people: 4,
    status: 'todo', priority: 'high',
  },
  {
    id: 2, title: 'Design System',
    description: 'Create a responsive design system for landing pages and projects, focusing on consistency, scalability, and reusable components.',
    date: 'Today', timeRange: '08:00 Am  08:00 Pm', people: 8, files: 6,
    tags: ['Design team', 'Marketing team', 'Development Team'], progress: 70,
    status: 'in-progress', priority: 'medium',
  },
  {
    id: 3, title: 'Meeting With The Sales Team',
    description: 'Checking the sales of the month and estimating the costs and next month',
    date: 'Today', timeRange: '11:00 Am  02:00 Am', people: 2,
    status: 'todo', priority: 'low',
  },
];

const AVATARS = [
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=40&h=40&q=80',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&q=80',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&q=80',
];

const ACTIVITY_BARS = [20, 45, 30, 65, 80, 55, 90, 40, 72, 60, 85, 48];

// ─── Sub-Components ────────────────────────────────────────────────────────────
const AvatarStack = ({ count }: { count: number }) => (
  <div className="flex items-center -space-x-2">
    {AVATARS.slice(0, Math.min(count, 3)).map((src, i) => (
      <img key={i} src={src} alt="avatar"
        className="w-6 h-6 rounded-full object-cover ring-2 ring-card shrink-0" />
    ))}
    {count > 3 && (
      <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-[9px] font-bold flex items-center justify-center ring-2 ring-card">
        +{count - 3}
      </span>
    )}
  </div>
);

const PriorityDot = ({ priority }: { priority: Task['priority'] }) => {
  const colors = { low: 'bg-green-500', medium: 'bg-amber-500', high: 'bg-red-500' };
  return <span className={cn('w-2 h-2 rounded-full shrink-0', colors[priority])} />;
};

const TaskCard = ({ task }: { task: Task }) => {
  const cardStyle = useCardStyle();
  const isDetailed = task.status === 'in-progress';

  return (
    <div
      className={cn('p-4 transition-all group', isDetailed ? 'ring-1 ring-primary/30' : '')}
      style={{ ...cardStyle, borderRadius: 'var(--radius)' }}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <PriorityDot priority={task.priority} />
          <span className="text-[10px] font-semibold text-primary uppercase tracking-wider">{task.date}</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {task.files && (
            <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <Folder size={11} /> {task.files} Files
            </span>
          )}
          <button className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-foreground transition-all">
            <Bell size={13} />
          </button>
          <button className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-foreground transition-all">
            <Paperclip size={13} />
          </button>
          <button className="text-muted-foreground hover:text-foreground transition-colors">
            <MoreHorizontal size={14} />
          </button>
        </div>
      </div>

      <h3 className="text-sm font-semibold text-foreground mb-1 leading-snug">{task.title}</h3>
      <p className="text-[11px] text-muted-foreground leading-relaxed mb-3 line-clamp-2">{task.description}</p>

      {task.tags && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {task.tags.map(tag => (
            <span key={tag} className="px-2 py-0.5 text-[10px] font-medium bg-primary/10 text-primary"
              style={{ borderRadius: 'calc(var(--radius) / 2)' }}>
              {tag}
            </span>
          ))}
        </div>
      )}

      {task.progress !== undefined && (
        <div className="mb-3">
          <div className="flex items-center justify-between text-[10px] mb-1">
            <span className="text-muted-foreground font-medium">Progress</span>
            <span className="font-bold text-foreground">{task.progress}%</span>
          </div>
          <div className="h-1.5 bg-accent rounded-full overflow-hidden">
            <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${task.progress}%` }} />
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Clock size={11} />
          <span className="text-[10px]">{task.timeRange}</span>
        </div>
        <div className="flex items-center gap-2">
          <AvatarStack count={task.people} />
          <span className="text-[10px] text-muted-foreground">+{task.people} People</span>
        </div>
      </div>
    </div>
  );
};

// ─── Main Dashboard ────────────────────────────────────────────────────────────
export const ProjectliDashboard = () => {
  const cardStyle = useCardStyle();
  const [activeFilter, setActiveFilter] = useState<string>('To do');
  const filters = ['To do', 'Work', 'High priority'];

  const panel = { ...cardStyle, borderRadius: 'var(--radius)' };

  return (
    <div className="h-full flex flex-col gap-4 min-h-0 overflow-y-auto scrollbar-stylized">
      {/* ─── Header ─── */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground leading-tight tracking-tight">
          Make Things <span className="text-primary">Simple!</span>
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Management and planning in a simple and attractive style will bring you success
        </p>
      </div>

      {/* ─── Toolbar ─── */}
      <div className="flex items-center gap-2 flex-wrap shrink-0">
        {filters.map(f => (
          <button key={f} onClick={() => setActiveFilter(f)}
            className={cn(
              'h-8 px-3 flex items-center gap-1.5 text-xs font-semibold border transition-all',
              activeFilter === f ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:bg-accent'
            )}
            style={{ borderRadius: 'var(--radius)' }}
          >
            {activeFilter === f && <CheckCircle2 size={11} />}
            {f}
          </button>
        ))}
        <button className="h-8 w-8 flex items-center justify-center border border-border text-muted-foreground hover:bg-accent transition-all"
          style={{ borderRadius: 'var(--radius)' }}>
          <MoreHorizontal size={14} />
        </button>
        <button className="ml-auto h-8 px-4 flex items-center gap-2 bg-primary text-primary-foreground text-xs font-semibold hover:brightness-110 active:scale-95 transition-all"
          style={{ borderRadius: 'var(--radius)' }}>
          <Plus size={13} /> New task
        </button>
      </div>

      {/* ─── Grid ─── */}
      <div className="flex-1 grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-4 min-h-0">
        {/* Left: Task List */}
        <div className="flex flex-col gap-3">
          {TASKS.map(task => <TaskCard key={task.id} task={task} />)}
        </div>

        {/* Right: Panels */}
        <div className="flex flex-col gap-3">
          {/* Today Note */}
          <div className="p-4" style={panel}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-foreground">Today note</span>
              <button className="w-7 h-7 flex items-center justify-center bg-primary text-primary-foreground hover:brightness-110 transition-all"
                style={{ borderRadius: 'var(--radius)' }}>
                <FileText size={12} />
              </button>
            </div>
            <p className="text-[11px] text-foreground leading-relaxed">
              Going to the company and <span className="font-semibold">planning meetings</span> for the week ahead 🔥
            </p>
            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-primary text-[9px] font-bold">A</span>
                </div>
                <span className="text-[10px] text-muted-foreground">20min ago</span>
              </div>
              <button className="flex items-center gap-1 text-[10px] text-green-500 font-semibold">
                <CheckCircle2 size={11} /> I'm going
              </button>
            </div>
          </div>

          {/* My Files */}
          <div className="p-4" style={panel}>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-foreground">My files</span>
              <button className="text-muted-foreground hover:text-foreground transition-colors">
                <MoreHorizontal size={14} />
              </button>
            </div>
            <div className="flex flex-col items-center justify-center py-4 gap-2">
              <div className="w-12 h-12 bg-accent flex items-center justify-center" style={{ borderRadius: 'var(--radius)' }}>
                <Folder size={22} className="text-muted-foreground" />
              </div>
              <span className="text-[11px] text-muted-foreground">You have not added a file yet</span>
              <span className="text-[10px] text-muted-foreground/60">More than 20 formats</span>
            </div>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              {['W', 'F', 'N', 'Ps'].map((fmt, i) => (
                <div key={i}
                  className={cn('w-8 h-8 flex items-center justify-center text-[10px] font-bold border border-border',
                    i === 0 && 'bg-blue-600 text-white border-transparent',
                    i === 1 && 'bg-orange-500 text-white border-transparent',
                    i === 2 && 'text-foreground bg-accent',
                    i === 3 && 'bg-blue-800 text-white border-transparent',
                  )}
                  style={{ borderRadius: 'var(--radius)' }}
                >
                  {fmt}
                </div>
              ))}
              <button
                className="h-8 px-2.5 flex items-center gap-1 text-[10px] font-semibold border border-dashed border-border text-muted-foreground hover:border-primary hover:text-primary transition-all ml-auto"
                style={{ borderRadius: 'var(--radius)' }}
              >
                <Plus size={10} /> Add file
              </button>
            </div>
          </div>

          {/* Activity */}
          <div className="p-4 flex-1" style={panel}>
            <div className="flex items-center justify-between mb-1">
              <div>
                <span className="text-xs font-semibold text-foreground">Activity</span>
                <p className="text-[10px] text-muted-foreground mt-0.5">13 Tasks Completed 🎯</p>
              </div>
              <button className="h-7 px-2.5 flex items-center gap-1.5 text-[10px] font-semibold bg-primary text-primary-foreground hover:brightness-110 transition-all"
                style={{ borderRadius: 'var(--radius)' }}>
                Get the report <ChevronRight size={10} />
              </button>
            </div>
            <div className="flex items-end gap-1 h-16 mt-4">
              {ACTIVITY_BARS.map((h, i) => (
                <div key={i} className="flex-1 flex flex-col justify-end">
                  <div className={cn('rounded-sm transition-all', i === 9 ? 'bg-primary' : 'bg-accent')}
                    style={{ height: `${h}%` }} />
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-1">
              {['Feb', 'Mar', 'Apr', 'May'].map(m => (
                <span key={m} className="text-[9px] text-muted-foreground">{m}</span>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-border">
              {[
                { icon: CheckCircle2, label: 'Done', value: '13', color: 'text-green-500' },
                { icon: AlertCircle, label: 'Pending', value: '4', color: 'text-amber-500' },
                { icon: TrendingUp, label: 'Progress', value: '80%', color: 'text-primary' },
              ].map(({ icon: Icon, label, value, color }) => (
                <div key={label} className="flex flex-col items-center gap-0.5">
                  <Icon size={14} className={color} />
                  <span className="text-xs font-bold text-foreground">{value}</span>
                  <span className="text-[9px] text-muted-foreground">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Team */}
          <div className="p-4" style={panel}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-foreground">Team</span>
              <button className="text-[10px] text-primary font-semibold flex items-center gap-0.5 hover:underline">
                View all <ChevronRight size={10} />
              </button>
            </div>
            <div className="flex flex-col gap-2">
              {[
                { name: 'Ana Costa', role: 'Designer', img: AVATARS[0] },
                { name: 'Bruno Lima', role: 'Developer', img: AVATARS[1] },
                { name: 'Carla Braga', role: 'Manager', img: AVATARS[2] },
              ].map(m => (
                <div key={m.name} className="flex items-center gap-2.5">
                  <img src={m.img} alt={m.name} className="w-7 h-7 rounded-full object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-semibold text-foreground truncate">{m.name}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{m.role}</p>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
