# QuickThought ⚡

> **Open. Type. Close.** The ultra-fast, distraction-free thought capture app designed for Windows & desktop. Native speed, 100% offline, local-first SQLite WAL persistence, and customizable global hotkeys.

![QuickThought Banner](https://img.shields.io/badge/Tauri-v2.0-blue?style=for-the-badge&logo=tauri)
![Windows 11](https://img.shields.io/badge/Windows-11%20Mica%20%26%20Fluent-0078D4?style=for-the-badge&logo=windows)
![SQLite WAL](https://img.shields.io/badge/Database-SQLite%203.45-003B57?style=for-the-badge&logo=sqlite)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

---

## 🌟 Vision & Design Pillars

QuickThought is built for writers, developers, and thinkers who need to capture ideas the millisecond they strike, without waiting for heavy electron apps or slow cloud syncs.

- **⚡ Sub-15ms Pre-Warmed Summon**: Instant global hotkey overlay (`Alt+Space`, `Ctrl+Shift+T`, or custom hotkey).
- **🧘 Clean Minimalism**: Pure focus on writing. Toolbars and formatting options stay collapsed until needed.
- **🔒 100% Offline & Local-First**: Zero telemetry, zero external network dependency. Stored in high-performance local SQLite database with WAL (Write-Ahead Logging).
- **⌨️ Keyboard-Driven Command Palette**: Access everything with `Ctrl+K` or `Ctrl+Shift+P`.
- **🔄 Conflict-Free Keybinding**: Record and re-map any global shortcut if occupied by Raycast, PowerToys, or Alfred.

---

## 💻 Tech Architecture

QuickThought utilizes a high-performance **Tauri v2 + React 18 + TypeScript** stack:

```
┌─────────────────────────────────────────────────────────┐
│              QuickThought Architecture                  │
├──────────────────────────┬──────────────────────────────┤
│ Frontend Surface         │ React 18 + Vite + Tailwind   │
│ OS Native Windowing      │ Tauri v2 + Windows DWM       │
│ Database Engine          │ Local SQLite 3.45 (WAL Mode) │
│ Inter-Process Comms      │ Rust Zero-Copy Memory IPC    │
└──────────────────────────┴──────────────────────────────┘
```

---

## ⌨️ Global Shortcuts & Keybindings

| Action | Default Hotkey | Configurable? |
| :--- | :--- | :--- |
| **Summon / Hide Window** | `Alt+Space` | ✅ Yes |
| **Command Palette** | `Ctrl+K` | ✅ Yes |
| **New Thought** | `Ctrl+N` | ✅ Yes |
| **Search Notes Drawer** | `Ctrl+F` | ✅ Yes |
| **Toggle Markdown Preview**| `Ctrl+D` | ✅ Yes |
| **Close Window** | `Escape` | ✅ Yes |

---

## 🛠️ Building & Running Locally

### Prerequisites
- [Node.js](https://nodejs.org/) v18+ & `npm`
- [Rust](https://www.rust-lang.org/) (for Tauri v2 desktop builds)

### Development
```bash
# Clone repository
git clone https://github.com/your-username/quickthought.prewarm.git
cd quickthought.prewarm

# Install dependencies
npm install

# Run Vite web development server
npm run dev
```

### Tauri Native Desktop Build
```bash
# Build native Windows executable
npm run build
cargo tauri build
```

---

## 📄 License & Privacy

QuickThought is open-source under the **[MIT License](LICENSE)**.
Read our [Privacy Policy](PRIVACY.md) — 100% local, zero tracking, zero cloud dependencies.
