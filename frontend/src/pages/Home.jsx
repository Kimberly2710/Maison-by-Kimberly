import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import ProductCard from '../components/ProductCard'
import PolicyStrip from '../components/PolicyStrip'
import HeroSlider from '../components/HeroSlider'
import NewArrivals from '../components/NewArrivals'

const defaultSlides = [
  {
    label: 'Maison Edit',
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
  { slug: 'dresses', label: 'Dresses', icon: '👗' },
  { slug: 'tops', label: 'Tops', icon: '👚' },
  { slug: 'crop-tops', label: 'Crop Tops', icon: '✨' },
  { slug: 'boho-skirts', label: 'Boho Skirts', icon: '🌸' },
  { slug: 'trousers', label: 'Trousers', icon: '👖' },
  { slug: 'palazzo', label: 'Palazzo / Official', icon: '💼' },
  { slug: 'jumpsuit', label: 'Jumpsuit', icon: '🧥' },
  { slug: 'jumpshorts', label: 'Jumpshorts', icon: '🩳' },
  { slug: 'shoes', label: 'Shoes', icon: '👠' },
]

const badges = [
  { icon: '💎', title: 'Curated Quality', desc: 'Every item inspected and selected by hand' },
  { icon: '🌿', title: 'Sustainable Fashion', desc: 'Give beautiful clothes a second life' },
  { icon: '📦', title: 'One of a Kind', desc: 'Limited pieces — once it\'s gone, it\'s gone' },
  { icon: '💬', title: 'Order via WhatsApp', desc: 'Fast, personal, and direct to Kim' },
]

export default function Home() {
  const [slides, setSlides] = useState([])
  const [featured, setFeatured] = useState([])
  const [newArrivals, setNewArrivals] = useState([])

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

  return (
    <>
      {/* HERO */}
      <div className="min-h-screen bg-blush/90 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(122,16,64,0.18),_transparent_25%),radial-gradient(circle_at_bottom_right,_rgba(196,112,144,0.18),_transparent_20%)]" />
        <div className="relative max-w-6xl mx-auto px-6 pt-[120px] pb-20">
          <HeroSlider slides={slides.length ? slides : defaultSlides} />
        </div>
      </div>

      {/* CATEGORIES */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <p className="section-eyebrow">Browse by</p>
        <h2 className="section-title">Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4">
          {categories.map(cat => (
            <Link
              key={cat.slug}
              to={`/shop?cat=${cat.slug}`}
              className="flex flex-col items-center justify-center gap-3 py-7 px-4 bg-blush border border-blush-border rounded-2xl transition-all duration-200 hover:bg-wine hover:border-wine hover:-translate-y-1 hover:shadow-lg group"
            >
              <span className="text-3xl">{cat.icon}</span>
              <span className="text-xs font-medium text-wine group-hover:text-white text-center transition-colors">
                {cat.label}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* NEW ARRIVALS */}
      <NewArrivals products={newArrivals} />

      {/* FEATURED PRODUCTS */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
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
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
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
    </>
  )
}