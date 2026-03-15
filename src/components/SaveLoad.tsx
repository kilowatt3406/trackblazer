import { useState, useRef } from 'react';
import { usePlannerStore } from '../store/planner';
import { Download, Upload, Trash2 } from 'lucide-react';

export function SaveLoad() {
  const { exportPlan, importPlan, clearAllRaces } = usePlannerStore();
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleExport = () => {
    const json = exportPlan();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `raceplan-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setMessage({ type: 'success', text: 'Plan exported!' });
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
        setMessage({ type: 'success', text: 'Plan imported!' });
      } else {
        setMessage({ type: 'error', text: 'Invalid plan file' });
      }
      setTimeout(() => setMessage(null), 2000);
    };
    reader.readAsText(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const handleClear = () => {
    if (confirm('Clear all selected races?')) {
      clearAllRaces();
      setMessage({ type: 'success', text: 'All races cleared!' });
      setTimeout(() => setMessage(null), 2000);
    }
  };
  
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Save / Load</h2>
      
      <div className="flex gap-2">
        <button
          onClick={handleExport}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded border border-gray-300 hover:bg-gray-50 text-sm"
        >
          <Download className="w-4 h-4" />
          Export
        </button>
        
        <label className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded border border-gray-300 hover:bg-gray-50 text-sm cursor-pointer">
          <Upload className="w-4 h-4" />
          Import
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
          />
        </label>
        
        <button
          onClick={handleClear}
          className="flex items-center justify-center gap-2 px-3 py-2 rounded border border-red-300 hover:bg-red-50 text-red-600 text-sm"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
      
      {message && (
        <div className={cn(
          "text-xs px-3 py-2 rounded",
          message.type === 'success' ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
        )}>
          {message.text}
        </div>
      )}
    </div>
  );
}

function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
