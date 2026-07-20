import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export default function HeroSlider({ slides }) {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    if (!slides.length) return undefined
    const interval = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % slides.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [slides.length])

  if (!slides.length) return null
  const slide = slides[activeIndex]
  const actionLink = slide.actionLink || slide.action_link || '/shop'
  const actionText = slide.actionText || slide.action_text || 'Shop now'
  const imageUrl = slide.image && (slide.image.startsWith('/') || slide.image.startsWith('http'))
    ? slide.image
    : slide.image
      ? `/uploads/${slide.image}`
      : null
  const isInternal = actionLink.startsWith('/')

  return (
    <section aria-label={`Homepage slider. Slide ${activeIndex + 1} of ${slides.length}`} className="relative overflow-hidden rounded-[2.5rem] border border-blush-border bg-wine/5 shadow-[0_30px_90px_rgba(122,16,64,0.08)]">
      <div
        className="relative h-[520px] sm:h-[600px] bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: imageUrl
            ? `linear-gradient(rgba(13, 7, 12, 0.5), rgba(13, 7, 12, 0.5)), url(${imageUrl})`
            : `linear-gradient(180deg, rgba(122,16,64,.35), rgba(25,8,23,.65))`,
        }}
        aria-label={slide.alt_text || slide.title || 'Slide image'}
      >
        <div className="absolute inset-0 bg-wine/20" />
        <div className="relative z-10 h-full flex flex-col justify-end p-6 sm:p-12 text-white">
          <div className="absolute top-6 left-6 z-20 text-left">
            <p className="text-xs uppercase tracking-widest text-white/80">Welcome</p>
            <h2 className="font-script text-2xl sm:text-3xl text-white/95">Welcome to Maison by Kimberly</h2>
          </div>
          <span className="section-eyebrow text-white/80">{slide.label}</span>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl leading-tight max-w-3xl">
            {slide.title}
          </h1>
          <p className="mt-4 max-w-2xl text-sm sm:text-base text-white/80 leading-relaxed">
            {slide.description}
          </p>
          {isInternal ? (
            <Link
              to={actionLink}
              className="mt-8 inline-flex items-center justify-center rounded-full bg-white/95 px-8 py-3 text-sm font-semibold text-wine transition-all duration-200 hover:bg-white"
            >
              {actionText}
            </Link>
          ) : (
            <a
              href={actionLink}
              target="_blank"
              rel="noreferrer"
              className="mt-8 inline-flex items-center justify-center rounded-full bg-white/95 px-8 py-3 text-sm font-semibold text-wine transition-all duration-200 hover:bg-white"
            >
              {actionText}
            </a>
          )}
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setActiveIndex(index)}
            className={`h-2.5 w-8 rounded-full transition-all ${index === activeIndex ? 'bg-white' : 'bg-white/40 hover:bg-white'}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
