# Dockerman

Language: [🇺🇸 English](./README.md) | [🇨🇳 简体中文](./README.zh-CN.md) | [🇯🇵 日本語](./README.ja.md) | 🇪🇸 Español

[![Version](https://img.shields.io/badge/version-v5.2.0-blue.svg?style=flat-square)](https://github.com/dockerman/dockerman/releases/tag/v5.2.0)
[![Release Date](https://img.shields.io/badge/release%20date-Apr%2026%2C%202026-green.svg?style=flat-square)](https://github.com/dockerman/dockerman/releases/tag/v5.2.0)

Una UI de escritorio nativa para gestionar Docker **y** Kubernetes — construida con Tauri + Rust. Arranque rápido, ligera en recursos y completamente local: nada sale de tu máquina.

![Dashboard](apps/landing/public/screenshots/readme/dashboard.png)
![Kubernetes](apps/landing/public/screenshots/readme/k8s.png)

## Lo más destacado

- 🐳 **Contenedores e Imágenes** — ciclo de vida completo, soporte Compose, backup/restore (incl. bind mounts), detección de actualizaciones
- ☸️ **Kubernetes** — multi-cluster, recursos principales, Helm, port forwarding, editor YAML con dry-run
- 🖥️ **Herramientas integradas** — terminal, visor de logs con búsqueda, historial de CPU/memoria, navegador de archivos con edición
- 🔔 **Vigilancia de actualizaciones de imagen** — servicio en segundo plano con notificaciones de escritorio
- ☁️ **Túneles Cloudflared** — URLs públicas en un clic con limpieza automática
- 🐙 **Podman y motor WSL2** — alternativas de primera clase a Docker Desktop
- 🌐 Localizado en English, 中文, 日本語, Español, con modo oscuro completo

## Contenedores e Imágenes

Gestiona todo desde un solo lugar sin tener que recurrir a la terminal:

- Agrupa contenedores por proyecto Compose o navega en lista plana; filtros rápidos por nombre, puerto o estado
- Crea desde un formulario guiado o pega un comando `docker run` — y conviértelo a YAML Compose en el editor integrado
- Logs en vivo con búsqueda por palabra clave/regex y alternancia de mayúsculas; historial de CPU/memoria con comparativa multi-contenedor (hasta 6)
- Terminal con temas, lista de procesos y un navegador de archivos con edición in situ, vistas previas (texto/código/imágenes/PDF/vídeo) y subida/descarga de carpetas
- Backup y restore del contenedor completo — configuración, sistema de archivos, volúmenes y bind mounts soportados
- Build de imágenes (Dockerfile o comando parseado), push a registries privados, búsqueda en Docker Hub, escaneo de seguridad Trivy y análisis por capas
- Vigilancia de actualizaciones de imagen en segundo plano con suscripciones por canal, resolutor de credenciales y deep links `dockerman://`

![Logs de contenedor](apps/landing/public/screenshots/readme/logs.png)
![Análisis de imagen](apps/landing/public/screenshots/readme/image-analysis.png)

## Kubernetes

Gestión de cluster equivalente a `kubectl`, pero visual:

- Conecta vía kubeconfig o lanza un cluster local con k3d (auto-instalado); cambia de cluster de forma independiente a tus hosts Docker
- Workloads, Networking, Config & Storage, RBAC, CRDs — y páginas dedicadas de Node, Persistent Volume y Namespace
- Explorador de eventos del cluster con filtros y tarjetas de resumen de CPU y memoria
- Editor YAML integrado con enrutamiento por deep link y vista previa server-side dry-run
- Helm: releases, repos e instalación de charts
- Port forwarding con DNS local automático para servicios reenviados
- Asistente de debug para Pods con problemas; force-delete para Pods atascados en terminating
- Manejo tipado de 403 para que los errores de permisos se vean a nivel de lista

## Más allá de Docker

- **Túneles Cloudflared** — expón cualquier puerto de un contenedor en un clic; los túneles se limpian automáticamente al parar/destruir y sobreviven a caídas
- **Podman** — runtime detectado automáticamente con preferencia por host y feature gating para flujos solo-Compose
- **Motor WSL2 en Windows** — sin Docker Desktop; setup Alpine en un clic con recuperación ante caídas y mirrors de registry
- **Daemons remotos** — socket personalizado, TCP o SSH forwarding con reconexión por heartbeat y latencia por host

## Operación y experiencia

- 🚨 Reglas de alerta preestablecidas (restart loop, crash de contenedor) y feed reciente con contenedor, hora y regla
- 🧰 Bundle de diagnóstico en un clic (logs, inspect, estado del host) para escalaciones de soporte
- 📝 Editor visual de `.env` que conserva comentarios y aplica de forma atómica
- 🔍 Paleta de comandos global (Cmd/Ctrl+;) y bandeja del sistema con CPU/memoria en vivo
- 🔐 Gestión de credenciales de registry privado con auto-match al hacer pull
- 🔑 Activación de licencia para funciones de hosts remotos

## Por qué se siente rápido

Construido con Tauri + Rust como app de escritorio nativa — no es Electron, no es una pestaña del navegador. Funcionamiento totalmente local, sin telemetría y sin dependencias remotas para las funciones principales.

## Más capturas

![Modo oscuro](apps/landing/public/screenshots/readme/dark.png)
![Terminal](apps/landing/public/screenshots/readme/terminal.png)
![Ajustes de terminal](apps/landing/public/screenshots/readme/terminal-settings.png)
![Lista de procesos](apps/landing/public/screenshots/readme/process.png)
![Inspect](apps/landing/public/screenshots/readme/inspect.png)
![Stats](apps/landing/public/screenshots/readme/stats.png)
![SSH](apps/landing/public/screenshots/readme/ssh.png)
![Log de build](apps/landing/public/screenshots/readme/build-log.png)
![Historial de builds](apps/landing/public/screenshots/readme/build-log-history.png)
![Navegador de archivos](apps/landing/public/screenshots/readme/file.png)
![Vista previa de archivo](apps/landing/public/screenshots/readme/file-preview.png)
![Vista Compose](apps/landing/public/screenshots/readme/compose.png)
![Eventos](apps/landing/public/screenshots/readme/event.png)
![Navegador de volúmenes](apps/landing/public/screenshots/readme/volume-browse.png)
![Almacenamiento](apps/landing/public/screenshots/readme/storage.png)
![Paleta de comandos](apps/landing/public/screenshots/readme/cmd.png)
![Docker Hub](apps/landing/public/screenshots/readme/dockerhub.png)
![Seguridad de imagen](apps/landing/public/screenshots/readme/image-security.png)
