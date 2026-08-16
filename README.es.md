# Dockerman

Language: [🇺🇸 English](./README.md) | [🇨🇳 简体中文](./README.zh-CN.md) | [🇯🇵 日本語](./README.ja.md) | 🇪🇸 Español

[![Version](https://img.shields.io/badge/version-v6.1.0-blue.svg?style=flat-square)](https://github.com/dockerman/dockerman/releases/tag/v6.1.0)
[![Release Date](https://img.shields.io/badge/release%20date-Aug%2016%2C%202026-green.svg?style=flat-square)](https://github.com/dockerman/dockerman/releases/tag/v6.1.0)

Una UI de escritorio nativa para gestionar Docker **y** Kubernetes — construida con Tauri + Rust. Arranque rápido, ligera en recursos y completamente local: nada sale de tu máquina.

![Dashboard](apps/landing/public/screenshots/readme/dashboard.png)
![Kubernetes](apps/landing/public/screenshots/readme/k8s.png)

## Lo más destacado

- 🛍️ **Marketplace de apps** — instala plantillas de un clic desde fuentes Portainer y CasaOS, con comprobaciones de seguridad y configuración previa
- 🐳 **Contenedores e Imágenes** — ciclo de vida completo, soporte Compose, backup/restore (incl. bind mounts), detección de actualizaciones
- ☸️ **Kubernetes de extremo a extremo** — multi-cluster, HPAs/cuotas/CRDs y recursos principales, operaciones de carga protegidas, Helm, port forwarding, RBAC, eventos y YAML en todas partes
- 🩺 **Triaje de contenedores en vivo** — logs recientes, fallos de healthcheck, diagnóstico de salida y eventos anómalos para contenedores con fallos
- 🖥️ **Herramientas integradas** — terminal, visor de logs con búsqueda, historial de CPU/memoria, navegador de archivos con edición
- 🧭 **Vistas de contenedor enlazables** — Detalle, Estadísticas, Logs, Terminal, Procesos y Archivos son rutas anidadas bajo `/container/:id`, así que cada vista se puede enlazar, recargar y volver a ella
- 🪟 **Cabeceras de página en la barra de título** — el título y las acciones de la página viven en la banda superior de la ventana, junto al conmutador de la barra lateral y la navegación atrás/adelante
- 🎬 **Animaciones pulidas** — renovación de animaciones en toda la app: tooltips instantáneos, popovers que escalan desde su disparador, retroalimentación al pulsar y compatibilidad con movimiento reducido
- 📈 **Gráficos del panel más fluidos** — gráficos de CPU/memoria con un motor liveline ligero, exploración al pasar el cursor y un eje y adecuado
- 🔔 **Vigilancia de actualizaciones de imagen** — servicio en segundo plano con notificaciones de escritorio
- 🌐 **Dominios locales** — direcciones `*.dockerman.localhost` memorables para servicios Docker locales, sin números de puerto
- ☁️ **Túneles Cloudflared** — URLs públicas en un clic con limpieza automática
- 🐙 **Motores Podman, Colima, WSL2 y Apple Container** — alternativas de primera clase a Docker Desktop, con máquinas Colima/Podman gestionadas en macOS
- 🌐 Localizado en English, 中文, 日本語, Español, con modo oscuro completo

## Contenedores e Imágenes

Gestiona todo desde un solo lugar sin tener que recurrir a la terminal:

- Agrupa contenedores por proyecto Compose o navega en lista plana; filtros rápidos por nombre, puerto o estado
- Crea desde un formulario guiado o pega un comando `docker run` — y conviértelo a YAML Compose en el editor integrado
- Logs en vivo con búsqueda por palabra clave/regex y alternancia de mayúsculas; historial de CPU/memoria con comparativa multi-contenedor (hasta 6)
- Terminal con temas que sigue viva cinco minutos tras salir de la vista, lista de procesos y un navegador de archivos con edición in situ, vistas previas (texto/código/imágenes/PDF/vídeo) y subida/descarga de carpetas
- Backup y restore del contenedor completo — configuración, sistema de archivos, volúmenes y bind mounts soportados
- Build de imágenes (Dockerfile o comando parseado), push a registries privados, búsqueda en Docker Hub, escaneo de seguridad Trivy y análisis por capas
- Edita en línea los mapeos de puertos de un contenedor en ejecución: añade, cambia y elimina puertos publicados sin recrearlo desde cero
- Da a los servicios Docker locales direcciones `*.dockerman.localhost` memorables que sobreviven a la recreación del contenedor
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
- **Podman** — runtime detectado automáticamente con preferencia por host y soporte de Compose cuando el toolchain está presente
- **Apple Container** — conéctate al motor de contenedores de Apple en macOS: contenedores, imágenes, volúmenes, redes, logs, estadísticas, builds, pulls y terminales interactivas
- **Motores gestionados en macOS** — detecta, inicia, detén, repara y alterna entre máquinas Colima y Podman desde el onboarding, los Ajustes y el selector de host, con CPU, memoria y disco de la VM configurables desde la app (Dockerman te guía hasta los binarios del motor; nunca los instala ni actualiza)
- **Motor WSL2 en Windows** — sin Docker Desktop; setup Alpine en un clic con recuperación ante caídas, mirrors de registry, reinstalación y un conmutador en Ajustes entre el motor WSL2 y Docker nativo del sistema
- **Daemons remotos** — socket personalizado, TCP o SSH forwarding con reconexión por heartbeat y latencia por host
- **Despliegue en hosts SSH** — instala y gestiona apps en hosts remotos accesibles solo por SSH

## Operación y experiencia

- 🚨 Reglas de alerta preestablecidas (restart loop, crash de contenedor) y feed reciente con contenedor, hora y regla
- 🧰 Bundle de diagnóstico en un clic (logs, inspect, estado del host) para escalaciones de soporte
- 📝 Editor visual de `.env` que conserva comentarios y aplica de forma atómica
- 🔍 Paleta de comandos global (Cmd/Ctrl+;) y bandeja del sistema con CPU/memoria en vivo
- 🔐 Gestión de credenciales de registry privado con auto-match al hacer pull
- 🔑 Activación de licencia para funciones de hosts remotos
- 📦 CLI `dockerman` incluido, instalable, actualizable y desinstalable desde Ajustes
- 🤖 Instalador en un clic para plugins de Claude Code, Codex y Gemini CLI
- 🛡️ Comprobación de actualizaciones del CLI Trivy desde Ajustes

## Por qué se siente rápido

Construido con Tauri + Rust como app de escritorio nativa — no es Electron, no es una pestaña del navegador. Funcionamiento totalmente local, sin telemetría y sin dependencias remotas para las funciones principales.

## Más capturas

![Modo oscuro](apps/landing/public/screenshots/readme/dark.png)
![Terminal](apps/landing/public/screenshots/readme/terminal.png)
![Ajustes de terminal](apps/landing/public/screenshots/readme/terminal-settings.png)
![Lista de procesos](apps/landing/public/screenshots/readme/process.png)
![Inspect](apps/landing/public/screenshots/readme/inspect.png)
![Stats](apps/landing/public/screenshots/readme/stats.png)
![Comparación multi-contenedor](apps/landing/public/screenshots/readme/stats-compare.png)
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
