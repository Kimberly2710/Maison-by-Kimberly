import { useState } from 'react'
import { Link } from 'react-router-dom'

const WHATSAPP = '254781245686'

const CAT_LABELS = {
  dresses: 'Dresses',
  tops: 'Tops',
  'crop-tops': 'Crop Tops',
  'boho-skirts': 'Boho Skirts',
  trousers: 'Trousers',
  palazzo: 'Palazzo / Official',
  shoes: 'Shoes',
  
}

export default function ProductCard({ product }) {
  const { name, category, price, size, description, image, front_image, back_image, sold } = product
  const [viewOpen, setViewOpen] = useState(false)
  const [selectedSide, setSelectedSide] = useState(front_image ? 'front' : 'back')

  const previewImage = image || front_image || back_image
  const displayImage = selectedSide === 'back' ? back_image || front_image || image : front_image || image || back_image

  const waMessage = encodeURIComponent(
    `Hi Kim! I am interested in:\n\n*${name}*\nPrice: KSh ${Number(price).toLocaleString()}\nSize: ${size || 'Please advise'}\n\nIs this still available?`
  )
  const waLink = `https://wa.me/${WHATSAPP}?text=${waMessage}`

  return (
    <>
      <div className="bg-white border border-blush-border rounded-2xl overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-xl group">
        <div className="relative aspect-[3/4] overflow-hidden bg-blush">
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
          <div className="absolute inset-0 flex flex-col justify-between p-3">
            <span className="bg-blush/90 text-wine text-[10px] font-semibold tracking-[1.5px] uppercase px-3 py-1 rounded-full border border-blush-border">
              {CAT_LABELS[category] || category}
            </span>
            <button
              type="button"
              onClick={() => setViewOpen(true)}
              className="self-start bg-white/90 text-wine text-[11px] font-semibold px-3 py-2 rounded-full border border-blush-border hover:bg-white transition-colors"
            >
              View item
            </button>
          </div>
          {sold && (
            <span className="absolute top-3 right-3 bg-rose text-white text-[10px] font-semibold tracking-[1.5px] uppercase px-3 py-1 rounded-full border border-rose/70">
              Sold
            </span>
          )}
        </div>
        <div className="p-5">
          <h3 className="font-serif text-lg text-wine-deep mb-1">{name}</h3>
          {size && (
            <p className="text-xs text-wine mb-2">Size: {size}</p>
          )}
          {description && (
            <p className="text-xs text-[#6b5060] mb-4 line-clamp-2 leading-relaxed">
              {description}
            </p>
          )}
          <div className="flex items-center justify-between gap-3">
            <span className="text-lg font-semibold text-wine">
              KSh {Number(price).toLocaleString()}
            </span>
            {sold ? (
              <button className="bg-rose text-white text-[11px] font-medium px-4 py-2 rounded-full tracking-wide cursor-not-allowed opacity-80 whitespace-nowrap">
                Sold
              </button>
            ) : (
              <a
                href={waLink}
                target="_blank"
                rel="noreferrer"
                className="bg-wine text-white text-[11px] font-medium px-4 py-2 rounded-full tracking-wide hover:bg-wine-deep transition-colors whitespace-nowrap"
              >
                Order via WhatsApp
              </a>
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
                  <Link
                    to="/contact"
                    className={`block w-full text-center rounded-2xl px-4 py-3 text-sm font-semibold transition ${sold ? 'bg-gray-300 text-gray-700 cursor-not-allowed' : 'bg-wine text-white hover:bg-wine-deep'}`}
                  >
                    {sold ? 'Sold' : 'Buy Now'}
                  </Link>
                  {!sold && (
                    <a href={waLink} target="_blank" rel="noreferrer" className="block text-center text-sm text-wine underline">
                      Or order immediately on WhatsApp
                    </a>
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
