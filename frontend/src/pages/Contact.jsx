export default function Contact() {
  const methods = [
    { icon: '💬', title: 'WhatsApp', value: '+254 781 245 686', note: 'Fastest response — order here', href: 'https://wa.me/254781245686', highlight: true },
    { icon: '📞', title: 'Call', value: '+254 757 866 002', note: 'For urgent enquiries', href: 'tel:+254757866002', highlight: false },
    { icon: '📸', title: 'Instagram', value: '@maison_by_kimberly', note: 'DMs open · New drops posted here', href: 'https://www.instagram.com/maison_by_kimberly?igsh=MTdyNm1lMGtvNW53MA==', highlight: false },
    { icon: '🎵', title: 'TikTok', value: '@maison_by_kimberly', note: 'Behind the scenes & styling tips', href: 'https://www.tiktok.com/@maison_by_kimberly?_r=1&_t=ZS-97rKkFU21Ar', highlight: false },
  ]

  return (
    <div className="bg-gradient-to-b from-rose-500/20 via-slate-50 to-white">
      <div className="border-b border-slate-200/60 bg-gradient-to-b from-rose-500/20 via-slate-50 to-white px-6 py-12 text-center sm:py-16">
        <p className="section-eyebrow mb-3">Let's connect</p>
        <h1 className="font-serif text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">Contact Kim</h1>
      </div>

      <section className="bg-white px-6 py-20 sm:py-24">
        <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <p className="font-serif italic text-black text-lg leading-relaxed mb-8">
              Have a question about a piece? Want to check availability? Ready to order? Kim is just a message away.
            </p>
            <div className="flex flex-col gap-3">
              {methods.map((m, i) => (
                <a key={i} href={m.href} target="_blank" rel="noreferrer"
                  className={`flex gap-4 items-start p-5 rounded-2xl border transition-all duration-200 hover:translate-x-1
                    ${m.highlight ? 'bg-white border-wine border-l-[3px]' : 'bg-blush border-blush-border hover:border-rose'}`}
                >
                  <span className="text-2xl mt-0.5 flex-shrink-0">{m.icon}</span>
                  <div>
                    <h3 className="text-xs font-semibold text-black tracking-wide mb-1">{m.title}</h3>
                    <p className="text-base font-medium text-black">{m.value}</p>
                    <span className="text-xs text-black/70">{m.note}</span>
                  </div>
                </a>
              ))}
            </div>
          </div>

          <div className="bg-white border border-blush-border rounded-2xl p-6">
            <h3 className="text-base text-black mb-3">🚚 Delivery & Payment</h3>
            <p className="text-sm text-black/80 mb-3">Deliveries countrywide at a fee. Within Mombasa, Kimberly delivers every Saturday. Pick up points are CBD Posta and Bamburi (Petrocity near Milano).</p>
            <h4 className="text-sm font-semibold text-black mb-2">How to Pay</h4>
            <ol className="text-sm text-black/80 leading-loose list-decimal pl-5 mb-4">
              <li>Browse the shop and choose a piece.</li>
              <li>Message Kim on WhatsApp to confirm availability.</li>
              <li>Send full payment via M-Pesa to:</li>
            </ol>
            <div className="bg-blush border-[1.5px] border-wine rounded-xl p-4 mb-4">
              <span className="text-[10px] font-semibold tracking-[1.5px] uppercase text-rose block mb-1">M-Pesa Number</span>
              <span className="text-2xl font-semibold text-black tracking-wide">+254 757 866 002</span>
            </div>
            <ol className="text-sm text-black/80 leading-loose list-decimal pl-5">
              <li>Send Kim the payment screenshot on WhatsApp.</li>
              <li>Once confirmed, your item is reserved and you can arrange delivery or pick-up.</li>
            </ol>
            <p className="text-xs text-black/70 mt-4 italic">⚠️ Items are only reserved after full payment is confirmed.</p>
          </div>

          <div className="bg-white border border-blush-border rounded-2xl p-6">
            <h3 className="text-base text-black mb-3">📍 Location</h3>
            <p className="text-sm text-black/80 leading-relaxed">
              Based in <strong className="text-black">Mombasa, Kenya</strong>. Meet-ups and delivery within Mombasa are available. WhatsApp Kim to arrange.
            </p>
          </div>
        </div>
        </div>
      </section>
    </div>
  )
}