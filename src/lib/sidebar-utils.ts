import type { SidebarActiveStyle, SidebarActiveTextColor } from '@/context/ThemeContext';

/**
 * Returns the CSS class string for an active sidebar item based on the
 * configured sidebarActiveStyle. Used by ALL sidebar components to ensure
 * consistent styling across layouts.
 */
export function getActiveSidebarClass(
  sidebarActiveStyle: SidebarActiveStyle,
  sidebarActiveTextColor: SidebarActiveTextColor = 'foreground'
): string {
  let baseClass = '';

  switch (sidebarActiveStyle) {
    case 'gradient':
      baseClass = 'bg-gradient-to-l from-primary/70 via-primary/20 to-black/5 dark:to-white/5 border-r-[3px] border-primary font-semibold shadow-[2px_0_14px_2px_hsl(var(--primary)/_0.4)]';
      break;
    case 'left-border':
      baseClass = 'bg-gradient-to-r from-primary/10 to-transparent border-l-[3px] border-primary font-semibold rounded-none';
      break;
    case 'solid':
      baseClass = 'bg-primary font-semibold';
      break;
    case 'soft':
      baseClass = 'bg-primary/20 font-semibold';
      break;
    case 'glass':
      baseClass = 'bg-foreground/5 dark:bg-background/40 backdrop-blur-md border border-border/50 dark:border-white/10 font-semibold';
      break;
    case 'minimal':
      baseClass = 'font-bold bg-transparent text-primary';
      break;
    case 'workly-neon':
      // Class .sidebar-neon-active from globals.css handles all the visual
      return 'sidebar-neon-active font-semibold';
    default:
      baseClass = 'bg-accent/40 font-semibold border border-border/50';
  }

  let textClass = '';
  if (sidebarActiveTextColor === 'white') textClass = '!text-white';
  else if (sidebarActiveTextColor === 'black') textClass = '!text-black';
  else if (sidebarActiveTextColor === 'primary') textClass = 'text-primary';
  else if (sidebarActiveStyle === 'solid') textClass = 'text-primary-foreground';
  else textClass = 'text-foreground';

  return `${baseClass} ${textClass}`.trim();
}

/** Inactive item class — uniform across all layouts */
export const INACTIVE_SIDEBAR_CLASS =
  'text-muted-foreground hover:bg-black/5 dark:hover:bg-white/10 hover:text-foreground border border-transparent';
