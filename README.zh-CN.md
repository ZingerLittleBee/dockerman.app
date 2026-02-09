# Dockerman

Language: [🇺🇸 English](./README.md) | 🇨🇳 简体中文

[![Version](https://img.shields.io/badge/version-v3.11.0-blue.svg?style=flat-square)](https://github.com/dockerman/dockerman/releases/tag/v3.11.0)
[![Release Date](https://img.shields.io/badge/release%20date-Feb%2010%2C%202026-green.svg?style=flat-square)](https://github.com/dockerman/dockerman/releases/tag/v3.11.0)

一个现代、轻量级的 Docker 管理界面，使用 Tauri 和 Rust 构建。
专注于简洁性和性能的 Docker 容器管理工具。

- 🚀 快速启动，资源占用极低
- 💻 基于 Tauri 的强大性能
- 🎯 简洁、专注的界面设计
- 📊 实时容器监控
- 🔒 本地运行，安全可靠
- 🌙 全面的深色模式支持
- 🌐 国际化 (i18n) 支持

![Dashboard Screenshot](public/screenshots/3.2.0/dashboard.png)
![Dashboard Dark Screenshot](public/screenshots/3.2.0/dark.png)
![Terminal Screenshot](public/screenshots/2.4.0/terminal.png)
![Process List Screenshot](public/screenshots/2.4.0/process.png)
![inspect Screenshot](public/screenshots/2.4.0/inspect.png)
![stats Screenshot](public/screenshots/2.4.0/stat.png)
![logs Screenshot](public/screenshots/logs.png)
![ssh Screenshot](public/screenshots/2.4.0/ssh.png)
![build Screenshot](public/screenshots/2.4.0/build-log.png)
![build History Screenshot](public/screenshots/2.4.0/build-log-history.png)
![file system](public/screenshots/3.0.0/file.png)
![Termin Settings](public/screenshots/terminal-settings.png)
![Image Analysis](public/screenshots/3.3.0/image-analysis.png)
![Compose Screenshot](public/screenshots/3.4.0/compose.png)
![Event Screenshot](public/screenshots/event.png)
![Volume Browse Screenshot](public/screenshots/volume-browse.png)

## 功能特性

### 仪表盘概览

- 📊 容器和镜像统计一目了然
- 💾 镜像总大小监控
- 🔄 实时容器状态更新
- 📈 资源使用可视化
- 🖥️ 系统信息展示（Docker 版本、操作系统、架构、资源限制）
- ⚡ 并行化容器统计查询，仪表盘加载更快

### 存储

- 💾 Docker 磁盘用量分布（镜像、容器、卷、构建缓存），支持交互式图表
- 🧹 一键系统清理

### 容器管理

- 📋 详细的容器列表，带状态指示器
- 🔍 容器列表支持快速搜索，实时过滤并可一键清除
- 🐳 Docker Compose 视图
  - 支持平铺列表和按 Compose 项目分组视图切换
  - Compose 项目卡片，显示状态指示器和运行中的容器数量
  - 可折叠的独立容器区域，用于非 Compose 容器
  - 完整的 Compose 生命周期管理（启动、停止、重启、拉取、删除）
  - 支持所有 Docker Compose CLI 选项（file、env-file、profile、progress、dry-run）
- 🐳 容器创建对话框，支持双输入模式
  - 表单配置，引导式设置
  - Docker 命令输入模式，支持解析
  - Docker Run 命令导入和解析，增强 UI 集成
- 🔍 容器详情检查
  - 端口映射
  - 网络设置
  - 挂载点
  - 容器标签
- 📊 资源监控
  - CPU 使用率和分布
  - 内存使用情况
  - 网络统计
  - 块 I/O 统计
- 💻 集成终端访问
  - 终端主题选择器，支持颜色主题自定义
  - 可配置默认 shell 和用户
- 📝 进程列表查看
- 📜 实时日志查看器
  - 虚拟化日志列表，支持跟踪/暂停和加载更多历史
  - 关键字/正则过滤，支持高亮和快捷操作
  - 导出日志为 TXT/JSON，复制过滤结果
- 📂 容器文件浏览器
  - 动态加载的文件树导航
  - 文件夹上传和下载支持
  - 单文件上传和下载，保留文件权限
  - 符号链接支持和大目录分页
  - 文件/文件夹操作的右键菜单

### Docker 事件

- 🔔 实时 Docker 事件监听
- 🔍 全面的事件过滤和搜索
- 📋 JSON 详情对话框，用于检查事件数据
- ⚡ 操作按钮，支持复制 JSON 和删除选项

### 模板管理

- 🧩 Stack 模板支持，包含迁移、UI 和 API 集成

### 镜像管理

- 📦 镜像列表，包含大小和标签信息
- 🗑️ 批量操作：镜像、网络、卷的多选批量删除
- 🏗️ 镜像构建
  - 从 Dockerfile 构建
  - 支持构建参数和标签
  - 实时构建日志流
  - 历史日志回放
  - Docker 构建命令生成和解析功能
  - 从构建历史中重建，自动填充参数
  - 无需重新配置即可重试失败的构建
- 📉 镜像大小分析
  - 详细的镜像层大小拆解分析
  - 交互式的大小分布条，通过颜色块可视化各层比例
  - 支持展开/收起查看完整的 Dockerfile 构建命令
  - 可折叠的分布面板，支持紧凑视图
  - 导出层分析为 JSON 或复制到剪贴板
- 🐳 大型镜像导出/导入使用流式 I/O
- 🕒 创建时间追踪
- 🔍 详细的镜像检查
- 📊 使用统计
  - 总数统计
  - 大小分析
  - 使用追踪

### 网络管理

- 🔍 网络列表支持快速搜索（名称、ID、驱动、状态）

### 卷管理

- 📂 卷文件浏览器，支持上传和下载
- 🔍 卷列表支持快速搜索，实时过滤并可一键清除

### 应用日志查看器

- 📋 自定义 HTML 日志查看器，支持关键词搜索、级别过滤、详情对话框和导出功能

### 系统集成

- 🔌 原生 Docker 守护进程连接
  - 自定义 Docker socket 路径支持
  - TCP 连接支持，连接远程 Docker 守护进程
  - SSH socket 转发，支持远程连接
- 🔐 私有仓库凭证管理，拉取镜像时自动匹配
- 🛡️ 错误边界，组件异常时显示恢复界面而非白屏
- 📁 侧边栏可折叠分区，带容器数量徽章
- 🚀 轻量快速的性能
- 💻 跨平台桌面应用
