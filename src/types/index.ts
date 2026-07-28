export type NoteType = 'markdown' | 'text';

export interface NoteSnapshot {
  id: string;
  timestamp: number;
  title: string;
  content: string;
  wordCount: number;
  charCount: number;
  label?: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  isPinned: boolean;
  isArchived: boolean;
  createdAt: number;
  updatedAt: number;
  wordCount: number;
  charCount: number;
  snapshots?: NoteSnapshot[];
}

export type ThemeMode = 'system' | 'light' | 'dark';
export type ThemePreset = 'fluent' | 'obsidian' | 'nord' | 'paper' | 'dracula' | 'cyberpunk';

export type WindowPosition = 
  | 'compact-scratchpad' 
  | 'pure-minimal'
  | 'right-flyout' 
  | 'center-overlay' 
  | 'near-cursor' 
  | 'floating-mini' 
  | 'focused-canvas';

export interface AppSettings {
  // Appearance
  themeMode: ThemeMode;
  themePreset: ThemePreset;
  accentColor: string;
  windowOpacity: number;
  enableBlur: boolean;
  fontSize: number;
  fontFamily: string;
  lineHeight: number;
  lineWidth: 'narrow' | 'medium' | 'full';

  // Editor
  defaultNoteFormat: NoteType;
  wordWrap: boolean;
  autoSaveIntervalMs: number; // e.g., 150ms
  showLineNumbers: boolean;
  showWordCount: boolean;
  autoExtractTags: boolean;
  hideEditorToolbar?: boolean;
  titleBarDensity?: 'standard' | 'ultra-compact';

  // Behavior & Custom Hotkeys
  launchAtStartup: boolean;
  globalShortcut: string; // e.g. "Alt+Space"
  commandPaletteShortcut: string; // e.g. "Ctrl+K"
  newNoteShortcut: string; // e.g. "Ctrl+N"
  searchNotesShortcut: string; // e.g. "Ctrl+F"
  togglePreviewShortcut: string; // e.g. "Ctrl+D"
  alwaysOnTop: boolean;
  windowPosition: WindowPosition;
  closeOnEscape: boolean;
  hideToTrayOnClose: boolean;
  autoFocusOnSummon: boolean;

  // Storage
  customStorageFolder: string;
  enableAutoBackup: boolean;
}

export interface CommandItem {
  id: string;
  title: string;
  subtitle?: string;
  category: 'General' | 'Editor' | 'Notes' | 'Window' | 'Settings';
  shortcut?: string;
  icon: string; // Lucide icon name
  action: () => void;
}

export interface RustIPCMessage {
  command: string;
  payload?: Record<string, unknown>;
  timestamp: number;
  latencyMs: number;
}

