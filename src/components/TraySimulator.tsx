import React, { useState } from 'react';
import { Radio, Shield, Plus, Terminal, Settings, Layers, Eye, Power } from 'lucide-react';

interface TraySimulatorProps {
  onSummonWindow: () => void;
  onNewNote: () => void;
  onOpenCommandPalette: () => void;
  onOpenArchDoc: () => void;
  onOpenSettings: () => void;
  isWindowVisible: boolean;
  globalShortcut: string;
}

export const TraySimulator: React.FC<TraySimulatorProps> = ({
  onSummonWindow,
  onNewNote,
  onOpenCommandPalette,
  onOpenArchDoc,
  onOpenSettings,
  isWindowVisible,
  globalShortcut,
}) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="fixed bottom-0 left-0 right-0 h-9 bg-slate-950/90 border-t border-slate-800/80 backdrop-blur-xl z-30 flex items-center justify-between px-3 md:px-6 text-xs text-slate-400 font-sans select-none">
      {/* Left: Windows Taskbar Context */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-[11px] font-mono text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="hidden sm:inline text-slate-400">Windows Tray Host:</span>
          <span className="font-semibold text-white">QuickThought Background Worker</span>
        </div>

        <div className="h-3 w-px bg-slate-800"></div>

        {/* Global Shortcut Badge */}
        <div className="hidden md:flex items-center gap-1.5 text-[10px] text-slate-400">
          <span>Global Shortcut Active:</span>
          <button
            onClick={onSummonWindow}
            className="font-mono bg-blue-950/80 hover:bg-blue-900 border border-blue-700/50 text-blue-300 px-2 py-0.5 rounded transition cursor-pointer"
            title="Click or press shortcut to toggle window"
          >
            {globalShortcut}
          </button>
        </div>
      </div>

      {/* Right: Interactive System Tray Icon & Right-Click Menu */}
      <div className="relative flex items-center gap-2">
        <button
          onClick={() => setShowMenu(!showMenu)}
          onContextMenu={(e) => {
            e.preventDefault();
            setShowMenu(true);
          }}
          className={`flex items-center gap-2 px-2.5 py-1 rounded-md transition cursor-pointer ${
            showMenu
              ? 'bg-blue-600 text-white'
              : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800'
          }`}
          title="QuickThought System Tray Icon (Click or Right Click)"
        >
          <div className="w-2 h-2 rounded-full bg-blue-400"></div>
          <span className="font-semibold text-xs font-mono">QT</span>
          <span className="text-[10px] text-slate-400 hidden sm:inline">
            {isWindowVisible ? 'Visible' : 'Hidden'}
          </span>
        </button>

        {/* Tray Right Click Context Menu */}
        {showMenu && (
          <div
            className="absolute bottom-11 right-0 w-56 bg-slate-900 border border-slate-700/80 rounded-xl shadow-2xl p-1 text-xs text-slate-200 space-y-0.5 z-50 animate-in slide-in-from-bottom-2 duration-150"
            onClick={() => setShowMenu(false)}
          >
            <div className="px-3 py-1.5 text-[10px] font-mono text-slate-400 uppercase tracking-wider border-b border-slate-800">
              QuickThought Tray Options
            </div>

            <button
              onClick={onSummonWindow}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-blue-600 hover:text-white transition text-left"
            >
              <div className="flex items-center gap-2">
                <Eye className="w-3.5 h-3.5" />
                <span>{isWindowVisible ? 'Hide Window' : 'Summon Thought Window'}</span>
              </div>
              <span className="text-[10px] font-mono opacity-70">{globalShortcut}</span>
            </button>

            <button
              onClick={onNewNote}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-blue-600 hover:text-white transition text-left"
            >
              <div className="flex items-center gap-2">
                <Plus className="w-3.5 h-3.5" />
                <span>New Thought</span>
              </div>
              <span className="text-[10px] font-mono opacity-70">Ctrl+N</span>
            </button>

            <button
              onClick={onOpenCommandPalette}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-blue-600 hover:text-white transition text-left"
            >
              <div className="flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5" />
                <span>Command Palette</span>
              </div>
              <span className="text-[10px] font-mono opacity-70">Ctrl+K</span>
            </button>

            <button
              onClick={onOpenArchDoc}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-blue-600 hover:text-white transition text-left"
            >
              <div className="flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-blue-400" />
                <span>System Architecture</span>
              </div>
            </button>

            <button
              onClick={onOpenSettings}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-blue-600 hover:text-white transition text-left"
            >
              <div className="flex items-center gap-2">
                <Settings className="w-3.5 h-3.5" />
                <span>Settings</span>
              </div>
            </button>

            <div className="border-t border-slate-800 my-1"></div>

            <button
              onClick={() => alert('QuickThought background process paused. Press Alt+Space to resume.')}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-red-600 hover:text-white transition text-left text-slate-400"
            >
              <Power className="w-3.5 h-3.5" />
              <span>Quit QuickThought</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
