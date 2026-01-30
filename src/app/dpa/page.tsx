import Balancer from 'react-wrap-balancer'
import { Badge } from '@/components/Badge'

export default function DPA() {
  return (
    <div className="mt-36 flex flex-col overflow-hidden px-3 pb-16">
      <section
        aria-labelledby="dpa-overview"
        className="animate-slide-up-fade"
        style={{
          animationDuration: '600ms',
          animationFillMode: 'backwards'
        }}
      >
        <Badge>DPA</Badge>
        <h1
          className="mt-2 inline-block bg-gradient-to-br from-gray-900 to-gray-800 bg-clip-text py-2 font-bold text-4xl text-transparent tracking-tighter sm:text-6xl md:text-6xl dark:from-gray-50 dark:to-gray-300"
          id="dpa-overview"
        >
          <Balancer>Data Processing Agreement</Balancer>
        </h1>
        <p className="mt-6 max-w-2xl text-gray-700 text-lg dark:text-gray-400">
          This agreement outlines how Dockerman processes and protects your data.
        </p>
      </section>

      <section className="my-16 max-w-4xl">
        <div className="space-y-8 rounded-xl bg-white p-8 shadow-gray-200/50 shadow-lg ring-1 ring-gray-200/50 dark:bg-gray-900 dark:shadow-none dark:ring-gray-800">
          {/* Data Processing Overview */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900">
                <span className="font-semibold text-indigo-600 text-sm dark:text-indigo-300">
                  1
                </span>
              </div>
              <h2 className="font-semibold text-gray-900 text-xl dark:text-gray-100">
                Data Processing Overview
              </h2>
            </div>
            <div className="ml-11 space-y-4">
              <p className="text-gray-600 dark:text-gray-400">
                Dockerman processes data in two main categories:
              </p>
              <ul className="list-inside space-y-2 text-gray-600 dark:text-gray-400">
                {[
                  'Local data: processed exclusively on your device',
                  'Account data: processed on our secure servers for user authentication and subscription management'
                ].map((item, index) => (
                  <li className="flex items-center gap-2" key={index}>
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-indigo-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Data Categories */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900">
                <span className="font-semibold text-indigo-600 text-sm dark:text-indigo-300">
                  2
                </span>
              </div>
              <h2 className="font-semibold text-gray-900 text-xl dark:text-gray-100">
                Data Categories
              </h2>
            </div>
            <div className="ml-11 space-y-4">
              <h3 className="font-medium text-gray-900 dark:text-gray-100">Local Data:</h3>
              <ul className="list-inside space-y-2 text-gray-600 dark:text-gray-400">
                {[
                  'Docker container configurations and settings',
                  'Container logs and metrics',
                  'Local application preferences',
                  'System resource statistics'
                ].map((item, index) => (
                  <li className="flex items-center gap-2" key={index}>
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-indigo-500" />
                    {item}
                  </li>
                ))}
              </ul>
              <h3 className="mt-6 font-medium text-gray-900 dark:text-gray-100">Account Data:</h3>
              <ul className="list-inside space-y-2 text-gray-600 dark:text-gray-400">
                {[
                  'Email address and account credentials',
                  'Subscription status and payment information',
                  'Usage analytics for subscription features',
                  'Account preferences and settings'
                ].map((item, index) => (
                  <li className="flex items-center gap-2" key={index}>
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-indigo-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Data Storage and Security */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900">
                <span className="font-semibold text-indigo-600 text-sm dark:text-indigo-300">
                  3
                </span>
              </div>
              <h2 className="font-semibold text-gray-900 text-xl dark:text-gray-100">
                Data Storage and Security
              </h2>
            </div>
            <div className="ml-11 rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
              <p className="mb-4 text-gray-600 dark:text-gray-400">
                We implement industry-standard security measures to protect your data:
              </p>
              <ul className="list-inside space-y-2 text-gray-600 dark:text-gray-400">
                {[
                  'Encryption of all data in transit and at rest',
                  'Secure authentication and authorization protocols',
                  'Regular security audits and updates',
                  'Compliance with data protection regulations'
                ].map((item, index) => (
                  <li className="flex items-center gap-2" key={index}>
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Data Processing Purposes */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900">
                <span className="font-semibold text-indigo-600 text-sm dark:text-indigo-300">
                  4
                </span>
              </div>
              <h2 className="font-semibold text-gray-900 text-xl dark:text-gray-100">
                Data Processing Purposes
              </h2>
            </div>
            <div className="ml-11 space-y-4">
              <p className="text-gray-600 dark:text-gray-400">
                We process your data for the following purposes:
              </p>
              <ul className="list-inside space-y-2 text-gray-600 dark:text-gray-400">
                {[
                  'User authentication and account management',
                  'Subscription and payment processing',
                  'Providing and improving our services',
                  'Technical support and communication'
                ].map((item, index) => (
                  <li className="flex items-center gap-2" key={index}>
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-indigo-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Data Retention */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900">
                <span className="font-semibold text-indigo-600 text-sm dark:text-indigo-300">
                  5
                </span>
              </div>
              <h2 className="font-semibold text-gray-900 text-xl dark:text-gray-100">
                Data Retention
              </h2>
            </div>
            <p className="ml-11 text-gray-600 dark:text-gray-400">
              We retain account data for as long as your account is active or as needed to provide
              services. You can request data deletion by contacting our support team. Local data
              remains under your control and is stored only on your device.
            </p>
          </div>

          {/* Data Subject Rights */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900">
                <span className="font-semibold text-indigo-600 text-sm dark:text-indigo-300">
                  6
                </span>
              </div>
              <h2 className="font-semibold text-gray-900 text-xl dark:text-gray-100">
                Your Rights
              </h2>
            </div>
            <div className="ml-11 space-y-4">
              <p className="text-gray-600 dark:text-gray-400">You have the right to:</p>
              <ul className="list-inside space-y-2 text-gray-600 dark:text-gray-400">
                {[
                  'Access your personal data',
                  'Request correction of inaccurate data',
                  'Request deletion of your account data',
                  'Export your account information'
                ].map((item, index) => (
                  <li className="flex items-center gap-2" key={index}>
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-indigo-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900">
                <span className="font-semibold text-indigo-600 text-sm dark:text-indigo-300">
                  7
                </span>
              </div>
              <h2 className="font-semibold text-gray-900 text-xl dark:text-gray-100">Contact</h2>
            </div>
            <p className="ml-11 text-gray-600 dark:text-gray-400">
              For any questions about data processing or to exercise your rights, please contact our
              Data Protection Officer at{' '}
              <a
                className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
                href="mailto:support@dockerman.app"
              >
                support@dockerman.app
              </a>
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
