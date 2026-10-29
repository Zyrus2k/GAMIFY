import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { SearchAndFilters, type FormatFilter, type GameFilter, type SortOption, type StatusFilter } from '../components/SearchAndFilters'
import { TournamentCollection } from '../components/TournamentCollection'
import { games } from '../data/games'
import { matchesQuery, sortTournaments } from '../lib/format'
import { isPublicTournament } from '../lib/events'
import { useApp } from '../context/AppContext'
import { usePageTitle } from '../hooks/usePageTitle'
import type { PublicTournamentStatus, TournamentFormat } from '../types'

const statusValues: Array<PublicTournamentStatus | 'all'> = [
  'all',
  'live',
  'upcoming',
  'ended',
  'cancelled',
]
const formatValues: Array<TournamentFormat | 'all'> = ['all', 'Online', 'Offline', 'Hybrid']
const sortValues: SortOption[] = ['soonest', 'prize', 'entrants']

export function TournamentsPage() {
  usePageTitle('Tournaments')
  const [params, setParams] = useSearchParams()
  const { favorites, tournaments } = useApp()

  const query = params.get('q') ?? ''
  const rawStatus = params.get('status')
  const status: StatusFilter = statusValues.includes(rawStatus as StatusFilter)
    ? (rawStatus as StatusFilter)
    : 'all'
  const rawGame = params.get('game')
  const game: GameFilter = games.some((item) => item.slug === rawGame)
    ? (rawGame as GameFilter)
    : 'all'
  const rawFormat = params.get('format')
  const format: FormatFilter = formatValues.includes(rawFormat as FormatFilter)
    ? (rawFormat as FormatFilter)
    : 'all'
  const rawSort = params.get('sort')
  const sort: SortOption = sortValues.includes(rawSort as SortOption)
    ? (rawSort as SortOption)
    : 'soonest'
  const savedOnly = params.get('saved') === '1'

  const updateParam = (key: string, value: string, fallback: string) => {
    const next = new URLSearchParams(params)
    if (!value || value === fallback) next.delete(key)
    else next.set(key, value)
    setParams(next, { replace: true })
  }

  const reset = () => setParams(new URLSearchParams(), { replace: true })

  const base = useMemo(
    () =>
      tournaments.filter((tournament) => {
        if (!isPublicTournament(tournament)) return false
        if (!matchesQuery(tournament, query)) return false
        if (game !== 'all' && tournament.game !== game) return false
        if (format !== 'all' && tournament.format !== format) return false
        if (savedOnly && !favorites.includes(tournament.id)) return false
        return true
      }),
    [query, game, format, savedOnly, favorites, tournaments],
  )

  const counts = useMemo(
    () => ({
      all: base.length,
      live: base.filter((tournament) => tournament.status === 'live').length,
      upcoming: base.filter((tournament) => tournament.status === 'upcoming').length,
      ended: base.filter((tournament) => tournament.status === 'ended').length,
      cancelled: base.filter((tournament) => tournament.status === 'cancelled').length,
    }),
    [base],
  )

  const filtered = useMemo(() => {
    const byStatus = status === 'all' ? base : base.filter((tournament) => tournament.status === status)
    if (sort === 'prize') return [...byStatus].sort((a, b) => b.prize - a.prize)
    if (sort === 'entrants') return [...byStatus].sort((a, b) => b.entrants - a.entrants)
    return sortTournaments(byStatus)
  }, [base, status, sort])

  const emptyTitle = savedOnly
    ? 'No saved events yet'
    : query
      ? 'No tournaments match that search'
      : 'No events in this view'
  const emptyMessage = savedOnly
    ? 'Tap the heart on any tournament card to save it here. Saved events are stored in this browser.'
    : 'Try a different game, format or status — or reset the filters to see the full sample calendar.'

  return (
    <>
      <section className="page-hero page-hero--compact">
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span aria-hidden="true">/</span>
            <span>Tournaments</span>
          </nav>
          <div className="page-hero__grid page-hero__grid--compact">
            <div>
              <p className="eyebrow">
                <span className="eyebrow__bar" aria-hidden="true" />
                2026 season calendar
              </p>
              <h1 className="page-hero__title page-hero__title--lg">
                Tournament
                <br />
                <span className="text-dim">calendar.</span>
              </h1>
              <p className="page-hero__lede">
                Search the full sample calendar, filter by circuit and status, and save the events you
                want to follow. Every registration is a clearly labelled demo flow.
              </p>
            </div>
            <div className="page-hero__seal" aria-hidden="true">
              <span>EST.</span>
              <strong>2026</strong>
              <span>SAMPLE DATA</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--tight">
        <div className="container">
          <SearchAndFilters
            query={query}
            status={status}
            game={game}
            format={format}
            sort={sort}
            savedOnly={savedOnly}
            resultCount={filtered.length}
            favoritesCount={favorites.length}
            counts={counts}
            onQueryChange={(value) => updateParam('q', value, '')}
            onStatusChange={(value) => updateParam('status', value, 'all')}
            onGameChange={(value) => updateParam('game', value, 'all')}
            onFormatChange={(value) => updateParam('format', value, 'all')}
            onSortChange={(value) => updateParam('sort', value, 'soonest')}
            onSavedToggle={() => updateParam('saved', savedOnly ? '' : '1', '')}
            onReset={reset}
          />

          <TournamentCollection
            items={filtered}
            emptyTitle={emptyTitle}
            emptyMessage={emptyMessage}
            onReset={reset}
          />
        </div>
      </section>
    </>
  )
}
