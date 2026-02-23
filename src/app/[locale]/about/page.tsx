'use client'

import { RiGithubFill, RiTwitterXFill } from '@remixicon/react'
import Image from 'next/image'
import Balancer from 'react-wrap-balancer'
import { Badge } from '@/components/Badge'
import { Button } from '@/components/Button'
import { useTranslation } from '@/lib/i18n/client'

const TEAM_MEMBERS = [
  {
    name: 'ZingerBee',
    avatar: '/images/avatar.jpeg',
    social: {
      github: 'https://github.com/ZingerLittleBee',
      twitter: 'https://twitter.com/zinger_bee'
    }
  }
]

export default function About() {
  const { t } = useTranslation()

  const values = [
    {
      key: 'performanceFirst',
      title: t('about.values.performanceFirst.title'),
      description: t('about.values.performanceFirst.description')
    },
    {
      key: 'developerExperience',
      title: t('about.values.developerExperience.title'),
      description: t('about.values.developerExperience.description')
    },
    {
      key: 'privacyFocused',
      title: t('about.values.privacyFocused.title'),
      description: t('about.values.privacyFocused.description')
    }
  ]

  return (
    <div className="mt-36 flex flex-col overflow-hidden px-3 pb-16">
      <section
        aria-labelledby="about-overview"
        className="animate-slide-up-fade"
        style={{
          animationDuration: '600ms',
          animationFillMode: 'backwards'
        }}
      >
        <Badge>{t('about.badge')}</Badge>
        <h1
          className="mt-2 inline-block bg-gradient-to-br from-gray-900 to-gray-800 bg-clip-text py-2 font-bold text-4xl text-transparent tracking-tighter sm:text-6xl md:text-6xl dark:from-gray-50 dark:to-gray-300"
          id="about-overview"
        >
          <Balancer>{t('about.title')}</Balancer>
        </h1>
        <p className="mt-6 max-w-2xl text-gray-700 text-lg dark:text-gray-400">
          {t('about.description')}
        </p>
      </section>

      {/* Mission Section */}
      <section className="mt-24">
        <h2 className="font-bold text-3xl text-gray-900 tracking-tight dark:text-gray-100">
          {t('about.mission.title')}
        </h2>
        <div className="mt-6 max-w-prose space-y-6 text-gray-600 text-lg dark:text-gray-400">
          <p>{t('about.mission.p1')}</p>
          <p>{t('about.mission.p2')}</p>
        </div>
      </section>

      {/* Team Section */}
      <section className="mt-24">
        <h2 className="font-bold text-3xl text-gray-900 tracking-tight dark:text-gray-100">
          {t('about.team.title')}
        </h2>
        <div className="mt-12 grid gap-8 sm:grid-cols-2">
          {TEAM_MEMBERS.map((member) => (
            <div
              className="rounded-xl bg-white p-6 shadow-gray-200/50 shadow-lg ring-1 ring-gray-200/50 dark:bg-gray-900 dark:shadow-none dark:ring-gray-800"
              key={member.name}
            >
              <div className="flex items-center gap-4">
                <Image
                  alt={member.name}
                  className="rounded-full object-cover"
                  height={64}
                  src={member.avatar}
                  width={64}
                />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">{member.name}</h3>
                  <p className="text-gray-500 text-sm dark:text-gray-400">{t('about.team.role')}</p>
                </div>
              </div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">{t('about.team.bio')}</p>
              <div className="mt-4 flex gap-3">
                <a
                  className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                  href={member.social.github}
                  onClick={() => {
                    import('posthog-js').then(({ default: posthog }) => {
                      posthog.capture('about_social_clicked', {
                        platform: 'github',
                        section: 'team_member',
                        url: member.social.github
                      })
                    })
                  }}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <RiGithubFill className="h-5 w-5" />
                </a>
                <a
                  className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                  href={member.social.twitter}
                  onClick={() => {
                    import('posthog-js').then(({ default: posthog }) => {
                      posthog.capture('about_social_clicked', {
                        platform: 'twitter',
                        section: 'team_member',
                        url: member.social.twitter
                      })
                    })
                  }}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <RiTwitterXFill className="h-5 w-5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Values Section */}
      <section className="mt-24">
        <h2 className="font-bold text-3xl text-gray-900 tracking-tight dark:text-gray-100">
          {t('about.values.title')}
        </h2>
        <div className="mt-12 grid gap-8 sm:grid-cols-3">
          {values.map((value) => (
            <div
              className="rounded-xl bg-white p-6 shadow-gray-200/50 shadow-lg ring-1 ring-gray-200/50 dark:bg-gray-900 dark:shadow-none dark:ring-gray-800"
              key={value.key}
            >
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">{value.title}</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400">{value.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Join Us Section */}
      <section className="mt-24">
        <div className="rounded-xl bg-gradient-to-br from-indigo-100 to-indigo-50 p-8 dark:from-indigo-900/50 dark:to-indigo-800/50">
          <h2 className="font-bold text-2xl text-gray-900 tracking-tight dark:text-gray-100">
            {t('about.connect.title')}
          </h2>
          <p className="mt-4 text-gray-600 text-lg dark:text-gray-400">
            {t('about.connect.description')}
          </p>
          <div className="mt-6 flex gap-4">
            <a
              href="https://github.com/ZingerLittleBee"
              onClick={() => {
                import('posthog-js').then(({ default: posthog }) => {
                  posthog.capture('about_social_clicked', {
                    platform: 'github',
                    section: 'join_us',
                    url: 'https://github.com/ZingerLittleBee'
                  })
                })
              }}
              rel="noopener noreferrer"
              target="_blank"
            >
              <Button className="bg-indigo-600 text-white hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400">
                <RiGithubFill className="h-5 w-5" />
                <span className="ml-2">{t('about.connect.followGithub')}</span>
              </Button>
            </a>
            <a
              href="https://twitter.com/zinger_bee"
              onClick={() => {
                import('posthog-js').then(({ default: posthog }) => {
                  posthog.capture('about_social_clicked', {
                    platform: 'twitter',
                    section: 'join_us',
                    url: 'https://twitter.com/zinger_bee'
                  })
                })
              }}
              rel="noopener noreferrer"
              target="_blank"
            >
              <Button rel="noopener noreferrer" variant="secondary">
                <RiTwitterXFill className="h-5 w-5" />
                <span className="ml-2">{t('about.connect.followX')}</span>
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
