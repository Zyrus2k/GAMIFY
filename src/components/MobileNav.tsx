import { useEffect, useRef, useState, type FormEvent } from 'react'
import { createPortal } from 'react-dom'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { BrandLogo } from './BrandLogo'

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/games', label: 'All Games' },
  { to: '/tournaments', label: 'Tournaments' },
  { to: '/rankings', label: 'Rankings' },
  { to: '/results', label: 'Results' },
]

export function MobileNav({ open, onClose }: { open: boolean; onClose: () => void }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [query, setQuery] = useState('')
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    closeRef.current?.focus()
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = previousOverflow
    }
  }, [open, onClose])

  useEffect(() => {
    if (open) {
      setQuery('')
      onClose()
    }
    // Close the drawer whenever the route changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, location.search])

  const submit = (event: FormEvent) => {
    event.preventDefault()
    const trimmed = query.trim()
    navigate(trimmed ? `/tournaments?q=${encodeURIComponent(trimmed)}` : '/tournaments')
    onClose()
  }

  if (!open) return null

  return createPortal(
    <div className="mobile-nav" role="dialog" aria-modal="true" aria-label="Site menu">
      <button type="button" className="mobile-nav__backdrop" aria-label="Close menu" onClick={onClose} />
      <div className="mobile-nav__panel">
        <div className="mobile-nav__top">
          <BrandLogo />
          <button
            ref={closeRef}
            type="button"
            className="icon-btn"
            onClick={onClose}
            aria-label="Close menu"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
              <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>
        </div>

        <form className="mobile-nav__search" onSubmit={submit} role="search">
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search tournaments, games, cities"
            aria-label="Search tournaments"
          />
          <button type="submit" className="btn btn--ghost btn--small">
            Search
          </button>
        </form>

        <nav className="mobile-nav__links" aria-label="Mobile">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) => `mobile-nav__link ${isActive ? 'is-active' : ''}`}
              onClick={onClose}
            >
              <span>{item.label}</span>
              <span aria-hidden="true">→</span>
            </NavLink>
          ))}
        </nav>

        <Link to="/tournaments?status=upcoming" className="btn btn--primary mobile-nav__cta" onClick={onClose}>
          Join a Tournament
        </Link>

        <div className="mobile-nav__foot">
          <p className="eyebrow">DEMO CLUB</p>
          <p>Events, rankings and registrations shown here are sample data for a frontend concept.</p>
          <Link to="/admin/login" onClick={onClose}>Staff access</Link>
          <div className="socials">
            <span>DISCORD</span>
            <span>TWITCH</span>
            <span>X</span>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}
