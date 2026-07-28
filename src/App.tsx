import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Note, AppSettings, WindowPosition } from './types';
import { dbService, DEFAULT_SETTINGS, createNewNote } from './services/db';
import { TitleBar } from './components/TitleBar';
import { Editor } from './components/Editor';
import { NotesDrawer } from './components/NotesDrawer';
import { CommandPalette } from './components/CommandPalette';
import { SettingsModal } from './components/SettingsModal';
import { ArchDocView } from './components/ArchDocView';
import { TraySimulator } from './components/TraySimulator';
import { updateService } from './services/updateService';

// Helper to check if a KeyboardEvent matches a shortcut string like "Alt+Space" or "Ctrl+K"
function matchShortcut(e: KeyboardEvent, shortcutStr: string): boolean {
  if (!shortcutStr) return false;
  const parts = shortcutStr.split('+').map((p) => p.trim().toLowerCase());
  const hasCtrl = parts.includes('ctrl') || parts.includes('control');
  const hasAlt = parts.includes('alt');
  const hasShift = parts.includes('shift');
  const hasWin = parts.includes('win') || parts.includes('meta');

  if (e.ctrlKey !== hasCtrl) return false;
  if (e.altKey !== hasAlt) return false;
  if (e.shiftKey !== hasShift) return false;
  if (e.metaKey !== hasWin) return false;

  const mainKey = parts.find((p) => !['ctrl', 'control', 'alt', 'shift', 'win', 'meta'].includes(p));
  if (!mainKey) return false;

  if (mainKey === 'space') return e.code === 'Space' || e.key === ' ';
  if (mainKey === 'escape' || mainKey === 'esc') return e.key === 'Escape';
  return e.key.toLowerCase() === mainKey;
}

export default function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNote, setActiveNote] = useState<Note | null>(null);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [isSaved, setIsSaved] = useState(true);
  const [isWindowVisible, setIsWindowVisible] = useState(true);
  const [isZenMode, setIsZenMode] = useState(false);

  // Modals & Drawers state
  const [isNotesDrawerOpen, setIsNotesDrawerOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isArchDocOpen, setIsArchDocOpen] = useState(false);

  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load initial settings & notes
  useEffect(() => {
    const loadedSettings = dbService.getSettings();
    setSettings(loadedSettings);

    if (loadedSettings.enableAutoUpdates) {
      updateService.checkForUpdates(loadedSettings, false);
    }

    dbService.getAllNotes().then((loadedNotes) => {
      if (loadedNotes.length > 0) {
        setNotes(loadedNotes);
        setActiveNote(loadedNotes[0]);
      } else {
        // Create initial starter thought
        const starter = createNewNote(
          `# Welcome to QuickThought 🚀\n\nThe ultra-fast, distraction-free thought capture app designed for Windows.\n\n### ⚡ Quick Start:\n- **Open. Type. Close.** Everything is saved instantly to SQLite local database.\n- Press \`Ctrl+K\` or \`Ctrl+Shift+P\` to open the Command Palette.\n- Press \`Ctrl+F\` to search all notes.\n- Use inline hashtags like #idea, #meeting, #todo to auto-categorize.\n- Toggle Markdown preview mode using \`Ctrl+D\`.\n\n### ⚙️ Features:\n- 100% offline & local-first\n- Windows 11 Fluent Acrylic & Mica theme presets\n- Custom typography & hotkeys\n- Instant export to Markdown (.md)`,
          'Welcome to QuickThought'
        );
        dbService.saveNote(starter);
        setNotes([starter]);
        setActiveNote(starter);
      }
    });
  }, []);

  // Save current active note changes with 150ms debounce
  const handleContentChange = useCallback(
    (content: string, title?: string) => {
      if (!activeNote) return;

      setIsSaved(false);

      const derivedTitle =
        title !== undefined
          ? title
          : content
              .trim()
              .split('\n')[0]
              .replace(/^#+\s*/, '')
              .slice(0, 45) || 'Untitled Thought';

      const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
      const charCount = content.length;

      const updatedNote: Note = {
        ...activeNote,
        content,
        title: derivedTitle,
        updatedAt: Date.now(),
        wordCount,
        charCount,
      };

      setActiveNote(updatedNote);

      // Update in notes array
      setNotes((prevNotes) =>
        prevNotes.map((n) => (n.id === updatedNote.id ? updatedNote : n))
      );

      // Debounce disk/database flush
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = setTimeout(() => {
        dbService.saveNote(updatedNote).then(() => {
          setIsSaved(true);
        });
      }, settings.autoSaveIntervalMs || 150);
    },
    [activeNote, settings.autoSaveIntervalMs]
  );

  // New Note Action
  const handleNewNote = useCallback(() => {
    const freshNote = createNewNote('', 'Untitled Thought');
    dbService.saveNote(freshNote).then(() => {
      setNotes((prev) => [freshNote, ...prev]);
      setActiveNote(freshNote);
      setIsSaved(true);
    });
  }, []);

  // Delete Note
  const handleDeleteNote = useCallback(
    (id: string) => {
      dbService.deleteNote(id).then(() => {
        const remaining = notes.filter((n) => n.id !== id);
        setNotes(remaining);
        if (activeNote?.id === id) {
          if (remaining.length > 0) {
            setActiveNote(remaining[0]);
          } else {
            handleNewNote();
          }
        }
      });
    },
    [notes, activeNote, handleNewNote]
  );

  // Toggle Pin Note
  const handleTogglePin = useCallback((noteToPin: Note) => {
    const updated = { ...noteToPin, isPinned: !noteToPin.isPinned };
    dbService.saveNote(updated).then(() => {
      setNotes((prev) =>
        prev
          .map((n) => (n.id === updated.id ? updated : n))
          .sort((a, b) => {
            if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
            return b.updatedAt - a.updatedAt;
          })
      );
    });
  }, []);

  // Export note as Markdown or Text file
  const handleExportNote = useCallback(
    (format: 'md' | 'txt' = 'md') => {
      if (!activeNote) return;
      const blob = new Blob([activeNote.content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const safeTitle = (activeNote.title || 'thought').toLowerCase().replace(/[^a-z0-9]/g, '_');
      link.download = `${safeTitle}.${format}`;
      link.click();
      URL.revokeObjectURL(url);
    },
    [activeNote]
  );

  // Export all notes as JSON backup
  const handleExportAll = useCallback(() => {
    const dataStr = JSON.stringify(notes, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `quickthought_backup_${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }, [notes]);

  // Global Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape key to close window or active modals
      if (e.key === 'Escape') {
        if (isCommandPaletteOpen) {
          setIsCommandPaletteOpen(false);
          return;
        }
        if (isNotesDrawerOpen) {
          setIsNotesDrawerOpen(false);
          return;
        }
        if (isSettingsOpen) {
          setIsSettingsOpen(false);
          return;
        }
        if (isArchDocOpen) {
          setIsArchDocOpen(false);
          return;
        }
        if (settings.closeOnEscape) {
          setIsWindowVisible(false);
        }
      }

      // Global Summon toggle check
      if (matchShortcut(e, settings.globalShortcut || 'Alt+Space')) {
        e.preventDefault();
        setIsWindowVisible((prev) => !prev);
        return;
      }

      // Command Palette
      if (matchShortcut(e, settings.commandPaletteShortcut || 'Ctrl+K') || (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'p')) {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
        return;
      }

      // New Note
      if (matchShortcut(e, settings.newNoteShortcut || 'Ctrl+N')) {
        e.preventDefault();
        handleNewNote();
        return;
      }

      // Search Notes
      if (matchShortcut(e, settings.searchNotesShortcut || 'Ctrl+F')) {
        e.preventDefault();
        setIsNotesDrawerOpen(true);
        return;
      }

      // Ctrl + , -> Settings
      if (e.ctrlKey && e.key === ',') {
        e.preventDefault();
        setIsSettingsOpen((prev) => !prev);
        return;
      }

      // Ctrl + Shift + S -> Export
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 's') {
        e.preventDefault();
        handleExportNote('md');
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    isCommandPaletteOpen,
    isNotesDrawerOpen,
    isSettingsOpen,
    isArchDocOpen,
    settings,
    handleNewNote,
    handleExportNote,
  ]);

  // Update Settings
  const handleUpdateSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    dbService.saveSettings(newSettings);
  };

  // Compute theme background style
  const themeStyles = {
    fluent: 'bg-slate-950/90 text-slate-100 border-slate-800',
    obsidian: 'bg-black text-slate-100 border-neutral-800',
    nord: 'bg-[#2e3440] text-[#eceff4] border-[#434c5e]',
    paper: 'bg-[#fdf6e3] text-[#657b83] border-[#eee8d5]',
    dracula: 'bg-[#282a36] text-[#f8f8f2] border-[#44475a]',
    cyberpunk: 'bg-[#0f051d] text-[#00f0ff] border-[#ff0055]',
  }[settings.themePreset || 'fluent'];

  // Window positioning and sizing preset classes
  const positionClasses = {
    'compact-scratchpad': 'fixed right-6 top-10 w-[420px] h-[520px] min-w-[340px] min-h-[360px] max-w-[92vw] max-h-[85vh] border rounded-2xl shadow-2xl overflow-hidden resize',
    'pure-minimal': 'fixed right-6 bottom-14 w-[360px] h-[300px] min-w-[280px] min-h-[200px] max-w-[95vw] max-h-[90vh] border rounded-2xl shadow-2xl overflow-hidden resize',
    'right-flyout': 'fixed right-0 top-0 bottom-9 w-full max-w-xl min-w-[340px] border-l shadow-2xl',
    'center-overlay': 'fixed inset-x-4 top-[8vh] bottom-14 max-w-4xl min-w-[340px] min-h-[380px] mx-auto border rounded-2xl shadow-2xl overflow-hidden resize',
    'near-cursor': 'fixed right-8 top-12 bottom-14 w-full max-w-lg min-w-[340px] min-h-[380px] border rounded-2xl shadow-2xl overflow-hidden',
    'floating-mini': 'fixed right-6 bottom-14 w-[360px] h-[340px] min-w-[320px] min-h-[280px] border rounded-2xl shadow-2xl overflow-hidden resize',
    'focused-canvas': 'fixed inset-4 max-w-6xl min-w-[360px] min-h-[380px] mx-auto border rounded-2xl shadow-2xl overflow-hidden resize',
  }[settings.windowPosition || 'compact-scratchpad'];

  return (
    <div className="relative w-screen h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 font-sans overflow-hidden select-none">
      {/* Background Desktop Workspace Visual Frame */}
      <div className="absolute inset-0 p-8 flex flex-col justify-between opacity-30 pointer-events-none">
        <div className="flex justify-between items-start">
          <div className="text-xs font-mono text-slate-500">
            Windows 11 Build 22631 • QuickThought Pre-Warm Process Ready
          </div>
          <div className="text-xs font-mono text-slate-500">
            Press <code className="bg-slate-800 px-1.5 py-0.5 rounded text-blue-400">Alt+Space</code> or <code className="bg-slate-800 px-1.5 py-0.5 rounded text-blue-400">Ctrl+K</code>
          </div>
        </div>
      </div>

      {/* Main QuickThought Window Surface */}
      {isWindowVisible && activeNote && (
        <div
          className={`${positionClasses} ${themeStyles} backdrop-blur-2xl flex flex-col flex-grow flex-shrink min-h-0 min-w-0 z-20 transition-all duration-200 animate-in slide-in-from-right-4`}
          style={{
            opacity: settings.windowOpacity || 0.96,
          }}
        >
          {/* Windows TitleBar - Hidden in Pure Minimal mode or Zen Mode */}
          {settings.windowPosition !== 'pure-minimal' && !isZenMode && (
            <TitleBar
              settings={settings}
              onUpdateSettings={handleUpdateSettings}
              onOpenNotesDrawer={() => setIsNotesDrawerOpen(true)}
              onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
              onOpenSettings={() => setIsSettingsOpen(true)}
              onOpenArchDoc={() => setIsArchDocOpen(true)}
              isAlwaysOnTop={settings.alwaysOnTop}
              onToggleAlwaysOnTop={() =>
                handleUpdateSettings({ ...settings, alwaysOnTop: !settings.alwaysOnTop })
              }
              isSaved={isSaved}
              activeNoteTitle={activeNote.title}
              isTrayHidden={!isWindowVisible}
              onToggleTrayHide={() => setIsWindowVisible(false)}
              onToggleZenMode={() => setIsZenMode(!isZenMode)}
            />
          )}

          {/* Main Editor Surface */}
          <Editor
            note={activeNote}
            settings={settings}
            onChangeContent={handleContentChange}
            onNewNote={handleNewNote}
            onExport={handleExportNote}
            onOpenSettings={() => setIsSettingsOpen(true)}
            isZenMode={isZenMode}
            onToggleZenMode={() => setIsZenMode(!isZenMode)}
          />
        </div>
      )}

      {/* Slide-out All Notes Drawer */}
      <NotesDrawer
        isOpen={isNotesDrawerOpen}
        onClose={() => setIsNotesDrawerOpen(false)}
        notes={notes}
        activeNoteId={activeNote?.id || null}
        onSelectNote={(note) => {
          setActiveNote(note);
          setIsSaved(true);
        }}
        onNewNote={handleNewNote}
        onDeleteNote={handleDeleteNote}
        onTogglePin={handleTogglePin}
        onExportAll={handleExportAll}
      />

      {/* Raycast / PowerToys Command Palette */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNewNote={handleNewNote}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenNotesDrawer={() => setIsNotesDrawerOpen(true)}
        onOpenArchDoc={() => setIsArchDocOpen(true)}
        onToggleAlwaysOnTop={() =>
          handleUpdateSettings({ ...settings, alwaysOnTop: !settings.alwaysOnTop })
        }
        onExportNote={() => handleExportNote('md')}
        onToggleTheme={() => {
          const presets: AppSettings['themePreset'][] = ['fluent', 'obsidian', 'nord', 'dracula'];
          const nextIdx = (presets.indexOf(settings.themePreset) + 1) % presets.length;
          handleUpdateSettings({ ...settings, themePreset: presets[nextIdx] });
        }}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSaveSettings={handleUpdateSettings}
        onOpenArchDoc={() => setIsArchDocOpen(true)}
        onExportAll={handleExportAll}
      />

      {/* System Architecture Specification Inspector */}
      {isArchDocOpen && <ArchDocView onClose={() => setIsArchDocOpen(false)} />}

      {/* Taskbar & System Tray Simulator */}
      <TraySimulator
        onSummonWindow={() => setIsWindowVisible(!isWindowVisible)}
        onNewNote={handleNewNote}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onOpenArchDoc={() => setIsArchDocOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        isWindowVisible={isWindowVisible}
        globalShortcut={settings.globalShortcut}
      />
    </div>
  );
}
