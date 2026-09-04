function Icon({ children, label }) {
  return (
    <span aria-label={label} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-rose-50 text-pink-600">
      <svg aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        {children}
      </svg>
    </span>
  )
}

const methods = [
  { icon: 'message', title: 'WhatsApp', value: '+254 781 245 686', href: 'https://wa.me/254781245686' },
  { icon: 'phone', title: 'Phone Call', value: '+254 757 866 002', href: 'tel:+254757866002' },
  { icon: 'instagram', title: 'Instagram', value: '@maison_by_kimberly', href: 'https://www.instagram.com/maison_by_kimberly?igsh=MTdyNm1lMGtvNW53MA==' },
  { icon: 'tiktok', title: 'TikTok', value: '@maison_by_kimberly', href: 'https://www.tiktok.com/@maison_by_kimberly?_r=1&_t=ZS-97rKkFU21Ar' },
]

function ContactIcon({ type }) {
  if (type === 'phone') {
    return <Icon label="Phone"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 3.18 2 2 0 0 1 4.11 1h3a2 2 0 0 1 2 1.72c.12.9.33 1.78.62 2.63a2 2 0 0 1-.45 2.11L8 8.73a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.85.29 1.73.5 2.63.62A2 2 0 0 1 22 16.92Z" /></Icon>
  }

  if (type === 'instagram') {
    return <Icon label="Instagram"><rect height="17" rx="4" width="17" x="3.5" y="3.5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" fill="currentColor" r=".7" stroke="none" /></Icon>
  }

  if (type === 'tiktok') {
    return <Icon label="TikTok"><path d="M15 4v10.5a4.5 4.5 0 1 1-3.6-4.41M15 4c.52 2.2 1.8 3.5 4 4" /></Icon>
  }

  return <Icon label="WhatsApp"><path d="M20.5 11.4a8.5 8.5 0 0 1-12.55 7.48L3.5 20.5l1.66-4.3A8.5 8.5 0 1 1 20.5 11.4Z" /><path d="M8.5 8.5c.2-.4.4-.4.7-.4h.5c.2 0 .4.1.5.4l.7 1.7c.1.2 0 .4-.1.6l-.5.6c.7 1.3 1.7 2.3 3 3l.6-.5c.2-.2.4-.2.6-.1l1.7.7c.3.1.4.3.4.5v.5c0 .3 0 .5-.4.7-2.5 1.1-8.3-3.8-7.7-7.7Z" /></Icon>
}

export default function Contact() {
  return (
    <div className="bg-slate-50">
      <div className="w-full border-b border-slate-200/60 bg-gradient-to-b from-rose-400/20 via-pink-200/5 to-transparent px-6 text-center">
        <p className="pt-16 text-xs font-semibold uppercase tracking-wider text-pink-600">Let's Connect</p>
        <h1 className="pb-12 pt-3 font-serif text-4xl font-extrabold text-slate-900 sm:text-5xl">Contact Kim</h1>
      </div>

      <main className="mx-auto grid max-w-7xl grid-cols-1 items-start gap-10 bg-transparent px-6 py-6 md:grid-cols-2 lg:px-8">
        <div className="space-y-4">
          {methods.map(method => (
            <a key={method.title} className="flex items-center gap-4 rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-md" href={method.href} rel="noreferrer" target="_blank">
              <ContactIcon type={method.icon} />
              <div>
                <h2 className="font-sans text-base font-bold text-slate-900">{method.title}</h2>
                <p className="mt-1 text-sm font-medium text-slate-600">{method.value}</p>
              </div>
            </a>
          ))}
        </div>

        <section className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="font-serif text-2xl font-bold text-slate-900">How To Pay</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">A simple, personal checkout from selection to delivery.</p>
          <ol className="mt-6 list-decimal space-y-3 pl-5 text-sm leading-relaxed text-slate-700 marker:font-bold marker:text-pink-600">
            <li>Browse the shop and choose your preferred piece.</li>
            <li>Message Kim on WhatsApp to confirm availability.</li>
            <li>Send full payment via Lipa na M-Pesa using the details below.</li>
          </ol>
          <div className="mt-6 rounded-xl border border-pink-200 bg-rose-50 p-5">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-pink-600">Lipa na M-Pesa</p>
            <p className="mt-2 text-2xl font-extrabold tracking-wide text-slate-900">+254 757 866 002</p>
            <p className="mt-1 text-xs font-medium text-slate-600">Send payment directly to this M-Pesa number.</p>
          </div>
          <ol start="4" className="mt-6 list-decimal space-y-3 pl-5 text-sm leading-relaxed text-slate-700 marker:font-bold marker:text-pink-600">
            <li>Send Kim the payment screenshot on WhatsApp.</li>
            <li>Once payment is confirmed, arrange your delivery or pickup.</li>
          </ol>
          <p className="mt-6 border-t border-slate-100 pt-4 text-xs font-medium italic text-slate-500">Items are reserved only after full payment is confirmed.</p>
        </section>

        <section className="col-span-1 mt-6 flex w-full items-start gap-4 rounded-2xl border border-slate-200/60 bg-white p-6 shadow-sm md:col-span-2">
          <Icon label="Location"><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></Icon>
          <p className="pt-1 text-sm leading-relaxed text-slate-700"><strong className="font-bold text-slate-900">Location:</strong> Mombasa, Kenya — Deliveries countrywide via preferred courier platforms. Deliveries within CBD Mombasa are handled within 24 hours.</p>
        </section>
      </main>
    </div>
  )
}
