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
      <div className="bg-blush border-b border-blush-border pt-[120px] pb-10 text-center px-6">
        <h1 className="font-script text-black" style={{fontSize:'clamp(48px,8vw,80px)'}}>About Maison</h1>
      </div>

      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div>
            <h2 className="font-script text-black mb-5" style={{fontSize:'52px'}}>Hi, I'm Kimberly.</h2>
            <div className="flex flex-col gap-4 text-sm text-black/80 leading-[1.85]">
              <p>Maison by Kimberly was born from a simple belief — that great style should never be out of reach. I started this brand because I love fashion deeply, and I believe that a beautifully curated thrift piece carries more character than anything you'd find mass-produced on a shelf.</p>
              <p>Every item in this collection is personally hand-picked by me. I look for quality, cut, and that intangible quality that makes you feel like yourself when you put it on. No fast fashion. No compromise. Just pieces worth owning.</p>
              <p>Based in Mombasa, Kenya — meet-ups and delivery available.</p>
            </div>
            <p className="font-serif italic text-black text-xl mt-6">— Kim ✦</p>
          </div>
          <div className="flex flex-col gap-5">
            {[
              { title: 'Hand-Curated', desc: 'Every piece passes through Kim\'s hands and meets a personal standard before it reaches you.' },
              { title: 'Sustainable', desc: 'Thrifting is one of the most powerful things you can do for the planet without giving up style.' },
              { title: 'Personal', desc: 'You order directly. No bots, no auto-replies. Just Kim, ready to help you find your look.' },
            ].map((v, i) => (
              <div key={i} className="px-6 py-5 bg-blush border-l-[3px] border-wine rounded-r-xl">
                <h3 className="text-sm font-semibold text-black tracking-wide mb-2">{v.title}</h3>
                <p className="text-xs text-black/75 leading-relaxed">{v.desc}</p>
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