import PolicyStrip from '../components/PolicyStrip'

const policies = [
  'Confirm availability before making any payment',
  'Items are only reserved after full payment is received',
  'Please confirm your size carefully before purchasing',
  'No deposits accepted',
  'No refunds',
  'No exchanges',
]

export default function About() {
  return (
    <>
      <div className="border-b border-slate-200/60 bg-gradient-to-b from-rose-500/20 via-slate-50 to-white px-6 py-12 text-center sm:py-16">
        <p className="mb-2 block text-xs font-semibold uppercase tracking-wider text-pink-600">The story behind the edit</p>
        <h1 className="font-serif text-4xl font-semibold leading-tight tracking-tight text-slate-900 sm:text-5xl">About Maison</h1>
      </div>

      <section className="bg-white px-6 py-20 sm:py-24">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-start gap-8 md:grid-cols-2 lg:gap-20">
          <div className="rounded-2xl border border-white bg-white/80 p-7 shadow-xl shadow-slate-200/70 backdrop-blur-md sm:p-10">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.28em] text-wine">About Maison</p>
            <h2 className="mb-7 font-sans text-5xl font-black leading-[0.95] tracking-tight text-slate-900 sm:text-6xl">Hi, I'm Kimberly.</h2>
            <div className="flex flex-col gap-5 text-base font-medium leading-relaxed text-slate-700">
              <p>Maison by Kimberly was born from a simple belief — that great style should never be out of reach. I started this brand because I love fashion deeply, and I believe that a beautifully curated thrift piece carries more character than anything you'd find mass-produced on a shelf.</p>
              <p>Every item in this collection is personally hand-picked by me. I look for quality, cut, and that intangible quality that makes you feel like yourself when you put it on. No fast fashion. No compromise. Just pieces worth owning.</p>
              <p>Based in Mombasa, Kenya — meet-ups and delivery available.</p>
            </div>
            <p className="mt-8 font-serif text-xl italic text-slate-900">— Kim ✦</p>
          </div>
          <div className="mt-2 grid gap-4 items-start">
            {[
              { title: 'Hand-Curated', desc: 'Every piece passes through Kim\'s hands and meets a personal standard before it reaches you.' },
              { title: 'Sustainable', desc: 'Thrifting is one of the most powerful things you can do for the planet without giving up style.' },
              { title: 'Personal', desc: 'You order directly. No bots, no auto-replies. Just Kim, ready to help you find your look.' },
            ].map((v, i) => (
              <div key={i} className="rounded-2xl border border-slate-200 bg-slate-50/80 px-7 py-6 shadow-sm">
                <h3 className="mb-2 font-sans text-lg font-extrabold tracking-tight text-slate-900">{v.title}</h3>
                <p className="text-sm font-medium leading-relaxed text-slate-600">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-blush py-16 px-6">
        <div className="max-w-2xl mx-auto">
          <h2 className="section-title">Store Policy</h2>
          <div className="flex flex-col gap-3">
            {policies.map((p, i) => (
              <div key={i} className="bg-white border border-blush-border border-l-[3px] border-l-rose rounded-r-xl px-5 py-4 text-sm text-black/80">
                <strong className="text-black">Policy {i+1}:</strong> ✦ {p}
              </div>
            ))}
          </div>
        </div>
      </section>

      <PolicyStrip />
    </>
  )
}