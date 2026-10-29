import type { Tournament } from '../types'
import { gameBySlug } from '../data/games'
import { resultByTournamentId } from '../data/results'
import { formatCurrency, formatDateTime, formatNumber } from '../lib/format'
import { StatusBadge } from './ui/StatusBadge'
import { tournamentAction } from '../lib/events'
import { useApp } from '../context/AppContext'

interface TournamentCardProps {
  tournament: Tournament
  onOpen: (tournament: Tournament) => void
  onResults: (resultId: string) => void
}

export function TournamentCard({ tournament, onOpen, onResults }: TournamentCardProps) {
  const game = gameBySlug(tournament.game)!
  const result = resultByTournamentId(tournament.id)
  const { isFavorite, toggleFavorite } = useApp()
  const saved = isFavorite(tournament.id)

  const action = tournamentAction(tournament, Boolean(result))
  const actionLabel = action.label

  const handleAction = () => {
    if (tournament.status === 'ended' && result) {
      onResults(result.tournamentId)
      return
    }
    onOpen(tournament)
  }

  return (
    <article className={`t-card game--${tournament.game}`}>
      <div className="t-card__top">
        <StatusBadge status={tournament.status} />
        <button
          type="button"
          className={`fav-btn ${saved ? 'is-saved' : ''}`}
          aria-pressed={saved}
          aria-label={saved ? `Remove ${tournament.title} from saved events` : `Save ${tournament.title}`}
          onClick={() => toggleFavorite(tournament.id)}
        >
          <svg width="15" height="15" viewBox="0 0 16 16" aria-hidden="true">
            <path
              d="M8 13.8 2.9 8.9A3.2 3.2 0 0 1 8 3.6a3.2 3.2 0 0 1 5.1 5.3Z"
              fill={saved ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth="1.2"
            />
          </svg>
        </button>
      </div>

      <p className="t-card__game">
        <span className="t-card__swatch" aria-hidden="true" />
        {game.shortName}
        <span className="t-card__format">{tournament.format}</span>
      </p>

      <h3 className="t-card__title">
        <button type="button" onClick={() => onOpen(tournament)}>
          {tournament.title}
        </button>
      </h3>

      <dl className="t-card__meta">
        <div>
          <dt>Date</dt>
          <dd>{formatDateTime(tournament.start)}</dd>
        </div>
        <div>
          <dt>Location</dt>
          <dd>{tournament.location}</dd>
        </div>
        <div>
          <dt>Field</dt>
          <dd>
            {formatNumber(tournament.entrants)} / {formatNumber(tournament.capacity)}
          </dd>
        </div>
      </dl>

      {tournament.status === 'ended' && result && (
        <div className="t-card__winner">
          <span>CHAMPION</span>
          <strong>{result.champion}</strong>
          <span className="t-card__winner-country">{result.championCountry}</span>
        </div>
      )}

      <div className="t-card__money">
        <div className="t-card__prize">
          <span>
            Prize pool <em>SAMPLE</em>
          </span>
          <strong>{formatCurrency(tournament.prize)}</strong>
        </div>
        <div className="t-card__fee">
          <span>Entry</span>
          <strong>{formatCurrency(tournament.entryFee)}</strong>
        </div>
      </div>

      <button type="button" className="t-card__action" onClick={handleAction}>
        <span>{actionLabel}</span>
        <span className="t-card__arrow" aria-hidden="true">
          →
        </span>
      </button>
    </article>
  )
}

