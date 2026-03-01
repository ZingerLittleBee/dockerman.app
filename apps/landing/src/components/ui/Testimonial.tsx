import Image from 'next/image'
import Balancer from 'react-wrap-balancer'

export default function Testimonial() {
  return (
    <section aria-label="Testimonial" id="testimonial">
      <figure className="mx-auto">
        <blockquote className="mx-auto max-w-2xl text-center font-semibold text-gray-900 text-xl leading-8 sm:text-2xl sm:leading-9 dark:text-gray-50">
          <p>
            <Balancer>
              “Thanks to this robust database solution, our organization has streamlined data
              management processes, leading to increased efficiency and accuracy in our operations.”
            </Balancer>
          </p>
        </blockquote>
        <figcaption className="mt-10 flex items-center justify-center gap-x-5">
          <Image
            alt="Image of Dima Coil"
            className="h-11 w-11 rounded-full object-cover shadow-indigo-500/50 shadow-lg ring-2 ring-white dark:ring-gray-700"
            height={200}
            src="/images/testimonial.webp"
            width={200}
          />
          <div>
            <p className="font-semibold text-gray-900 dark:text-gray-50">Dima Coil</p>
            <p className="text-gray-600 text-sm dark:text-gray-400">CEO Hornertools</p>
          </div>
        </figcaption>
      </figure>
    </section>
  )
}
