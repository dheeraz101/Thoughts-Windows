# QuickThought Developer & Operations Guide 🛠️

Welcome to the QuickThought developer documentation. This guide provides comprehensive instructions for setting up your local environment, building Windows desktop binaries (`.exe`), managing versions, and running CI/CD workflows.

---

## 📋 Table of Contents
1. [Prerequisites & Environment Setup](#1-prerequisites--environment-setup)
2. [Project Architecture & File Map](#2-project-architecture--file-map)
3. [Local Development & Web Testing](#3-local-development--web-testing)
4. [Local Windows Desktop Packaging (.exe)](#4-local-windows-desktop-packaging-exe)
5. [Version Bumping & Release Script](#5-version-bumping--release-script)
6. [Silent Update System (`updateService.ts`)](#6-silent-update-system-updateservicets)
7. [GitHub CI/CD Release Pipeline](#7-github-cicd-release-pipeline)
8. [Security & Local Storage Rules](#8-security--local-storage-rules)

---

## 1. Prerequisites & Environment Setup

Before working on QuickThought, make sure you have installed:

- **Node.js**: v20.x or v22.x LTS ([Download Node.js](https://nodejs.org/))
- **npm**: v10.x or higher (Included with Node.js)
- **Git**: For version control and branch management
- **Windows OS** (Optional, required only for native `.exe` local testing. Web version works on macOS/Linux/Windows).

### Initial Repository Setup

```bash
# 1. Clone the repository
git clone https://github.com/dheeraz101/Thoughts-Windows.git
cd Thoughts-Windows

# 2. Run automated developer environment setup script
npm run setup
```

---

## 2. Project Architecture & File Map

QuickThought uses a decoupled architecture allowing the exact same React components to run seamlessly as a web app or inside a native Windows Electron container:

```
.
├── .github/
│   ├── ISSUE_TEMPLATE/        # Bug report & feature request templates
│   ├── PULL_REQUEST_TEMPLATE.md
│   ├── dependabot.yml         # Dependency update schedule
│   └── workflows/
│       ├── main.yml           # CI code quality, audit & build check
│       └── release.yml        # Windows .exe release pipeline
├── electron/
│   └── main.js                # Native Electron main window & title bar overlay
├── scripts/
│   ├── setup-dev.js           # Automated developer setup & file audit script
│   └── bump-version.js        # Automated version synchronization script
├── src/
│   ├── components/            # UI components (Editor, Settings, TitleBar, NotesDrawer)
│   ├── services/
│   │   ├── db.ts              # Local IndexedDB & LocalStorage persistence engine
│   │   └── updateService.ts   # Silent GitHub releases auto-update service
│   ├── types/
│   │   └── index.ts           # Shared TypeScript interfaces & settings types
│   ├── version.ts             # Single source of truth for app versioning
│   ├── App.tsx                # Main QuickThought application container
│   └── main.tsx               # React DOM entry point
├── .gitignore                 # Excludes secrets, node_modules, & build outputs
├── electron-builder.json      # Windows NSIS & portable packaging configuration
├── package.json               # Manifest & build commands
├── SECURITY.md                # Vulnerability disclosure policy
├── CONTRIBUTING.md            # Git workflow & PR rules
├── README.md                  # Main overview
└── DEVELOPMENT_GUIDE.md       # This file
```

---

## 3. Local Development & Web Testing

### Start Dev Server
To launch the hot-reloading web environment:
```bash
npm run dev
```
Open `http://localhost:3000` in your web browser.

### Run Linter & Type Check
Before committing changes, verify there are no TypeScript or compilation errors:
```bash
npm run lint
```

---

## 4. Local Windows Desktop Packaging (.exe)

QuickThought provides multiple npm scripts for building native Windows executables using Electron Builder:

| Command | Purpose | Output Location |
| :--- | :--- | :--- |
| `npm run build:win` | Packages both the **NSIS Installer Setup `.exe`** and the **Portable `.exe`**. | `dist-electron/` |
| `npm run build:win:portable` | Builds only the standalone single-file **Portable `.exe`**. | `dist-electron/` |
| `npm run build:win:dir` | Unpacks raw Electron binaries into an executable folder for **rapid local testing**. | `dist-electron/win-unpacked/` |
| `npm run electron:build` | Alias for standard Electron release build. | `dist-electron/` |

### Testing an Unpacked Windows Binary
```bash
npm run build:win:dir
# Launch the generated executable:
./dist-electron/win-unpacked/QuickThought.exe
```

---

## 5. Version Bumping & Release Script

To upgrade the application version across all project manifests and source files simultaneously, use the custom `bump-version` script:

```bash
npm run bump-version <NEW_VERSION>
```

### Example Usage
```bash
npm run bump-version 1.1.0
```

### What this script automatically updates:
1. `package.json` -> `"version": "1.1.0"`
2. `src/version.ts` -> `export const APP_VERSION = '1.1.0';`
3. `electron-builder.json` -> Automatically refreshes copyright dates and metadata.

After running `bump-version`, commit your changes and push to trigger a release:
```bash
git commit -am "chore(release): bump version to v1.1.0"
git push origin main
```

---

## 6. Silent Update System (`updateService.ts`)

QuickThought features a local, non-intrusive auto-updater that queries the GitHub Releases API for the latest release tag.

### Settings & Controls
Users can configure update behavior in **Settings -> Updates & Release**:

- **Automatic Update Checking**: Toggles background check on application launch.
- **Silent Background Updates**: When enabled, new versions download silently without interrupting note writing.
- **Pause All Updates**: Opt-out switch to completely suspend background network requests for updates.
- **Manual "Check for Updates" Button**: Forces an immediate manual check against GitHub Releases, even if automatic background updates are paused.

---

## 7. GitHub CI/CD Release Pipeline

QuickThought uses GitHub Actions with `actions/cache@v4` for fast, reproducible builds.

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
  │ .github/workflows/main.yml  │                 │ .github/workflows/release.yml│
  ├─────────────────────────────┤                 ├─────────────────────────────┤
  │ - Node.js 22 + npm Cache    │                 │ - Windows Server Runner     │
  │ - TypeScript Type Check     │                 │ - Auto Commit Delta Logs    │
  │ - Security Vulnerability Audit│                 │ - Package Windows .exe      │
  │ - Web Production Build Test │                 │ - Publish GitHub Release    │
  └─────────────────────────────┘                 └─────────────────────────────┘
```

### Streamlined Branching Strategy
- **`main` branch**: Primary development branch. Every push automatically runs `main.yml` (Code Quality, `npm run lint`, `npm audit`, and web production build test).
- **`release` branch**: Production release branch. Pushing `main` to `release` (`git push origin main:release`) triggers `release.yml`, which compiles the Windows installer & portable binaries and creates an official GitHub Release with auto-generated commit notes.

---

## 8. Security & Local Storage Rules

1. **Strict Local-First Guarantee**: Notes and settings are stored locally in IndexedDB / LocalStorage. Zero telemetry or user analytics are collected.
2. **No Environment Secrets Required**: QuickThought is designed to run 100% locally.
3. **Ignored Sensitive Files**: `.gitignore` is pre-configured to strictly exclude `.env`, `node_modules/`, `dist/`, `dist-electron/`, `*.exe`, and certificates.
