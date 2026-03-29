# Dockerman

Language: [🇺🇸 English](./README.md) | 🇨🇳 简体中文

[![Version](https://img.shields.io/badge/version-v4.7.0-blue.svg?style=flat-square)](https://github.com/dockerman/dockerman/releases/tag/v4.7.0)
[![Release Date](https://img.shields.io/badge/release%20date-Mar%2029%2C%202026-green.svg?style=flat-square)](https://github.com/dockerman/dockerman/releases/tag/v4.7.0)

一个现代、轻量级的 Docker 管理界面，使用 Tauri 和 Rust 构建。
专注于简洁性和性能的 Docker 容器管理工具。

- 🚀 快速启动，资源占用极低
- 💻 基于 Tauri 的强大性能
- 🎯 简洁、专注的界面设计
- 📊 实时容器监控
- 🔒 本地运行，安全可靠
- 🌙 全面的深色模式支持
- 🌐 国际化 (i18n) 支持

![Dashboard Screenshot](apps/landing/public/screenshots/readme/dashboard.png)
![Dashboard Dark Screenshot](apps/landing/public/screenshots/readme/dark.png)
![Terminal Screenshot](apps/landing/public/screenshots/readme/terminal.png)
![Process List Screenshot](apps/landing/public/screenshots/readme/process.png)
![inspect Screenshot](apps/landing/public/screenshots/readme/inspect.png)
![stats Screenshot](apps/landing/public/screenshots/readme/stats.png)
![logs Screenshot](apps/landing/public/screenshots/readme/logs.png)
![ssh Screenshot](apps/landing/public/screenshots/readme/ssh.png)
![build Screenshot](apps/landing/public/screenshots/readme/build-log.png)
![build History Screenshot](apps/landing/public/screenshots/readme/build-log-history.png)
![file system](apps/landing/public/screenshots/readme/file.png)
![file preview](apps/landing/public/screenshots/readme/file-preview.png)
![Termin Settings](apps/landing/public/screenshots/readme/terminal-settings.png)
![Image Analysis](apps/landing/public/screenshots/readme/image-analysis.png)
![Compose Screenshot](apps/landing/public/screenshots/readme/compose.png)
![Event Screenshot](apps/landing/public/screenshots/readme/event.png)
![Volume Browse Screenshot](apps/landing/public/screenshots/readme/volume-browse.png)
![Storage Screenshot](apps/landing/public/screenshots/readme/storage.png)
![Command Palette](apps/landing/public/screenshots/readme/cmd.png)
![Docker Hub](apps/landing/public/screenshots/readme/dockerhub.png)
![Image Security](apps/landing/public/screenshots/readme/image-security.png)

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
- 🔍 容器列表支持快速搜索，实时过滤并可一键清除（支持按端口号、协议和端口映射搜索）
- 🖼️ 容器创建对话框支持可搜索的镜像组合框
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
- ⏸️ 容器暂停/恢复，支持三态菜单
- 📦 容器提交，将容器状态保存为新镜像
- 🐑 容器克隆，将配置复制到创建对话框
- 🔍 容器详情检查
  - 端口映射
  - 网络设置
  - 挂载点
  - 容器标签
- 📊 资源监控，全新设计的统计页面
  - 环形仪表盘显示 CPU 和内存使用率
  - 迷你图表展示 CPU、内存、网络 I/O 和磁盘 I/O
  - 时间范围选择器控制图表历史窗口
  - 可折叠详情面板查看网络接口和磁盘设备
  - 图表悬停提示显示格式化数值
- 💻 集成终端访问
  - 终端主题选择器，支持颜色主题自定义
  - 可配置默认 shell 和用户
- 📝 进程列表查看
- 📜 实时日志查看器
  - 虚拟化日志列表，支持跟踪/暂停和加载更多历史
  - 关键字/正则过滤，支持高亮和快捷操作
  - 导出日志为 TXT/JSON，复制过滤结果
  - 日志最新优先排序，与事件页面保持一致
  - 键盘快捷键（`P` 暂停、`/` 搜索、`g` 最新、`G` 最旧），带页面提示
- 📂 容器文件浏览器
  - 动态加载的文件树导航
  - 文件夹上传和下载支持
  - 单文件上传和下载，保留文件权限
  - 符号链接支持和大目录分页
  - 文件/文件夹操作的右键菜单
  - 文件预览，支持文本、代码、图片、Markdown、PDF、视频和音频
  - 就地编辑，支持语法高亮
  - 右键菜单删除文件和文件夹
  - 多选批量下载、删除和复制路径

### Docker 事件

- 🔔 实时 Docker 事件监听
- 🔔 容器异常事件桌面通知（非零退出码、OOM 终止、健康检查失败）
- 🔍 全面的事件过滤和搜索
- 📋 JSON 详情对话框，用于检查事件数据
- ⚡ 操作按钮，支持复制 JSON 和删除选项
- ⌨️ 键盘快捷键（`P` 暂停、`/` 搜索、`g` 最新、`G` 最旧），带页面提示

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
- 🚀 镜像推送到仓库，支持流式进度和凭证管理
- 🔍 Docker Hub 浏览器，支持镜像搜索、详情、README 和标签
- 🛡️ Trivy 安全扫描，支持漏洞过滤和查看
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

### 命令面板与系统托盘

- 🔍 全局命令面板（Cmd+; / Ctrl+;），快速访问容器、镜像、Compose 项目、网络和卷
- 🖥️ 系统托盘图标，显示连接状态、资源统计和快捷操作
- 📊 可选的实时 CPU 和内存统计，直接显示在 macOS 菜单栏
- 🙈 macOS 上关闭主窗口时 Dock 图标自动隐藏
- ⌨️ 可配置的全局键盘快捷键，用于呼出命令面板

### 系统集成

- ⌨️ Wayland 全局键盘快捷键支持（通过 XDG Desktop Portal）
- 🔌 原生 Docker 守护进程连接
  - 自定义 Docker socket 路径支持
  - TCP 连接支持，连接远程 Docker 守护进程
  - SSH socket 转发，支持远程连接
  - SSH 隧道故障心跳检测与自动重连
- 🪟 WSL2 Docker 引擎（无需 Docker Desktop）
  - 一键安装向导，使用 Alpine 发行版
  - 自动崩溃恢复与退避策略
  - WSL2 发行版资源监控
  - 守护进程配置编辑器，支持镜像源配置
  - Docker Desktop 与 WSL2 引擎切换
- 🔑 许可证激活与管理，远程主机功能需许可证授权
  - 📡 主机延迟显示，支持 ICMP ping 和一键刷新
  - 🗑️ 主机移除，带确认对话框
- 🔐 私有仓库凭证管理，拉取镜像时自动匹配
- 🛡️ 错误边界，组件异常时显示恢复界面而非白屏
- 📁 侧边栏可折叠分区，带容器数量徽章
- 🚀 轻量快速的性能
- 💻 跨平台桌面应用
