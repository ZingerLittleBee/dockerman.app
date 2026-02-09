export const siteConfig = {
  name: 'Dockerman',
  title: 'Dockerman - Modern Docker Management UI',
  url: 'https://dockerman.app',
  issuesLink: 'https://github.com/ZingerLittleBee/dockerman.app/issues/new',
  description:
    'A modern, lightweight Docker management UI built with Tauri and Rust. Focus on simplicity and performance for Docker container management.',
  baseLinks: {
    home: '/',
    about: '/about',
    download: '/download',
    changelog: '/changelog',
    imprint: '/imprint',
    privacy: '/privacy',
    terms: '/terms'
  },
  latestVersion: '3.11.0'
}

export type siteConfig = typeof siteConfig
