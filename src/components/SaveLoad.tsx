import { useState, useRef } from "react";
import { usePlannerStore } from "@/store/planner";
import { cn } from "@/utils";
import { Download, Save, FolderOpen } from "lucide-react";

export function SaveLoad() {
  const { exportPlan, importPlan } = usePlannerStore();
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const json = exportPlan();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `raceplan-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setMessage({ type: "success", text: "Plan exported!" });
    setTimeout(() => setMessage(null), 2000);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const json = event.target?.result as string;
      const success = importPlan(json);
      if (success) {
        setMessage({ type: "success", text: "Plan imported!" });
      } else {
        setMessage({ type: "error", text: "Invalid plan file" });
      }
      setTimeout(() => setMessage(null), 2000);
    };
    reader.readAsText(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Save className="w-5 h-5 text-slate-400" />
        <h2 className="text-base font-semibold text-slate-900 dark:text-white">
          Save / Load
        </h2>
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleExport}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors duration-150"
        >
          <Download className="w-4 h-4" />
          Export
        </button>

        <label className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer transition-colors duration-150">
          <FolderOpen className="w-4 h-4" />
          Import
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
          />
        </label>
      </div>

      {message && (
        <div
          className={cn(
            "text-sm px-3 py-2 rounded-lg",
            message.type === "success"
              ? "bg-green-50 dark:bg-green-900/40 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800"
              : "bg-red-50 dark:bg-red-900/40 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800",
          )}
        >
          {message.text}
        </div>
      )}
    </div>
  );
}
