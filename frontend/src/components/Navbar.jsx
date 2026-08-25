import { Link, useLocation } from 'react-router-dom'
import { useCart } from '../context/useCart'

export default function Navbar() {
  const location = useLocation()
  const { itemCount } = useCart()

  const links = [
    { to: '/', label: 'Home' },
    { to: '/shop', label: 'Shop' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ]

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200/50 bg-white/80 py-4 backdrop-blur-md">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6">
        <Link to="/" className="font-script text-3xl tracking-wide text-slate-900">
          Maison by Kimberly
        </Link>
        <ul className="hidden md:flex gap-9 items-center list-none">
          {links.map(link => (
            <li key={link.to}>
              <Link
                to={link.to}
                className={`text-xs font-medium tracking-[2px] uppercase relative pb-[2px] transition-colors duration-200
                  after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-px after:transition-transform after:duration-200
                  ${location.pathname === link.to ? 'text-pink-600 font-semibold after:bg-pink-600 after:scale-x-100' : 'text-slate-600 hover:text-pink-500 after:bg-pink-500 after:scale-x-0 hover:after:scale-x-100'}
                `}
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            <Link to="/checkout" className="text-xs font-semibold uppercase tracking-[2px] text-pink-600 transition-colors hover:text-pink-500">
              Cart ({itemCount})
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}