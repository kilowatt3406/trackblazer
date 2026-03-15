import { cn } from '../utils';
import { Check } from 'lucide-react';

interface EpithetItemProps {
  name: string;
  rank: 1 | 2 | 3;
  selected?: boolean;
  complete?: boolean;
  progress?: number;
  target?: number;
  onClick?: () => void;
}

const rankColors: Record<1 | 2 | 3, { bg: string; text: string }> = {
  1: { bg: 'bg-amber-50', text: 'text-amber-700' },
  2: { bg: 'bg-slate-50', text: 'text-slate-600' },
  3: { bg: 'bg-yellow-50', text: 'text-yellow-700' },
};

const rankLabels: Record<1 | 2 | 3, string> = {
  1: 'Bronze',
  2: 'Silver',
  3: 'Gold',
};

export function EpithetItem({ 
  name, 
  rank, 
  selected = false, 
  complete = false,
  progress, 
  target, 
  onClick 
}: EpithetItemProps) {
  const colors = rankColors[rank];
  
  const Container = onClick ? 'button' : 'div';
  
  const showProgress = (selected || complete) && progress !== undefined && target !== undefined;
  
  return (
    <Container
      onClick={onClick}
      className={cn(
        "w-full flex items-center justify-between px-3 py-2.5 text-left rounded-lg border text-sm transition-all duration-150",
        complete && selected ? "bg-gradient-to-r from-green-50 to-blue-50 border-green-300 border-l-4" : 
        complete ? "bg-green-50 border-green-200" : 
        selected ? "bg-blue-50 border-blue-300 shadow-sm border-l-4" : 
        "border-slate-200 hover:border-slate-300 hover:bg-slate-50",
        onClick && "cursor-pointer"
      )}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <span className={cn("px-2 py-0.5 rounded text-xs font-semibold shrink-0", colors.bg, colors.text)}>
          {rankLabels[rank]}
        </span>
        <span className="font-medium text-slate-800 truncate">{name}</span>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {showProgress && (
          <span className="text-xs text-slate-500 font-medium">
            {progress}/{target}
          </span>
        )}
        {complete ? (
          <Check className="w-4 h-4 text-green-500" />
        ) : selected ? (
          <div className="w-4 h-4 rounded-full border-2 border-blue-300" />
        ) : onClick ? (
          <div className="w-4 h-4 rounded-full border-2 border-slate-200" />
        ) : null}
      </div>
    </Container>
  );
}
