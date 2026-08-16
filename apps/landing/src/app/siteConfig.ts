export const siteConfig = {
  name: 'Dockerman',
  title: 'Dockerman - Lightweight Docker Desktop Alternative',
  url: 'https://dockerman.app',
  issuesLink: 'https://github.com/ZingerLittleBee/dockerman.app/issues/new',
  description:
    'A lightweight Docker Desktop alternative. Local-first desktop UI for Docker, Podman, and Kubernetes, built with Tauri and Rust. Every local Docker feature is completely free.',
  baseLinks: {
    home: '/',
    about: '/about',
    download: '/download',
    changelog: '/changelog',
    imprint: '/imprint',
    privacy: '/privacy',
    terms: '/terms'
  },
  latestVersion: '6.1.0'
}

export type siteConfig = typeof siteConfig
