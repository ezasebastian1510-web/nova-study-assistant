import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import logo from '../assets/nova-logo.png'
import bookImg from '../assets/nav-books.jpg'
import readingImg from '../assets/nav-reading.jpg'
import coffeeImg from '../assets/nav-coffee.jpg'

function Navbar() {
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const isActive = (path) => location.pathname === path

  const navLinks = [
  { path: '/', label: 'Home' },
  { path: '/upload', label: 'Upload' },
  { path: '/chat', label: 'Chat' },
  { path: '/quiz', label: 'Quiz' },
  { path: '/library', label: 'My Documents' },
  ]
  return (
    <nav className="relative w-full overflow-hidden border-b border-olive/20">
      <div className="absolute inset-0 flex">
        <div className="w-1/3 h-full bg-cover bg-center" style={{ backgroundImage: `url(${bookImg})` }} />
        <div className="w-1/3 h-full bg-cover bg-center" style={{ backgroundImage: `url(${readingImg})` }} />
        <div className="w-1/3 h-full bg-cover bg-center" style={{ backgroundImage: `url(${coffeeImg})` }} />
      </div>
      <div className="absolute inset-0 bg-brown/75" />

      <div className="relative h-20 px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Nova Logo" className="h-10 w-10 object-contain" />
          <span className="text-4xl text-cream" style={{ fontFamily: 'Ballet, cursive' }}>
            Nova
          </span>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`font-medium transition ${isActive(link.path) ? 'text-olive' : 'text-cream hover:text-olive'}`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-cream text-2xl"
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="relative md:hidden bg-brown/95 px-6 py-4 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMenuOpen(false)}
              className={`block font-medium transition ${isActive(link.path) ? 'text-olive' : 'text-cream'}`}
            >
              {link.label}
            </Link>
          ))}
          
        </div>
      )}
    </nav>
  )
}

export default Navbar