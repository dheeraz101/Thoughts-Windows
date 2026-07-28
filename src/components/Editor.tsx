import React, { useState, useEffect, useRef, useCallback } from 'react';
import { marked } from 'marked';
import { Note, AppSettings, NoteSnapshot } from '../types';
import { MinimalMetadata } from './MinimalMetadata';
import { 
  Bold, 
  List, 
  CheckSquare, 
  Code, 
  Hash, 
  Eye, 
  Edit3, 
  Download, 
  Sparkles,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Settings,
  Plus,
  Undo2,
  Redo2,
  Clock,
  Camera,
  RotateCcw,
  Trash2,
  X,
  History,
  FileText,
  Maximize2,
  Minimize2,
  MoreHorizontal
} from 'lucide-react';

interface EditorProps {
  note: Note;
  settings: AppSettings;
  onChangeContent: (content: string, title?: string) => void;
  onNewNote: () => void;
  onExport: (format: 'md' | 'txt') => void;
  onOpenSettings: () => void;
  isZenMode?: boolean;
  onToggleZenMode?: () => void;
}

export const Editor: React.FC<EditorProps> = ({
  note,
  settings,
  onChangeContent,
  onNewNote,
  onExport,
  onOpenSettings,
  isZenMode: isZenModeProp,
  onToggleZenMode,
}) => {
  const [isMarkdownPreview, setIsMarkdownPreview] = useState(false);
  const [showToolbar, setShowToolbar] = useState(false); // Default collapsed for ultra-minimal writing
  const [copied, setCopied] = useState(false);
  const [isSnapshotsOpen, setIsSnapshotsOpen] = useState(false);
  const [snapshots, setSnapshots] = useState<NoteSnapshot[]>(note.snapshots || []);
  const [snapshotNameInput, setSnapshotNameInput] = useState('');
  const [previewSnapshot, setPreviewSnapshot] = useState<NoteSnapshot | null>(null);
  const [internalZenMode, setInternalZenMode] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  const isZenMode = isZenModeProp !== undefined ? isZenModeProp : internalZenMode;
  const toggleZenMode = onToggleZenMode || (() => setInternalZenMode(!internalZenMode));

  // Undo / Redo session stack
  const undoStackRef = useRef<string[]>([]);
  const redoStackRef = useRef<string[]>([]);
  const lastContentRef = useRef<string>(note.content);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Sync snapshots when active note changes or creates initial auto-snapshot
  useEffect(() => {
    const loadedSnapshots = note.snapshots || [];
    setSnapshots(loadedSnapshots);

    // Reset undo/redo stack on note change
    undoStackRef.current = [];
    redoStackRef.current = [];
    lastContentRef.current = note.content;
    setCanUndo(false);
    setCanRedo(false);
  }, [note.id]);

  // Track undo stack on content typing
  const handleTextChange = (newContent: string) => {
    const prev = lastContentRef.current;
    if (prev !== newContent) {
      undoStackRef.current.push(prev);
      if (undoStackRef.current.length > 40) undoStackRef.current.shift(); // keep max 40 states
      redoStackRef.current = []; // clear redo on new edit
      lastContentRef.current = newContent;

      setCanUndo(undoStackRef.current.length > 0);
      setCanRedo(false);
    }
    onChangeContent(newContent);
  };

  const handleUndo = useCallback(() => {
    if (undoStackRef.current.length === 0) return;
    const previous = undoStackRef.current.pop()!;
    redoStackRef.current.push(lastContentRef.current);
    lastContentRef.current = previous;

    setCanUndo(undoStackRef.current.length > 0);
    setCanRedo(redoStackRef.current.length > 0);

    onChangeContent(previous);
  }, [onChangeContent]);

  const handleRedo = useCallback(() => {
    if (redoStackRef.current.length === 0) return;
    const next = redoStackRef.current.pop()!;
    undoStackRef.current.push(lastContentRef.current);
    lastContentRef.current = next;

    setCanUndo(undoStackRef.current.length > 0);
    setCanRedo(redoStackRef.current.length > 0);

    onChangeContent(next);
  }, [onChangeContent]);

  // Create manual snapshot
  const handleTakeSnapshot = (label?: string) => {
    const snapshotLabel = label || snapshotNameInput.trim() || `Snapshot #${snapshots.length + 1}`;
    const wordCount = note.content.trim() ? note.content.trim().split(/\s+/).length : 0;
    
    const newSnap: NoteSnapshot = {
      id: `snap_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      timestamp: Date.now(),
      title: note.title,
      content: note.content,
      wordCount,
      charCount: note.content.length,
      label: snapshotLabel,
    };

    const updated = [newSnap, ...snapshots];
    setSnapshots(updated);
    setSnapshotNameInput('');

    // Save back to note
    note.snapshots = updated;
    onChangeContent(note.content, note.title);
  };

  // Restore snapshot version
  const handleRestoreSnapshot = (snap: NoteSnapshot) => {
    // Take safety snapshot of current state before replacing
    if (note.content && note.content !== snap.content) {
      const autoSafetyLabel = `Pre-Restore Backup (${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})`;
      handleTakeSnapshot(autoSafetyLabel);
    }

    onChangeContent(snap.content, snap.title);
    setIsSnapshotsOpen(false);
    setPreviewSnapshot(null);
  };

  // Delete snapshot
  const handleDeleteSnapshot = (id: string) => {
    const updated = snapshots.filter((s) => s.id !== id);
    setSnapshots(updated);
    note.snapshots = updated;
    onChangeContent(note.content, note.title);
    if (previewSnapshot?.id === id) setPreviewSnapshot(null);
  };

  // Keyboard shortcuts: Ctrl+Z (Undo), Ctrl+Y / Ctrl+Shift+Z (Redo), Ctrl+D (Preview), Esc (Exit Zen)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isZenMode) {
        toggleZenMode();
      }

      // Undo
      if (e.ctrlKey && !e.shiftKey && e.key.toLowerCase() === 'z') {
        if (!isMarkdownPreview && document.activeElement === textareaRef.current) {
          // Let standard textarea undo work if focused, or trigger custom undo
        } else if (canUndo) {
          e.preventDefault();
          handleUndo();
        }
      }
      // Redo
      if ((e.ctrlKey && e.key.toLowerCase() === 'y') || (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'z')) {
        if (canRedo) {
          e.preventDefault();
          handleRedo();
        }
      }

      // Ctrl+D toggle preview
      const toggleKey = settings.togglePreviewShortcut || 'Ctrl+D';
      const parts = toggleKey.toLowerCase().split('+');
      const hasCtrl = parts.includes('ctrl') || parts.includes('control');
      const key = parts[parts.length - 1];

      if (e.ctrlKey === hasCtrl && e.key.toLowerCase() === key) {
        e.preventDefault();
        setIsMarkdownPreview((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [canUndo, canRedo, handleUndo, handleRedo, isMarkdownPreview, isZenMode, settings.togglePreviewShortcut]);

  // Insert markdown syntax helper at cursor position
  const insertSyntax = (prefix: string, suffix = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = note.content;
    const selectedText = text.substring(start, end);

    const replacement = `${prefix}${selectedText || 'text'}${suffix}`;
    const newContent = text.substring(0, start) + replacement + text.substring(end);

    handleTextChange(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + prefix.length,
        start + prefix.length + (selectedText ? selectedText.length : 4)
      );
    }, 10);
  };

  const handleCopyContent = () => {
    navigator.clipboard.writeText(note.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isPureMinimal = settings.windowPosition === 'pure-minimal';

  // Line width constraint classes - pure-minimal and full mode expand 100% to fill container
  const widthClasses = isPureMinimal || settings.lineWidth === 'full'
    ? 'w-full flex-1 flex-grow flex-shrink min-h-0 h-full max-w-full'
    : {
        narrow: 'max-w-2xl mx-auto w-full flex-1 flex-grow flex-shrink min-h-0 h-full',
        medium: 'max-w-3xl mx-auto w-full flex-1 flex-grow flex-shrink min-h-0 h-full',
        full: 'w-full flex-1 flex-grow flex-shrink min-h-0 h-full max-w-full',
      }[settings.lineWidth];

  return (
    <div className="flex-1 flex-grow flex-shrink min-h-0 min-w-0 flex flex-col overflow-hidden bg-transparent select-text relative w-full h-full">
      {/* Top Formatting & Utility Bar - Hidden in Zen, Pure Minimal, or when hideEditorToolbar is enabled */}
      {!isZenMode && !isPureMinimal && !settings.hideEditorToolbar && (
        <div className="px-2.5 py-1 flex items-center justify-between border-b border-white/[0.04] bg-black/20 text-[11px] text-slate-400 gap-1.5 shrink-0 select-none relative z-20">
          <div className="flex items-center gap-1.5 shrink-0 overflow-x-auto no-scrollbar">
            {/* New Note Button */}
            <button
              onClick={onNewNote}
              className="flex items-center gap-1 hover:text-slate-100 transition px-1.5 py-0.5 rounded hover:bg-white/10 font-medium"
              title="New Thought (Ctrl+N)"
            >
              <Plus className="w-3 h-3 text-blue-400" />
              <span className="hidden sm:inline text-[10px]">New</span>
            </button>

            <div className="h-3 w-px bg-white/10 mx-0.5"></div>

            {/* Edit / Preview Mode Switcher */}
            <button
              onClick={() => setIsMarkdownPreview(!isMarkdownPreview)}
              className={`flex items-center gap-1 px-1.5 py-0.5 rounded transition text-[10px] ${
                isMarkdownPreview
                  ? 'bg-blue-950/60 text-blue-300 font-medium border border-blue-800/40'
                  : 'hover:text-slate-200 hover:bg-white/10 text-slate-400'
              }`}
              title="Toggle Preview (Ctrl+D)"
            >
              {isMarkdownPreview ? <Edit3 className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
              <span className="hidden xs:inline">{isMarkdownPreview ? 'Edit' : 'Preview'}</span>
            </button>

            {/* Zen Mode Focus Switcher */}
            <button
              onClick={toggleZenMode}
              className="flex items-center gap-1 px-1.5 py-0.5 rounded hover:text-amber-300 hover:bg-amber-500/10 text-slate-400 transition text-[10px]"
              title="100% Focus Zen Mode (Hides bars for max writing area)"
            >
              <Maximize2 className="w-3 h-3 text-amber-400" />
              <span className="hidden sm:inline">Zen</span>
            </button>

            <div className="h-3 w-px bg-white/10 mx-0.5"></div>

            {/* Format Tools Toggle */}
            <button
              onClick={() => setShowToolbar(!showToolbar)}
              className="flex items-center gap-1 hover:text-slate-100 transition px-1.5 py-0.5 rounded hover:bg-white/10"
              title="Toggle Formatting Helper Buttons"
            >
              <span className="font-mono text-[10px] uppercase font-bold text-slate-300">Aa</span>
              {showToolbar ? <ChevronUp className="w-3 h-3 text-slate-400" /> : <ChevronDown className="w-3 h-3 text-slate-400" />}
            </button>
          </div>

          {/* Right Overflow Action Menu */}
          <div className="flex items-center gap-1 shrink-0 relative">
            <button
              onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
              className={`p-1 rounded transition text-slate-400 hover:text-slate-200 hover:bg-white/10 ${
                isMoreMenuOpen ? 'bg-white/10 text-slate-200' : ''
              }`}
              title="More Actions (Versions, Copy, Export, Undo)"
            >
              <MoreHorizontal className="w-3.5 h-3.5" />
            </button>

            {/* Dropdown Menu */}
            {isMoreMenuOpen && (
              <>
                {/* Backdrop to dismiss on click outside */}
                <div 
                  className="fixed inset-0 z-40 bg-black/5" 
                  onClick={() => setIsMoreMenuOpen(false)} 
                />
                <div className="absolute right-0 top-full mt-1.5 w-48 bg-slate-900 border border-white/15 rounded-xl shadow-2xl p-1 z-50 text-[11px] font-sans flex flex-col gap-0.5 backdrop-blur-2xl ring-1 ring-black/50 animate-in fade-in zoom-in-95 duration-100">
                  <button
                    onClick={() => {
                      handleCopyContent();
                      setIsMoreMenuOpen(false);
                    }}
                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-white/10 text-slate-200 transition text-left"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                    <span>Copy Full Note</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsSnapshotsOpen(!isSnapshotsOpen);
                      setIsMoreMenuOpen(false);
                    }}
                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-white/10 text-slate-200 transition text-left"
                  >
                    <History className="w-3.5 h-3.5 text-blue-400" />
                    <span>Version Snapshots</span>
                    {snapshots.length > 0 && (
                      <span className="ml-auto px-1.5 py-0.2 rounded-full bg-blue-500/30 text-[9px] font-mono font-bold text-blue-200">
                        {snapshots.length}
                      </span>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      onExport('md');
                      setIsMoreMenuOpen(false);
                    }}
                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-white/10 text-slate-200 transition text-left"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Export as Markdown (.md)</span>
                  </button>

                  <button
                    onClick={() => {
                      onExport('txt');
                      setIsMoreMenuOpen(false);
                    }}
                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-white/10 text-slate-200 transition text-left"
                  >
                    <Download className="w-3.5 h-3.5 text-slate-400" />
                    <span>Export as Text (.txt)</span>
                  </button>

                  <div className="h-px bg-white/10 my-0.5"></div>

                  <div className="flex items-center justify-between px-2.5 py-1 text-slate-400 text-[10px]">
                    <span>Undo / Redo</span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          handleUndo();
                        }}
                        disabled={!canUndo}
                        className={`p-1 rounded hover:bg-white/10 ${canUndo ? 'text-slate-200' : 'text-slate-600'}`}
                        title="Undo (Ctrl+Z)"
                      >
                        <Undo2 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => {
                          handleRedo();
                        }}
                        disabled={!canRedo}
                        className={`p-1 rounded hover:bg-white/10 ${canRedo ? 'text-slate-200' : 'text-slate-600'}`}
                        title="Redo (Ctrl+Y)"
                      >
                        <Redo2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Formatting Helpers Toolbar */}
      {!isZenMode && !isPureMinimal && showToolbar && (
        <div className="flex items-center gap-1 px-3 py-1 border-b border-white/5 bg-slate-950/90 text-xs animate-in slide-in-from-top-1 shrink-0 overflow-x-auto no-scrollbar">
          <button
            onClick={() => insertSyntax('## ')}
            className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-slate-100 transition"
            title="Heading 2 (## )"
          >
            <Hash className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => insertSyntax('**', '**')}
            className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-slate-100 transition font-bold"
            title="Bold (**text**)"
          >
            <Bold className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => insertSyntax('- ')}
            className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-slate-100 transition"
            title="Bullet List (- )"
          >
            <List className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => insertSyntax('- [ ] ')}
            className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-slate-100 transition"
            title="Task Checkbox (- [ ] )"
          >
            <CheckSquare className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => insertSyntax('```\n', '\n```')}
            className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-slate-100 transition"
            title="Code Block (```)"
          >
            <Code className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => insertSyntax('#')}
            className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-slate-100 transition"
            title="Add Tag (#tag)"
          >
            <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
          </button>
        </div>
      )}



      {/* Main Canvas Area - SINGLE SCROLLBAR CONTAINER */}
      <div className={`flex-1 flex-grow flex-shrink min-h-0 flex flex-col overflow-hidden ${isZenMode || isPureMinimal ? 'p-1.5 sm:p-2.5' : 'p-2 sm:p-3.5 md:p-5'}`}>
        <div className={`${widthClasses} flex-1 flex-grow flex-shrink min-h-0 flex flex-col space-y-1 overflow-hidden`}>
          {/* Title Input */}
          <input
            type="text"
            value={note.title}
            onChange={(e) => onChangeContent(note.content, e.target.value)}
            placeholder="Title or start typing..."
            className="w-full bg-transparent border-none outline-none font-bold text-base sm:text-xl md:text-2xl text-slate-100 placeholder-slate-700 tracking-tight shrink-0 py-0.5"
          />

          {/* Tags Pills Bar */}
          {!isZenMode && !isPureMinimal && note.tags && note.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-1 py-0.5 shrink-0">
              {note.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-slate-900/80 text-slate-400 border border-slate-800"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Writing Surface - Strict Single Custom Scrollbar */}
          <div className="flex-1 flex-grow flex-shrink min-h-0 relative flex flex-col overflow-hidden pt-0.5">
            {!isMarkdownPreview ? (
              <textarea
                ref={textareaRef}
                value={note.content}
                onChange={(e) => handleTextChange(e.target.value)}
                placeholder="Start writing... (Markdown supported)"
                className="w-full flex-1 flex-grow flex-shrink min-h-0 bg-transparent resize-none outline-none border-none text-slate-200 placeholder-slate-700 leading-relaxed font-sans focus:ring-0 overflow-y-auto custom-scrollbar p-0"
                style={{
                  fontFamily: settings.fontFamily,
                  fontSize: `${settings.fontSize}px`,
                  lineHeight: settings.lineHeight,
                }}
              />
            ) : (
              <div
                className="w-full flex-1 min-h-0 overflow-y-auto custom-scrollbar prose prose-invert max-w-none text-slate-200 leading-relaxed p-1"
                style={{
                  fontFamily: settings.fontFamily,
                  fontSize: `${settings.fontSize}px`,
                  lineHeight: settings.lineHeight,
                }}
                dangerouslySetInnerHTML={{
                  __html: marked.parse(note.content || '*No content written yet.*') as string,
                }}
              />
            )}
          </div>
        </div>
      </div>

      {/* Snapshots / Version History Slide-Over Panel */}
      {isSnapshotsOpen && (
        <div className="absolute inset-y-0 right-0 w-80 bg-slate-950/95 border-l border-white/[0.08] shadow-2xl z-40 backdrop-blur-2xl flex flex-col animate-in slide-in-from-right duration-200 text-xs">
          {/* Header */}
          <div className="p-3 border-b border-white/[0.06] flex items-center justify-between bg-slate-900/80">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-blue-400" />
              <span className="font-bold text-slate-100">Version Snapshots</span>
            </div>
            <button
              onClick={() => setIsSnapshotsOpen(false)}
              className="p-1 text-slate-400 hover:text-slate-100 rounded hover:bg-white/10 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Take Manual Snapshot Controls */}
          <div className="p-3 border-b border-white/[0.06] bg-slate-900/40 space-y-2">
            <div className="text-[11px] text-slate-400">Save current note state as a version snapshot:</div>
            <div className="flex gap-1.5">
              <input
                type="text"
                value={snapshotNameInput}
                onChange={(e) => setSnapshotNameInput(e.target.value)}
                placeholder="Snapshot label (e.g. Draft 1)"
                className="flex-1 bg-slate-950 border border-white/[0.08] rounded-lg px-2.5 py-1 text-xs text-slate-200 outline-none placeholder-slate-600"
              />
              <button
                onClick={() => handleTakeSnapshot()}
                className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg text-xs flex items-center gap-1 transition shadow-sm shrink-0"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Save</span>
              </button>
            </div>
          </div>

          {/* Snapshots List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2.5 custom-scrollbar">
            {snapshots.length === 0 ? (
              <div className="text-center py-8 text-slate-500 space-y-2">
                <Clock className="w-8 h-8 mx-auto text-slate-600 opacity-60" />
                <p>No snapshots saved yet.</p>
                <p className="text-[10px] text-slate-600">Click <strong>Save</strong> above to lock in a version state before major edits!</p>
              </div>
            ) : (
              snapshots.map((snap) => {
                const isSelected = previewSnapshot?.id === snap.id;
                const timeAgo = new Date(snap.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                const dateStr = new Date(snap.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' });

                return (
                  <div
                    key={snap.id}
                    className={`p-2.5 rounded-xl border transition flex flex-col gap-1.5 ${
                      isSelected
                        ? 'bg-blue-950/60 border-blue-500/80 shadow-md ring-1 ring-blue-500/30'
                        : 'bg-slate-900/60 border-white/[0.06] hover:border-white/[0.12]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-200 text-xs truncate max-w-[170px]">
                        {snap.label || 'Snapshot'}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">
                        {dateStr} {timeAgo}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-400 line-clamp-2 italic font-sans bg-black/20 p-1.5 rounded border border-white/[0.02]">
                      "{snap.content || 'Empty note'}"
                    </p>

                    <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono pt-0.5">
                      <span>{snap.wordCount} words • {snap.charCount} chars</span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleRestoreSnapshot(snap)}
                          className="px-2 py-0.5 bg-blue-600/30 hover:bg-blue-600 text-blue-300 hover:text-white rounded border border-blue-500/40 font-semibold transition flex items-center gap-1"
                          title="Restore this version to editor"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Restore</span>
                        </button>
                        <button
                          onClick={() => handleDeleteSnapshot(snap.id)}
                          className="p-1 text-slate-500 hover:text-red-400 hover:bg-white/10 rounded transition"
                          title="Delete snapshot"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Minimal Bottom Status Bar - Clean MinimalMetadata component */}
      <MinimalMetadata
        wordCount={note.wordCount || 0}
        charCount={note.charCount || 0}
        onOpenSettings={onOpenSettings}
        isZenMode={isZenMode}
        onToggleZenMode={toggleZenMode}
      />
    </div>
  );
};


