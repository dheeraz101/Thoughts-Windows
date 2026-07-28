# QuickThought ⚡

> **Open. Type. Close.** The ultra-fast, distraction-free desktop thought capture app & scratchpad for Windows & Web. Native speed, 100% offline, local-first storage, version snapshots, and customizable global hotkeys.

[![CI & Windows Release Workflow](https://github.com/dheeraz101/Thoughts-Windows/actions/workflows/release.yml/badge.svg)](https://github.com/dheeraz101/Thoughts-Windows/actions/workflows/release.yml)
![Platform](https://img.shields.io/badge/Platform-Windows%20x64%20%7C%20Web-0078D4?style=flat&logo=windows)
![Node.js](https://img.shields.io/badge/Node.js-v22.x-339933?style=flat&logo=nodedotjs)
![TypeScript](https://img.shields.io/badge/TypeScript-v5.8-3178C6?style=flat&logo=typescript)
![License](https://img.shields.io/badge/License-MIT-green?style=flat)

---

## 🌟 Key Features

QuickThought is designed for writers, developers, and thinkers who need to capture thoughts instantaneously without getting derailed by heavy note applications or slow cloud syncs.

- **⚡ Instant Scratchpad**: Lightweight floating window surface with auto-focus and instant note access.
- **🧘 Zen Mode & Minimal View**: Toggle distraction-free writing modes with full-width typing or custom margins.
- **🕒 Version Snapshots & History**: Create named version snapshots and easily revert to previous edits at any time.
- ** Markdown & Raw Text Formatting**: Full Markdown support with live side-by-side or toggleable rendered preview.
- **🎨 Themes & Customization**: Supports Dark Glass, High Contrast Dark, Light Theme, custom typography, font sizing, and line widths.
- **🔒 100% Offline & Local-First**: Zero telemetry, zero external network requests. All notes stay strictly on your local machine.
- **⌨️ Keyboard Shortcuts**: Full command palette (`Ctrl+K`), quick new note (`Ctrl+N`), snapshot viewer (`Ctrl+H`), and toggle preview (`Ctrl+Shift+P`).

---

## 🚀 GitHub Branching & CI/CD Release Pipeline

This repository features an automated **GitHub Actions CI/CD pipeline** designed for seamless development and release management:

```
                      ┌──────────────────────────────────────┐
                      │          Developer Push              │
                      └──────────────────┬───────────────────┘
                                         │
                 ┌───────────────────────┴───────────────────────┐
                 │                                               │
    git push origin main                       git push origin main:release
                 │                                               │
                 ▼                                               ▼
  ┌─────────────────────────────┐                 ┌─────────────────────────────┐
  │  Job 1: CI Quality Check    │                 │ Job 2: Windows Release Build│
  ├─────────────────────────────┤                 ├─────────────────────────────┤
  │ - Node.js 22 Environment    │                 │ - Windows Server Runner     │
  │ - TypeScript Type Check     │                 │ - Generate Commit Delta Log │
  │ - Web Application Build     │                 │ - Package Windows .exe      │
  │ - Dist Artifact Validation  │                 │ - Publish GitHub Release    │
  └─────────────────────────────┘                 └─────────────────────────────┘
```

### 🌿 How to Push Code & Trigger Releases

1. **Development & Bug Checks (`main` branch)**:
   ```bash
   git push origin main
   ```
   *Runs Job 1*: Verifies TypeScript types, linter, and web production build.

2. **Publishing a Windows Release (`release` branch)**:
   ```bash
   git push origin main:release
   ```
   *Runs Job 2*: Builds the native Windows `.exe` installer (NSIS) and portable standalone executable, extracts recent git commit logs since the last release, and publishes an official GitHub Release package automatically.

---

## 🛠️ Local Development & Building

### Prerequisites
- **Node.js**: v20 or v22 LTS
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

3. **Start Local Development Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

4. **Run Code Quality Check**:
   ```bash
   npm run lint
   ```

5. **Package Native Windows Executables (.exe) Locally**:
   ```bash
   npm run electron:build
   ```
   The compiled `.exe` installers will be saved in the `dist-electron/` folder.

---

## 📁 Repository Structure

```
.
├── .github/
│   ├── ISSUE_TEMPLATE/       # Bug report & feature request templates
│   ├── PULL_REQUEST_TEMPLATE.md
│   └── workflows/
│       └── release.yml        # CI quality check & Windows .exe release pipeline
├── electron/
│   └── main.js               # Electron main window container configuration
├── src/
│   ├── components/           # UI components (Editor, Drawer, TitleBar, Settings)
│   ├── App.tsx               # Main QuickThought application layout
│   └── main.tsx              # React entry point
├── electron-builder.json     # Windows NSIS & Portable .exe packaging config
├── package.json              # App manifest and scripts
├── LICENSE                   # MIT License
└── README.md
```

---

## 📄 Community & Governance

- **[Contributing Guidelines](CONTRIBUTING.md)**: Guidelines for opening issues and submitting PRs.
- **[Code of Conduct](CODE_OF_CONDUCT.md)**: Community rules and standards.
- **[Security Policy](SECURITY.md)**: Vulnerability disclosure procedure.
- **[Privacy Policy](PRIVACY.md)**: 100% local privacy guarantee.

---

## 📜 License

QuickThought is open-source software licensed under the **[MIT License](LICENSE)**.
