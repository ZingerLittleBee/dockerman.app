import { Badge } from "@/components/Badge"
import Balancer from "react-wrap-balancer"

export default function Privacy() {
  return (
    <div className="mt-36 flex flex-col overflow-hidden px-3">
      <section
        aria-labelledby="privacy-overview"
        className="animate-slide-up-fade"
        style={{
          animationDuration: "600ms",
          animationFillMode: "backwards",
        }}
      >
        <Badge>privacy</Badge>
        <h1
          id="privacy-overview"
          className="mt-2 inline-block bg-gradient-to-br from-gray-900 to-gray-800 bg-clip-text py-2 text-4xl font-bold tracking-tighter text-transparent sm:text-6xl md:text-6xl dark:from-gray-50 dark:to-gray-300"
        >
          <Balancer>Privacy Policy</Balancer>
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-gray-700 dark:text-gray-400">
          We take your privacy seriously. Here&apos;s how we handle your data.
        </p>
      </section>

      <section className="my-16 max-w-3xl">
        <div className="space-y-12">
          <div className="rounded-xl bg-white p-6 shadow-lg shadow-gray-200/50 ring-1 ring-gray-200/50 dark:bg-gray-900 dark:shadow-none dark:ring-gray-800">
            <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-gray-100">
              Data Collection
            </h2>
            <p className="text-gray-700 dark:text-gray-400">
              Dockerman is a desktop application that runs locally on your
              machine. We do not collect, store, or transmit any personal
              information or usage data. All container and image data is
              processed locally through your Docker daemon.
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-lg shadow-gray-200/50 ring-1 ring-gray-200/50 dark:bg-gray-900 dark:shadow-none dark:ring-gray-800">
            <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-gray-100">
              Local Storage
            </h2>
            <p className="text-gray-700 dark:text-gray-400">
              Any application settings or preferences are stored locally on your
              device. These settings are never transmitted to external servers
              and remain under your control.
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-lg shadow-gray-200/50 ring-1 ring-gray-200/50 dark:bg-gray-900 dark:shadow-none dark:ring-gray-800">
            <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-gray-100">
              Third-Party Services
            </h2>
            <p className="text-gray-700 dark:text-gray-400">
              Dockerman interacts only with your local Docker daemon. We do not
              integrate with any third-party services or analytics platforms.
              Your container data and usage patterns remain private and local to
              your system.
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-lg shadow-gray-200/50 ring-1 ring-gray-200/50 dark:bg-gray-900 dark:shadow-none dark:ring-gray-800">
            <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-gray-100">
              Updates
            </h2>
            <p className="text-gray-700 dark:text-gray-400">
              When checking for application updates, Dockerman only connects to
              our release repository to verify the latest version. No personal
              information is transmitted during this process.
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-lg shadow-gray-200/50 ring-1 ring-gray-200/50 dark:bg-gray-900 dark:shadow-none dark:ring-gray-800">
            <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-gray-100">
              Contact
            </h2>
            <p className="text-gray-700 dark:text-gray-400">
              If you have any questions about our privacy practices, please feel
              free to reach out through our support channels.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
