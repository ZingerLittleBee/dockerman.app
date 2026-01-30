import Balancer from 'react-wrap-balancer'
import { Badge } from '@/components/Badge'

export default function Terms() {
  return (
    <div className="mt-36 flex flex-col overflow-hidden px-3 pb-16">
      <section
        aria-labelledby="terms-overview"
        className="animate-slide-up-fade"
        style={{
          animationDuration: '600ms',
          animationFillMode: 'backwards'
        }}
      >
        <Badge>terms</Badge>
        <h1
          className="mt-2 inline-block bg-gradient-to-br from-gray-900 to-gray-800 bg-clip-text py-2 font-bold text-4xl text-transparent tracking-tighter sm:text-6xl md:text-6xl dark:from-gray-50 dark:to-gray-300"
          id="terms-overview"
        >
          <Balancer>Terms of Use</Balancer>
        </h1>
        <p className="mt-6 max-w-2xl text-gray-700 text-lg dark:text-gray-400">
          Please read these terms carefully before using Dockerman. By using Dockerman, you agree to
          these terms.
        </p>
      </section>

      <section className="my-16 max-w-4xl">
        <div className="space-y-8 rounded-xl bg-white p-8 shadow-gray-200/50 shadow-lg ring-1 ring-gray-200/50 dark:bg-gray-900 dark:shadow-none dark:ring-gray-800">
          {/* Terms Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900">
                <span className="font-semibold text-indigo-600 text-sm dark:text-indigo-300">
                  1
                </span>
              </div>
              <h2 className="font-semibold text-gray-900 text-xl dark:text-gray-100">
                Acceptance of Terms
              </h2>
            </div>
            <p className="ml-11 text-gray-600 dark:text-gray-400">
              By downloading, installing, or using Dockerman, you acknowledge that you have read,
              understood, and agree to be bound by these Terms of Use. If you do not agree to these
              terms, do not use the software.
            </p>
          </div>

          {/* License Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900">
                <span className="font-semibold text-indigo-600 text-sm dark:text-indigo-300">
                  2
                </span>
              </div>
              <h2 className="font-semibold text-gray-900 text-xl dark:text-gray-100">
                License Grant
              </h2>
            </div>
            <div className="ml-11 space-y-4">
              <p className="text-gray-600 dark:text-gray-400">
                Subject to your compliance with these Terms, we grant you a limited, non-exclusive,
                non-transferable, non-sublicensable license to:
              </p>
              <ul className="list-inside space-y-2 text-gray-600 dark:text-gray-400">
                {[
                  'Download and install Dockerman on your devices',
                  'Use Dockerman for personal or business purposes',
                  'Receive software updates when available'
                ].map((item, index) => (
                  <li className="flex items-center gap-2" key={index}>
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-indigo-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Restrictions Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900">
                <span className="font-semibold text-indigo-600 text-sm dark:text-indigo-300">
                  3
                </span>
              </div>
              <h2 className="font-semibold text-gray-900 text-xl dark:text-gray-100">
                Restrictions
              </h2>
            </div>
            <div className="ml-11 space-y-4">
              <p className="text-gray-600 dark:text-gray-400">You may not:</p>
              <ul className="list-inside space-y-2 text-gray-600 dark:text-gray-400">
                {[
                  'Copy, modify, or create derivative works of the software',
                  'Reverse engineer, decompile, or disassemble the software',
                  'Remove or alter any proprietary notices in the software',
                  'Redistribute, sell, rent, lease, or sublicense the software',
                  'Use the software for any unlawful purpose'
                ].map((item, index) => (
                  <li className="flex items-center gap-2" key={index}>
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-red-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Intellectual Property Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900">
                <span className="font-semibold text-indigo-600 text-sm dark:text-indigo-300">
                  4
                </span>
              </div>
              <h2 className="font-semibold text-gray-900 text-xl dark:text-gray-100">
                Intellectual Property
              </h2>
            </div>
            <p className="ml-11 text-gray-600 dark:text-gray-400">
              Dockerman and all related intellectual property rights are and shall remain the
              exclusive property of us and our licensors. All rights not expressly granted in these
              Terms are reserved.
            </p>
          </div>

          {/* Disclaimer Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900">
                <span className="font-semibold text-indigo-600 text-sm dark:text-indigo-300">
                  5
                </span>
              </div>
              <h2 className="font-semibold text-gray-900 text-xl dark:text-gray-100">Disclaimer</h2>
            </div>
            <div className="ml-11 rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
              <p className="text-gray-600 dark:text-gray-400">
                THE SOFTWARE IS PROVIDED &ldquo;AS IS&rdquo;, WITHOUT WARRANTY OF ANY KIND. TO THE
                MAXIMUM EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED,
                INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
                PURPOSE, AND NON-INFRINGEMENT.
              </p>
            </div>
          </div>

          {/* Updates Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900">
                <span className="font-semibold text-indigo-600 text-sm dark:text-indigo-300">
                  6
                </span>
              </div>
              <h2 className="font-semibold text-gray-900 text-xl dark:text-gray-100">
                Updates to Terms
              </h2>
            </div>
            <p className="ml-11 text-gray-600 dark:text-gray-400">
              We reserve the right to modify these Terms at any time. We will notify you of any
              material changes by posting the updated Terms on our website. Your continued use of
              Dockerman after such modifications constitutes your acceptance of the updated Terms.
            </p>
          </div>

          {/* Contact Section */}
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
              If you have any questions about these Terms, please contact us at{' '}
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
