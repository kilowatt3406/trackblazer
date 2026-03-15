import { createContext, useContext, useState, ReactNode } from "react";
import { createPortal } from "react-dom";

interface TooltipContextType {
  showTooltip: (content: ReactNode, position: { x: number; y: number }) => void;
  hideTooltip: () => void;
}

const TooltipContext = createContext<TooltipContextType | null>(null);

export function useTooltip() {
  const context = useContext(TooltipContext);
  if (!context) {
    throw new Error("useTooltip must be used within a TooltipProvider");
  }
  return context;
}

export function TooltipProvider({ children }: { children: ReactNode }) {
  const [tooltip, setTooltip] = useState<{
    content: ReactNode;
    position: { x: number; y: number };
  } | null>(null);

  const showTooltip = (
    content: ReactNode,
    position: { x: number; y: number },
  ) => {
    setTooltip({ content, position });
  };

  const hideTooltip = () => {
    setTooltip(null);
  };

  return (
    <TooltipContext.Provider value={{ showTooltip, hideTooltip }}>
      {children}
      {tooltip &&
        createPortal(
          <div
            className="fixed z-[9999] w-64 p-2 bg-slate-800 text-white text-xs rounded shadow-lg pointer-events-none"
            style={{
              left: tooltip.position.x,
              top: tooltip.position.y,
              transform: "translateY(8px)",
            }}
          >
            {tooltip.content}
          </div>,
          document.body,
        )}
    </TooltipContext.Provider>
  );
}
