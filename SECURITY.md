# Security Policy 🛡️

## Supported Versions

| Version | Supported |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

QuickThought is a **100% offline, local-first application**. It does not transmit data over the network or connect to third-party tracking servers.

If you discover a security issue regarding local data storage, IPC message handling, or hotkey interception:

1. **Do NOT open a public issue.**
2. Email the maintainer directly at `security@quickthought.local` or contact the maintainer directly.
3. Include details about the vulnerability, steps to reproduce, and potential impact.

We will acknowledge receipt within 48 hours and work on a security fix promptly.

## Local Data Security
- All user notes are stored locally in IndexedDB / SQLite database files.
- Notes are never uploaded to any remote server.
- Optional encryption at rest can be configured via local vault settings.
