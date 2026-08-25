import React from 'react'

export default function NewArrivals({ products = [] }) {
  return (
    <section className="mx-auto max-w-7xl px-6 py-12 sm:px-8 lg:px-12">
      <p className="section-eyebrow">Just In</p>
      <h2 className="section-title">New Arrivals</h2>
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {products.map((product) => {
            const image = product.front_image || product.back_image || product.image || '/uploads/new-1.jpg'
            const imageUrl = image.startsWith('/') ? image : `/uploads/${image}`
            return (
              <div key={product.id} className="bg-white border border-blush-border rounded-2xl overflow-hidden">
                <div className="aspect-[3/4] bg-blush">
                  <img
                    src={imageUrl}
                    alt={product.name || 'New arrival item'}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="p-4 text-center">
                  <p className="text-[10px] uppercase tracking-[1.5px] text-wine/70 mb-2">New Arrival</p>
                  <p className="text-sm font-semibold text-wine-deep">{product.name}</p>
                  <p className="text-xs text-wine-light mt-1">KSh {Number(product.price).toLocaleString()}</p>
                </div>
              </div>
            )
          })}
        </div>
      ) : null}
    </section>
  )
}
