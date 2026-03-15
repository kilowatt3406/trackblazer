import { cn } from "@/utils";
import { Check } from "lucide-react";
import { useTooltip } from "./Tooltip";

interface EpithetItemProps {
  name: string;
  rank: 1 | 2 | 3;
  description?: string;
  selected?: boolean;
  complete?: boolean;
  progress?: number;
  target?: number;
  onClick?: () => void;
}

const rankColors: Record<
  1 | 2 | 3,
  { bg: string; text: string; bgDark: string; textDark: string }
> = {
  1: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    bgDark: "dark:bg-amber-900/40",
    textDark: "dark:text-amber-400",
  },
  2: {
    bg: "bg-slate-50",
    text: "text-slate-600",
    bgDark: "dark:bg-slate-700",
    textDark: "dark:text-slate-300",
  },
  3: {
    bg: "bg-yellow-50",
    text: "text-yellow-700",
    bgDark: "dark:bg-yellow-900/40",
    textDark: "dark:text-yellow-400",
  },
};

const rankLabels: Record<1 | 2 | 3, string> = {
  1: "Bronze",
  2: "Silver",
  3: "Gold",
};

export function EpithetItem({
  name,
  rank,
  description,
  selected = false,
  complete = false,
  progress,
  target,
  onClick,
}: EpithetItemProps) {
  const colors = rankColors[rank];
  const { showTooltip, hideTooltip } = useTooltip();

  const Container = onClick ? "button" : "div";

  const showProgress =
    (selected || complete) && progress !== undefined && target !== undefined;

  const handleMouseEnter = (e: React.MouseEvent) => {
    if (description) {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      showTooltip(description, { x: rect.left, y: rect.bottom });
    }
  };

  return (
    <div className="relative">
      <Container
        onClick={onClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={hideTooltip}
        className={cn(
          "w-full flex items-center justify-between px-3 py-2.5 text-left rounded-lg border text-sm transition-all duration-150",
          complete && selected
            ? "bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/30 dark:to-blue-900/30 border-green-300 dark:border-green-700 border-l-4"
            : complete
              ? "bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800"
              : selected
                ? "bg-blue-50 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700 shadow-sm border-l-4"
                : "border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700",
          onClick && "cursor-pointer",
        )}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <span
            className={cn(
              "px-2 py-0.5 rounded text-xs font-semibold shrink-0",
              colors.bg,
              colors.text,
              colors.bgDark,
              colors.textDark,
            )}
          >
            {rankLabels[rank]}
          </span>
          <span className="font-medium text-slate-800 dark:text-slate-200 truncate">
            {name}
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {showProgress && (
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {progress}/{target}
            </span>
          )}
          {complete ? (
            <Check className="w-4 h-4 text-green-500" />
          ) : selected ? (
            <div className="w-4 h-4 rounded-full border-2 border-blue-300 dark:border-blue-600" />
          ) : onClick ? (
            <div className="w-4 h-4 rounded-full border-2 border-slate-200 dark:border-slate-600" />
          ) : null}
        </div>
      </Container>
    </div>
  );
}
