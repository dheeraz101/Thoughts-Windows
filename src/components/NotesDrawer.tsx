import React, { useState } from 'react';
import { Note } from '../types';
import { Search, Plus, Pin, Trash2, Tag, Calendar, FileText, X, Download } from 'lucide-react';

interface NotesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notes: Note[];
  activeNoteId: string | null;
  onSelectNote: (note: Note) => void;
  onNewNote: () => void;
  onDeleteNote: (id: string) => void;
  onTogglePin: (note: Note) => void;
  onExportAll: () => void;
}

export const NotesDrawer: React.FC<NotesDrawerProps> = ({
  isOpen,
  onClose,
  notes,
  activeNoteId,
  onSelectNote,
  onNewNote,
  onDeleteNote,
  onTogglePin,
  onExportAll,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  if (!isOpen) return null;

  // Extract all unique tags
  const allTags = Array.from(
    new Set(notes.flatMap((n) => n.tags || []))
  );

  // Filter notes
  const filteredNotes = notes.filter((n) => {
    const matchesSearch =
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = !selectedTag || (n.tags && n.tags.includes(selectedTag));
    return matchesSearch && matchesTag;
  });

  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-slate-900 border-l border-slate-800 text-slate-100 flex flex-col h-full shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-400" />
            <h3 className="font-semibold text-sm">All Notes ({notes.length})</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onNewNote}
              className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-medium flex items-center gap-1 transition shadow"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-slate-100 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search & Tag Filter Bar */}
        <div className="p-3 border-b border-slate-800 space-y-2 bg-slate-950/40">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search thoughts, tags, or text..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500/80 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2 text-xs text-slate-500 hover:text-slate-300"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Tags Pills */}
          {allTags.length > 0 && (
            <div className="flex items-center gap-1.5 overflow-x-auto py-1 custom-scrollbar text-xs">
              <button
                onClick={() => setSelectedTag(null)}
                className={`px-2 py-0.5 rounded-full text-[10px] font-mono transition ${
                  !selectedTag
                    ? 'bg-blue-600 text-white font-medium'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                All
              </button>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                  className={`px-2 py-0.5 rounded-full text-[10px] font-mono transition ${
                    selectedTag === tag
                      ? 'bg-blue-600 text-white font-medium'
                      : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 border border-slate-700/50'
                  }`}
                >
                  #{tag}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notes List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
          {filteredNotes.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              <p>No thoughts found.</p>
              <button
                onClick={onNewNote}
                className="mt-2 text-blue-400 hover:underline font-medium"
              >
                + Create a new thought
              </button>
            </div>
          ) : (
            filteredNotes.map((note) => {
              const isActive = note.id === activeNoteId;
              const dateStr = new Date(note.updatedAt).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={note.id}
                  onClick={() => {
                    onSelectNote(note);
                    onClose();
                  }}
                  className={`group relative p-3 rounded-xl border transition cursor-pointer ${
                    isActive
                      ? 'bg-blue-950/40 border-blue-500/60 shadow-md'
                      : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-950'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-semibold text-xs text-slate-100 truncate flex-1">
                      {note.title || 'Untitled Thought'}
                    </h4>

                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onTogglePin(note);
                        }}
                        className={`p-1 rounded hover:bg-slate-800 ${
                          note.isPinned ? 'text-blue-400' : 'text-slate-500'
                        }`}
                        title={note.isPinned ? 'Unpin Note' : 'Pin Note'}
                      >
                        <Pin className="w-3 h-3 transform -rotate-45" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteNote(note.id);
                        }}
                        className="p-1 rounded hover:bg-red-950/80 text-slate-500 hover:text-red-400"
                        title="Delete Note"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                    {note.content.replace(/^#+\s*/, '') || 'Empty thought...'}
                  </p>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/60 text-[10px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {dateStr}
                    </span>
                    <span>{note.wordCount || 0} words</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs text-slate-400">
          <button
            onClick={onExportAll}
            className="flex items-center gap-1.5 hover:text-slate-200 transition"
            title="Export all notes as JSON backup"
          >
            <Download className="w-3.5 h-3.5 text-blue-400" />
            <span>Backup All Notes</span>
          </button>
          <span className="text-[10px] text-slate-600 font-mono">SQLite WAL Sync</span>
        </div>
      </div>
    </div>
  );
};
