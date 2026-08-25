import { Link, useLocation } from 'react-router-dom'

function SocialIcon({ type }) {
  if (type === 'instagram') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
        <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7Zm5 3.5A4.5 4.5 0 1 1 7.5 12 4.5 4.5 0 0 1 12 7.5Zm0 2A2.5 2.5 0 1 0 14.5 12 2.5 2.5 0 0 0 12 9.5Zm5.25-3.25a1.25 1.25 0 1 1-1.25 1.25 1.25 1.25 0 0 1 1.25-1.25Z" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
      <path d="M16.7 3H7.3A4.3 4.3 0 0 0 3 7.3v9.4A4.3 4.3 0 0 0 7.3 21h9.4a4.3 4.3 0 0 0 4.3-4.3V7.3A4.3 4.3 0 0 0 16.7 3Zm-4.7 5.2A4.8 4.8 0 1 1 7.2 12 4.8 4.8 0 0 1 12 8.2Zm5.1-1.8a1.1 1.1 0 1 1-1.1-1.1 1.1 1.1 0 0 1 1.1 1.1Z" />
    </svg>
  )
}

export default function Footer() {
  const location = useLocation()
  const showPhone = location.pathname !== '/contact'

  return (
    <footer className="mt-8 border-t border-slate-200/60 bg-white text-slate-900">
      <div className="max-w-6xl mx-auto px-6 py-10 sm:py-12">
        <div className="grid grid-cols-1 gap-8 border-b border-slate-200 pb-8 md:grid-cols-4">
          <div>
            <p className="mb-2 font-script text-3xl text-slate-900">Maison by Kimberly</p>
            <p className="text-sm leading-relaxed text-slate-700">Luxury thrift collection with timeless style, carefully sourced in Mombasa, Kenya.</p>
          </div>

          <div className="flex flex-col gap-3">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-900">Explore</p>
            {[['/', 'Home'], ['/shop', 'Shop'], ['/about', 'About'], ['/contact', 'Contact']].map(([to, label]) => (
              <Link key={to} to={to} className="text-sm font-semibold text-slate-700 transition-colors hover:text-wine">
                {label}
              </Link>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            {showPhone && (
              <a
                href="tel:+254757866002"
                className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 transition-colors hover:text-wine"
              >
                <span className="text-base">📞</span>
                <span>Call +254 757 866 002</span>
              </a>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-900">Find us on</p>
            <div className="mt-1 flex flex-col gap-2">
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href="https://www.instagram.com/maison_by_kimberly?igsh=MTdyNm1lMGtvNW53MA=="
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 transition-colors hover:text-wine"
                >
                  <SocialIcon type="instagram" />
                  <span>Instagram</span>
                </a>
                <a
                  href="https://www.tiktok.com/@maison_by_kimberly?_r=1&_t=ZS-97rKkFU21Ar"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 transition-colors hover:text-wine"
                >
                  <SocialIcon type="tiktok" />
                  <span>TikTok</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        <p className="pt-6 text-center text-xs font-medium uppercase tracking-wider text-slate-500">
          © 2025 Maison by Kimberly · Kimberly Jahenda · Thank you for shopping with us ✦
        </p>
      </div>
    </footer>
  )
}