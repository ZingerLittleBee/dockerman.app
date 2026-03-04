import { JsonLd } from '@/components/JsonLd'

// English FAQ items – must match the visible content in Faqs.tsx / en.json
const enFaqItems = [
  {
    question: 'Which operating systems does Dockerman support?',
    answer:
      'Dockerman supports macOS, Windows, and major Linux distributions. Built with Tauri and Rust, it provides consistent performance and experience across various operating systems.'
  },
  {
    question: 'Does Dockerman require an internet connection?',
    answer:
      "Dockerman is a local application that doesn't require an internet connection. It runs entirely on your device, ensuring your data security and privacy."
  },
  {
    question: 'Where is SSH data stored?',
    answer: 'SSH data is stored on your device and is never uploaded to any server.'
  },
  {
    question: 'What makes Dockerman different from other Docker management tools?',
    answer:
      'Dockerman stands out with its focus on speed and efficiency. It features fast startup times, minimal resource usage (<30MB memory), real-time container monitoring, and a clean, focused interface that prioritizes the most common Docker tasks.'
  }
]

const zhFaqItems = [
  {
    question: 'Dockerman 支持哪些操作系统？',
    answer:
      'Dockerman 支持 macOS、Windows 和主流 Linux 发行版。基于 Tauri 和 Rust 构建，在各种操作系统上提供一致的性能和体验。'
  },
  {
    question: 'Dockerman 需要联网吗？',
    answer:
      'Dockerman 是一个本地应用程序，不需要联网。它完全在您的设备上运行，确保您的数据安全和隐私。'
  },
  {
    question: 'SSH 数据存储在哪里？',
    answer: 'SSH 数据存储在您的设备上，不会上传到任何服务器。'
  },
  {
    question: 'Dockerman 与其他 Docker 管理工具有什么不同？',
    answer:
      'Dockerman 以速度和效率为核心。它具有快速启动、极低资源占用（<30MB 内存）、实时容器监控，以及专注于最常用 Docker 任务的简洁界面。'
  }
]

function buildFaqJsonLd(items: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org' as const,
    '@type': 'FAQPage' as const,
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer
      }
    }))
  }
}

const softwareAppJsonLd = {
  '@context': 'https://schema.org' as const,
  '@type': 'SoftwareApplication' as const,
  name: 'Dockerman',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'macOS, Windows, Linux',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD'
  },
  description:
    'A modern, lightweight Docker management UI built with Tauri and Rust. Focus on simplicity and performance for Docker container management.',
  url: 'https://dockerman.app',
  downloadUrl: 'https://dockerman.app/en/download'
}

export function HomeJsonLd({ locale }: { locale: string }) {
  const faqItems = locale === 'zh' ? zhFaqItems : enFaqItems

  return (
    <>
      <JsonLd data={buildFaqJsonLd(faqItems)} />
      <JsonLd data={softwareAppJsonLd} />
    </>
  )
}
