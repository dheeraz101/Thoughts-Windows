import React from 'react';
import { Settings } from 'lucide-react';

interface MinimalMetadataProps {
  wordCount: number;
  charCount: number;
  onOpenSettings: () => void;
  isZenMode?: boolean;
  onToggleZenMode?: () => void;
}

export const MinimalMetadata: React.FC<MinimalMetadataProps> = ({
  wordCount,
  charCount,
  onOpenSettings,
  isZenMode,
  onToggleZenMode,
}) => {
  return (
    <div className="px-3 py-1 border-t border-white/[0.04] bg-black/40 text-[10px] font-mono text-slate-500 flex items-center justify-between z-20 select-none shrink-0">
      <div className="flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
        <span className="text-slate-400 font-semibold">{wordCount}w</span>
        <span>•</span>
        <span className="text-slate-400 font-semibold">{charCount}c</span>
      </div>

      <div className="flex items-center gap-2">
        {isZenMode && onToggleZenMode && (
          <button
            onClick={onToggleZenMode}
            className="text-amber-400/90 hover:text-amber-300 transition px-1 py-0.5 rounded hover:bg-amber-500/10 text-[9px] font-mono"
            title="Exit Focus Zen Mode (Esc)"
          >
            Exit Zen (Esc)
          </button>
        )}
        <button
          onClick={onOpenSettings}
          className="flex items-center gap-1 hover:text-slate-200 transition px-1 py-0.5 rounded hover:bg-white/10 text-slate-400"
          title="Open Settings (Ctrl+,)"
        >
          <Settings className="w-3.5 h-3.5 text-slate-400 hover:text-slate-200" />
          <span>Settings <code className="bg-slate-800/80 text-blue-300 px-1 rounded text-[9px]">Ctrl+,</code></span>
        </button>
      </div>
    </div>
  );
};
