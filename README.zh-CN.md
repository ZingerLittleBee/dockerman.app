# Dockerman

Language: [🇺🇸 English](./README.md) | 🇨🇳 简体中文

[![Version](https://img.shields.io/badge/version-v5.2.0-blue.svg?style=flat-square)](https://github.com/dockerman/dockerman/releases/tag/v5.2.0)
[![Release Date](https://img.shields.io/badge/release%20date-Apr%2026%2C%202026-green.svg?style=flat-square)](https://github.com/dockerman/dockerman/releases/tag/v5.2.0)

一个原生桌面端 Docker **与** Kubernetes 管理工具，基于 Tauri + Rust。启动快、占用低、完全本地运行——数据不出本机。

![Dashboard](apps/landing/public/screenshots/readme/dashboard.png)
![Kubernetes](apps/landing/public/screenshots/readme/k8s.png)

## 亮点

- 🐳 **容器与镜像** — 全生命周期、Compose 支持、备份与恢复（含绑定挂载）、镜像升级检测
- ☸️ **Kubernetes** — 多集群、主流资源、Helm、端口转发、带 dry-run 的 YAML 编辑器
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
- **Windows WSL2 引擎** — 无需 Docker Desktop；Alpine 一键安装，自动崩溃恢复，支持镜像源
- **远程守护进程** — 自定义 socket、TCP 或 SSH 转发，心跳重连与每主机延迟显示

## 运维与体验

- 🚨 预置告警规则（restart loop、容器崩溃）以及包含容器/时间/规则名称的近期告警列表
- 🧰 一键诊断包（日志、inspect、主机状态），便于上报排障
- 📝 可视化 `.env` 编辑器，保留注释并原子化应用
- 🔍 全局命令面板（Cmd/Ctrl+;）与系统托盘实时显示 CPU/内存
- 🔐 私有仓库凭证管理，拉取时自动匹配
- 🔑 远程主机功能的许可证激活

## 为什么够快

基于 Tauri + Rust 构建的原生桌面应用——不是 Electron，也不是浏览器标签页。完全本地运行，无遥测，核心功能不依赖远程服务。

## 更多截图

![Compose 视图](apps/landing/public/screenshots/readme/compose.png)
![终端](apps/landing/public/screenshots/readme/terminal.png)
![文件浏览](apps/landing/public/screenshots/readme/file.png)
![命令面板](apps/landing/public/screenshots/readme/cmd.png)
![统计](apps/landing/public/screenshots/readme/stats.png)
![存储](apps/landing/public/screenshots/readme/storage.png)
