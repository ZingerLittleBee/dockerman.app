import { siteConfig } from "@/app/siteConfig"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../Accordion"

const faqs = [
  {
    question: "Which operating systems does Dockerman support?",
    answer:
      "Dockerman supports macOS, Windows, and major Linux distributions. Built with Tauri and Rust, it provides consistent performance and experience across various operating systems.",
  },
  {
    question: "Does Dockerman require an internet connection?",
    answer:
      "Dockerman is a local application that doesn't require an internet connection. It runs entirely on your device, ensuring your data security and privacy.",
  },
  {
    question: "Where is SSH data stored?",
    answer:
      "SSH data is stored on your device and is never uploaded to any server.",
  },
  {
    question:
      "What makes Dockerman different from other Docker management tools?",
    answer:
      "Dockerman stands out with its focus on speed and efficiency. It features fast startup times, minimal resource usage (<30MB memory), real-time container monitoring, and a clean, focused interface that prioritizes the most common Docker tasks.",
  },
]

export function Faqs() {
  return (
    <section className="mt-20 sm:mt-36" aria-labelledby="faq-title">
      <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-14">
        <div className="col-span-full sm:col-span-5">
          <h2
            id="faq-title"
            className="inline-block scroll-my-24 bg-gradient-to-br from-gray-900 to-gray-800 bg-clip-text py-2 pr-2 text-2xl font-bold tracking-tighter text-transparent lg:text-3xl dark:from-gray-50 dark:to-gray-300"
          >
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-base leading-7 text-gray-600 dark:text-gray-400">
            Can&rsquo;t find the answer you&rsquo;re looking for? Don&rsquo;t
            hesitate to get in touch with{" "}
            <a
              href={siteConfig.issuesLink}
              className="font-medium text-indigo-600 hover:text-indigo-300 dark:text-indigo-400"
            >
              open issues
            </a>{" "}
            on GitHub.
          </p>
        </div>
        <div className="col-span-full mt-6 lg:col-span-7 lg:mt-0">
          <Accordion type="multiple" className="mx-auto">
            {faqs.map((item) => (
              <AccordionItem
                value={item.question}
                key={item.question}
                className="py-3 first:pb-3 first:pt-0"
              >
                <AccordionTrigger>{item.question}</AccordionTrigger>
                <AccordionContent className="text-gray-600 dark:text-gray-400">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
