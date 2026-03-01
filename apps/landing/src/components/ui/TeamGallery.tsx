import { InstaxImage } from './InstaxImage'

export default function TeamGallery() {
  return (
    <section
      aria-labelledby="teamwork-title"
      className="mx-auto mt-5 max-w-4xl animate-slide-up-fade"
      style={{
        animationDuration: '600ms',
        animationDelay: '200ms',
        animationFillMode: 'backwards'
      }}
    >
      <div className="mt-20">
        <div className="flex w-full flex-col items-center justify-between md:flex-row">
          <InstaxImage
            alt="Two employees working with computers"
            caption="At Database we use computers"
            className="w-[25rem] -rotate-6 sm:-ml-10"
            height={427}
            src="/images/working.webp"
            width={640}
          />
          <InstaxImage
            alt="Office with a phone booth"
            caption="Our phone booths are nuts"
            className="w-[15rem] rotate-3"
            height={853}
            src="/images/workplace.webp"
            width={640}
          />
          <InstaxImage
            alt="Picture of the Fraumunster Zurich"
            caption="Home sweet home"
            className="-mr-10 w-[15rem] rotate-1"
            height={960}
            src="/images/home.webp"
            width={640}
          />
        </div>
        <div className="mt-8 hidden w-full justify-between gap-4 md:flex">
          <InstaxImage
            alt="Team having a break in the lunch room"
            caption="Sometimes we take a break"
            className="-ml-16 w-[25rem] rotate-1"
            height={360}
            src="/images/break.webp"
            width={640}
          />
          <InstaxImage
            alt="Personw with headphones"
            caption="Robin handels the playlist"
            className="-mt-10 w-[15rem] -rotate-3"
            height={965}
            src="/images/cool.webp"
            width={640}
          />
          <InstaxImage
            alt="Picture of a party with confetti"
            caption="v1.0 Release party. Our US intern, Mike, had his first alcohol-free beer"
            className="-mt-2 -mr-20 w-[30rem] rotate-[8deg]"
            height={1281}
            src="/images/release.webp"
            width={1920}
          />
        </div>
      </div>
      <div className="mt-28">
        <div className="flex w-full flex-col items-center justify-between md:flex-row">
          <InstaxImage
            alt=" Join Database, be yourself."
            caption=" Join Database, be yourself."
            className="w-full rotate-1"
            height={998}
            src="/images/founders.webp"
            width={1819}
          />
        </div>
      </div>
    </section>
  )
}
