# Dockerman

Language: [🇺🇸 English](./README.md) | 🇨🇳 简体中文 | [🇯🇵 日本語](./README.ja.md) | [🇪🇸 Español](./README.es.md)

[![Version](https://img.shields.io/badge/version-v5.5.0-blue.svg?style=flat-square)](https://github.com/dockerman/dockerman/releases/tag/v5.5.0)
[![Release Date](https://img.shields.io/badge/release%20date-Jun%2030%2C%202026-green.svg?style=flat-square)](https://github.com/dockerman/dockerman/releases/tag/v5.5.0)

一个原生桌面端 Docker **与** Kubernetes 管理工具，基于 Tauri + Rust。启动快、占用低、完全本地运行——数据不出本机。

![Dashboard](apps/landing/public/screenshots/readme/dashboard.png)
![Kubernetes](apps/landing/public/screenshots/readme/k8s.png)

## 亮点

- 🛍️ **应用市场** — 从 Portainer 与 CasaOS 源一键安装应用模板，附带安全检查与安装前配置
- 🐳 **容器与镜像** — 全生命周期、Compose 支持、备份与恢复（含绑定挂载）、镜像升级检测
- ☸️ **端到端 Kubernetes** — 多集群、HPA/配额/CRD 及核心资源、带确认的工作负载操作、Helm、端口转发、RBAC、事件，以及随处可用的 YAML
- 🩺 **实时容器排障** — 为故障容器提供最近日志、健康检查失败、退出诊断与异常事件呈现
- 🖥️ **内置工具** — 终端、带搜索的日志查看器、CPU/内存历史、可编辑文件浏览器
- 🔔 **镜像升级监控** — 后台订阅服务，更新时桌面通知
- ☁️ **Cloudflared 隧道** — 一键生成公网 URL，自动清理
- 🐙 **Podman 与 WSL2 引擎** — Docker Desktop 的一流替代方案
- 🌐 多语言：English、中文、日本語、Español，全面深色模式

## 容器与镜像

无需切到命令行即可完成全部操作：

- 按 Compose 项目分组或平铺浏览容器；按名称、端口、状态快速过滤
- 用引导式表单创建，或粘贴 `docker run` 命令——并在内置编辑器中转换为 Compose YAML
- 实时日志，支持关键词/正则搜索与大小写切换；CPU/内存历史曲线，最多 6 容器并列对比
- 可定制主题的终端、进程列表，文件浏览器支持就地编辑、预览（文本/代码/图片/PDF/视频）以及文件夹上传下载
- 整体备份与恢复——配置、文件系统、卷以及支持的绑定挂载
- 镜像构建（Dockerfile 或解析命令）、推送到私有仓库、Docker Hub 搜索、Trivy 安全扫描、按层大小分析
- 就地编辑运行中容器的端口映射——无需重新创建即可添加、修改和移除已发布端口
- 后台镜像升级监控，支持按通道订阅、仓库凭证解析与 `dockerman://` 深链

![容器日志](apps/landing/public/screenshots/readme/logs.png)
![镜像分析](apps/landing/public/screenshots/readme/image-analysis.png)

## Kubernetes

提供与 `kubectl` 相当的能力，但完全可视化：

- 通过 kubeconfig 连接，或一键创建本地 k3d 集群（自动安装）；多集群切换与 Docker 主机相互独立
- 工作负载、网络、配置与存储、RBAC、CRDs——以及节点、持久卷、命名空间专属页面
- 可过滤的集群事件浏览，集群概览页 CPU 与内存卡片
- 内置 YAML 编辑器，支持深层链接路由与服务端 dry-run 预览
- Helm releases、仓库与 chart 安装
- Pods/Services/Deployments 端口转发，转发服务自动本地 DNS 注册
- 调试助手定位 Pod 异常；卡死 Pod 强制删除
- 类型化 403 处理，列表层面显式呈现权限错误

## 不止 Docker

- **Cloudflared 隧道** — 一键暴露任意容器端口；容器停止/销毁自动清理，崩溃后可恢复
- **Podman** — 自动检测运行时，支持按主机偏好与 Compose 类操作的功能门控
- **Windows WSL2 引擎** — 无需 Docker Desktop；Alpine 一键安装、崩溃恢复、镜像源、重新安装，并可在设置中切换 WSL2 引擎与系统原生 Docker
- **远程守护进程** — 自定义 socket、TCP 或 SSH 转发，心跳重连与每主机延迟显示
- **部署到 SSH 主机** — 在仅能通过 SSH 访问的远程主机上安装与管理应用

## 运维与体验

- 🚨 预置告警规则（restart loop、容器崩溃）以及包含容器/时间/规则名称的近期告警列表
- 🧰 一键诊断包（日志、inspect、主机状态），便于上报排障
- 📝 可视化 `.env` 编辑器，保留注释并原子化应用
- 🔍 全局命令面板（Cmd/Ctrl+;）与系统托盘实时显示 CPU/内存
- 🔐 私有仓库凭证管理，拉取时自动匹配
- 🔑 远程主机功能的许可证激活
- 📦 内置 `dockerman` CLI，可在设置中安装、更新与卸载
- 🤖 一键安装 Claude Code、Codex 与 Gemini CLI 插件
- 🛡️ 在设置中检查并应用 Trivy CLI 升级

## 为什么够快

基于 Tauri + Rust 构建的原生桌面应用——不是 Electron，也不是浏览器标签页。完全本地运行，无遥测，核心功能不依赖远程服务。

## 更多截图

![深色模式](apps/landing/public/screenshots/readme/dark.png)
![终端](apps/landing/public/screenshots/readme/terminal.png)
![终端设置](apps/landing/public/screenshots/readme/terminal-settings.png)
![进程列表](apps/landing/public/screenshots/readme/process.png)
![Inspect](apps/landing/public/screenshots/readme/inspect.png)
![统计](apps/landing/public/screenshots/readme/stats.png)
![多容器对比](apps/landing/public/screenshots/readme/stats-compare.png)
![SSH](apps/landing/public/screenshots/readme/ssh.png)
![构建日志](apps/landing/public/screenshots/readme/build-log.png)
![构建历史](apps/landing/public/screenshots/readme/build-log-history.png)
![文件浏览](apps/landing/public/screenshots/readme/file.png)
![文件预览](apps/landing/public/screenshots/readme/file-preview.png)
![Compose 视图](apps/landing/public/screenshots/readme/compose.png)
![事件](apps/landing/public/screenshots/readme/event.png)
![卷浏览](apps/landing/public/screenshots/readme/volume-browse.png)
![存储](apps/landing/public/screenshots/readme/storage.png)
![命令面板](apps/landing/public/screenshots/readme/cmd.png)
![Docker Hub](apps/landing/public/screenshots/readme/dockerhub.png)
![镜像安全](apps/landing/public/screenshots/readme/image-security.png)
