'use client'

import { Badge } from "@/components/Badge"
import { Button } from "@/components/Button"
import { RiGithubFill, RiTwitterXFill } from "@remixicon/react"
import Balancer from "react-wrap-balancer"

const TEAM_MEMBERS = [
  {
    name: "ZingerBee",
    role: "Full Stack Developer",
    avatar: "/images/avatar.jpeg",
    bio: "Coding in Rust, TypeScript & Flutter | Turning coffee into software magic | Building to bridge the gap between technology & humanity.",
    social: {
      github: "https://github.com/ZingerLittleBee",
      twitter: "https://twitter.com/zinger_bee"
    }
  }
]

export default function About() {
  return (
    <div className="mt-36 flex flex-col overflow-hidden px-3 pb-16">
      <section
        aria-labelledby="about-overview"
        className="animate-slide-up-fade"
        style={{
          animationDuration: "600ms",
          animationFillMode: "backwards",
        }}
      >
        <Badge>about</Badge>
        <h1
          id="about-overview"
          className="mt-2 inline-block bg-gradient-to-br from-gray-900 to-gray-800 bg-clip-text py-2 text-4xl font-bold tracking-tighter text-transparent sm:text-6xl md:text-6xl dark:from-gray-50 dark:to-gray-300"
        >
          <Balancer>
            Building the Docker management tool we always wanted
          </Balancer>
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-gray-700 dark:text-gray-400">
          We're a team of developers and designers who believe that managing Docker containers should be simple, intuitive, and efficient.
        </p>
      </section>

      {/* Mission Section */}
      <section className="mt-24">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          Our Mission
        </h2>
        <div className="mt-6 max-w-prose space-y-6 text-lg text-gray-600 dark:text-gray-400">
          <p>
            Dockerman was born from our own frustrations with existing Docker management tools. We wanted something that was fast, cross-platform, and focused on developer productivity.
          </p>
          <p>
            Our mission is to make container management accessible to everyone, from individual developers to large teams, while maintaining the power and flexibility that Docker provides.
          </p>
        </div>
      </section>

      {/* Team Section */}
      <section className="mt-24">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          Meet the Team
        </h2>
        <div className="mt-12 grid gap-8 sm:grid-cols-2">
          {TEAM_MEMBERS.map((member) => (
            <div
              key={member.name}
              className="rounded-xl bg-white p-6 shadow-lg shadow-gray-200/50 ring-1 ring-gray-200/50 dark:bg-gray-900 dark:shadow-none dark:ring-gray-800"
            >
              <div className="flex items-center gap-4">
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="h-16 w-16 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">{member.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{member.role}</p>
                </div>
              </div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">{member.bio}</p>
              <div className="mt-4 flex gap-3">
                <a
                  href={member.social.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                >
                  <RiGithubFill className="h-5 w-5" />
                </a>
                <a
                  href={member.social.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
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
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          Our Values
        </h2>
        <div className="mt-12 grid gap-8 sm:grid-cols-3">
          {[
            {
              title: "Performance First",
              description: "Built with Rust and Tauri for powerful performance and minimal resource usage."
            },
            {
              title: "Developer Experience",
              description: "Intuitive interface designed for developers, by developers."
            },
            {
              title: "Privacy Focused",
              description: "Your data stays local. We believe in transparency and user privacy."
            }
          ].map((value) => (
            <div
              key={value.title}
              className="rounded-xl bg-white p-6 shadow-lg shadow-gray-200/50 ring-1 ring-gray-200/50 dark:bg-gray-900 dark:shadow-none dark:ring-gray-800"
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
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            Stay Connected
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Follow Dockerman's development and be the first to know about new features and updates.
          </p>
          <div className="mt-6 flex gap-4">
            <a href="https://github.com/ZingerLittleBee" target="_blank" rel="noopener noreferrer">
              <Button
                className="bg-indigo-600 text-white hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400"
              >
                <RiGithubFill className="h-5 w-5" />
                <span className="ml-2">Follow on GitHub</span>
              </Button>
            </a>
            <a href="https://twitter.com/zinger_bee" target="_blank" rel="noopener noreferrer">
              <Button
                rel="noopener noreferrer"
                variant="secondary"
              >
                <RiTwitterXFill className="h-5 w-5" />
                <span className="ml-2">Follow on X</span>
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}