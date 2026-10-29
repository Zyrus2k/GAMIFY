import { useMemo, useState, type FormEvent } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { games } from '../data/games'
import { matchesQuery } from '../lib/format'
import { isPublicTournament } from '../lib/events'
import { useApp } from '../context/AppContext'
import { BrandLogo } from './BrandLogo'
import { MobileNav } from './MobileNav'

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/games', label: 'All Games' },
  { to: '/tournaments', label: 'Tournaments' },
  { to: '/rankings', label: 'Rankings' },
  { to: '/results', label: 'Results' },
]

export function Header() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { tournaments } = useApp()

  const suggestions = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (!needle) return { games: [], tournaments: [] }
    return {
      games: games.filter((game) => game.name.toLowerCase().includes(needle)).slice(0, 3),
      tournaments: tournaments
        .filter((tournament) => isPublicTournament(tournament) && matchesQuery(tournament, needle))
        .slice(0, 5),
    }
  }, [query, tournaments])

  const hasSuggestions = suggestions.games.length > 0 || suggestions.tournaments.length > 0

  const submitSearch = (event: FormEvent) => {
    event.preventDefault()
    const trimmed = query.trim()
    navigate(trimmed ? `/tournaments?q=${encodeURIComponent(trimmed)}` : '/tournaments')
    setFocused(false)
  }

  const goTo = (path: string) => {
    setQuery('')
    setFocused(false)
    navigate(path)
  }

  return (
    <>
      <header className="site-header">
        <div className="container header-inner">
          <Link to="/" className="brand" aria-label="Deckout Cafe home">
            <BrandLogo />
          </Link>

          <nav className="nav" aria-label="Primary">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) => `nav__link ${isActive ? 'is-active' : ''}`}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="header-actions">
            <form
              className="search"
              role="search"
              onSubmit={submitSearch}
              onFocus={() => setFocused(true)}
              onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                  setFocused(false)
                }
              }}
            >
              <svg className="search__icon" width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
                <circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" strokeWidth="1.3" fill="none" />
                <path d="M10 10l4 4" stroke="currentColor" strokeWidth="1.3" />
              </svg>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search events"
                aria-label="Search tournaments"
              />
              {focused && query.trim() && (
                <div className="search__panel">
                  {!hasSuggestions && <p className="search__empty">No matches for â€œ{query.trim()}â€.</p>}
                  {suggestions.games.length > 0 && (
                    <div className="search__group">
                      <p className="search__label">Game systems</p>
                      {suggestions.games.map((game) => (
                        <button
                          type="button"
                          key={game.slug}
                          className="search__item"
                          onMouseDown={(event) => event.preventDefault()}
                          onClick={() => goTo(`/games/${game.slug}`)}
                        >
                          <span className={`search__swatch game--${game.slug}`} />
                          <span>{game.shortName}</span>
                          <span className="search__hint">GAME</span>
                        </button>
                      ))}
                    </div>
                  )}
                  {suggestions.tournaments.length > 0 && (
                    <div className="search__group">
                      <p className="search__label">Tournaments</p>
                      {suggestions.tournaments.map((tournament) => (
                        <button
                          type="button"
                          key={tournament.id}
                          className="search__item"
                          onMouseDown={(event) => event.preventDefault()}
                          onClick={() => goTo(`/tournaments?q=${encodeURIComponent(tournament.title)}`)}
                        >
                          <span className="search__item-title">{tournament.title}</span>
                          <span className="search__hint">{tournament.location}</span>
                        </button>
                      ))}
                    </div>
                  )}
                  <button
                    type="submit"
                    className="search__all"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => {
                      navigate(`/tournaments?q=${encodeURIComponent(query.trim())}`)
                      setQuery('')
                      setFocused(false)
                    }}
                  >
                    Search all tournaments <span aria-hidden="true">â†’</span>
                  </button>
                </div>
              )}
            </form>

            <Link to="/tournaments?status=upcoming" className="btn btn--primary btn--small header-cta">
              Join Tournament
            </Link>

            <button
              type="button"
              className="menu-toggle"
              aria-label="Open menu"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen(true)}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  )
}


