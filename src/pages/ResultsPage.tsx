import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ResultsGrid } from '../components/ResultsGrid'
import { results } from '../data/results'
import { games, gameBySlug } from '../data/games'
import { EmptyState } from '../components/ui/EmptyState'
import { formatNumber } from '../lib/format'
import { usePageTitle } from '../hooks/usePageTitle'
import type { GameSlug } from '../types'

export function ResultsPage() {
  usePageTitle('Results')
  const [game, setGame] = useState<GameSlug | 'all'>('all')
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return results
      .filter((result) => {
        if (game !== 'all' && result.game !== game) return false
        if (!needle) return true
        return [
          result.name,
          result.champion,
          result.location,
          gameBySlug(result.game)?.shortName ?? '',
        ]
          .join(' ')
          .toLowerCase()
          .includes(needle)
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [game, query])

  const reset = () => {
    setGame('all')
    setQuery('')
  }

  return (
    <>
      <section className="page-hero page-hero--compact">
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span aria-hidden="true">/</span>
            <span>Results</span>
          </nav>
          <div className="page-hero__grid page-hero__grid--compact">
            <div>
              <p className="eyebrow">
                <span className="eyebrow__bar" aria-hidden="true" />
                Completed events · 2026
              </p>
              <h1 className="page-hero__title page-hero__title--lg">
                Results
                <br />
                <span className="text-dim">& champions.</span>
              </h1>
              <p className="page-hero__lede">
                Every completed event, final table and title winner in one place. Open any result for
                the full mock standings. No official results are represented here.
              </p>
            </div>
            <div className="page-hero__seal" aria-hidden="true">
              <span>EVENTS</span>
              <strong>{formatNumber(results.length).padStart(2, '0')}</strong>
              <span>SAMPLE RESULTS</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--tight">
        <div className="container">
          <div className="results-filters">
            <label className="filters__search">
              <svg width="15" height="15" viewBox="0 0 16 16" aria-hidden="true">
                <circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" strokeWidth="1.3" fill="none" />
                <path d="M10 10l4 4" stroke="currentColor" strokeWidth="1.3" />
              </svg>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search champion, event or city"
                aria-label="Search results"
              />
            </label>
            <label className="select-field">
              <span>Game</span>
              <select
                value={game}
                onChange={(event) => setGame(event.target.value as GameSlug | 'all')}
              >
                <option value="all">All games</option>
                {games.map((item) => (
                  <option key={item.slug} value={item.slug}>
                    {item.shortName}
                  </option>
                ))}
              </select>
            </label>
            <span className="results-filters__count">
              <strong>{filtered.length}</strong> {filtered.length === 1 ? 'result' : 'results'}
            </span>
            <button type="button" className="text-btn" onClick={reset}>
              Reset
            </button>
          </div>

          {filtered.length === 0 ? (
            <EmptyState title="No results match this search" action={{ label: 'Reset filters', onClick: reset }}>
              Try another champion, city or game system.
            </EmptyState>
          ) : (
            <ResultsGrid items={filtered} />
          )}

          <p className="page-note">
            All champions, records and standings are fictional sample content created for this
            frontend concept.
          </p>
        </div>
      </section>
    </>
  )
}
