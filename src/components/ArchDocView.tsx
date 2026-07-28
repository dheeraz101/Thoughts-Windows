import React, { useState } from 'react';
import { Shield, Zap, Layers, Cpu, Database, Layout, Terminal, Code2, ArrowRight, CheckCircle2, Sliders, Monitor, Sparkles, X, BookOpen, HardDrive, Lock, ShieldCheck } from 'lucide-react';

export const ArchDocView: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'vision' | 'architecture' | 'rust' | 'react' | 'performance' | 'roadmap'>('vision');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl p-3 md:p-6 animate-in fade-in duration-200">
      <div className="bg-slate-900/90 border border-white/[0.08] text-slate-100 rounded-2xl w-full max-w-5xl h-[88vh] flex flex-col shadow-2xl overflow-hidden backdrop-blur-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06] bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-inner">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-base text-white tracking-tight">QuickThought Technical Specification</h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono border border-emerald-500/30 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  Offline Verified
                </span>
                <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-mono border border-blue-500/30 font-semibold">
                  Open Source
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">High-Performance Local Desktop Engine • Apple HIG & Obsidian Inspired</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition border border-white/[0.08] flex items-center gap-1.5"
          >
            <span>Close (Esc)</span>
            <X className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-1.5 px-6 bg-slate-950/60 border-b border-white/[0.06] overflow-x-auto text-xs font-medium text-slate-400 custom-scrollbar">
          {[
            { id: 'vision', label: 'Vision & Product Design', icon: Shield },
            { id: 'architecture', label: 'System Blueprint', icon: Layers },
            { id: 'rust', label: 'Rust Native Core', icon: Terminal },
            { id: 'react', label: 'React Frontend Stack', icon: Code2 },
            { id: 'performance', label: 'Performance & Security', icon: Zap },
            { id: 'roadmap', label: 'Roadmap & Specs', icon: CheckCircle2 },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-3 border-b-2 transition whitespace-nowrap text-xs ${
                  active
                    ? 'border-blue-500 text-blue-400 bg-blue-500/10 font-semibold'
                    : 'border-transparent hover:text-slate-200 hover:bg-white/[0.04]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 text-sm text-slate-300 leading-relaxed custom-scrollbar">
          {activeTab === 'vision' && (
            <div className="space-y-6">
              <div className="bg-blue-950/40 border border-blue-800/40 rounded-xl p-5 shadow-sm">
                <h3 className="text-base font-semibold text-blue-200 mb-2 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-blue-400" />
                  Product Vision: Zero Friction Mind-to-Canvas Capture
                </h3>
                <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
                  Traditional note apps introduce artificial friction: cold start loading screens, notebook selection popups, title requirements, heavy WebSockets, and cloud sync stalls.
                  <strong className="text-white"> QuickThought operates on a zero-friction paradigm:</strong>
                </p>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="bg-slate-950/80 p-3.5 rounded-xl border border-white/[0.06]">
                    <span className="text-red-400 font-bold flex items-center gap-1">❌ Traditional Apps (Notion/Evernote)</span>
                    <p className="mt-1 text-slate-400 leading-relaxed">Heavy cloud JS bundles, multi-second hydration delays, modal prompts, and web frame overhead before typing can begin.</p>
                  </div>
                  <div className="bg-slate-950/80 p-3.5 rounded-xl border border-white/[0.06]">
                    <span className="text-emerald-400 font-bold flex items-center gap-1">✅ QuickThought Strategy</span>
                    <p className="mt-1 text-slate-400 leading-relaxed">Pre-warmed background webview, sub-15ms global shortcut summon, and local SQLite WAL atomic storage.</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-purple-400" />
                  Apple HIG & Obsidian Inspired Design Mechanics
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 bg-slate-950/60 border border-white/[0.06] rounded-xl space-y-1">
                    <div className="font-semibold text-slate-100">Translucent Materials (Acrylic / Mica)</div>
                    <div className="text-slate-400 leading-relaxed">Subtle background blurs (`backdrop-blur-2xl`) and 1px hairline borders that mimic Apple macOS Sonoma & Windows 11 Fluent UI.</div>
                  </div>
                  <div className="p-3.5 bg-slate-950/60 border border-white/[0.06] rounded-xl space-y-1">
                    <div className="font-semibold text-slate-100">Contextual Steganography & Stealth UI</div>
                    <div className="text-slate-400 leading-relaxed">Controls fade into background when writing and emerge only on hover or explicit keyboard shortcuts.</div>
                  </div>
                  <div className="p-3.5 bg-slate-950/60 border border-white/[0.06] rounded-xl space-y-1">
                    <div className="font-semibold text-slate-100">Collision-Free Hotkey Recording</div>
                    <div className="text-slate-400 leading-relaxed">Rebind any shortcut directly in settings if occupied by Raycast, Flow Launcher, PowerToys, or Alfred.</div>
                  </div>
                  <div className="p-3.5 bg-slate-950/60 border border-white/[0.06] rounded-xl space-y-1">
                    <div className="font-semibold text-slate-100">Obsidian Vault Compatibility</div>
                    <div className="text-slate-400 leading-relaxed">Dual-engine persistence: fast SQLite database + optional background Markdown directory mirroring.</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'architecture' && (
            <div className="space-y-5">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-400" />
                Tauri v2 + Rust Architecture Blueprint
              </h3>

              <div className="bg-slate-950 p-4 rounded-xl border border-white/[0.06] font-mono text-xs text-blue-300 shadow-inner">
                <pre>{`┌─────────────────────────────────────────────────────────────────────────────┐
│                       QUICKTHOUGHT ARCHITECTURE                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────┐           IPC Bridge          ┌──────────────┐ │
│  │   React 18 Frontend    │ ──(Tauri Invokes / Events)─► │ Tauri v2 Core│ │
│  │  - Canvas / Textarea   │                          │ (Rust Thread)│ │
│  │  - Command Palette     │ ◄─(Zero-Copy Shared Mem)── │              │ │
│  └────────────┬────────────┘                          └──────┬───────┘ │
│               │                                              │          │
│               ▼                                              ▼          │
│     ┌───────────────────┐                          ┌──────────────────┐ │
│     │ IndexedDB / Local │                          │ SQLite (rusqlite)│ │
│     │ Cache Store       │                          │ WAL Storage Mode │ │
│     └───────────────────┘                          └─────────┬────────┘ │
│                                                              │          │
│                                                     ┌────────┴────────┐ │
│                                                     │ Obsidian Vault  │ │
│                                                     │ Markdown Files  │ │
│                                                     └─────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘`}</pre>
              </div>
            </div>
          )}

          {activeTab === 'rust' && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Terminal className="w-4 h-4 text-orange-400" />
                Rust Native IPC & SQLite Engine
              </h3>

              <div className="bg-slate-950 p-4 rounded-xl border border-white/[0.06] space-y-3 font-mono text-xs">
                <div className="text-slate-400">High-speed SQLite WAL initialization with rust-native rusqlite:</div>
                <div className="bg-slate-900 p-3 rounded-lg text-emerald-400">
                  <pre>{`PRAGMA journal_mode = WAL;
PRAGMA synchronous = NORMAL;
PRAGMA temp_store = MEMORY;

CREATE TABLE IF NOT EXISTS notes (
  id TEXT PRIMARY KEY NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  tags TEXT, -- JSON array
  is_pinned INTEGER DEFAULT 0,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);`}</pre>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'react' && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Code2 className="w-4 h-4 text-cyan-400" />
                React 18 & Uncontrolled Editor Canvas
              </h3>

              <div className="p-4 bg-slate-950 border border-white/[0.06] rounded-xl text-xs space-y-2">
                <div className="font-semibold text-cyan-300">100% Uncontrolled Hybrid Editing Surface</div>
                <p className="text-slate-400 leading-relaxed">
                  To eliminate input latency during fast typing, the editor canvas directly reads DOM text state, queueing disk writes via an asynchronous requestIdleCallback buffer.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'performance' && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-400" />
                Performance Metrics & Security Audit
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="p-4 bg-slate-950 border border-white/[0.06] rounded-xl space-y-1">
                  <div className="font-bold text-yellow-300">Memory Footprint</div>
                  <div className="text-slate-400">&lt; 28 MB RAM (Pre-warmed background thread)</div>
                </div>
                <div className="p-4 bg-slate-950 border border-white/[0.06] rounded-xl space-y-1">
                  <div className="font-bold text-emerald-300">Summon Latency</div>
                  <div className="text-slate-400">&lt; 15 ms (1 display frame response)</div>
                </div>
                <div className="p-4 bg-slate-950 border border-white/[0.06] rounded-xl space-y-1">
                  <div className="font-bold text-blue-300">Security & Privacy</div>
                  <div className="text-slate-400">100% Offline • Zero Telemetry • Local DB</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'roadmap' && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Implementation Roadmap & Component Tree
              </h3>

              <div className="bg-slate-950 p-4 rounded-xl border border-white/[0.06] text-xs font-mono text-slate-300 space-y-2">
                <div className="text-emerald-400 font-bold">Completed Architecture Features:</div>
                <ul className="list-disc list-inside space-y-1 text-slate-400">
                  <li>Global hotkey recording & conflict resolution engine</li>
                  <li>Ultra-minimal distraction-free writing layout</li>
                  <li>Clean aesthetic custom scrollbars</li>
                  <li>Markdown live preview mode (`Ctrl+D`)</li>
                  <li>Command palette (`Ctrl+K`) & Notes search (`Ctrl+F`)</li>
                  <li>Full GitHub repo documentation suite (README, SECURITY, PRIVACY, CONTRIBUTING)</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-white/[0.06] bg-slate-950/80 flex items-center justify-between text-xs text-slate-400">
          <div>QuickThought Architecture Spec v1.0</div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition shadow-md"
          >
            Back to Editor
          </button>
        </div>
      </div>
    </div>
  );
};

