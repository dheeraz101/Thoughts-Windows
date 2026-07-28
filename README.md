# QuickThought ⚡

> **Open. Type. Close.** The ultra-fast, distraction-free desktop thought capture app & scratchpad for Windows & Web. Native speed, 100% offline, local-first storage, version snapshots, and customizable hotkeys.

[![CI Code Quality & Audit](https://github.com/dheeraz101/Thoughts-Windows/actions/workflows/main.yml/badge.svg)](https://github.com/dheeraz101/Thoughts-Windows/actions/workflows/main.yml)
[![Windows Release Workflow](https://github.com/dheeraz101/Thoughts-Windows/actions/workflows/release.yml/badge.svg)](https://github.com/dheeraz101/Thoughts-Windows/actions/workflows/release.yml)
![Platform](https://img.shields.io/badge/Platform-Windows%20x64%20%7C%20Web-0078D4?style=flat&logo=windows)
![Privacy](https://img.shields.io/badge/Privacy-100%25%20Offline%20%26%20Secure-success?style=flat)
![Open Source](https://img.shields.io/badge/Open%20Source-MIT%20License-blue?style=flat)
![Version](https://img.shields.io/badge/Version-v1.0.0-blue?style=flat)
![Status](https://img.shields.io/badge/Status-Active%20Development-orange?style=for-the-badge)
![Stability](https://img.shields.io/badge/Stability-Unstable-red?style=for-the-badge)
![Do Not Build](https://img.shields.io/badge/Build-Do%20Not%20Use-critical?style=for-the-badge)

---

## 🔒 100% Offline, Private, Secure & Open Source

QuickThought is designed with an absolute local-first architecture:
- **🔒 100% Offline & Local**: Your notes never leave your computer. All data is saved directly in local IndexedDB and LocalStorage engines.
- **🛡️ Zero Tracking or Telemetry**: No analytics, no third-party trackers, no hidden network calls.
- **📖 100% Open Source**: Fully open source under the MIT License. Anyone can audit, build, or customize the application.
![Node.js](https://img.shields.io/badge/Node.js-v22.x-339933?style=flat&logo=nodedotjs)
![TypeScript](https://img.shields.io/badge/TypeScript-v5.8-3178C6?style=flat&logo=typescript)
![License](https://img.shields.io/badge/License-MIT-green?style=flat)

> [!CAUTION]
> ## 🚧 Under Active Development
>
> This repository is **currently unstable** and **not intended for public use**.
>
> - APIs and project structure may change at any time.
> - Features are incomplete.
> - Breaking changes are expected.
> - **Please do not build or use this project until the first stable release.**

---

## 🌟 Features

QuickThought is engineered for thinkers, developers, and creators who need instantaneous note capture without getting derailed by heavy cloud applications or sluggish interfaces.

- **⚡ Instant Scratchpad**: Floating distraction-free window surface with instantaneous typing focus and quick note switching.
- **🧘 Zen Mode & Minimal View**: Toggle pure minimalist writing mode with full-width typing or custom margin controls.
- **🕒 Version Snapshots & History**: Save named version snapshots of your notes and revert to any point in time.
- **📝 Markdown & Raw Formatting**: Rich Markdown rendering with live side-by-side or toggleable preview modes.
- **🎨 Themes & Typography**: Includes Dark Glass, High Contrast Dark, Light Mode, custom font pairings, line heights, and margin controls.
- **🔒 Local-First & 100% Offline**: Zero remote telemetry or external database requests. Notes are stored locally on your device.
- **⌨️ Command Palette & Keyboard Shortcuts**:
  - `Ctrl + K`: Global Command Palette
  - `Ctrl + N`: Create New Note
  - `Ctrl + H`: Version Snapshots History
  - `Ctrl + Shift + P`: Toggle Markdown Live Preview

---

## 🏗️ Architecture

QuickThought uses a decoupled hybrid architecture that powers both web deployment and native desktop packaging:

```
┌──────────────────────────────────────────────────────────────────┐
│                         QuickThought Application                 │
├────────────────────────────────┬─────────────────────────────────┤
│    Desktop Runtime (Electron)  │        Web Runtime (SPA)        │
│    - Native Windows TitleBar   │        - React 18 / Vite         │
│    - Window Overlay Controls   │        - Tailwind CSS Utility    │
│    - Local Storage Persistence │        - LocalStorage / IndexedDB │
└────────────────────────────────┴─────────────────────────────────┘
                                 │
                     ┌───────────┴───────────┐
                     │ Core Editing Engine   │
                     ├───────────────────────┤
                     │ - Lucide Icons        │
                     │ - Markdown Parser     │
                     │ - Snapshot Manager    │
                     └───────────────────────┘
```

---

## 🚀 Installation & Local Development

### Prerequisites
- **Node.js**: v20.x or v22.x LTS
- **npm**: v10+

### Step-by-Step Setup

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/dheeraz101/Thoughts-Windows.git
   cd Thoughts-Windows
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Access the app at `http://localhost:3000`.

4. **Run Code Quality Check & Linter**:
   ```bash
   npm run lint
   ```

5. **Package & Test Native Windows Executable (.exe) Locally**:
   - **Full NSIS Installer + Portable**:
     ```bash
     npm run build:win
     ```
   - **Standalone Portable `.exe` Only**:
     ```bash
     npm run build:win:portable
     ```
   - **Unpacked Directory (Fast Test Run)**:
     ```bash
     npm run build:win:dir
     ```
   Compiled `.exe` installer binaries will be placed in `dist-electron/`.

6. **Bumping Project Version across all release files**:
   ```bash
   npm run bump-version 1.1.0
   ```
   *Automatically updates `package.json`, `src/version.ts`, and copyright dates.*

---

## 🌿 GitHub CI/CD Pipeline & Release Workflow

```
                        ┌──────────────────────────────────────┐
                        │          Developer Push              │
                        └──────────────────┬───────────────────┘
                                           │
                 ┌─────────────────────────┴─────────────────────────┐
                 │                                                   │
    git push origin main                           git push origin main:release
                 │                                                   │
                 ▼                                                   ▼
  ┌───────────────────────────────┐                 ┌───────────────────────────────┐
  │ .github/workflows/main.yml    │                 │ .github/workflows/release.yml │
  ├───────────────────────────────┤                 ├───────────────────────────────┤
  │ - Node.js 22 + npm Cache      │                 │ - Windows Server Runner       │
  │ - TypeScript Type Checking    │                 │ - Auto Commit Delta Changelog │
  │ - Security Vulnerability Audit│                 │ - Electron Windows .exe Build │
  │ - Web Production Bundle Test  │                 │ - Auto Publish GitHub Release │
  └───────────────────────────────┘                 └───────────────────────────────┘
```

- **Standard Code Push**:
  ```bash
  git push origin main
  ```
  Runs code quality checks, security vulnerability audits, and web build verification.

- **Triggering a Public Windows Release**:
  ```bash
  git push origin main:release
  ```
  Triggers the Windows release builder, extracts recent commit logs since the last tag, packages the NSIS installer & portable `.exe`, and creates a GitHub Release page automatically.

---

## 📁 Repository Structure

```
.
├── .github/
│   ├── ISSUE_TEMPLATE/        # Bug report & feature request templates
│   ├── PULL_REQUEST_TEMPLATE.md
│   ├── dependabot.yml         # Dependency update schedule
│   └── workflows/
│       ├── main.yml           # CI code quality & audit workflow
│       └── release.yml        # Windows .exe release pipeline
├── electron/
│   └── main.js                # Electron main window & title bar overlay
├── src/
│   ├── components/            # UI components (Editor, Drawer, TitleBar, Settings)
│   ├── App.tsx                # Main QuickThought application container
│   └── main.tsx               # React entry point
├── electron-builder.json      # Windows NSIS & portable .exe builder config
├── package.json               # Application metadata and dependencies
├── SECURITY.md                # Security vulnerability reporting policy
├── CONTRIBUTING.md            # Git branching & contribution guidelines
├── DEVELOPMENT_GUIDE.md       # Developer setup, build scripts & operations guide
├── CODE_OF_CONDUCT.md         # Community standards
└── LICENSE                    # MIT License
```

---

## 📄 License

QuickThought is open-source software licensed under the **[MIT License](LICENSE)**.
