# Contributing to QuickThought 🤝

Thank you for your interest in contributing to QuickThought! We welcome community contributions, bug fixes, UI enhancements, and documentation improvements.

---

## 🌿 Branching & Git Workflow Strategy

QuickThought uses a two-tier branch model:

1. **`main` Branch (Development & CI Check)**:
   - All feature work and bug fixes should be merged into `main`.
   - Pushing to `main` automatically runs our CI pipeline to check for TypeScript errors (`npm run lint`) and verifies that the production build compiles cleanly.
   ```bash
   git push origin main
   ```

2. **`release` Branch (Production Windows `.exe` Releases)**:
   - When code on `main` is stable and ready for a public Windows release, push `main` directly to the `release` branch:
   ```bash
   git push origin main:release
   ```
   - This triggers the Windows Release pipeline, which compiles the Windows NSIS `.exe` installer & portable `.exe` binary, extracts new commit logs, and publishes an official GitHub Release.

---

## 🚀 How to Contribute

### 1. Reporting Bugs
- Search existing [GitHub Issues](https://github.com/dheeraz101/Thoughts-Windows/issues) to ensure the issue isn't already logged.
- Use the **Bug Report** issue template and include:
  - Windows / OS Version (e.g. Windows 11 Build 22631)
  - Clear steps to reproduce
  - Screenshots or console logs if applicable

### 2. Requesting Features
- Open a feature request issue using our **Feature Request** template.
- Focus on features that maintain our core values: **speed, keyboard accessibility, local privacy, and distraction-free writing**.

### 3. Submitting Pull Requests (PRs)
1. Fork the repository and create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
2. Make your code edits following our code style guidelines.
3. Test locally and ensure there are no linter or build errors:
   ```bash
   npm run lint
   npm run build
   ```
4. Commit your changes using descriptive commit messages:
   ```bash
   git commit -m "feat(editor): add version snapshot comparison view"
   ```
5. Push to your fork and submit a Pull Request targeting the `main` branch.

---

## 🎨 Code Style & Standards

- **TypeScript**: Strict type safety. Avoid `any` types where possible.
- **Styling**: Tailwind CSS utility classes. Keep custom CSS in `src/index.css` minimal.
- **Icons**: Import all icons strictly from `lucide-react`.
- **UI Performance**: Minimize unnecessary re-renders; maintain smooth typing responsiveness under all conditions.

Thank you for helping make QuickThought better!
