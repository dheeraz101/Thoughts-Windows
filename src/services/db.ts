import { Note, AppSettings } from '../types';

const DB_NAME = 'QuickThoughtDB';
const DB_VERSION = 1;
const NOTES_STORE = 'notes';
const SETTINGS_KEY = 'quickthought_settings';

export const DEFAULT_SETTINGS: AppSettings = {
  themeMode: 'dark',
  themePreset: 'fluent',
  accentColor: '#3b82f6', // Windows blue
  windowOpacity: 0.96,
  enableBlur: true,
  fontSize: 16,
  fontFamily: 'Segoe UI, system-ui, sans-serif',
  lineHeight: 1.6,
  lineWidth: 'medium',

  defaultNoteFormat: 'markdown',
  wordWrap: true,
  autoSaveIntervalMs: 150,
  showLineNumbers: false,
  showWordCount: true,
  autoExtractTags: true,

  launchAtStartup: true,
  globalShortcut: 'Alt+Space',
  commandPaletteShortcut: 'Ctrl+K',
  newNoteShortcut: 'Ctrl+N',
  searchNotesShortcut: 'Ctrl+F',
  togglePreviewShortcut: 'Ctrl+D',
  alwaysOnTop: true,
  windowPosition: 'right-flyout',
  closeOnEscape: true,
  hideToTrayOnClose: true,
  autoFocusOnSummon: true,

  customStorageFolder: 'C:\\Users\\User\\Documents\\QuickThought',
  enableAutoBackup: true,
};

class LocalDatabase {
  private dbPromise: Promise<IDBDatabase | null>;

  constructor() {
    this.dbPromise = this.initDB();
  }

  private initDB(): Promise<IDBDatabase | null> {
    if (typeof window === 'undefined' || !window.indexedDB) {
      return Promise.resolve(null);
    }

    return new Promise((resolve) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(NOTES_STORE)) {
          const store = db.createObjectStore(NOTES_STORE, { keyPath: 'id' });
          store.createIndex('updatedAt', 'updatedAt', { unique: false });
          store.createIndex('isPinned', 'isPinned', { unique: false });
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => {
        console.warn('IndexedDB failed to open, falling back to localStorage');
        resolve(null);
      };
    });
  }

  public async getAllNotes(): Promise<Note[]> {
    const db = await this.dbPromise;
    if (!db) {
      return this.getAllNotesLocalStorage();
    }

    return new Promise((resolve) => {
      try {
        const tx = db.transaction(NOTES_STORE, 'readonly');
        const store = tx.objectStore(NOTES_STORE);
        const request = store.getAll();

        request.onsuccess = () => {
          const notes: Note[] = request.result || [];
          notes.sort((a, b) => {
            if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
            return b.updatedAt - a.updatedAt;
          });
          resolve(notes);
        };

        request.onerror = () => resolve(this.getAllNotesLocalStorage());
      } catch {
        resolve(this.getAllNotesLocalStorage());
      }
    });
  }

  public async saveNote(note: Note): Promise<void> {
    const db = await this.dbPromise;
    // extract tags
    if (note.content) {
      const tags = Array.from(
        new Set((note.content.match(/#([a-zA-Z0-9_\-]+)/g) || []).map((t) => t.slice(1)))
      );
      note.tags = tags;
    }

    if (!db) {
      this.saveNoteLocalStorage(note);
      return;
    }

    return new Promise((resolve, reject) => {
      try {
        const tx = db.transaction(NOTES_STORE, 'readwrite');
        const store = tx.objectStore(NOTES_STORE);
        const request = store.put(note);

        request.onsuccess = () => {
          this.backupToLocalStorage(note);
          resolve();
        };
        request.onerror = () => {
          this.saveNoteLocalStorage(note);
          reject(request.error);
        };
      } catch {
        this.saveNoteLocalStorage(note);
        resolve();
      }
    });
  }

  public async deleteNote(id: string): Promise<void> {
    const db = await this.dbPromise;
    if (!db) {
      this.deleteNoteLocalStorage(id);
      return;
    }

    return new Promise((resolve) => {
      try {
        const tx = db.transaction(NOTES_STORE, 'readwrite');
        const store = tx.objectStore(NOTES_STORE);
        const request = store.delete(id);

        request.onsuccess = () => {
          this.deleteNoteLocalStorage(id);
          resolve();
        };
        request.onerror = () => {
          this.deleteNoteLocalStorage(id);
          resolve();
        };
      } catch {
        this.deleteNoteLocalStorage(id);
        resolve();
      }
    });
  }

  // Settings
  public getSettings(): AppSettings {
    try {
      const saved = localStorage.getItem(SETTINGS_KEY);
      if (saved) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
      }
    } catch {
      // ignore
    }
    return DEFAULT_SETTINGS;
  }

  public saveSettings(settings: AppSettings): void {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save settings:', e);
    }
  }

  // LocalStorage Fallbacks
  private getAllNotesLocalStorage(): Note[] {
    try {
      const data = localStorage.getItem('quickthought_notes_backup');
      if (data) {
        const notes: Note[] = JSON.parse(data);
        return notes.sort((a, b) => {
          if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
          return b.updatedAt - a.updatedAt;
        });
      }
    } catch {
      // ignore
    }
    return [];
  }

  private saveNoteLocalStorage(note: Note): void {
    const notes = this.getAllNotesLocalStorage();
    const idx = notes.findIndex((n) => n.id === note.id);
    if (idx >= 0) {
      notes[idx] = note;
    } else {
      notes.push(note);
    }
    localStorage.setItem('quickthought_notes_backup', JSON.stringify(notes));
  }

  private deleteNoteLocalStorage(id: string): void {
    const notes = this.getAllNotesLocalStorage().filter((n) => n.id !== id);
    localStorage.setItem('quickthought_notes_backup', JSON.stringify(notes));
  }

  private backupToLocalStorage(note: Note): void {
    this.saveNoteLocalStorage(note);
  }
}

export const dbService = new LocalDatabase();

export function createNewNote(content = '', title = ''): Note {
  const now = Date.now();
  const derivedTitle =
    title ||
    content
      .trim()
      .split('\n')[0]
      .replace(/^#+\s*/, '')
      .slice(0, 40) ||
    'Untitled Thought';

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const charCount = content.length;

  return {
    id: `note_${now}_${Math.random().toString(36).substring(2, 7)}`,
    title: derivedTitle,
    content,
    tags: [],
    isPinned: false,
    isArchived: false,
    createdAt: now,
    updatedAt: now,
    wordCount,
    charCount,
  };
}
