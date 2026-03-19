import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CustomCheckboxProps {
  id?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: React.ReactNode;
  className?: string;
}

export function CustomCheckbox({ id, checked, onChange, label, className }: CustomCheckboxProps) {
  return (
    <label
      htmlFor={id}
      className={cn('flex items-center gap-2.5 cursor-pointer select-none group', className)}
    >
      <div className="relative shrink-0">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only"
        />
        <div
          className={cn(
            'w-4 h-4 rounded-[4px] border-2 flex items-center justify-center transition-all duration-150',
            checked
              ? 'bg-primary border-primary'
              : 'bg-transparent border-border group-hover:border-primary/60'
          )}
        >
          {checked && <Check size={10} className="text-primary-foreground stroke-[3]" />}
        </div>
      </div>
      {label && <span className="text-sm text-muted-foreground leading-snug">{label}</span>}
    </label>
  );
}
