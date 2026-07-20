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
  { slug: 'boho-skirts', label: 'Boho Skirts' },
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
    <>
      <div className="bg-blush border-b border-blush-border pt-[120px] pb-10 text-center px-6">
        <h1 className="font-script text-black" style={{fontSize:'clamp(48px,8vw,80px)'}}>Shop</h1>
      </div>

      <div className="sticky top-[68px] z-40 bg-white/95 backdrop-blur-sm border-b border-blush-border px-6">
        <div className="max-w-6xl mx-auto flex gap-2 overflow-x-auto py-3 filter-scroll">
          {filters.map(f => (
            <button
              key={f.slug}
              onClick={() => setSearchParams(f.slug === 'all' ? {} : { cat: f.slug })}
              className={`px-4 py-2 rounded-full text-xs font-medium tracking-wide whitespace-nowrap border transition-all duration-200
                ${activecat === f.slug
                  ? 'bg-wine border-wine text-white'
                  : 'bg-transparent border-blush-border text-wine hover:border-wine hover:text-wine'
                }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <section className="max-w-6xl mx-auto px-6 py-12">
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
      </section>

      <PolicyStrip />
    </>
  )
}