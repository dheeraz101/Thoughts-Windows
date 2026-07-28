import React, { useState, useEffect, useRef } from 'react';
import { CommandItem } from '../types';
import { Search, Terminal, Plus, Settings, FileText, Layers, Pin, Eye, Download, Moon, Sun, Monitor, X } from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNewNote: () => void;
  onOpenSettings: () => void;
  onOpenNotesDrawer: () => void;
  onOpenArchDoc: () => void;
  onToggleAlwaysOnTop: () => void;
  onExportNote: () => void;
  onToggleTheme: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onNewNote,
  onOpenSettings,
  onOpenNotesDrawer,
  onOpenArchDoc,
  onToggleAlwaysOnTop,
  onExportNote,
  onToggleTheme,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const commands: CommandItem[] = [
    {
      id: 'cmd-new',
      title: 'Create New Thought',
      subtitle: 'Start writing in a clean canvas',
      category: 'General',
      shortcut: 'Ctrl+N',
      icon: 'Plus',
      action: () => {
        onNewNote();
        onClose();
      },
    },
    {
      id: 'cmd-notes',
      title: 'Search All Thoughts & Notes',
      subtitle: 'Filter by tags and content',
      category: 'Notes',
      shortcut: 'Ctrl+F',
      icon: 'FileText',
      action: () => {
        onOpenNotesDrawer();
        onClose();
      },
    },
    {
      id: 'cmd-theme',
      title: 'Toggle Theme Preset',
      subtitle: 'Switch between Dark, Fluent, and Light themes',
      category: 'General',
      shortcut: 'Ctrl+T',
      icon: 'Moon',
      action: () => {
        onToggleTheme();
        onClose();
      },
    },
    {
      id: 'cmd-pin',
      title: 'Toggle Always On Top',
      subtitle: 'Keep QuickThought visible over other windows',
      category: 'Window',
      shortcut: 'Ctrl+P',
      icon: 'Pin',
      action: () => {
        onToggleAlwaysOnTop();
        onClose();
      },
    },
    {
      id: 'cmd-export',
      title: 'Export Current Thought as Markdown',
      subtitle: 'Save .md file to local disk',
      category: 'Editor',
      shortcut: 'Ctrl+Shift+S',
      icon: 'Download',
      action: () => {
        onExportNote();
        onClose();
      },
    },
    {
      id: 'cmd-spec',
      title: 'View System Architecture Specification',
      subtitle: 'Inspect Rust, Tauri v2 & SQLite technical blueprint',
      category: 'General',
      icon: 'Layers',
      action: () => {
        onOpenArchDoc();
        onClose();
      },
    },
    {
      id: 'cmd-settings',
      title: 'Open Settings',
      subtitle: 'Customize typography, shortcuts, storage & themes',
      category: 'Settings',
      shortcut: 'Ctrl+,',
      icon: 'Settings',
      action: () => {
        onOpenSettings();
        onClose();
      },
    },
  ];

  const filteredCommands = commands.filter(
    (c) =>
      c.title.toLowerCase().includes(query.toLowerCase()) ||
      c.subtitle?.toLowerCase().includes(query.toLowerCase()) ||
      c.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredCommands.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev === 0 ? filteredCommands.length - 1 : prev - 1
      );
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        filteredCommands[selectedIndex].action();
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] bg-black/70 backdrop-blur-md animate-in fade-in duration-150 p-4">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col text-slate-100">
        {/* Search Header */}
        <div className="p-4 border-b border-slate-800 flex items-center gap-3 bg-slate-950/80">
          <Terminal className="w-5 h-5 text-blue-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Type a command or search actions... (Use ↑ ↓ Enter)"
            className="w-full bg-transparent border-none outline-none text-sm text-slate-100 placeholder-slate-500 font-sans focus:ring-0"
          />
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Command List */}
        <div className="max-h-[340px] overflow-y-auto p-2 space-y-1 custom-scrollbar">
          {filteredCommands.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">
              No matching commands found.
            </div>
          ) : (
            filteredCommands.map((cmd, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={cmd.id}
                  onClick={() => cmd.action()}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'hover:bg-slate-800/60 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        isSelected
                          ? 'bg-blue-500/30 text-white'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      <Terminal className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-xs">{cmd.title}</div>
                      {cmd.subtitle && (
                        <div
                          className={`text-[11px] ${
                            isSelected ? 'text-blue-100' : 'text-slate-400'
                          }`}
                        >
                          {cmd.subtitle}
                        </div>
                      )}
                    </div>
                  </div>

                  {cmd.shortcut && (
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                        isSelected
                          ? 'bg-blue-700/50 border-blue-400 text-white'
                          : 'bg-slate-950 border-slate-700/80 text-slate-400'
                      }`}
                    >
                      {cmd.shortcut}
                    </span>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 bg-slate-950/90 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between font-mono">
          <div className="flex items-center gap-2">
            <span>Navigation:</span>
            <span className="px-1.5 py-0.2 bg-slate-800 rounded">↑ ↓</span>
            <span>Select:</span>
            <span className="px-1.5 py-0.2 bg-slate-800 rounded">Enter</span>
          </div>
          <div>QuickThought Command Engine</div>
        </div>
      </div>
    </div>
  );
};
