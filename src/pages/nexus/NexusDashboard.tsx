import {
  ArrowUpRight,
  Layers,
  FolderOpen,
  Calendar,
  ChevronDown,
  User,
  FileText,
  Image as ImageIcon,
  Mic,
  Send,
  Maximize2,
  Copy,
  Share2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, type ReactNode } from 'react';
import { useCardStyle, useTheme } from '@/context/ThemeContext';
import { hslToHex } from '@/lib/color-utils';

const useAccentHex = () => {
  const { activeAccentColor } = useTheme();
  return hslToHex(activeAccentColor);
};

type ChatMessage = {
  id: number;
  sender: 'user' | 'ai';
  name: string;
  time: string;
  text: string;
  file?: string;
  list?: { label: string; val: string; active: boolean }[];
};

export const NexusDashboard = () => {
  const accentHex = useAccentHex();
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      sender: 'user',
      name: 'Jordan Lee',
      time: '10:12',
      text: 'Hey Daxa, can you check for discrepancies in revenue vs. projected values?',
      file: 'ID: #6287439'
    },
    {
      id: 2,
      sender: 'ai',
      name: 'Daxa',
      time: '10:13',
      text: 'Main Deviations by Month:',
      list: [
        { label: 'July', val: '$18.9K', active: false },
        { label: 'August', val: '$21.7K', active: false },
        { label: 'September', val: '$11.9K', active: true }
      ]
    }
  ]);

  const handleSend = () => {
    if (!chatInput.trim()) return;
    setMessages([...messages, {
      id: Date.now(),
      sender: 'user',
      name: 'Walancy',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: chatInput
    }]);
    setChatInput('');
  };

  return (
    <div className="flex flex-col gap-4 w-full h-full min-h-0 animate-in fade-in zoom-in-95 duration-500 font-sans pb-4 xl:pb-0 overflow-y-auto xl:overflow-hidden scrollbar-thin">

      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 relative z-10 shrink-0">
        <div>
          <span className="text-[10px] uppercase font-semibold tracking-wider text-muted-foreground mb-1 block">
            Data Based on All Clients
          </span>
          <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-foreground" style={{ fontFamily: 'Inter, sans-serif', letterSpacing: '-0.03em' }}>
            Overview Panel
          </h1>
        </div>


        <div className="flex items-center gap-2 mt-4 lg:mt-0 relative z-20 xl:ml-auto">
          <button className="h-10 px-4 rounded-xl bg-card border border-border shadow-sm flex items-center gap-2 text-xs font-semibold text-foreground hover:bg-accent transition-colors">
            <Calendar size={14} className="text-muted-foreground" />
            01.12.2023 <span className="text-muted-foreground font-normal hidden sm:inline">01.12.2024</span>
          </button>
          <button className="h-10 px-4 rounded-xl bg-card border border-border shadow-sm flex items-center gap-2 text-xs font-semibold text-foreground hover:bg-accent transition-colors">
            All Partner
            <ChevronDown size={14} className="text-muted-foreground" />
          </button>
        </div>
      </div>

      <div className="w-8 h-1 bg-border rounded-full shrink-0" />

      {/* Main Grid Layout - 8 columns */}
      <div className="grid grid-cols-1 xl:grid-cols-8 gap-4 flex-1 min-h-0 h-full overflow-y-auto xl:overflow-visible pr-1 xl:pr-0">

        {/* ================= LEFT SIDE (6 cols) ================= */}
        <div className="col-span-1 xl:col-span-6 flex flex-col gap-4 min-h-0 xl:h-full shrink-0 xl:shrink">

          {/* Top 3 Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 shrink-0">
            {/* Processed Items */}
            <DashboardCard title="Processed Items" icon={<Copy size={14} className="fill-current text-foreground" />} showLink={false}>
              <div className="flex flex-col justify-between h-full pt-2">
                {/* Big Number */}
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-5xl font-medium tracking-tight text-foreground flex items-start">
                    97,22<span className="text-xl font-normal text-foreground mt-1 ml-0.5">%</span>
                  </div>
                </div>

                {/* Stats & Bar */}
                <div className="shrink-0">
                  <div className="flex justify-between text-[11px] text-muted-foreground font-medium mb-2">
                    <div>
                      <span className="text-foreground text-sm font-semibold block mb-0.5 tracking-tight leading-none">14.9k</span>
                      Auto-Processed
                    </div>
                    <div className="text-right">
                      <span className="text-foreground text-sm font-semibold block mb-0.5 tracking-tight leading-none">18k</span>
                      Pending Check
                    </div>
                  </div>

                  {/* Refined Horizontal Bar (Compact & Thick) */}
                  <div className="h-[22px] w-full flex items-center overflow-hidden rounded-[2px]">
                    <div className="h-full w-4 bg-foreground" />
                    <div style={{ backgroundColor: accentHex }} className="h-full w-1.5" />
                    <div className="h-full flex-1 bg-muted-foreground/10" />
                    <div style={{ backgroundColor: accentHex }} className="h-full w-px" />
                    <div className="flex justify-evenly items-center h-full w-[28%] pl-[1px] pr-[2px] bg-card border-y border-r border-border/40">
                      {Array.from({ length: 40 }).map((_, i) => (
                        <div key={i} className="h-full w-[1px] bg-border max-h-[60%] shrink-0 opacity-60" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </DashboardCard>

            {/* Synced Records */}
            <DashboardCard title="Synced Records" icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 6C4 4.89543 4.89543 4 6 4H18C19.1046 4 20 4.89543 20 6V10C20 11.1046 19.1046 12 18 12H6C4.89543 12 4 11.1046 4 10V6Z" fill="currentColor" /><path d="M6 14C4.89543 14 4 14.89543 4 16V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V16C20 14.89543 19.1046 14 18 14H6ZM14 18C14 19.1046 13.1046 20 12 20C10.8954 20 10 19.1046 10 18C10 16.8954 10.8954 16 12 16C13.1046 16 14 16.8954 14 18Z" fill="currentColor" /></svg>} showLink={false}>
              <div className="flex flex-col justify-between h-full relative pt-2">
                <div className="flex justify-between text-[11px] text-muted-foreground font-medium relative z-20">
                  <div>
                    <span className="text-foreground text-sm font-semibold block mb-0.5 tracking-tight leading-none">174</span>
                    Verified
                  </div>
                  <div className="text-right">
                    <span className="text-foreground text-sm font-semibold block mb-0.5 tracking-tight leading-none">31</span>
                    Pending Check
                  </div>
                </div>

                {/* Semi-Circle SVG (Compact) */}
                <div className="relative w-full overflow-hidden flex flex-col items-center mt-auto">
                  <svg viewBox="0 0 200 100" className="w-full sm:w-[95%] overflow-visible relative z-0">
                    <path d="M 15 100 A 85 85 0 0 1 185 100" pathLength="100" fill="none" stroke="currentColor" className="text-muted-foreground/30" strokeWidth="1" strokeDasharray="0 75 25 100" />
                    <path d="M 15 100 A 85 85 0 0 1 185 100" pathLength="100" fill="none" stroke="currentColor" className="text-muted-foreground/30" strokeWidth="6" strokeLinecap="round" strokeDasharray="0 0 18 100" />
                    <path d="M 15 100 A 85 85 0 0 1 185 100" pathLength="100" fill="none" stroke="currentColor" className="text-muted-foreground/30" strokeWidth="6" strokeLinecap="round" strokeDasharray="0 21.5 33 100" />
                    <path d="M 15 100 A 85 85 0 0 1 185 100" pathLength="100" fill="none" stroke="currentColor" className="text-foreground" strokeWidth="9" strokeLinecap="round" strokeDasharray="0 58 17 100" />
                    <circle cx="160.1" cy="39.9" r="4.5" fill={accentHex} stroke="hsl(var(--card))" strokeWidth="2.5" />
                  </svg>

                  {/* Centered Value inside Arc */}
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[40px] sm:text-[44px] font-medium tracking-tight z-10 px-2 py-0 flex items-start justify-center">
                    71,74<span className="text-lg sm:text-xl font-normal text-foreground mt-1 ml-0.5">%</span>
                  </div>
                </div>
              </div>
            </DashboardCard>

            {/* Anomalies */}
            <DashboardCard title="Anomalies" icon={<Share2 size={14} className="fill-current text-foreground" />} showLink={false}>
              <div className="flex flex-col justify-between h-full pt-2">
                {/* Big Number */}
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-5xl font-medium tracking-tight text-foreground flex items-start">
                    10,12<span className="text-xl font-normal text-foreground mt-1 ml-0.5">%</span>
                  </div>
                </div>

                {/* Stats & Bar */}
                <div className="shrink-0">
                  <div className="flex justify-between text-[11px] text-muted-foreground font-medium mb-2">
                    <div>
                      <span className="text-foreground text-sm font-semibold block mb-0.5 tracking-tight leading-none">1.62k</span>
                      Detected
                    </div>
                    <div className="text-right">
                      <span className="text-foreground text-sm font-semibold block mb-0.5 tracking-tight leading-none">13.7k</span>
                      Total Items
                    </div>
                  </div>

                  {/* Refined Horizontal Bar (Compact & Thick) */}
                  <div className="h-[22px] w-full flex items-center overflow-hidden rounded-[2px]">
                    <div style={{ backgroundColor: accentHex }} className="h-full w-4" />
                    <div className="h-full w-1.5 bg-foreground" />
                    <div className="h-full flex-1 bg-muted-foreground/10" />
                    <div style={{ backgroundColor: accentHex }} className="h-full w-px" />
                    <div className="flex justify-evenly items-center h-full w-[45%] pl-[1px] pr-[2px] bg-card border-y border-r border-border/40">
                      {Array.from({ length: 60 }).map((_, i) => (
                        <div key={i} className="h-full w-[1px] bg-border max-h-[60%] shrink-0 opacity-60" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </DashboardCard>
          </div>

          {/* Middle 2 Cards (Charts) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 min-h-[200px] xl:min-h-[150px]">
            {/* Utilization */}
            <DashboardCard title="Utilization" icon={<Layers size={14} className="fill-current text-foreground" />} className="flex flex-col h-full group cursor-pointer">
              <div className="mt-1 flex justify-between px-1 shrink-0">
                <div className="flex flex-col justify-between gap-4">
                  <div>
                    <span className="text-foreground text-[15px] font-medium block leading-tight">65%</span>
                    <span className="text-[11px] text-muted-foreground transition-colors group-hover:text-foreground">Syncs</span>
                  </div>
                  <div>
                    <span className="text-foreground text-[15px] font-medium block leading-tight">82%</span>
                    <span className="text-[11px] text-muted-foreground transition-colors group-hover:text-foreground">Fetches</span>
                  </div>
                </div>
                <div className="text-center pt-0">
                  <span className="text-[11px] text-muted-foreground font-medium mb-1 block">Average Account Stats</span>
                  <div className="text-5xl font-medium tracking-tight text-foreground flex items-start justify-center group-hover:scale-110 transition-transform origin-center">
                    56,1<span className="text-xl font-normal text-muted-foreground mt-1 ml-0.5">%</span>
                  </div>
                </div>
                <div className="flex flex-col justify-between text-right gap-4">
                  <div>
                    <span className="text-foreground text-[15px] font-medium block leading-tight">34%</span>
                    <span className="text-[11px] text-muted-foreground transition-colors group-hover:text-foreground">Manuals</span>
                  </div>
                  <div>
                    <span className="text-foreground text-[15px] font-medium block leading-tight">12%</span>
                    <span className="text-[11px] text-muted-foreground transition-colors group-hover:text-foreground">Autosync</span>
                  </div>
                </div>
              </div>

              {/* Flexible Chart Box (Interactive) */}
              <div className="flex-1 w-full mt-auto pt-4 flex items-end gap-[1.5px] relative min-h-0">

                {Array.from({ length: 80 }).map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      "flex-1 rounded-t-[1px] relative transition-all duration-300 cursor-none",
                      i > 20 && i < 45 ? "bg-foreground w-[2px] group-hover:opacity-80" : "bg-border w-px group-hover:bg-muted-foreground/30"
                    )}
                    style={{
                      height: `${(i > 20 && i < 45) ? (30 + Math.random() * 40) : (10 + Math.random() * 15)}%`,
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = accentHex)}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '')}
                  >
                    {(i === 28 || i === 31) && <div className="absolute inset-0 rounded-t-[1px]" style={{ backgroundColor: accentHex }} />}
                  </div>
                ))}
                <div className="absolute bottom-[-10px] h-[calc(100%+10px)] w-px left-[55%] pointer-events-none" style={{ backgroundColor: accentHex }} />
              </div>
              <div className="flex justify-between text-[10px] text-muted-foreground mt-2 font-semibold shrink-0">
                <span>Jun</span>
                <span>Jul</span>
              </div>
            </DashboardCard>

            {/* Timely Closures */}
            <DashboardCard title="Timely Closures" icon={<FolderOpen size={14} className="fill-current text-foreground" />} className="flex flex-col h-full group cursor-pointer">
              <div className="mt-1 flex justify-between px-1 shrink-0">
                <div className="flex flex-col justify-between gap-4">
                  <div>
                    <span className="text-foreground text-[15px] font-medium block leading-tight">84</span>
                    <span className="text-[11px] text-muted-foreground transition-colors group-hover:text-foreground">Done</span>
                  </div>
                  <div>
                    <span className="text-foreground text-[15px] font-medium block leading-tight">24%</span>
                    <span className="text-[11px] text-muted-foreground transition-colors group-hover:text-foreground">Active</span>
                  </div>
                </div>
                <div className="text-center pt-0">
                  <span className="text-[11px] text-muted-foreground font-medium mb-1 block">Average Account Stats</span>
                  <div className="text-5xl font-medium tracking-tight text-foreground flex items-start justify-center group-hover:scale-110 transition-transform origin-center">
                    82,6<span className="text-xl font-normal text-muted-foreground mt-1 ml-0.5">%</span>
                  </div>
                </div>
                <div className="flex flex-col justify-between text-right gap-4">
                  <div>
                    <span className="text-foreground text-[15px] font-medium block leading-tight">84/0%</span>
                    <span className="text-[11px] text-muted-foreground transition-colors group-hover:text-foreground">OnTime</span>
                  </div>
                  <div>
                    <span className="text-foreground text-[15px] font-medium block leading-tight">19/5</span>
                    <span className="text-[11px] text-muted-foreground transition-colors group-hover:text-foreground">Timely</span>
                  </div>
                </div>
              </div>

              {/* Flexible Chart Box (Interactive) */}
              <div className="flex-1 w-full mt-auto pt-4 flex items-end gap-[1.5px] relative min-h-0">
                {Array.from({ length: 80 }).map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      "flex-1 rounded-t-[1px] relative transition-all duration-300 cursor-none",
                      Math.random() > 0.6 ? "bg-foreground w-[2px] group-hover:opacity-80" : "bg-border w-px group-hover:bg-muted-foreground/30"
                    )}
                    style={{ height: `${20 + Math.random() * 25}%` }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = accentHex)}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '')}
                  />
                ))}
                <div className="absolute bottom-[-10px] h-[calc(100%+10px)] w-px left-[80%] pointer-events-none" style={{ backgroundColor: accentHex }} />
              </div>
              <div className="flex justify-between text-[10px] text-muted-foreground mt-2 font-semibold shrink-0">
                <span>Jun</span>
                <span>Jul</span>
              </div>
            </DashboardCard>
          </div>

          {/* Bottom Contact Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 shrink-0 pb-4 xl:pb-0 pt-2 xl:pt-0">
            {[
              { name: 'Eva Robinson', email: 'eva.r@syncdesk.co' },
              { name: 'Helena Crims', email: 'helena.c@veriq.tech' },
              { name: 'Anna Morris', email: 'anna@domain.io' }
            ].map((contact, i) => (
              <DashboardCard key={i} className="py-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center shrink-0 border border-border shadow-sm">
                    <User size={14} className="text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-foreground truncate">{contact.name}</h4>
                    <p className="text-[10px] text-muted-foreground truncate">{contact.email}</p>
                  </div>
                  <div className="shrink-0 text-muted-foreground/30 hover:text-foreground cursor-pointer transition-colors p-1">
                    <ChevronDown size={14} className="-rotate-90" />
                  </div>
                </div>
              </DashboardCard>
            ))}
          </div>

        </div>

        {/* ================= RIGHT SIDE (2 cols) ================= */}
        <div className="col-span-1 xl:col-span-2 flex flex-col gap-4 h-full w-full max-w-[400px] xl:max-w-none mx-auto min-h-[500px] xl:min-h-0">
          <DashboardCard title="AI Assistant" icon={<SparklesIcon />} showLink={false} customAction={<button className="text-muted-foreground opacity-50 hover:opacity-100 transition-opacity cursor-pointer p-1"><Maximize2 size={12} /></button>} className="flex-1 flex flex-col pt-5 h-full">

            {/* Chat Items area */}
            <div className="flex-1 flex flex-col gap-5 pr-1 mt-4 overflow-y-auto overflow-x-hidden scrollbar-thin">
              {messages.map((msg) => (
                <div key={msg.id} className="flex gap-3">
                  {msg.sender === 'user' ? (
                    <div className="w-8 h-8 rounded-full bg-accent shrink-0 overflow-hidden">
                      <img src="https://i.pravatar.cc/150?u=jordan" alt="Avatar" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-[10px] shrink-0 flex items-center justify-center relative overflow-hidden" style={{ backgroundColor: accentHex }}>
                      <SparklesIcon color="#fff" />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-0.5 text-[11px]">
                      <span className="font-semibold text-foreground">{msg.name}</span>
                      {msg.sender === 'ai' && <span className="text-[9px] text-muted-foreground font-medium">{msg.time}</span>}
                    </div>

                    <p className="text-[11px] text-foreground leading-[1.5] pr-2 break-words text-wrap">
                      {msg.text}
                    </p>

                    {/* User File Attachment */}
                    {msg.file && (
                      <div className="flex justify-between items-end mt-2">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-border bg-card w-fit cursor-pointer shadow-sm">
                          <FileText size={16} strokeWidth={1.5} style={{ color: accentHex }} />
                          <div className="w-4 h-5 -ml-3 bg-foreground rounded-sm flex items-center justify-center shrink-0 border border-card shadow-sm z-10">
                            <div className="w-2.5 h-[1px] bg-background mt-1" />
                          </div>
                          <span className="text-[10px] text-muted-foreground ml-1">{msg.file}</span>
                        </div>
                        <span className="text-[9px] text-muted-foreground font-medium pt-3">{msg.time}</span>
                      </div>
                    )}

                    {/* AI List Response */}
                    {msg.list && (
                      <div className="mt-3">
                        <ul className="text-[11px] text-muted-foreground space-y-2 mb-4">
                          {msg.list.map((item, idx) => (
                            <li key={idx} className={cn("flex items-center justify-between relative pl-3 before:absolute before:left-0 before:top-1.5 before:w-1.5 before:h-1.5 before:rounded-full", item.active ? "before:bg-foreground" : "before:border before:border-muted-foreground before:bg-transparent")}>
                              <span className={cn("font-normal", item.active && "text-foreground")}>{item.label}</span>
                              <span className="text-foreground font-semibold">{item.val}</span>
                            </li>
                          ))}
                        </ul>
                        {/* Mini Stacked Bar */}
                        <div className="h-4 w-full flex items-center gap-[1px]">
                          <div className="h-full w-4 rounded-l-[1px]" style={{ backgroundColor: accentHex }} />
                          <div className="h-full w-8 bg-foreground" />
                          <div className="h-full flex-1 bg-muted-foreground/15" />
                          <div className="h-[120%] w-px" style={{ backgroundColor: accentHex }} />
                          <div className="flex justify-end items-center gap-[2px] h-full w-[25%] pl-1">
                            {Array.from({ length: 12 }).map((_, i) => (
                              <div key={i} className="h-full w-px bg-border max-h-[70%]" />
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Action Area */}
            <div className="mt-8 pt-4 flex flex-col gap-4">
              <div className="flex gap-2">
                <button className="flex-1 h-9 rounded-xl bg-accent hover:bg-muted-foreground/10 border border-transparent flex items-center justify-center gap-2 text-[11px] font-medium text-foreground transition-all shrink-0">
                  <FileText size={12} className="text-foreground" strokeWidth={2.5} /> Files
                </button>
                <button className="flex-1 h-9 rounded-xl bg-accent hover:bg-muted-foreground/10 border border-transparent flex items-center justify-center gap-2 text-[11px] font-medium text-foreground transition-all shrink-0">
                  <ImageIcon size={12} className="text-foreground" strokeWidth={2.5} /> Images
                </button>
                <button className="flex-[1.2] h-9 rounded-xl border border-border bg-transparent hover:bg-accent flex items-center justify-center gap-2 text-[11px] font-medium text-foreground transition-all shrink-0 shadow-sm">
                  <Mic size={12} className="text-foreground" strokeWidth={2.5} /> Audio Chat
                </button>
              </div>

              <div className="flex gap-2 items-center bg-accent/50 border border-transparent rounded-[14px] p-1.5 shadow-sm">
                <button className="w-8 h-8 shrink-0 rounded-lg text-muted-foreground hover:bg-border transition-colors flex items-center justify-center">
                  <span className="text-xl font-light leading-none">+</span>
                </button>
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Enter your AI Assistant Request"
                  className="flex-1 bg-transparent px-1 text-[11px] font-medium placeholder:text-muted-foreground text-foreground outline-none w-0"
                />
                <button onClick={handleSend} className="w-9 h-9 shrink-0 rounded-[10px] bg-foreground text-background flex items-center justify-center shadow-lg hover:-translate-y-0.5 transition-transform duration-300">
                  <Send size={14} className="ml-0.5 fill-current" strokeWidth={0} />
                </button>
              </div>
            </div>

          </DashboardCard>
        </div>

      </div>
    </div>
  );
};

/* --- Helpers --- */

const SparklesIcon = ({ color = "currentColor" }: { color?: string }) => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" fill={color} />
  </svg>
);

const DashboardCard = ({ title, icon, children, className, showLink = true, customAction }: { title?: string, icon?: ReactNode, children: ReactNode, className?: string, showLink?: boolean, customAction?: ReactNode }) => {
  const cardStyle = useCardStyle();

  return (
    <div
      className={cn("border border-border p-4 lg:p-[18px] flex flex-col relative group transition-all hover:border-foreground/20", className)}
      style={cardStyle}
    >
      {title && (
        <div className="flex justify-between items-center z-10 relative mb-2 shrink-0">
          <div className="flex items-center gap-2.5 text-[11px] font-medium text-muted-foreground tracking-wide">
            <span className="text-foreground/80">{icon}</span>
            {title}
          </div>
          {customAction ? customAction : showLink && <button className="text-muted-foreground opacity-50 cursor-pointer hover:opacity-100 transition-opacity"><ArrowUpRight size={14} /></button>}
        </div>
      )}
      <div className="flex-1 min-h-0 w-full z-10 relative flex flex-col">
        {children}
      </div>
    </div>
  );
};

