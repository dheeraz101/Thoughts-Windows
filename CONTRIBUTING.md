# Contributing to QuickThought 🤝

Thank you for your interest in contributing to QuickThought! We welcome contributions, bug reports, feature suggestions, and documentation improvements.

## 🚀 How to Contribute

### 1. Reporting Bugs
- Check the [Issues](https://github.com/your-username/quickthought.prewarm/issues) tab to see if the bug has already been reported.
- If not, create a new issue detailing:
  - Operating System & Version (e.g. Windows 11 Build 22631)
  - Steps to reproduce the bug
  - Expected vs actual behavior

### 2. Suggesting Features
- We prioritize **minimalism, speed, and local-first performance**.
- Submit feature suggestions via GitHub Discussions or Issues.

### 3. Pull Requests
1. Fork the repository and create your feature branch:
   ```bash
   git checkout -b feature/my-new-feature
   ```
2. Write clean, modular TypeScript code following existing patterns.
3. Ensure no linting errors or broken builds:
   ```bash
   npm run lint
   npm run build
   ```
4. Commit your changes with a clear commit message:
   ```bash
   git commit -m "feat: add custom shortcut re-binder"
   ```
5. Push to your branch and submit a Pull Request.

## 🎨 Code Style Guidelines
- **TypeScript**: Use strict type definitions.
- **Styling**: Use Tailwind CSS utility classes. Avoid custom CSS unless required for custom scrollbars or window glass effects.
- **Icons**: Import all icons strictly from `lucide-react`.

Thank you for helping make QuickThought better!
