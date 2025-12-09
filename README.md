# Dockerman

[![Version](https://img.shields.io/badge/version-v3.0.1-blue.svg?style=flat-square)](https://github.com/dockerman/dockerman/releases/tag/v3.0.1)
[![Release Date](https://img.shields.io/badge/release%20date-Dec%2010%2C%202025-green.svg?style=flat-square)](https://github.com/dockerman/dockerman/releases/tag/v3.0.1)

A modern, lightweight Docker management UI built with Tauri and Rust.
Focus on simplicity and performance for Docker container management.

- 🚀 Fast startup and minimal resource usage
- 💻 Powerful performance with Tauri
- 🎯 Clean, focused interface
- 📊 Real-time container monitoring
- 🔒 Local-only operation

![Dashboard Screenshot](public/screenshots/2.4.0/dashboard.png)
![Terminal Screenshot](public/screenshots/2.4.0/terminal.png)
![Process List Screenshot](public/screenshots/2.4.0/process.png)
![inspect Screenshot](public/screenshots/2.4.0/inspect.png)
![stats Screenshot](public/screenshots/2.4.0/stat.png)
![logs Screenshot](public/screenshots/2.4.0/log.png)
![ssh Screenshot](public/screenshots/2.4.0/ssh.png)
![build Screenshot](public/screenshots/2.4.0/build-log.png)
![build History Screenshot](public/screenshots/2.4.0/build-log-history.png)
![file system](public/screenshots/3.0.0/file.png)

## Features

### Dashboard Overview

- 📊 Container and image statistics at a glance
- 💾 Total image size monitoring
- 🔄 Real-time container status updates
- 📈 Resource usage visualization

### Container Management

- 📋 Detailed container list with status indicators
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
- 📝 Process list viewing
- 📜 Log viewer with real-time updates
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

### Image Management

- 📦 Image list with size and tag information
- 🏗️ Image Build
  - Build from Dockerfile
  - Support for build args and tags
  - Real-time build log streaming
  - Historical log playback
- 🕒 Creation time tracking
- 🔍 Detailed image inspection
- 📊 Usage statistics
  - Total count
  - Size analytics
  - Usage tracking

### System Integration

- 🔌 Native Docker daemon connection
- 🚀 Lightweight and fast performance
- 💻 Cross-platform desktop application
