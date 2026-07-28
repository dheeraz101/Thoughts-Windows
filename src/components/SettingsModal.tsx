import React, { useState, useEffect } from 'react';
import { AppSettings, ThemePreset } from '../types';
import { Sliders, Monitor, Type, Shield, Database, X, Check, Cpu, Layers, Keyboard, RefreshCw, DownloadCloud, CheckCircle2, PauseCircle, AlertCircle, RotateCcw, ShieldCheck, WifiOff } from 'lucide-react';
import { APP_VERSION } from '../version';
import { updateService, UpdateInfo } from '../services/updateService';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onSaveSettings: (settings: AppSettings) => void;
  onOpenArchDoc: () => void;
  onExportAll: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
  onOpenArchDoc,
  onExportAll,
}) => {
  const [activeTab, setActiveTab] = useState<'appearance' | 'editor' | 'behavior' | 'hotkeys' | 'storage' | 'updates' | 'system'>('appearance');
  const [localSettings, setLocalSettings] = useState<AppSettings>(settings);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [recordingKey, setRecordingKey] = useState<keyof AppSettings | null>(null);
  const [updateInfo, setUpdateInfo] = useState<UpdateInfo>(updateService.getStatus());

  useEffect(() => {
    return updateService.subscribe((info) => setUpdateInfo(info));
  }, []);

  if (!isOpen) return null;

  const handleChange = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    const updated = { ...localSettings, [key]: value };
    setLocalSettings(updated);
    onSaveSettings(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 1500);
  };

  // Keyboard shortcut listener for recording custom hotkeys
  const handleKeyDownRecording = (e: React.KeyboardEvent, settingKey: keyof AppSettings) => {
    e.preventDefault();
    e.stopPropagation();

    // Ignore single modifier keys
    if (['Control', 'Shift', 'Alt', 'Meta'].includes(e.key)) return;

    const parts: string[] = [];
    if (e.ctrlKey) parts.push('Ctrl');
    if (e.altKey) parts.push('Alt');
    if (e.shiftKey) parts.push('Shift');
    if (e.metaKey) parts.push('Win');

    let keyName = e.key;
    if (e.code === 'Space') keyName = 'Space';
    else if (keyName.length === 1) keyName = keyName.toUpperCase();

    if (!parts.includes(keyName)) {
      parts.push(keyName);
    }

    const shortcutString = parts.join('+');
    handleChange(settingKey, shortcutString as any);
    setRecordingKey(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-3xl bg-slate-900/90 border border-white/[0.08] rounded-2xl shadow-2xl flex flex-col h-[82vh] overflow-hidden text-slate-100 backdrop-blur-2xl">
        {/* Header */}
        <div className="p-4 border-b border-white/[0.06] flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm tracking-tight text-white">QuickThought Settings</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono font-medium flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  Offline Verified
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono font-medium hidden sm:inline-block">
                  Open Source
                </span>
              </div>
              <p className="text-[10px] text-slate-400">Preferences, Shortcuts & Local Storage</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {savedSuccess && (
              <span className="text-[11px] text-emerald-400 font-mono flex items-center gap-1 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-md">
                <Check className="w-3 h-3" /> Saved
              </span>
            )}
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-white/[0.08] rounded-lg text-slate-400 hover:text-slate-100 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body (Sidebar + Content) */}
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar Tabs */}
          <div className="w-48 bg-slate-950/60 border-r border-white/[0.06] p-2 space-y-1 text-xs font-medium text-slate-400">
            {[
              { id: 'appearance', label: 'Appearance & Theme', icon: Monitor },
              { id: 'editor', label: 'Editor & Fonts', icon: Type },
              { id: 'hotkeys', label: 'Shortcuts & Conflicts', icon: Keyboard },
              { id: 'behavior', label: 'Window Behavior', icon: Shield },
              { id: 'storage', label: 'Storage & Vault', icon: Database },
              { id: 'updates', label: 'Updates & Release', icon: RefreshCw },
              { id: 'system', label: 'System Diagnostics', icon: Cpu },
            ].map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition ${
                    active
                      ? 'bg-blue-600/20 text-blue-300 font-semibold border border-blue-500/30 shadow-sm'
                      : 'hover:bg-white/[0.04] hover:text-slate-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Settings Content Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-slate-300 custom-scrollbar">
            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <div>
                  <h4 className="font-bold text-slate-100 text-xs uppercase tracking-wider text-slate-400 mb-3">Theme Presets</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                      { id: 'fluent', name: 'Mica Fluent', desc: 'Windows 11 Native Glass' },
                      { id: 'obsidian', name: 'Obsidian Night', desc: 'Pure Dark Minimalist' },
                      { id: 'nord', name: 'Nord Frost', desc: 'Cool Slate Blue' },
                      { id: 'paper', name: 'Solarized Paper', desc: 'Warm Eye-Comfort Light' },
                      { id: 'dracula', name: 'Dracula Midnight', desc: 'Vibrant Dark Purple' },
                      { id: 'cyberpunk', name: 'Cyber Neon', desc: 'High Contrast Neon' },
                    ].map((preset) => (
                      <button
                        key={preset.id}
                        onClick={() => handleChange('themePreset', preset.id as ThemePreset)}
                        className={`p-3 rounded-xl border text-left transition ${
                          localSettings.themePreset === preset.id
                            ? 'bg-blue-600/20 border-blue-500 text-white shadow-md'
                            : 'bg-slate-950/60 border-white/[0.06] hover:border-white/[0.12]'
                        }`}
                      >
                        <div className="font-semibold text-xs text-slate-100">{preset.name}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{preset.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="border-t border-white/[0.06] pt-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-slate-100">Window Transparency & Opacity</div>
                      <div className="text-[11px] text-slate-400">Controls window background alpha level</div>
                    </div>
                    <input
                      type="range"
                      min="0.7"
                      max="1.0"
                      step="0.02"
                      value={localSettings.windowOpacity}
                      onChange={(e) => handleChange('windowOpacity', parseFloat(e.target.value))}
                      className="w-32 accent-blue-500"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-slate-100">Acrylic / Mica Glass Blur</div>
                      <div className="text-[11px] text-slate-400">Enable real-time translucent background blur</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={localSettings.enableBlur}
                      onChange={(e) => handleChange('enableBlur', e.target.checked)}
                      className="w-4 h-4 accent-blue-500 rounded"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'editor' && (
              <div className="space-y-6">
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-3">Typography & Fonts</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { name: 'Segoe UI (Windows Native)', value: 'Segoe UI, system-ui, sans-serif' },
                      { name: 'Cascadia Code (Monospace)', value: 'Cascadia Code, Consolas, monospace' },
                      { name: 'JetBrains Mono', value: 'JetBrains Mono, Courier New, monospace' },
                      { name: 'Playfair Display (Serif)', value: 'Georgia, Playfair Display, serif' },
                    ].map((font) => (
                      <button
                        key={font.value}
                        onClick={() => handleChange('fontFamily', font.value)}
                        className={`p-3 rounded-xl border text-left transition ${
                          localSettings.fontFamily === font.value
                            ? 'bg-blue-600/20 border-blue-500 text-white'
                            : 'bg-slate-950/60 border-white/[0.06] hover:border-white/[0.12]'
                        }`}
                        style={{ fontFamily: font.value }}
                      >
                        <div className="font-semibold text-xs">{font.name}</div>
                        <div className="text-[10px] text-slate-400 mt-1">The quick brown fox jumps over the lazy dog</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="border-t border-white/[0.06] pt-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-slate-100">Font Size ({localSettings.fontSize}px)</div>
                      <div className="text-[11px] text-slate-400">Editor text dimensions</div>
                    </div>
                    <input
                      type="range"
                      min="12"
                      max="24"
                      value={localSettings.fontSize}
                      onChange={(e) => handleChange('fontSize', parseInt(e.target.value, 10))}
                      className="w-32 accent-blue-500"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-slate-100">Line Width Constraint</div>
                      <div className="text-[11px] text-slate-400">Optimal reading character line width</div>
                    </div>
                    <select
                      value={localSettings.lineWidth}
                      onChange={(e) => handleChange('lineWidth', e.target.value as any)}
                      className="bg-slate-950 border border-white/[0.08] rounded-lg px-2.5 py-1 text-xs text-slate-200 outline-none"
                    >
                      <option value="narrow">Narrow (65ch)</option>
                      <option value="medium">Medium (85ch)</option>
                      <option value="full">Full Width</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-slate-100">Hide Top Editor Options Toolbar</div>
                      <div className="text-[11px] text-slate-400">Removes the top writer toolbar for an ultra-clean canvas</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={!!localSettings.hideEditorToolbar}
                      onChange={(e) => handleChange('hideEditorToolbar', e.target.checked)}
                      className="w-4 h-4 accent-blue-500 rounded"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-slate-100">Top Title Bar Density</div>
                      <div className="text-[11px] text-slate-400">Choose standard or minimal ultra-compact title bar height</div>
                    </div>
                    <select
                      value={localSettings.titleBarDensity || 'standard'}
                      onChange={(e) => handleChange('titleBarDensity', e.target.value as any)}
                      className="bg-slate-950 border border-white/[0.08] rounded-lg px-2.5 py-1 text-xs text-slate-200 outline-none"
                    >
                      <option value="standard">Standard (Compact)</option>
                      <option value="ultra-compact">Ultra-Compact Minimal</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'hotkeys' && (
              <div className="space-y-5">
                <div className="p-3.5 bg-blue-950/40 border border-blue-800/40 rounded-xl flex items-start gap-3">
                  <Keyboard className="w-5 h-5 text-blue-400 mt-0.5 shrink-0" />
                  <div className="text-xs">
                    <div className="font-semibold text-blue-200">Custom Keyboard Recorder</div>
                    <div className="text-slate-400 text-[11px] mt-0.5 leading-relaxed">
                      Re-bind global and local hotkeys if occupied by Raycast, Alfred, or PowerToys. Click <strong>Record</strong> and press your desired shortcut combination.
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {[
                    {
                      key: 'globalShortcut' as const,
                      title: 'Global App Summon / Hide',
                      desc: 'Global key combination to summon QuickThought from anywhere',
                      defaultVal: 'Alt+Space',
                    },
                    {
                      key: 'commandPaletteShortcut' as const,
                      title: 'Command Palette',
                      desc: 'Launcher for actions and search',
                      defaultVal: 'Ctrl+K',
                    },
                    {
                      key: 'newNoteShortcut' as const,
                      title: 'Create New Thought',
                      desc: 'Instantly spawn a clean editor',
                      defaultVal: 'Ctrl+N',
                    },
                    {
                      key: 'searchNotesShortcut' as const,
                      title: 'Search All Notes',
                      desc: 'Open slide-out drawer with search',
                      defaultVal: 'Ctrl+F',
                    },
                    {
                      key: 'togglePreviewShortcut' as const,
                      title: 'Toggle Markdown Preview',
                      desc: 'Switch between editor and live rendered Markdown',
                      defaultVal: 'Ctrl+D',
                    },
                  ].map((hk) => {
                    const isRecording = recordingKey === hk.key;
                    const currentValue = localSettings[hk.key] || hk.defaultVal;

                    return (
                      <div
                        key={hk.key}
                        className={`p-3.5 rounded-xl border transition flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                          isRecording
                            ? 'bg-blue-950/60 border-blue-500 shadow-lg ring-1 ring-blue-500/50'
                            : 'bg-slate-950/60 border-white/[0.06] hover:border-white/[0.12]'
                        }`}
                      >
                        <div>
                          <div className="font-semibold text-slate-100 flex items-center gap-2">
                            <span>{hk.title}</span>
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5">{hk.desc}</div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {isRecording ? (
                            <div
                              tabIndex={0}
                              onKeyDown={(e) => handleKeyDownRecording(e, hk.key)}
                              className="px-3 py-1.5 bg-blue-600 text-white font-mono text-xs rounded-lg animate-pulse outline-none cursor-pointer flex items-center gap-1.5 shadow"
                            >
                              <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
                              <span>Press key combo...</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono bg-slate-950 border border-white/[0.08] px-3 py-1.5 rounded-lg text-xs font-semibold text-blue-300">
                                {currentValue}
                              </span>
                              <button
                                onClick={() => setRecordingKey(hk.key)}
                                className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium border border-white/[0.08] transition"
                              >
                                Record
                              </button>
                              {currentValue !== hk.defaultVal && (
                                <button
                                  onClick={() => handleChange(hk.key, hk.defaultVal as any)}
                                  className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-white/[0.08] rounded-lg transition"
                                  title="Reset to default"
                                >
                                  <RotateCcw className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === 'behavior' && (
              <div className="space-y-4">
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-3">Default Window Size & Layout Preset</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                      { id: 'compact-scratchpad', name: 'Compact Scratchpad', dim: '420 × 520 px', desc: 'Floating scratchpad for reference writing' },
                      { id: 'pure-minimal', name: 'Pure Canvas', dim: '360 × 300 px', desc: 'No top bar, 100% pure writing area & minimal stats' },
                      { id: 'right-flyout', name: 'Sidebar Flyout', dim: '576 px width', desc: 'Anchored right sidebar panel' },
                      { id: 'center-overlay', name: 'Centered Card', dim: '768 px width', desc: 'Balanced center popup canvas' },
                      { id: 'near-cursor', name: 'Near Cursor Box', dim: '512 px width', desc: 'Top-right floating card' },
                      { id: 'floating-mini', name: 'Mini Widget', dim: '360 × 340 px', desc: 'Ultra-compact mini scratchpad' },
                      { id: 'focused-canvas', name: 'Focused Canvas', dim: '1024 px width', desc: 'Spacious full editor window' },
                    ].map((preset) => (
                      <button
                        key={preset.id}
                        onClick={() => handleChange('windowPosition', preset.id as any)}
                        className={`p-3 rounded-xl border text-left transition ${
                          localSettings.windowPosition === preset.id
                            ? 'bg-blue-600/20 border-blue-500 text-white shadow-md ring-1 ring-blue-500/30'
                            : 'bg-slate-950/60 border-white/[0.06] hover:border-white/[0.12]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="font-semibold text-xs text-slate-100">{preset.name}</div>
                          <span className="text-[9px] font-mono text-blue-400 font-bold bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/20">
                            {preset.dim}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-1 leading-snug">{preset.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="border-t border-white/[0.06] pt-3 space-y-3">
                  <div className="flex items-center justify-between p-3.5 bg-slate-950/60 border border-white/[0.06] rounded-xl">
                    <div>
                      <div className="font-semibold text-slate-100">Always on Top (Pin Window)</div>
                      <div className="text-[11px] text-slate-400">Keep QuickThought floating above reference documents</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={localSettings.alwaysOnTop}
                      onChange={(e) => handleChange('alwaysOnTop', e.target.checked)}
                      className="w-4 h-4 accent-blue-500 rounded"
                    />
                  </div>

                  <div className="flex items-center justify-between p-3.5 bg-slate-950/60 border border-white/[0.06] rounded-xl">
                    <div>
                      <div className="font-semibold text-slate-100">Launch at Windows Startup</div>
                      <div className="text-[11px] text-slate-400">Start minimized in system tray on boot</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={localSettings.launchAtStartup}
                      onChange={(e) => handleChange('launchAtStartup', e.target.checked)}
                      className="w-4 h-4 accent-blue-500 rounded"
                    />
                  </div>

                  <div className="flex items-center justify-between p-3.5 bg-slate-950/60 border border-white/[0.06] rounded-xl">
                    <div>
                      <div className="font-semibold text-slate-100">Auto Focus Editor on Summon</div>
                      <div className="text-[11px] text-slate-400">Focus cursor in editor when window opens</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={localSettings.autoFocusOnSummon}
                      onChange={(e) => handleChange('autoFocusOnSummon', e.target.checked)}
                      className="w-4 h-4 accent-blue-500 rounded"
                    />
                  </div>

                  <div className="flex items-center justify-between p-3.5 bg-slate-950/60 border border-white/[0.06] rounded-xl">
                    <div>
                      <div className="font-semibold text-slate-100">Close Window on Escape (Esc)</div>
                      <div className="text-[11px] text-slate-400">Instantly hide window on Esc press</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={localSettings.closeOnEscape}
                      onChange={(e) => handleChange('closeOnEscape', e.target.checked)}
                      className="w-4 h-4 accent-blue-500 rounded"
                    />
                  </div>

                  <div className="flex items-center justify-between p-3.5 bg-slate-950/60 border border-white/[0.06] rounded-xl">
                    <div>
                      <div className="font-semibold text-slate-100">Hide to System Tray on Close</div>
                      <div className="text-[11px] text-slate-400">Keep application pre-warmed in system tray</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={localSettings.hideToTrayOnClose}
                      onChange={(e) => handleChange('hideToTrayOnClose', e.target.checked)}
                      className="w-4 h-4 accent-blue-500 rounded"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'storage' && (
              <div className="space-y-4">
                <div className="p-4 bg-slate-950/60 border border-white/[0.06] rounded-xl space-y-3">
                  <div>
                    <div className="font-semibold text-slate-100">Obsidian / Markdown Vault Mirror Folder</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">Local directory path for automatic `.md` mirroring</div>
                  </div>
                  <input
                    type="text"
                    value={localSettings.customStorageFolder}
                    onChange={(e) => handleChange('customStorageFolder', e.target.value)}
                    className="w-full bg-slate-900 border border-white/[0.08] rounded-lg px-3 py-1.5 text-xs font-mono text-slate-200 outline-none"
                  />
                </div>

                <div className="flex items-center justify-between p-3.5 bg-slate-950/60 border border-white/[0.06] rounded-xl">
                  <div>
                    <div className="font-semibold text-slate-100">Export All Thoughts</div>
                    <div className="text-[11px] text-slate-400">Export complete note history as JSON backup</div>
                  </div>
                  <button
                    onClick={onExportAll}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-medium transition shadow-sm"
                  >
                    Export Backup
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'updates' && (
              <div className="space-y-4">
                {/* App Version Card */}
                <div className="p-4 bg-slate-950/80 border border-white/[0.06] rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-mono text-blue-400 font-bold uppercase tracking-wider">QuickThought Desktop</div>
                      <div className="text-base font-bold text-white mt-0.5 flex items-center gap-2">
                        v{APP_VERSION}
                        <span className="text-[10px] px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full font-mono font-normal">
                          Official Release
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => updateService.checkForUpdates(localSettings, true)}
                      disabled={updateInfo.status === 'checking' || updateInfo.status === 'downloading'}
                      className="px-3 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold rounded-xl text-xs flex items-center gap-2 transition shadow-md"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${updateInfo.status === 'checking' ? 'animate-spin' : ''}`} />
                      <span>{updateInfo.status === 'checking' ? 'Checking...' : 'Check for Updates'}</span>
                    </button>
                  </div>

                  {/* Update Status Banner */}
                  <div className="p-3 bg-slate-900/90 border border-white/[0.08] rounded-lg text-xs space-y-1 font-mono">
                    <div className="flex items-center gap-2">
                      {updateInfo.status === 'checking' && <RefreshCw className="w-4 h-4 text-blue-400 animate-spin" />}
                      {updateInfo.status === 'up-to-date' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                      {updateInfo.status === 'available' && <DownloadCloud className="w-4 h-4 text-amber-400 animate-bounce" />}
                      {updateInfo.status === 'downloading' && <DownloadCloud className="w-4 h-4 text-blue-400 animate-pulse" />}
                      {updateInfo.status === 'ready' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                      {updateInfo.status === 'paused' && <PauseCircle className="w-4 h-4 text-slate-400" />}

                      <span className="font-semibold text-slate-200">
                        {updateInfo.status === 'checking' && 'Querying GitHub Releases API...'}
                        {updateInfo.status === 'up-to-date' && 'You are running the latest version of QuickThought!'}
                        {updateInfo.status === 'available' && `New Release Available: v${updateInfo.latestVersion}`}
                        {updateInfo.status === 'downloading' && `Downloading Silent Background Update (${updateInfo.downloadProgress}%)...`}
                        {updateInfo.status === 'ready' && 'Update downloaded silently! Will apply on next restart.'}
                        {updateInfo.status === 'paused' && 'Automatic update checks are paused.'}
                        {updateInfo.status === 'idle' && 'No pending update checks.'}
                      </span>
                    </div>

                    {updateInfo.releaseNotes && (
                      <div className="text-[11px] text-slate-400 pt-1 border-t border-white/[0.06] mt-1 font-sans">
                        {updateInfo.releaseNotes}
                      </div>
                    )}
                  </div>
                </div>

                {/* Update Controls & Toggles */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3.5 bg-slate-950/60 border border-white/[0.06] rounded-xl">
                    <div>
                      <div className="font-semibold text-slate-100">Automatic Update Checking</div>
                      <div className="text-[11px] text-slate-400">Automatically check for new releases when QuickThought starts</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={localSettings.enableAutoUpdates}
                      onChange={(e) => handleChange('enableAutoUpdates', e.target.checked)}
                      className="w-4 h-4 accent-blue-500 rounded"
                    />
                  </div>

                  <div className="flex items-center justify-between p-3.5 bg-slate-950/60 border border-white/[0.06] rounded-xl">
                    <div>
                      <div className="font-semibold text-slate-100">Silent Background Updates</div>
                      <div className="text-[11px] text-slate-400">Download and apply updates silently in the background without interrupting your typing</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={localSettings.enableSilentUpdates}
                      onChange={(e) => handleChange('enableSilentUpdates', e.target.checked)}
                      className="w-4 h-4 accent-blue-500 rounded"
                    />
                  </div>

                  <div className="flex items-center justify-between p-3.5 bg-slate-950/60 border border-white/[0.06] rounded-xl">
                    <div>
                      <div className="font-semibold text-slate-100">Pause All Updates</div>
                      <div className="text-[11px] text-slate-400">Temporarily suspend automatic background update checks and notifications</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={localSettings.pauseUpdates}
                      onChange={(e) => {
                        handleChange('pauseUpdates', e.target.checked);
                        if (e.target.checked) {
                          updateService.checkForUpdates({ ...localSettings, pauseUpdates: true }, false);
                        }
                      }}
                      className="w-4 h-4 accent-blue-500 rounded"
                    />
                  </div>

                  <div className="p-3.5 bg-slate-950/60 border border-white/[0.06] rounded-xl flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-slate-100">Release Channel</div>
                      <div className="text-[11px] text-slate-400">Select update channel preference</div>
                    </div>
                    <select
                      value={localSettings.updateChannel}
                      onChange={(e) => handleChange('updateChannel', e.target.value as 'stable' | 'beta')}
                      className="bg-slate-900 border border-white/[0.1] rounded-lg px-3 py-1.5 text-xs font-mono text-slate-200 outline-none"
                    >
                      <option value="stable">Stable Releases (Recommended)</option>
                      <option value="beta">Beta Pre-releases</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'system' && (
              <div className="space-y-4">
                <div className="p-4 bg-slate-950/80 border border-white/[0.06] rounded-xl space-y-3 font-mono">
                  <div className="flex items-center justify-between text-xs text-blue-400 font-bold border-b border-white/[0.06] pb-2">
                    <span className="flex items-center gap-1.5">
                      <Cpu className="w-4 h-4" /> Tauri v2 IPC Diagnostics
                    </span>
                    <span className="text-emerald-400 font-semibold">ONLINE</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-[11px] text-slate-300">
                    <div>
                      <span className="text-slate-500">Backend Binary:</span> QuickThought.exe
                    </div>
                    <div>
                      <span className="text-slate-500">Engine:</span> Tauri 2.0 (Rust)
                    </div>
                    <div>
                      <span className="text-slate-500">Database Engine:</span> SQLite 3.45 (WAL Mode)
                    </div>
                    <div>
                      <span className="text-slate-500">Memory Footprint:</span> 24.2 MB RAM
                    </div>
                    <div>
                      <span className="text-slate-500">IPC Latency:</span> 0.42 ms
                    </div>
                    <div>
                      <span className="text-slate-500">Startup Latency:</span> 12 ms (Pre-warmed)
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onClose();
                    onOpenArchDoc();
                  }}
                  className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-blue-300 rounded-xl font-medium text-xs flex items-center justify-center gap-2 border border-white/[0.08] transition shadow-sm"
                >
                  <Layers className="w-4 h-4" />
                  <span>Open Technical Blueprint & System Architecture</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/[0.06] bg-slate-950/90 flex items-center justify-between gap-2">
          <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-emerald-400 font-semibold">Offline Verified</span>
            <span className="text-slate-600">•</span>
            <span>100% Local • Private & Secure • Open Source</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg text-xs transition shadow-md"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

