# Dockerman Documentation Content Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add comprehensive bilingual documentation (14 English + 14 Chinese pages) organized in 3 groups: guides, platform, reference.

**Architecture:** Pure content addition using Fumadocs MDX. No code changes needed — Fumadocs catch-all route and auto-indexing handle everything. Create meta.json files for navigation, then MDX content files.

**Tech Stack:** Fumadocs MDX, Next.js App Router, i18n (directory-based: `content/docs/` for English, `content/docs/zh/` for Chinese)

---

### Task 1: Create navigation meta.json files

**Files:**
- Modify: `content/docs/meta.json`
- Create: `content/docs/guides/meta.json`
- Create: `content/docs/platform/meta.json`
- Create: `content/docs/reference/meta.json`

**Step 1: Update top-level meta.json**

Replace `content/docs/meta.json` with:

```json
{
  "title": "Dockerman Docs",
  "pages": [
    "index",
    "getting-started",
    "---",
    "guides",
    "platform",
    "reference"
  ]
}
```

The `"---"` is a Fumadocs separator line in the sidebar.

**Step 2: Create guides/meta.json**

Create `content/docs/guides/meta.json`:

```json
{
  "title": "Guides",
  "pages": [
    "containers",
    "images",
    "networks",
    "volumes",
    "compose",
    "monitoring",
    "terminal",
    "file-browser"
  ],
  "defaultOpen": true
}
```

**Step 3: Create platform/meta.json**

Create `content/docs/platform/meta.json`:

```json
{
  "title": "Platform",
  "pages": [
    "wsl",
    "linux"
  ],
  "defaultOpen": true
}
```

**Step 4: Create reference/meta.json**

Create `content/docs/reference/meta.json`:

```json
{
  "title": "Reference",
  "pages": [
    "keyboard-shortcuts",
    "settings",
    "licensing",
    "troubleshooting"
  ],
  "defaultOpen": true
}
```

**Step 5: Commit**

```bash
git add content/docs/meta.json content/docs/guides/meta.json content/docs/platform/meta.json content/docs/reference/meta.json
git commit -m "docs: add navigation structure for documentation sections"
```

---

### Task 2: Create English guides content (8 files)

> This task can run in parallel with Tasks 3 and 4.

**Files:**
- Create: `content/docs/guides/containers.mdx`
- Create: `content/docs/guides/images.mdx`
- Create: `content/docs/guides/networks.mdx`
- Create: `content/docs/guides/volumes.mdx`
- Create: `content/docs/guides/compose.mdx`
- Create: `content/docs/guides/monitoring.mdx`
- Create: `content/docs/guides/terminal.mdx`
- Create: `content/docs/guides/file-browser.mdx`

**Writing style reference:** Match `content/docs/getting-started.mdx` — practical, concise, 50-150 lines, `##` for main sections, `###` for subsections. Frontmatter has `title` and `description`.

**Step 1: Create containers.mdx**

```mdx
---
title: Container Management
description: Manage Docker containers with Dockerman
---

## Overview

Dockerman provides a visual interface for managing your Docker containers. You can view, create, start, stop, restart, and remove containers from a single dashboard.

## Container List

The main Containers page displays all containers on your system, including running and stopped ones. Each entry shows:

- Container name and ID
- Image used
- Current status (running, stopped, paused)
- Port mappings
- Created time

Use the search bar to filter containers by name or image.

## Creating a Container

1. Click the **Create** button on the Containers page
2. Select a base image from your local images or pull a new one
3. Configure container settings:
   - Name
   - Port mappings
   - Volume mounts
   - Environment variables
   - Resource limits (CPU, memory)
4. Click **Create** to launch the container

## Container Actions

Right-click a container or use the action buttons to:

- **Start** — Start a stopped container
- **Stop** — Gracefully stop a running container
- **Restart** — Stop and start the container
- **Pause / Unpause** — Freeze or resume container processes
- **Remove** — Delete the container (must be stopped first)

## Viewing Logs

Click on a container to open its detail view, then select the **Logs** tab. Features include:

- Real-time log streaming
- Timestamp display
- Search and filter within logs
- Download logs as a file

## Inspecting a Container

The **Inspect** tab shows detailed container configuration in JSON format, including network settings, mounts, and environment variables.
```

**Step 2: Create images.mdx**

```mdx
---
title: Image Management
description: Pull, build, and manage Docker images
---

## Overview

The Images page lets you manage all Docker images on your system, including pulling new images, building from Dockerfiles, and cleaning up unused ones.

## Image List

All local images are displayed with:

- Repository and tag
- Image ID
- Size
- Created time

## Pulling an Image

1. Click **Pull** on the Images page
2. Enter the image name and tag (e.g., `nginx:latest`)
3. Click **Pull** to start downloading

The pull progress is displayed in real time with layer-by-layer download status.

## Building an Image

1. Click **Build** on the Images page
2. Select a Dockerfile or build context directory
3. Set the image tag
4. Click **Build** to start

Build output is streamed in real time so you can monitor each build step.

## Managing Images

- **Remove** — Delete an image (will fail if containers depend on it)
- **Tag** — Add a new tag to an existing image
- **History** — View the layer history of an image
- **Inspect** — View detailed image metadata in JSON format

## Cleaning Up

Use the **Prune** button to remove all dangling (untagged) images and reclaim disk space.
```

**Step 3: Create networks.mdx**

```mdx
---
title: Network Management
description: Create and manage Docker networks
---

## Overview

Dockerman provides a visual interface for managing Docker networks. You can view existing networks, create new ones, and connect or disconnect containers.

## Network List

The Networks page shows all Docker networks with:

- Network name and ID
- Driver type (bridge, host, overlay, etc.)
- Scope (local, swarm)
- Connected container count

## Creating a Network

1. Click **Create** on the Networks page
2. Configure:
   - Network name
   - Driver (bridge is the most common)
   - Subnet and gateway (optional)
   - Enable IPv6 (optional)
3. Click **Create**

## Connecting Containers

1. Click on a network to view its details
2. Use the **Connect** button to add a container to the network
3. Use the **Disconnect** button to remove a container

## Inspecting a Network

The detail view shows the full network configuration including:

- IPAM settings
- Connected containers with their IP addresses
- Network options and labels

## Removing a Network

Click **Remove** on a network to delete it. The network must have no connected containers before it can be removed.
```

**Step 4: Create volumes.mdx**

```mdx
---
title: Volume Management
description: Create and manage Docker volumes for persistent data
---

## Overview

Docker volumes provide persistent storage for container data. Dockerman lets you create, inspect, and manage volumes from a visual interface.

## Volume List

The Volumes page displays all Docker volumes with:

- Volume name
- Driver
- Mount point
- Created time

## Creating a Volume

1. Click **Create** on the Volumes page
2. Enter a volume name
3. Select a driver (local is the default)
4. Add labels if needed
5. Click **Create**

## Using Volumes

Volumes can be mounted when creating a container:

1. In the container creation form, go to the **Volumes** section
2. Click **Add Mount**
3. Select the volume and set the mount path inside the container
4. Choose read-write or read-only access

## Inspecting a Volume

Click on a volume to view:

- Full configuration in JSON format
- Mount point on the host
- Labels and options
- Containers currently using this volume

## Removing a Volume

Click **Remove** to delete a volume. The volume must not be in use by any container.

Use **Prune** to remove all unused volumes and free up disk space.
```

**Step 5: Create compose.mdx**

```mdx
---
title: Docker Compose
description: Manage multi-container applications with Docker Compose
---

## Overview

Dockerman supports Docker Compose for managing multi-container applications. You can import Compose files, start and stop services, and view logs for each service.

## Importing a Compose Project

1. Click **Import** on the Compose page
2. Select a `docker-compose.yml` file or a directory containing one
3. Dockerman will parse the file and display all defined services

## Managing Services

Each Compose project shows its services with their current status. You can:

- **Start All** — Launch all services in the project
- **Stop All** — Stop all running services
- **Start / Stop** individual services
- **Restart** a specific service

## Viewing Logs

Select a service to view its logs. You can:

- Stream logs in real time
- Filter by service name
- Search within log output

## Environment Variables

Compose projects can use `.env` files. Dockerman reads these automatically from the project directory.

## Removing a Project

Click **Remove** to tear down all containers, networks, and volumes created by the Compose project.
```

**Step 6: Create monitoring.mdx**

```mdx
---
title: Real-time Monitoring
description: Monitor container resource usage in real time
---

## Overview

Dockerman provides real-time monitoring of container resource usage. Track CPU, memory, network I/O, and disk I/O for running containers.

## Dashboard

The monitoring dashboard shows an overview of your Docker environment:

- Total containers (running / stopped)
- System CPU and memory usage
- Network throughput

## Container Stats

Click on a running container to view real-time stats:

- **CPU** — Usage percentage with a live graph
- **Memory** — Current usage, limit, and percentage
- **Network I/O** — Bytes sent and received per second
- **Disk I/O** — Read and write operations per second

Stats update automatically every few seconds.

## Resource Alerts

Dockerman highlights containers that are approaching their resource limits:

- High CPU usage is shown in yellow/red
- Memory usage near the limit triggers a warning

## Monitoring Tips

- Use resource limits when creating containers to prevent runaway usage
- Check the monitoring dashboard regularly for performance issues
- Container stats are only available for running containers
```

**Step 7: Create terminal.mdx**

```mdx
---
title: Built-in Terminal
description: Access container shells directly from Dockerman
---

## Overview

Dockerman includes a built-in terminal that lets you open a shell inside any running container without leaving the application.

## Opening a Terminal

1. Navigate to a running container
2. Click the **Terminal** tab or button
3. A terminal session opens inside the container

## Shell Selection

Dockerman tries to detect available shells in the container:

- `/bin/bash` — Used by default if available
- `/bin/sh` — Fallback for minimal containers

You can also specify a custom shell command when opening a terminal.

## Terminal Features

- Full interactive terminal with keyboard input
- Copy and paste support
- Scrollback buffer for reviewing output
- Multiple terminal sessions to the same container

## Closing a Terminal

Close the terminal tab to end the session. The terminal process inside the container is terminated when you disconnect.
```

**Step 8: Create file-browser.mdx**

```mdx
---
title: File Browser
description: Browse and manage files inside Docker containers
---

## Overview

Dockerman's file browser lets you explore the filesystem inside a running container. You can navigate directories, view files, and transfer files between your host and the container.

## Browsing Files

1. Navigate to a running container
2. Click the **Files** tab
3. The file browser shows the container's root filesystem

Navigate directories by clicking on them. The breadcrumb trail shows your current path.

## Viewing Files

Click on a file to view its contents. Dockerman supports previewing:

- Text files (logs, configs, scripts)
- JSON and YAML files with syntax highlighting

## Uploading Files

1. Navigate to the target directory in the container
2. Click **Upload**
3. Select files from your host machine
4. Files are copied into the container at the current path

## Downloading Files

Right-click a file or directory and select **Download** to save it to your host machine. Directories are downloaded as tar archives.
```

**Step 9: Commit**

```bash
git add content/docs/guides/
git commit -m "docs: add English guides for containers, images, networks, volumes, compose, monitoring, terminal, file-browser"
```

---

### Task 3: Create English platform content (2 files)

> This task can run in parallel with Tasks 2 and 4.

**Files:**
- Create: `content/docs/platform/wsl.mdx`
- Create: `content/docs/platform/linux.mdx`

**Step 1: Create wsl.mdx**

```mdx
---
title: Windows WSL
description: Using Dockerman with Windows Subsystem for Linux
---

## Overview

Dockerman supports Docker running through Windows Subsystem for Linux (WSL 2). This guide covers setup and common configurations.

## Prerequisites

- Windows 10 version 2004+ or Windows 11
- WSL 2 enabled
- Docker Desktop installed with WSL 2 backend, or Docker Engine running directly in WSL 2

## Setup with Docker Desktop

If you use Docker Desktop with WSL 2 backend:

1. Open Docker Desktop settings
2. Go to **Resources > WSL Integration**
3. Enable integration for your preferred WSL distro
4. Install and launch Dockerman on Windows
5. Dockerman connects to Docker automatically

## Setup with Docker Engine in WSL 2

If you run Docker Engine directly inside WSL 2 (without Docker Desktop):

1. Start Docker Engine in your WSL 2 distro
2. Ensure the Docker socket is accessible at `/var/run/docker.sock`
3. Launch Dockerman — it will detect the Docker socket

## Common Issues

### Docker socket not found

Make sure Docker is running in your WSL 2 distro:

```bash
sudo service docker start
```

### Slow performance

WSL 2 uses a virtual machine. For best performance:

- Store your project files inside the WSL 2 filesystem (not on Windows drives)
- Allocate sufficient memory to WSL 2 in `.wslconfig`

### Connection refused

Verify Docker is accessible:

```bash
docker info
```

If this fails, restart the Docker service or check your WSL 2 configuration.
```

**Step 2: Create linux.mdx**

```mdx
---
title: Linux
description: Setting up Dockerman on Linux
---

## Overview

Dockerman runs natively on Linux. This guide covers installation, Docker Engine setup, and permissions.

## Supported Distributions

- Ubuntu 20.04+
- Debian 11+
- Fedora 38+
- Arch Linux
- Other distributions with GTK/WebKit support

## Installation

1. Download the `.deb`, `.rpm`, or `.AppImage` package from the [download page](/download)
2. Install the package using your distribution's package manager

For Debian/Ubuntu:

```bash
sudo dpkg -i dockerman_*.deb
```

For Fedora:

```bash
sudo rpm -i dockerman_*.rpm
```

For AppImage:

```bash
chmod +x Dockerman_*.AppImage
./Dockerman_*.AppImage
```

## Docker Engine Setup

Dockerman requires Docker Engine installed and running:

```bash
# Install Docker (Ubuntu/Debian)
curl -fsSL https://get.docker.com | sh

# Start Docker
sudo systemctl start docker
sudo systemctl enable docker
```

## User Permissions

To use Docker without `sudo`, add your user to the `docker` group:

```bash
sudo usermod -aG docker $USER
```

Log out and log back in for the group change to take effect. Then launch Dockerman — it will detect Docker automatically.

## Common Issues

### Permission denied

If Dockerman shows a permission error, verify your user is in the `docker` group:

```bash
groups
```

If `docker` is not listed, run the `usermod` command above and re-login.

### Docker daemon not running

Start the Docker service:

```bash
sudo systemctl start docker
```
```

**Step 3: Commit**

```bash
git add content/docs/platform/
git commit -m "docs: add English platform guides for WSL and Linux"
```

---

### Task 4: Create English reference content (4 files)

> This task can run in parallel with Tasks 2 and 3.

**Files:**
- Create: `content/docs/reference/keyboard-shortcuts.mdx`
- Create: `content/docs/reference/settings.mdx`
- Create: `content/docs/reference/licensing.mdx`
- Create: `content/docs/reference/troubleshooting.mdx`

**Step 1: Create keyboard-shortcuts.mdx**

```mdx
---
title: Keyboard Shortcuts
description: Keyboard shortcuts reference for Dockerman
---

## Global Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + K` | Open command palette |
| `Ctrl/Cmd + ,` | Open settings |
| `Ctrl/Cmd + Q` | Quit Dockerman |
| `Ctrl/Cmd + R` | Refresh current view |
| `Ctrl/Cmd + F` | Search / Filter |

## Navigation

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + 1` | Go to Containers |
| `Ctrl/Cmd + 2` | Go to Images |
| `Ctrl/Cmd + 3` | Go to Networks |
| `Ctrl/Cmd + 4` | Go to Volumes |
| `Ctrl/Cmd + 5` | Go to Compose |

## Container Actions

| Shortcut | Action |
|----------|--------|
| `Enter` | Open selected container |
| `Ctrl/Cmd + T` | Open terminal for container |
| `Ctrl/Cmd + L` | View container logs |
| `Delete` | Remove selected container |

## Terminal

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + Shift + T` | New terminal tab |
| `Ctrl/Cmd + W` | Close terminal tab |
| `Ctrl/Cmd + C` | Copy (when text selected) |
| `Ctrl/Cmd + V` | Paste |
```

**Step 2: Create settings.mdx**

```mdx
---
title: Settings
description: Configure Dockerman to your preferences
---

## Accessing Settings

Open settings via the gear icon in the sidebar or press `Ctrl/Cmd + ,`.

## General

- **Language** — Choose between English and Chinese
- **Theme** — Light, Dark, or System (follows OS setting)
- **Start at login** — Launch Dockerman when you log in

## Docker Connection

- **Docker socket path** — Path to the Docker socket (default: `/var/run/docker.sock`)
- **Connection timeout** — How long to wait for Docker to respond

Dockerman auto-detects your Docker installation on startup. You only need to change these if you use a non-standard configuration.

## Notifications

- **Container state changes** — Get notified when containers start, stop, or crash
- **Resource alerts** — Alerts when containers approach resource limits

## Data

- **Log retention** — How long to keep container logs in Dockerman
- **Cache** — Clear cached data and temporary files
```

**Step 3: Create licensing.mdx**

```mdx
---
title: Licensing
description: Manage your Dockerman license
---

## License Types

- **Free** — Basic features with limited container management
- **Pro** — Full features including advanced monitoring, file browser, and priority support

## Activating a License

1. Purchase a license from the [pricing page](/pricing)
2. Open Dockerman and go to **Settings > License**
3. Enter your license key
4. Click **Activate**

Your license is tied to your machine. You can deactivate it to transfer to another machine.

## Managing Your License

- **View status** — Check your current license type and expiration in Settings
- **Deactivate** — Release the license from this machine so it can be used elsewhere
- **Renew** — Extend your license before it expires

## License FAQ

**Can I use one license on multiple machines?**
Each license is valid for one machine at a time. Deactivate on one machine before activating on another.

**What happens when my license expires?**
Dockerman reverts to the Free tier. Your data and settings are preserved.

**How do I get a refund?**
Contact support within 14 days of purchase for a full refund.
```

**Step 4: Create troubleshooting.mdx**

```mdx
---
title: Troubleshooting
description: Common issues and solutions for Dockerman
---

## Docker Connection Issues

### Dockerman cannot connect to Docker

1. Verify Docker is running:
   ```bash
   docker info
   ```
2. Check the Docker socket exists:
   ```bash
   ls -la /var/run/docker.sock
   ```
3. Ensure your user has permission to access Docker:
   ```bash
   groups | grep docker
   ```

### Connection timeout

- Increase the timeout in **Settings > Docker Connection**
- Restart the Docker daemon and try again

## Performance Issues

### Dockerman is slow or unresponsive

- Close unused terminal sessions
- Reduce the number of containers displayed (use filters)
- Check system resource usage — Dockerman is lightweight but Docker itself may consume resources

### High memory usage

- Large log buffers can consume memory. Clear container logs or reduce log retention in Settings
- Close file browser tabs you're not using

## Display Issues

### UI appears broken or unstyled

- Update Dockerman to the latest version
- Clear the application cache in **Settings > Data > Clear Cache**
- Restart the application

### Dark mode not working

- Ensure your system theme is set correctly
- Try switching to an explicit theme (Light or Dark) in Settings instead of System

## Platform-Specific Issues

### macOS: "App is damaged and can't be opened"

This happens when macOS blocks unsigned applications:

```bash
xattr -cr /Applications/Dockerman.app
```

### Linux: Application won't launch

Ensure required system libraries are installed:

```bash
# Ubuntu/Debian
sudo apt install libwebkit2gtk-4.1-0 libgtk-3-0
```

### Windows: WSL connection issues

See the [WSL guide](/docs/platform/wsl) for detailed troubleshooting.

## Getting Help

If your issue isn't listed here:

- Check the [changelog](/changelog) for recent fixes
- Visit the [GitHub repository](https://github.com/ZingerLittleBee/dockerman) for known issues
```

**Step 5: Commit**

```bash
git add content/docs/reference/
git commit -m "docs: add English reference docs for shortcuts, settings, licensing, troubleshooting"
```

---

### Task 5: Create Chinese guides content (8 files)

> This task can run in parallel with Tasks 6 and 7.

**Files:**
- Create: `content/docs/zh/guides/containers.mdx`
- Create: `content/docs/zh/guides/images.mdx`
- Create: `content/docs/zh/guides/networks.mdx`
- Create: `content/docs/zh/guides/volumes.mdx`
- Create: `content/docs/zh/guides/compose.mdx`
- Create: `content/docs/zh/guides/monitoring.mdx`
- Create: `content/docs/zh/guides/terminal.mdx`
- Create: `content/docs/zh/guides/file-browser.mdx`

**Writing style reference:** Match `content/docs/zh/getting-started.mdx` — natural Chinese, not machine-translated. Technical terms stay in English (Docker, WSL, etc.).

**Step 1: Create zh/guides/containers.mdx**

```mdx
---
title: 容器管理
description: 使用 Dockerman 管理 Docker 容器
---

## 概览

Dockerman 提供可视化界面来管理 Docker 容器。你可以在一个面板中查看、创建、启动、停止、重启和删除容器。

## 容器列表

容器页面展示系统中所有容器，包括运行中和已停止的容器。每个条目显示：

- 容器名称和 ID
- 使用的镜像
- 当前状态（运行中、已停止、已暂停）
- 端口映射
- 创建时间

使用搜索栏可按名称或镜像筛选容器。

## 创建容器

1. 在容器页面点击 **创建** 按钮
2. 从本地镜像中选择基础镜像，或拉取新镜像
3. 配置容器设置：
   - 名称
   - 端口映射
   - 卷挂载
   - 环境变量
   - 资源限制（CPU、内存）
4. 点击 **创建** 启动容器

## 容器操作

右键点击容器或使用操作按钮：

- **启动** — 启动已停止的容器
- **停止** — 优雅地停止运行中的容器
- **重启** — 停止并重新启动容器
- **暂停 / 恢复** — 冻结或恢复容器进程
- **删除** — 删除容器（需先停止）

## 查看日志

点击容器打开详情视图，然后选择 **日志** 标签页。功能包括：

- 实时日志流
- 时间戳显示
- 日志内搜索和筛选
- 下载日志文件

## 检查容器

**检查** 标签页以 JSON 格式显示容器的详细配置，包括网络设置、挂载和环境变量。
```

**Step 2: Create zh/guides/images.mdx**

```mdx
---
title: 镜像管理
description: 拉取、构建和管理 Docker 镜像
---

## 概览

镜像页面用于管理系统中所有 Docker 镜像，包括拉取新镜像、从 Dockerfile 构建以及清理未使用的镜像。

## 镜像列表

所有本地镜像会展示以下信息：

- 仓库和标签
- 镜像 ID
- 大小
- 创建时间

## 拉取镜像

1. 在镜像页面点击 **拉取**
2. 输入镜像名称和标签（例如 `nginx:latest`）
3. 点击 **拉取** 开始下载

拉取进度会实时显示，包含每一层的下载状态。

## 构建镜像

1. 在镜像页面点击 **构建**
2. 选择 Dockerfile 或构建上下文目录
3. 设置镜像标签
4. 点击 **构建** 开始

构建输出会实时展示，你可以监控每个构建步骤。

## 管理镜像

- **删除** — 删除镜像（如果有容器依赖则会失败）
- **标签** — 为已有镜像添加新标签
- **历史** — 查看镜像的层历史
- **检查** — 以 JSON 格式查看镜像详细元数据

## 清理

使用 **清理** 按钮删除所有悬空（无标签）镜像，释放磁盘空间。
```

**Step 3: Create zh/guides/networks.mdx**

```mdx
---
title: 网络管理
description: 创建和管理 Docker 网络
---

## 概览

Dockerman 提供可视化界面管理 Docker 网络。你可以查看已有网络、创建新网络以及连接或断开容器。

## 网络列表

网络页面展示所有 Docker 网络，包含：

- 网络名称和 ID
- 驱动类型（bridge、host、overlay 等）
- 作用域（local、swarm）
- 已连接容器数量

## 创建网络

1. 在网络页面点击 **创建**
2. 配置：
   - 网络名称
   - 驱动（bridge 最常用）
   - 子网和网关（可选）
   - 启用 IPv6（可选）
3. 点击 **创建**

## 连接容器

1. 点击网络查看详情
2. 使用 **连接** 按钮将容器添加到网络
3. 使用 **断开** 按钮从网络中移除容器

## 检查网络

详情视图展示完整的网络配置，包括：

- IPAM 设置
- 已连接容器及其 IP 地址
- 网络选项和标签

## 删除网络

点击 **删除** 移除网络。网络必须没有已连接容器才能删除。
```

**Step 4: Create zh/guides/volumes.mdx**

```mdx
---
title: 卷管理
description: 创建和管理 Docker 卷以实现数据持久化
---

## 概览

Docker 卷为容器数据提供持久化存储。Dockerman 允许你通过可视化界面创建、检查和管理卷。

## 卷列表

卷页面展示所有 Docker 卷，包含：

- 卷名称
- 驱动
- 挂载点
- 创建时间

## 创建卷

1. 在卷页面点击 **创建**
2. 输入卷名称
3. 选择驱动（默认为 local）
4. 按需添加标签
5. 点击 **创建**

## 使用卷

创建容器时可以挂载卷：

1. 在容器创建表单中，转到 **卷** 部分
2. 点击 **添加挂载**
3. 选择卷并设置容器内的挂载路径
4. 选择读写或只读访问

## 检查卷

点击卷查看：

- JSON 格式的完整配置
- 主机上的挂载点
- 标签和选项
- 当前使用此卷的容器

## 删除卷

点击 **删除** 移除卷。卷不能正在被任何容器使用。

使用 **清理** 删除所有未使用的卷，释放磁盘空间。
```

**Step 5: Create zh/guides/compose.mdx**

```mdx
---
title: Docker Compose
description: 使用 Docker Compose 管理多容器应用
---

## 概览

Dockerman 支持 Docker Compose，用于管理多容器应用。你可以导入 Compose 文件、启停服务以及查看每个服务的日志。

## 导入 Compose 项目

1. 在 Compose 页面点击 **导入**
2. 选择 `docker-compose.yml` 文件或包含该文件的目录
3. Dockerman 会解析文件并展示所有定义的服务

## 管理服务

每个 Compose 项目展示其服务及当前状态。你可以：

- **全部启动** — 启动项目中的所有服务
- **全部停止** — 停止所有运行中的服务
- **启动 / 停止** 单个服务
- **重启** 特定服务

## 查看日志

选择一个服务查看其日志。你可以：

- 实时流式查看日志
- 按服务名筛选
- 在日志中搜索

## 环境变量

Compose 项目可以使用 `.env` 文件。Dockerman 会自动从项目目录读取这些文件。

## 删除项目

点击 **删除** 可拆除 Compose 项目创建的所有容器、网络和卷。
```

**Step 6: Create zh/guides/monitoring.mdx**

```mdx
---
title: 实时监控
description: 实时监控容器资源使用情况
---

## 概览

Dockerman 提供容器资源使用的实时监控。追踪运行中容器的 CPU、内存、网络 I/O 和磁盘 I/O。

## 仪表板

监控仪表板展示 Docker 环境概览：

- 容器总数（运行中 / 已停止）
- 系统 CPU 和内存使用率
- 网络吞吐量

## 容器统计

点击运行中的容器查看实时统计数据：

- **CPU** — 使用率百分比，附带实时图表
- **内存** — 当前使用量、限制和百分比
- **网络 I/O** — 每秒发送和接收字节数
- **磁盘 I/O** — 每秒读写操作数

统计数据每隔几秒自动更新。

## 资源告警

Dockerman 会高亮显示接近资源限制的容器：

- CPU 使用过高显示为黄色/红色
- 内存使用接近限制时触发告警

## 监控建议

- 创建容器时设置资源限制，防止资源耗尽
- 定期查看监控仪表板，关注性能问题
- 容器统计仅对运行中的容器可用
```

**Step 7: Create zh/guides/terminal.mdx**

```mdx
---
title: 内置终端
description: 直接在 Dockerman 中访问容器 Shell
---

## 概览

Dockerman 内置终端功能，无需离开应用即可在任何运行中的容器内打开 Shell。

## 打开终端

1. 进入一个运行中的容器
2. 点击 **终端** 标签页或按钮
3. 终端会话在容器内打开

## Shell 选择

Dockerman 会尝试检测容器中可用的 Shell：

- `/bin/bash` — 如果可用则默认使用
- `/bin/sh` — 对于精简容器的备选方案

打开终端时也可以指定自定义 Shell 命令。

## 终端功能

- 完整的交互式终端，支持键盘输入
- 复制粘贴支持
- 回滚缓冲区，用于查看历史输出
- 支持对同一容器开启多个终端会话

## 关闭终端

关闭终端标签页即可结束会话。断开连接时，容器内的终端进程会被终止。
```

**Step 8: Create zh/guides/file-browser.mdx**

```mdx
---
title: 文件浏览器
description: 浏览和管理 Docker 容器内的文件
---

## 概览

Dockerman 的文件浏览器允许你浏览运行中容器的文件系统。你可以导航目录、查看文件，以及在主机和容器之间传输文件。

## 浏览文件

1. 进入一个运行中的容器
2. 点击 **文件** 标签页
3. 文件浏览器展示容器的根文件系统

点击目录进行导航。面包屑导航显示当前路径。

## 查看文件

点击文件查看内容。Dockerman 支持预览：

- 文本文件（日志、配置、脚本）
- JSON 和 YAML 文件（带语法高亮）

## 上传文件

1. 在容器中导航到目标目录
2. 点击 **上传**
3. 从主机选择文件
4. 文件将被复制到容器的当前路径

## 下载文件

右键点击文件或目录，选择 **下载** 保存到主机。目录以 tar 压缩包形式下载。
```

**Step 9: Commit**

```bash
git add content/docs/zh/guides/
git commit -m "docs: add Chinese guides for containers, images, networks, volumes, compose, monitoring, terminal, file-browser"
```

---

### Task 6: Create Chinese platform content (2 files)

> This task can run in parallel with Tasks 5 and 7.

**Files:**
- Create: `content/docs/zh/platform/wsl.mdx`
- Create: `content/docs/zh/platform/linux.mdx`

**Step 1: Create zh/platform/wsl.mdx**

```mdx
---
title: Windows WSL
description: 在 Windows WSL 环境下使用 Dockerman
---

## 概览

Dockerman 支持通过 Windows Subsystem for Linux (WSL 2) 运行的 Docker。本指南介绍设置方法和常见配置。

## 前提条件

- Windows 10 版本 2004+ 或 Windows 11
- 已启用 WSL 2
- 已安装 Docker Desktop（使用 WSL 2 后端）或在 WSL 2 中直接运行 Docker Engine

## 配合 Docker Desktop 使用

如果你使用 Docker Desktop 的 WSL 2 后端：

1. 打开 Docker Desktop 设置
2. 进入 **Resources > WSL Integration**
3. 为你使用的 WSL 发行版启用集成
4. 在 Windows 上安装并启动 Dockerman
5. Dockerman 会自动连接到 Docker

## 配合 WSL 2 中的 Docker Engine 使用

如果你在 WSL 2 中直接运行 Docker Engine（不使用 Docker Desktop）：

1. 在 WSL 2 发行版中启动 Docker Engine
2. 确保 Docker socket 可在 `/var/run/docker.sock` 访问
3. 启动 Dockerman — 它会自动检测 Docker socket

## 常见问题

### 找不到 Docker socket

确保 Docker 在你的 WSL 2 发行版中运行：

```bash
sudo service docker start
```

### 性能较慢

WSL 2 使用虚拟机运行。为获得最佳性能：

- 将项目文件存储在 WSL 2 文件系统中（而非 Windows 驱动器上）
- 在 `.wslconfig` 中为 WSL 2 分配足够的内存

### 连接被拒绝

验证 Docker 是否可访问：

```bash
docker info
```

如果失败，重启 Docker 服务或检查 WSL 2 配置。
```

**Step 2: Create zh/platform/linux.mdx**

```mdx
---
title: Linux
description: 在 Linux 上安装和配置 Dockerman
---

## 概览

Dockerman 在 Linux 上原生运行。本指南介绍安装、Docker Engine 配置和权限设置。

## 支持的发行版

- Ubuntu 20.04+
- Debian 11+
- Fedora 38+
- Arch Linux
- 其他支持 GTK/WebKit 的发行版

## 安装

1. 从[下载页面](/download)下载 `.deb`、`.rpm` 或 `.AppImage` 安装包
2. 使用发行版的包管理器安装

Debian/Ubuntu：

```bash
sudo dpkg -i dockerman_*.deb
```

Fedora：

```bash
sudo rpm -i dockerman_*.rpm
```

AppImage：

```bash
chmod +x Dockerman_*.AppImage
./Dockerman_*.AppImage
```

## Docker Engine 配置

Dockerman 需要已安装并运行的 Docker Engine：

```bash
# 安装 Docker（Ubuntu/Debian）
curl -fsSL https://get.docker.com | sh

# 启动 Docker
sudo systemctl start docker
sudo systemctl enable docker
```

## 用户权限

要在不使用 `sudo` 的情况下使用 Docker，将你的用户添加到 `docker` 组：

```bash
sudo usermod -aG docker $USER
```

注销并重新登录使组变更生效。然后启动 Dockerman — 它会自动检测 Docker。

## 常见问题

### 权限被拒绝

如果 Dockerman 显示权限错误，确认你的用户在 `docker` 组中：

```bash
groups
```

如果未列出 `docker`，运行上面的 `usermod` 命令并重新登录。

### Docker 守护进程未运行

启动 Docker 服务：

```bash
sudo systemctl start docker
```
```

**Step 3: Commit**

```bash
git add content/docs/zh/platform/
git commit -m "docs: add Chinese platform guides for WSL and Linux"
```

---

### Task 7: Create Chinese reference content (4 files)

> This task can run in parallel with Tasks 5 and 6.

**Files:**
- Create: `content/docs/zh/reference/keyboard-shortcuts.mdx`
- Create: `content/docs/zh/reference/settings.mdx`
- Create: `content/docs/zh/reference/licensing.mdx`
- Create: `content/docs/zh/reference/troubleshooting.mdx`

**Step 1: Create zh/reference/keyboard-shortcuts.mdx**

```mdx
---
title: 快捷键
description: Dockerman 快捷键参考
---

## 全局快捷键

| 快捷键 | 操作 |
|--------|------|
| `Ctrl/Cmd + K` | 打开命令面板 |
| `Ctrl/Cmd + ,` | 打开设置 |
| `Ctrl/Cmd + Q` | 退出 Dockerman |
| `Ctrl/Cmd + R` | 刷新当前视图 |
| `Ctrl/Cmd + F` | 搜索 / 筛选 |

## 导航

| 快捷键 | 操作 |
|--------|------|
| `Ctrl/Cmd + 1` | 进入容器页面 |
| `Ctrl/Cmd + 2` | 进入镜像页面 |
| `Ctrl/Cmd + 3` | 进入网络页面 |
| `Ctrl/Cmd + 4` | 进入卷页面 |
| `Ctrl/Cmd + 5` | 进入 Compose 页面 |

## 容器操作

| 快捷键 | 操作 |
|--------|------|
| `Enter` | 打开选中的容器 |
| `Ctrl/Cmd + T` | 打开容器终端 |
| `Ctrl/Cmd + L` | 查看容器日志 |
| `Delete` | 删除选中的容器 |

## 终端

| 快捷键 | 操作 |
|--------|------|
| `Ctrl/Cmd + Shift + T` | 新建终端标签 |
| `Ctrl/Cmd + W` | 关闭终端标签 |
| `Ctrl/Cmd + C` | 复制（选中文本时） |
| `Ctrl/Cmd + V` | 粘贴 |
```

**Step 2: Create zh/reference/settings.mdx**

```mdx
---
title: 设置
description: 根据你的偏好配置 Dockerman
---

## 访问设置

通过侧边栏齿轮图标或按 `Ctrl/Cmd + ,` 打开设置。

## 通用

- **语言** — 选择英文或中文
- **主题** — 浅色、深色或跟随系统
- **开机启动** — 登录时自动启动 Dockerman

## Docker 连接

- **Docker socket 路径** — Docker socket 的路径（默认：`/var/run/docker.sock`）
- **连接超时** — 等待 Docker 响应的时间

Dockerman 启动时会自动检测 Docker 安装。只有使用非标准配置时才需要修改这些设置。

## 通知

- **容器状态变更** — 容器启动、停止或崩溃时收到通知
- **资源告警** — 容器接近资源限制时发出告警

## 数据

- **日志保留** — Dockerman 中保留容器日志的时长
- **缓存** — 清除缓存数据和临时文件
```

**Step 3: Create zh/reference/licensing.mdx**

```mdx
---
title: 许可证
description: 管理你的 Dockerman 许可证
---

## 许可证类型

- **免费版** — 基础功能，有限的容器管理
- **专业版** — 完整功能，包含高级监控、文件浏览器和优先支持

## 激活许可证

1. 在[定价页面](/pricing)购买许可证
2. 打开 Dockerman，进入 **设置 > 许可证**
3. 输入许可证密钥
4. 点击 **激活**

许可证绑定到你的机器。你可以停用它以转移到另一台机器。

## 管理许可证

- **查看状态** — 在设置中查看当前许可证类型和到期时间
- **停用** — 从当前机器释放许可证，以便在其他机器上使用
- **续期** — 在许可证到期前续费

## 常见问题

**一个许可证可以在多台机器上使用吗？**
每个许可证同一时间只能在一台机器上使用。在另一台机器上激活前需要先停用。

**许可证到期后会怎样？**
Dockerman 会恢复到免费版。你的数据和设置会保留。

**如何申请退款？**
购买后 14 天内联系客服可获得全额退款。
```

**Step 4: Create zh/reference/troubleshooting.mdx**

```mdx
---
title: 故障排除
description: Dockerman 常见问题及解决方案
---

## Docker 连接问题

### Dockerman 无法连接到 Docker

1. 确认 Docker 正在运行：
   ```bash
   docker info
   ```
2. 检查 Docker socket 是否存在：
   ```bash
   ls -la /var/run/docker.sock
   ```
3. 确保你的用户有权访问 Docker：
   ```bash
   groups | grep docker
   ```

### 连接超时

- 在 **设置 > Docker 连接** 中增加超时时间
- 重启 Docker 守护进程后重试

## 性能问题

### Dockerman 运行缓慢或无响应

- 关闭未使用的终端会话
- 减少显示的容器数量（使用筛选功能）
- 检查系统资源使用情况 — Dockerman 本身很轻量，但 Docker 可能消耗较多资源

### 内存占用过高

- 大量日志缓冲区可能消耗内存。清除容器日志或在设置中减少日志保留时间
- 关闭不使用的文件浏览器标签页

## 显示问题

### 界面显示异常

- 更新 Dockerman 到最新版本
- 在 **设置 > 数据 > 清除缓存** 中清除应用缓存
- 重启应用

### 深色模式不生效

- 确保系统主题设置正确
- 尝试在设置中切换为明确的主题（浅色或深色）而非跟随系统

## 平台相关问题

### macOS：提示"应用已损坏，无法打开"

这是因为 macOS 阻止了未签名的应用：

```bash
xattr -cr /Applications/Dockerman.app
```

### Linux：应用无法启动

确保已安装必需的系统库：

```bash
# Ubuntu/Debian
sudo apt install libwebkit2gtk-4.1-0 libgtk-3-0
```

### Windows：WSL 连接问题

请参阅 [WSL 指南](/docs/platform/wsl) 获取详细的故障排除方法。

## 获取帮助

如果你的问题未列出：

- 查看[更新日志](/changelog)了解最近的修复
- 访问 [GitHub 仓库](https://github.com/ZingerLittleBee/dockerman) 查看已知问题
```

**Step 5: Commit**

```bash
git add content/docs/zh/reference/
git commit -m "docs: add Chinese reference docs for shortcuts, settings, licensing, troubleshooting"
```

---

### Task 8: Verify build

**Step 1: Run the dev server to verify all pages render**

```bash
cd /Users/zingerbee/conductor/workspaces/dockerman.app1/tacoma-v1
bun run build
```

Expected: Build completes without errors, all MDX pages are statically generated.

**Step 2: If build fails, fix any issues**

Common issues:
- Missing frontmatter fields → add `title` and `description`
- Broken internal links → fix link paths
- meta.json references non-existent pages → ensure filenames match

**Step 3: Final commit if fixes were needed**

```bash
git add -A
git commit -m "fix: resolve docs build issues"
```

---

## Parallelization Guide

```
Task 1 (meta.json files)
    ├── Task 2 (EN guides)  ──┐
    ├── Task 3 (EN platform) ─┤── Task 5 (ZH guides)  ──┐
    └── Task 4 (EN reference) ┘── Task 6 (ZH platform) ─┤── Task 8 (verify)
                                   Task 7 (ZH reference) ┘
```

- **Batch 1:** Task 1 (sequential, small)
- **Batch 2:** Tasks 2, 3, 4 (parallel — 3 subagents)
- **Batch 3:** Tasks 5, 6, 7 (parallel — 3 subagents)
- **Batch 4:** Task 8 (sequential, verification)
