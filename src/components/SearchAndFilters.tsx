import type { GameSlug, PublicTournamentStatus, TournamentFormat } from '../types'
import { games } from '../data/games'

export type StatusFilter = PublicTournamentStatus | 'all'
export type GameFilter = GameSlug | 'all'
export type FormatFilter = TournamentFormat | 'all'
export type SortOption = 'soonest' | 'prize' | 'entrants'

interface SearchAndFiltersProps {
  query: string
  status: StatusFilter
  game: GameFilter
  format: FormatFilter
  sort: SortOption
  savedOnly: boolean
  resultCount: number
  favoritesCount: number
  counts: Record<StatusFilter, number>
  onQueryChange: (value: string) => void
  onStatusChange: (value: StatusFilter) => void
  onGameChange: (value: GameFilter) => void
  onFormatChange: (value: FormatFilter) => void
  onSortChange: (value: SortOption) => void
  onSavedToggle: () => void
  onReset: () => void
}

const statuses: Array<{ value: StatusFilter; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'live', label: 'Live' },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'ended', label: 'Ended' },
  { value: 'cancelled', label: 'Cancelled' },
]

export function SearchAndFilters({
  query,
  status,
  game,
  format,
  sort,
  savedOnly,
  resultCount,
  favoritesCount,
  counts,
  onQueryChange,
  onStatusChange,
  onGameChange,
  onFormatChange,
  onSortChange,
  onSavedToggle,
  onReset,
}: SearchAndFiltersProps) {
  return (
    <div className="filters">
      <div className="filters__main">
        <label className="filters__search">
          <svg width="15" height="15" viewBox="0 0 16 16" aria-hidden="true">
            <circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" strokeWidth="1.3" fill="none" />
            <path d="M10 10l4 4" stroke="currentColor" strokeWidth="1.3" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search by event, game or city"
            aria-label="Search tournaments"
          />
          {query && (
            <button type="button" className="filters__clear" onClick={() => onQueryChange('')} aria-label="Clear search">
              ×
            </button>
          )}
        </label>

        <div className="status-tabs" role="group" aria-label="Filter by event status">
          {statuses.map((item) => (
            <button
              key={item.value}
              type="button"
              className={`status-tab ${status === item.value ? 'is-active' : ''}`}
              aria-pressed={status === item.value}
              onClick={() => onStatusChange(item.value)}
            >
              {item.value === 'live' && <span className="status-tab__dot" aria-hidden="true" />}
              {item.label}
              <span className="status-tab__count">{counts[item.value]}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="filters__sub">
        <label className="select-field">
          <span>Game</span>
          <select value={game} onChange={(event) => onGameChange(event.target.value as GameFilter)}>
            <option value="all">All games</option>
            {games.map((item) => (
              <option key={item.slug} value={item.slug}>
                {item.shortName}
              </option>
            ))}
          </select>
        </label>

        <label className="select-field">
          <span>Format</span>
          <select
            value={format}
            onChange={(event) => onFormatChange(event.target.value as FormatFilter)}
          >
            <option value="all">Any format</option>
            <option value="Online">Online</option>
            <option value="Offline">Offline</option>
            <option value="Hybrid">Hybrid</option>
          </select>
        </label>

        <label className="select-field">
          <span>Sort</span>
          <select value={sort} onChange={(event) => onSortChange(event.target.value as SortOption)}>
            <option value="soonest">Soonest first</option>
            <option value="prize">Largest prize</option>
            <option value="entrants">Most entrants</option>
          </select>
        </label>

        <button
          type="button"
          className={`saved-toggle ${savedOnly ? 'is-active' : ''}`}
          aria-pressed={savedOnly}
          onClick={onSavedToggle}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
            <path
              d="M8 13.8 2.9 8.9A3.2 3.2 0 0 1 8 3.6a3.2 3.2 0 0 1 5.1 5.3Z"
              fill={savedOnly ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth="1.2"
            />
          </svg>
          Saved
          <span>{favoritesCount}</span>
        </button>
      </div>

      <div className="filters__foot">
        <span className="filters__count">
          <strong>{resultCount}</strong> {resultCount === 1 ? 'event' : 'events'} found
        </span>
        <div className="filters__foot-actions">
          <span className="filters__demo">Demo calendar · sample data</span>
          <button type="button" className="text-btn" onClick={onReset}>
            Reset filters
          </button>
        </div>
      </div>
    </div>
  )
}
