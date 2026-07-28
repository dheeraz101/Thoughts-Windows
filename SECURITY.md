# Security Policy 🛡️

## Supported Versions

| Version | Supported |
| ------- | ------------------ |
| 1.x     | :white_check_mark: |
| < 1.0   | :x:                |

---

## 🔒 Security & Privacy Commitments

QuickThought is engineered as a **100% local-first, offline-first application**:

1. **No Cloud Sync or Remote Telemetry**: Notes, snapshots, and application settings are stored locally on your device in browser/Electron storage.
2. **No Data Tracking**: No user activity analytics or data tracking scripts exist in the codebase.
3. **No External Network Requests**: The core editing experience operates fully offline without requiring an internet connection.

---

## 📩 Reporting a Vulnerability

If you discover a security vulnerability (such as electron IPC exploitation, local file access leaks, or unsafe HTML parsing in Markdown preview):

1. **Do NOT open a public GitHub issue.**
2. Please report the issue privately by emailing the maintainers or submitting a private security advisory through GitHub.
3. Include:
   - Description of the vulnerability
   - Proof of concept / steps to reproduce
   - Potential impact on local note data or system permissions

We aim to acknowledge receipt of vulnerability reports within 48 hours and release fixes in the subsequent release build.
