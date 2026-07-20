const policies = [
  'Confirm availability before payment',
  'Items reserved after full payment only',
  'No deposits · No refunds · No exchanges',
  'Confirm your size before purchasing',
]

export default function PolicyStrip() {
  return (
    <div className="bg-wine py-4 px-6">
      <div className="flex flex-wrap justify-center gap-8">
        {policies.map((p, i) => (
          <span key={i} className="text-[11px] font-medium tracking-[1.5px] uppercase text-white/80 whitespace-nowrap">
            ✦ {p}
          </span>
        ))}
        
      </div>
    </div>
  )
}