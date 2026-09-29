import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/useCart'

const WHATSAPP = '254781245686'

const CAT_LABELS = {
  dresses: 'Dresses',
  tops: 'Tops',
  'crop-tops': 'Crop Tops',
  'boho-skirts': 'Skirt / Boho Skirts',
  trousers: 'Trousers',
  palazzo: 'Palazzo / Official',
  shoes: 'Shoes',
}

export default function ProductCard({ product }) {
  const { name, category, price, size, description, image, front_image, back_image, video_url, video_file, sold } = product
  const [viewOpen, setViewOpen] = useState(false)
  const [added, setAdded] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [selectedSide, setSelectedSide] = useState(front_image ? 'front' : 'back')
  const { addToCart } = useCart()

  const previewImage = image || front_image || back_image
  const displayImage = selectedSide === 'back' ? back_image || front_image || image : front_image || image || back_image
  const videoSrc = video_file ? `/uploads/${video_file}` : video_url || null

  const waMessage = encodeURIComponent(
    `Hi Kim! I am interested in:\n\n*${name}*\nPrice: KSh ${Number(price).toLocaleString()}\nSize: ${size || 'Please advise'}\n\nIs this still available?`
  )
  const waLink = `https://wa.me/${WHATSAPP}?text=${waMessage}`

  function openDetails() {
    setQuantity(1)
    setViewOpen(true)
  }

  return (
    <>
      <div className="group overflow-hidden bg-transparent transition-all duration-200 hover:-translate-y-1">
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-slate-100 cursor-pointer" onClick={openDetails} role="button" tabIndex="0" onKeyDown={event => (event.key === 'Enter' || event.key === ' ') && openDetails()}>
          {previewImage ? (
            <img
              src={`/uploads/${previewImage}`}
              alt={name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-5xl text-rose">
              ✦
            </div>
          )}
          <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-3">
            <span className="bg-blush/90 text-wine text-[10px] font-semibold tracking-[1.5px] uppercase px-3 py-1 rounded-full border border-blush-border">
              {CAT_LABELS[category] || category}
            </span>
            {!sold && (
              <span className="self-start rounded-full border border-blush-border bg-white/90 px-3 py-2 text-[11px] font-semibold text-wine">View item</span>
            )}
          </div>
          {sold && (
            <span className="absolute bottom-3 left-3 bg-slate-900/90 text-white font-black text-2xs uppercase tracking-widest px-3 py-1 rounded-md shadow-md backdrop-blur-sm border border-white/10">
              SOLD
            </span>
          )}
        </div>
        <div className="px-1 pt-4">
          <button type="button" onClick={openDetails} className="text-left text-sm font-medium text-slate-900 transition-colors hover:text-pink-600">{name}</button>
          <span className="mt-1 block text-sm text-slate-500">KSh {Number(price).toLocaleString()}</span>
          {size && (
            <p className="mb-2 mt-2 text-xs text-slate-600">Size: {size}</p>
          )}
          {description && (
            <p className="mb-4 mt-2 line-clamp-2 text-xs leading-relaxed text-slate-600">
              {description}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-2">
            {sold ? (
              <span className="w-full bg-slate-900 text-white py-3 rounded-xl font-black text-xs uppercase tracking-widest text-center cursor-not-allowed select-none shadow-sm">
                SOLD OUT
              </span>
            ) : (
              <>
                <a href={waLink} target="_blank" rel="noreferrer" className="rounded-full bg-wine px-3 py-2 text-[11px] font-medium tracking-wide text-white transition-colors hover:bg-wine-deep">
                  Chat on WhatsApp
                </a>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation()
                    addToCart(product)
                    setAdded(true)
                    window.setTimeout(() => setAdded(false), 1800)
                  }}
                  className="rounded-full border border-pink-600 px-3 py-2 text-[11px] font-semibold tracking-wide text-pink-600 transition-colors hover:bg-pink-600 hover:text-white"
                >
                  {added ? 'Added to cart' : 'Add to Cart'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {viewOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="relative w-full max-w-5xl max-h-full overflow-y-auto bg-white rounded-3xl shadow-2xl">
            <button
              type="button"
              onClick={() => setViewOpen(false)}
              className="absolute top-4 right-4 text-xs uppercase tracking-[2px] text-wine border border-wine rounded-full px-4 py-2 bg-white/90 hover:bg-wine hover:text-white transition-colors"
            >
              Close
            </button>
            <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_0.9fr] gap-6 p-8">
              <div className="space-y-4">
                {videoSrc ? (
                  <div className="rounded-3xl border border-blush-border bg-black/95 p-3">
                    <video src={videoSrc} controls playsInline className="w-full aspect-video rounded-2xl object-cover" />
                  </div>
                ) : null}
                <div className="aspect-[4/5] bg-blush overflow-hidden rounded-3xl border border-blush-border">
                  {displayImage ? (
                    <img src={`/uploads/${displayImage}`} alt={`${name} ${selectedSide}`} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl text-rose">✦</div>
                  )}
                </div>
                {(front_image || back_image) && (
                  <div className="flex gap-3">
                    {front_image && (
                      <button
                        type="button"
                        onClick={() => setSelectedSide('front')}
                        className={`flex-1 rounded-2xl px-4 py-3 text-sm font-semibold border transition ${selectedSide === 'front' ? 'bg-wine text-white border-wine' : 'bg-blush text-wine border-blush-border'}`}
                      >
                        Front view
                      </button>
                    )}
                    {back_image && (
                      <button
                        type="button"
                        onClick={() => setSelectedSide('back')}
                        className={`flex-1 rounded-2xl px-4 py-3 text-sm font-semibold border transition ${selectedSide === 'back' ? 'bg-wine text-white border-wine' : 'bg-blush text-wine border-blush-border'}`}
                      >
                        Back view
                      </button>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-xs uppercase tracking-[2px] text-wine/80 mb-2">{CAT_LABELS[category] || category}</p>
                  <h2 className="text-3xl font-serif text-wine mb-3">{name}</h2>
                  <p className="text-sm text-wine leading-relaxed">{description || 'No description provided.'}</p>
                </div>
                <div className="rounded-3xl border border-blush-border bg-blush p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm uppercase tracking-[1px] text-wine/80">Price</span>
                    <span className="text-2xl font-semibold text-wine">KSh {Number(price).toLocaleString()}</span>
                  </div>
                  {size && (
                    <div className="flex items-center justify-between text-sm text-wine-light">
                      <span>Size</span>
                      <span>{size}</span>
                    </div>
                  )}
                  {sold && (
                    <div className="rounded-2xl bg-rose/10 px-4 py-3 text-sm font-semibold text-rose">
                      This item has been marked sold.
                    </div>
                  )}
                  {!sold && (
                    <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-3">
                      <span className="text-sm font-semibold text-slate-700">Quantity</span>
                      <div className="flex items-center gap-3">
                        <button type="button" aria-label={`Decrease quantity for ${name}`} onClick={() => setQuantity(current => Math.max(1, current - 1))} className="h-9 w-9 rounded-full border border-slate-300 text-lg font-semibold text-slate-700 hover:border-pink-500 hover:text-pink-600">-</button>
                        <span aria-live="polite" className="w-5 text-center font-bold text-slate-900">{quantity}</span>
                        <button type="button" aria-label={`Increase quantity for ${name}`} onClick={() => setQuantity(current => current + 1)} className="h-9 w-9 rounded-full border border-slate-300 text-lg font-semibold text-slate-700 hover:border-pink-500 hover:text-pink-600">+</button>
                      </div>
                    </div>
                  )}
                  {!sold && (
                    <button type="button" onClick={() => { addToCart(product, quantity); setViewOpen(false); setQuantity(1) }} className="block w-full rounded-2xl bg-pink-600 px-4 py-3 text-center text-sm font-bold text-white transition hover:bg-pink-700">
                      Add {quantity} {quantity === 1 ? 'item' : 'items'} to Cart
                    </button>
                  )}
                  {sold && (
                    <button
                      type="button"
                      onClick={() => window.open(waLink, '_blank', 'noopener,noreferrer')}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-xl font-black text-sm tracking-wide text-center block transition-all"
                    >
                      Piece Sold - Message Kim for Similar Items
                    </button>
                  )}
                  {!sold && (
                    <Link to="/contact" className="block w-full rounded-2xl bg-wine px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-wine-deep">
                      Buy Now
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
