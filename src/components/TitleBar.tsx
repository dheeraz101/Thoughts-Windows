import React from 'react';
import { X, Minus, Settings, Search, Terminal, Pin, Maximize2, LayoutGrid, Minimize2, PanelRight } from 'lucide-react';
import { AppSettings, WindowPosition } from '../types';

interface TitleBarProps {
  settings: AppSettings;
  onUpdateSettings: (newSettings: AppSettings) => void;
  onOpenNotesDrawer: () => void;
  onOpenCommandPalette: () => void;
  onOpenSettings: () => void;
  onOpenArchDoc: () => void;
  isAlwaysOnTop: boolean;
  onToggleAlwaysOnTop: () => void;
  isSaved: boolean;
  activeNoteTitle: string;
  isTrayHidden: boolean;
  onToggleTrayHide: () => void;
  onToggleZenMode?: () => void;
}

export const TitleBar: React.FC<TitleBarProps> = ({
  settings,
  onUpdateSettings,
  onOpenNotesDrawer,
  onOpenCommandPalette,
  onOpenSettings,
  isAlwaysOnTop,
  onToggleAlwaysOnTop,
  isSaved,
  activeNoteTitle,
  onToggleTrayHide,
  onToggleZenMode,
}) => {
  const cycleWindowSize = () => {
    const presets: WindowPosition[] = [
      'compact-scratchpad',
      'pure-minimal',
      'right-flyout',
      'center-overlay',
      'focused-canvas',
      'floating-mini',
    ];
    const currentIdx = presets.indexOf(settings.windowPosition || 'compact-scratchpad');
    const nextPreset = presets[(currentIdx + 1) % presets.length];
    onUpdateSettings({ ...settings, windowPosition: nextPreset });
  };

  const presetLabels: Record<WindowPosition, string> = {
    'compact-scratchpad': 'Compact Scratchpad (420x520)',
    'pure-minimal': 'Pure Ultra-Minimal Canvas (360x300)',
    'right-flyout': 'Sidebar Flyout',
    'center-overlay': 'Centered Card',
    'near-cursor': 'Near Cursor Window',
    'floating-mini': 'Mini Widget (360x340)',
    'focused-canvas': 'Focused Full Canvas',
  };

  const isUltraCompact = settings.titleBarDensity === 'ultra-compact';

  return (
    <div className={`select-none flex items-center justify-between px-2 py-0.5 bg-black/40 border-b border-white/[0.04] text-[11px] text-slate-400 font-sans ${isUltraCompact ? 'h-6 text-[10px]' : 'h-7'} z-30 group transition-all shrink-0`}>
      {/* Left: Minimal Title & Status */}
      <div className="flex items-center gap-1.5 overflow-hidden shrink min-w-0">
        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></span>
        <span className="font-semibold text-slate-300 truncate max-w-[110px] xs:max-w-[150px] sm:max-w-[240px]">
          {activeNoteTitle || 'QuickThought'}
        </span>
        <span
          className={`text-[9px] px-1 rounded font-mono shrink-0 ${
            isSaved ? 'text-slate-500' : 'text-amber-400 animate-pulse'
          }`}
        >
          {isSaved ? 'saved' : 'saving...'}
        </span>
      </div>

      {/* Right: Stealth Quick Tools & Standard Window Controls */}
      <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity shrink-0">
        {/* Quick Window Size Preset Switcher */}
        <button
          onClick={cycleWindowSize}
          className="flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-white/10 text-slate-300 hover:text-white transition text-[10px] font-mono border border-white/[0.06]"
          title={`Window Preset: ${presetLabels[settings.windowPosition || 'compact-scratchpad']} (Click to switch)`}
        >
          {settings.windowPosition === 'compact-scratchpad' && <Minimize2 className="w-3 h-3 text-blue-400" />}
          {settings.windowPosition === 'pure-minimal' && <Minimize2 className="w-3 h-3 text-amber-400" />}
          {settings.windowPosition === 'right-flyout' && <PanelRight className="w-3 h-3 text-blue-400" />}
          {settings.windowPosition === 'center-overlay' && <LayoutGrid className="w-3 h-3 text-blue-400" />}
          {settings.windowPosition === 'focused-canvas' && <Maximize2 className="w-3 h-3 text-blue-400" />}
          {settings.windowPosition === 'floating-mini' && <Minimize2 className="w-3 h-3 text-emerald-400" />}
          {!isUltraCompact && (
            <span className="hidden sm:inline text-[9px] uppercase font-bold text-slate-400">
              {settings.windowPosition === 'compact-scratchpad' ? 'Scratchpad' : settings.windowPosition === 'pure-minimal' ? 'Pure Canvas' : settings.windowPosition === 'right-flyout' ? 'Flyout' : settings.windowPosition === 'center-overlay' ? 'Center' : settings.windowPosition === 'focused-canvas' ? 'Canvas' : 'Mini'}
            </span>
          )}
        </button>

        {/* 100% Focus Zen Mode Toggle */}
        {onToggleZenMode && (
          <button
            onClick={onToggleZenMode}
            className="flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-amber-500/10 text-amber-400/90 hover:text-amber-300 transition text-[10px] font-mono border border-amber-500/20 bg-amber-500/5"
            title="100% Focus Zen Mode (Hides top bars & settings for pure writing area)"
          >
            <Maximize2 className="w-3 h-3 text-amber-400" />
            {!isUltraCompact && <span className="hidden sm:inline text-[9px] uppercase font-bold text-amber-400">Zen</span>}
          </button>
        )}

        <button
          onClick={onOpenNotesDrawer}
          className="p-1 hover:text-white hover:bg-white/10 rounded transition"
          title={`Search Notes (${settings.searchNotesShortcut || 'Ctrl+F'})`}
        >
          <Search className="w-3 h-3" />
        </button>

        <button
          onClick={onOpenCommandPalette}
          className="p-1 hover:text-white hover:bg-white/10 rounded transition"
          title={`Command Palette (${settings.commandPaletteShortcut || 'Ctrl+K'})`}
        >
          <Terminal className="w-3 h-3 text-blue-400" />
        </button>

        <button
          onClick={onToggleAlwaysOnTop}
          className={`p-1 rounded transition ${
            isAlwaysOnTop ? 'text-blue-400 font-bold bg-blue-500/10' : 'hover:text-white hover:bg-white/10'
          }`}
          title={isAlwaysOnTop ? 'Always on Top: ON (Stays visible over reference windows)' : 'Always on Top: OFF'}
        >
          <Pin className="w-3 h-3 transform -rotate-45" />
        </button>

        <button
          onClick={onOpenSettings}
          className="p-1 hover:text-white hover:bg-white/10 rounded transition"
          title="Settings (Ctrl+,)"
        >
          <Settings className="w-3 h-3" />
        </button>

        <div className="h-2.5 w-px bg-white/10 mx-0.5"></div>

        <button
          onClick={onToggleTrayHide}
          className="p-1 hover:bg-white/10 text-slate-400 hover:text-white transition rounded"
          title="Minimize (Esc)"
        >
          <Minus className="w-3 h-3" />
        </button>
        <button
          onClick={onToggleTrayHide}
          className="p-1 hover:bg-red-600 hover:text-white text-slate-400 transition rounded"
          title="Close Window (Esc)"
        >
          <X className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};

