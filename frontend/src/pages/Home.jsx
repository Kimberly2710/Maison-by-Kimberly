import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import ProductCard from '../components/ProductCard'
import PolicyStrip from '../components/PolicyStrip'
import HeroSlider from '../components/HeroSlider'
import NewArrivals from '../components/NewArrivals'

const defaultSlides = [
  {
    title: 'Vintage tailoring reimagined for modern style',
    description: 'Discover a rotating edit of rare dresses, suits, and statement pieces styled with effortless confidence.',
    actionText: 'Shop the Edit',
    actionLink: '/shop',
    image: '/uploads/hero-1.jpg',
    alt_text: 'Stylish model in vintage tailoring',
  },
  {
    label: 'Limited Drops',
    title: 'Burgundy tones, silk details, and couture-inspired daywear',
    description: 'Every piece is hand-chosen for quality, personality, and wearability. No two drops are the same.',
    actionText: 'Explore New Pieces',
    actionLink: '/shop',
    image: '/uploads/hero-2.jpg',
    alt_text: 'Rich burgundy fashion spread',
  },
  {
    label: 'Behind the Scenes',
    title: 'Style notes from Kimberly — curated, conscious, iconic',
    description: 'Follow the journey on TikTok and Instagram for early access, styling inspiration, and exclusive restock alerts.',
    actionText: 'Follow @maison_by_kimberly',
    actionLink: 'https://www.instagram.com/maison_by_kimberly?igsh=MTdyNm1lMGtvNW53MA==',
    image: '/uploads/hero-3.jpg',
    alt_text: 'Behind the scenes fashion story',
  },
]

const categories = [
  { slug: 'dresses', label: 'Dresses'},
  { slug: 'tops', label: 'Tops'},
  { slug: 'crop-tops', label: 'Crop Tops' },
  { slug: 'boho-skirts', label: 'Skirt / Boho Skirts'},
  { slug: 'trousers', label: 'Trousers'},
  { slug: 'palazzo', label: 'Palazzo / Official'},
  { slug: 'jumpsuit', label: 'Jumpsuit'},
  { slug: 'jumpshorts', label: 'Jumpshorts'},
  { slug: 'shoes', label: 'Shoes' },
]

const badges = [
  {  title: 'Curated Quality', desc: 'Every item inspected and selected by hand' },
  {  title: 'Sustainable Fashion', desc: 'Give beautiful clothes a second life' },
  {  title: 'One of a Kind', desc: 'Limited pieces — once it\'s gone, it\'s gone' },
  {  title: 'Order via WhatsApp', desc: 'Fast, personal, and direct to Kim' },
]

export default function Home() {
  const [slides, setSlides] = useState([])
  const [featured, setFeatured] = useState([])
  const [newArrivals, setNewArrivals] = useState([])
  const [theme, setTheme] = useState(() => {
    const savedTheme = window.localStorage.getItem('maison-theme')
    if (savedTheme === 'dark' || savedTheme === 'light') return savedTheme
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })

  useEffect(() => {
    axios.get('/api/homepage/slides')
      .then(res => setSlides(res.data))
      .catch(() => setSlides([]))

    axios.get('/api/products')
      .then(res => setFeatured(res.data.slice(0, 4)))
      .catch(() => setFeatured([]))

    axios.get('/api/homepage/new-arrivals')
      .then(res => setNewArrivals(res.data))
      .catch(() => setNewArrivals([]))
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    window.localStorage.setItem('maison-theme', theme)
  }, [theme])

  const isDark = theme === 'dark'

  return (
    <div className={isDark ? 'min-h-screen w-full bg-slate-950 text-slate-100' : 'min-h-screen w-full bg-gradient-to-b from-rose-500/20 via-slate-50 to-white text-slate-900'}>
      {/* HERO */}
      <div className={isDark ? 'relative min-h-screen overflow-hidden border-b border-slate-700/60 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 px-6 py-12 sm:py-16' : 'relative min-h-screen overflow-hidden border-b border-slate-200/60 bg-gradient-to-b from-rose-500/20 via-slate-50 to-white px-6 py-12 sm:py-16'}>
        <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="flex justify-end pb-4">
            <button
              type="button"
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              aria-pressed={isDark}
              onClick={() => setTheme(current => current === 'dark' ? 'light' : 'dark')}
              className={isDark ? 'rounded-full border border-slate-600 bg-slate-800 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-100 transition hover:border-slate-500 hover:text-white' : 'rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-700 transition hover:border-pink-300 hover:text-pink-700'}
            >
              {isDark ? 'Light mode' : 'Dark mode'}
            </button>
          </div>
          <HeroSlider slides={slides.length ? slides : defaultSlides} />
        </div>
      </div>

      {/* CATEGORIES */}
      <section className={isDark ? 'mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-12' : 'mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-12'}>
        <p className={isDark ? 'section-eyebrow text-pink-300' : 'section-eyebrow'}>Browse by</p>
        <h2 className={isDark ? 'mb-12 text-center font-serif text-4xl font-semibold text-pink-200 sm:text-5xl' : 'section-title'}>Categories</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-7">
          {categories.map(cat => (
            <Link
              key={cat.slug}
              to={`/shop?cat=${cat.slug}`}
              aria-label={`Browse ${cat.label} products`}
              className={isDark ? 'flex min-h-[96px] items-center justify-center rounded-2xl border border-slate-700 bg-slate-900 px-4 py-4 text-center transition-all duration-350 hover:-translate-y-1 hover:border-pink-400 hover:bg-slate-800 hover:shadow-lg group' : 'flex min-h-[96px] items-center justify-center rounded-2xl border-2 border-wine/35 bg-blush px-4 py-4 text-center transition-all duration-350 hover:-translate-y-1 hover:border-wine hover:bg-wine hover:shadow-lg group'}
            >
              <span className={isDark ? 'text-sm font-semibold text-slate-100 transition-colors group-hover:text-white' : 'text-sm font-semibold text-wine transition-colors group-hover:text-white'}>
                {cat.label}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* NEW ARRIVALS */}
      <NewArrivals products={newArrivals} />

      {/* FEATURED PRODUCTS */}
      <section className="mx-auto max-w-7xl px-6 pb-20 sm:px-8 lg:px-12">
        <p className="section-eyebrow">Hand-picked for you</p>
        <h2 className="section-title">New Arrivals</h2>
        {featured.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        ) : (
          <div className="text-center py-16 text-wine">
            <p className="text-4xl mb-4">✦</p>
            <p className="font-serif text-xl font-light">New pieces dropping soon.</p>
            <p className="text-sm mt-2">Follow <strong>@maison_by_kimberly</strong> for first looks 💕</p>
          </div>
        )}
        <div className="text-center mt-12">
          <Link to="/shop" className="btn-outline">View All Pieces</Link>
        </div>
      </section>

      {/* WHY MAISON */}
      <section className="bg-blush py-20 px-6">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-6 sm:px-8 lg:grid-cols-2 lg:px-12">
          <div>
            <p className="section-eyebrow" style={{textAlign:'left'}}>The Maison way</p>
            <h2 className="font-serif text-wine text-left mb-5" style={{fontSize:'clamp(28px,4vw,42px)',fontWeight:300}}>
              Luxury doesn't have to cost a fortune.
            </h2>
            <p className="text-sm text-wine leading-relaxed mb-6">
              Every piece in the Maison by Kimberly collection is hand-selected for quality, style, and that something special you can't find on the high street. Thrift is not a compromise — it's a choice.
            </p>
            <Link to="/about" className="btn-outline">Our Story</Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {badges.map((b, i) => (
              <div key={i} className="bg-white border border-blush-border rounded-2xl p-5">
                <span className="text-2xl mb-3 block">{b.icon}</span>
                <h3 className="text-sm font-semibold text-wine mb-2">{b.title}</h3>
                <p className="text-xs text-wine leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PolicyStrip />
    </div>
  )
}