# Dockerman

Language: 🇺🇸 English | [🇨🇳 简体中文](./README.zh-CN.md)

[![Version](https://img.shields.io/badge/version-v3.6.0-blue.svg?style=flat-square)](https://github.com/dockerman/dockerman/releases/tag/v3.6.0)
[![Release Date](https://img.shields.io/badge/release%20date-Jan%2026%2C%202026-green.svg?style=flat-square)](https://github.com/dockerman/dockerman/releases/tag/v3.6.0)

A modern, lightweight Docker management UI built with Tauri and Rust.
Focus on simplicity and performance for Docker container management.

- 🚀 Fast startup and minimal resource usage
- 💻 Powerful performance with Tauri
- 🎯 Clean, focused interface
- 📊 Real-time container monitoring
- 🔒 Local-only operation
- 🌙 Comprehensive dark mode support
- 🌐 Internationalization (i18n) support

![Dashboard Screenshot](public/screenshots/3.2.0/dashboard.png)
![Dashboard Dark Screenshot](public/screenshots/3.2.0/dark.png)
![Terminal Screenshot](public/screenshots/2.4.0/terminal.png)
![Process List Screenshot](public/screenshots/2.4.0/process.png)
![inspect Screenshot](public/screenshots/2.4.0/inspect.png)
![stats Screenshot](public/screenshots/2.4.0/stat.png)
![logs Screenshot](public/screenshots/2.4.0/log.png)
![ssh Screenshot](public/screenshots/2.4.0/ssh.png)
![build Screenshot](public/screenshots/2.4.0/build-log.png)
![build History Screenshot](public/screenshots/2.4.0/build-log-history.png)
![file system](public/screenshots/3.0.0/file.png)
![Termin Settings](public/screenshots/3.2.0/terminal-settings.png)
![Image Analysis](public/screenshots/3.3.0/image-analysis.png)
![Compose](public/screenshots/3.4.0/compose.png)

## Features

### Dashboard Overview

- 📊 Container and image statistics at a glance
- 💾 Total image size monitoring
- 🔄 Real-time container status updates
- 📈 Resource usage visualization
- 🖥️ System information display (Docker version, OS, architecture, resource limits)

### Container Management

- 📋 Detailed container list with status indicators
- 🐳 Docker Compose View
  - Toggle between flat list and grouped view by Compose projects
  - Compose project cards with status indicators and running container counts
  - Collapsible Standalone Containers section for non-Compose containers
  - Full Compose lifecycle management (Up, Stop, Restart, Pull, Remove)
  - Support for all Docker Compose CLI options (file, env-file, profile, progress, dry-run)
- 🐳 Container creation dialog with dual input modes
  - Form-based configuration for guided setup
  - Docker command input mode with parsing support
  - Docker Run command import and parsing with enhanced UI
- 🔍 Container inspection with detailed information
  - Port mappings
  - Network settings
  - Mount points
  - Container labels
- 📊 Resource monitoring
  - CPU usage and distribution
  - Memory usage
  - Network statistics
  - Block I/O statistics
- 💻 Integrated terminal access
  - Terminal theme picker with color theme customization
- 📝 Process list viewing
- 📜 Log viewer with real-time updates
  - Virtualized log list with follow/pause and load-more history
  - Keyword/regex filtering with highlight and quick shortcuts
  - Export logs as TXT/JSON and copy filtered results
- 📂 Container File Browser
  - File tree navigation with dynamic loading
  - Folder upload and download support
  - Single file upload and download with mode preservation
  - Symlink support and pagination for large directories
  - Context menus for file/folder operations

### Docker Events

- 🔔 Real-time Docker event listening
- 🔍 Comprehensive event filtering and search
- 📋 JSON details dialog for inspecting event data
- ⚡ Action buttons with Copy JSON and Remove options

### Template Management

- 🧩 Stack templates support with migrations, UI, and API integration

### Image Management

- 📦 Image list with size and tag information
- 🗑️ Batch Operations: Multi-select batch delete for Images, Networks, and Volumes
- 🏗️ Image Build
  - Build from Dockerfile
  - Support for build args and tags
  - Real-time build log streaming
  - Historical log playback
  - Docker build command generation and parsing functionality
- 📉 Image Size Analysis
  - Detailed breakdown of layer sizes
  - Interactive size distribution bar with color-coded blocks
  - Layer details table with expand/collapse for Dockerfile commands
  - Collapsible distribution panel with compact view support
- 🕒 Creation time tracking
- 🔍 Detailed image inspection
- 📊 Usage statistics
  - Total count
  - Size analytics
  - Usage tracking

### System Integration

- 🔌 Native Docker daemon connection
  - Custom Docker socket path support
  - TCP connection support for remote Docker daemon
  - SSH socket forwarding for remote connections
- 📁 Sidebar collapsible sections with container count badges
- 🚀 Lightweight and fast performance
- 💻 Cross-platform desktop application
