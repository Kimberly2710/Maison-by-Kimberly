import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const isHome = location.pathname === '/' || location.pathname === ''
  const whiteNavPaths = ['/', '/shop', '/about', '/contact']
  const isWhiteNav = whiteNavPaths.includes(location.pathname)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const links = [
    { to: '/', label: 'Home' },
    { to: '/shop', label: 'Shop' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ]

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 bg-blush/90 backdrop-blur-md transition-all duration-300 ${scrolled ? 'border-b border-blush-border shadow-sm' : 'border-b border-transparent'}`}>
      <div className="max-w-6xl mx-auto px-6 h-[68px] flex items-center justify-between">
        <Link to="/" className={`font-script text-3xl tracking-wide ${isWhiteNav ? 'text-white' : 'text-wine'}`}>
          Maison by Kimberly
        </Link>
        <ul className="hidden md:flex gap-9 items-center list-none">
          {links.map(link => (
            <li key={link.to}>
              <Link
                to={link.to}
                className={`text-xs font-medium tracking-[2px] uppercase relative pb-[2px] transition-colors duration-200
                  after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-px after:transition-transform after:duration-200
                  ${isWhiteNav ? `after:bg-white ${location.pathname === link.to ? 'text-white after:scale-x-100' : 'text-white/90 hover:text-white after:scale-x-0 hover:after:scale-x-100'}` : `${location.pathname === link.to ? 'text-wine after:bg-wine after:scale-x-100' : 'text-wine-light hover:text-wine after:bg-wine after:scale-x-0 hover:after:scale-x-100'}`}
                `}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}