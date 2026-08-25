import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import axios from 'axios'
import ProductCard from '../components/ProductCard'
import PolicyStrip from '../components/PolicyStrip'

const filters = [
  { slug: 'all', label: 'All' },
  { slug: 'dresses', label: 'Dresses' },
  { slug: 'tops', label: 'Tops' },
  { slug: 'crop-tops', label: 'Crop Tops' },
  { slug: 'boho-skirts', label: 'Skirt / Boho Skirts' },
  { slug: 'trousers', label: 'Trousers' },
  { slug: 'palazzo', label: 'Palazzo / Official' },
  { slug: 'jumpsuit', label: 'Jumpsuit' },
  { slug: 'jumpshorts', label: 'Jumpshorts' },
  { slug: 'shoes', label: 'Shoes' },
]

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const activecat = searchParams.get('cat') || 'all'

  useEffect(() => {
    setLoading(true)
    const url = activecat === 'all' ? '/api/products' : `/api/products?category=${activecat}`
    axios.get(url)
      .then(res => { setProducts(res.data); setLoading(false) })
      .catch(() => { setProducts([]); setLoading(false) })
  }, [activecat])

  return (
    <div className="bg-gradient-to-b from-rose-500/20 via-slate-50 to-white">
      <div className="border-b border-slate-200/60 bg-gradient-to-b from-rose-500/20 via-slate-50 to-white px-6 py-12 text-center sm:py-16">
        <p className="section-eyebrow mb-3">The Maison edit</p>
        <h1 className="font-serif text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">Shop</h1>
      </div>

      <div className="sticky top-[76px] z-40 border-b border-slate-200/60 bg-white/90 px-6 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl flex-wrap gap-4 py-5 sm:gap-6">
          {filters.map(f => (
            <button
              key={f.slug}
              onClick={() => setSearchParams(f.slug === 'all' ? {} : { cat: f.slug })}
              className={`border-b-2 pb-1 text-xs font-medium tracking-wide transition-colors duration-200
                ${activecat === f.slug
                  ? 'border-pink-600 font-semibold text-pink-600'
                  : 'border-transparent text-slate-600 hover:border-pink-300 hover:text-pink-500'
                }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <section className="bg-white px-6 py-16">
        <div className="max-w-6xl mx-auto">
        {loading ? (
          <div className="text-center py-20 text-wine text-sm">Loading pieces... ✦</div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        ) : (
          <div className="text-center py-20 text-wine">
            <p className="text-4xl mb-4">✦</p>
            <h3 className="font-serif text-2xl font-light mb-3">New pieces coming soon</h3>
            <p className="text-sm">Follow <strong>@maison_by_kimberly</strong> on Instagram for first looks 💕</p>
          </div>
        )}
        </div>
      </section>

      <PolicyStrip />
    </div>
  )
}