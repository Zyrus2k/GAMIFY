import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { Tournament } from '../types'
import { gameBySlug } from '../data/games'
import { resultByTournamentId } from '../data/results'
import { leaderboardByGame } from '../data/leaderboard'
import { formatCurrency, formatDate, formatDateTime, formatNumber, statusLabel } from '../lib/format'
import { isRegistrationOpen, registrationStatusMessage } from '../lib/events'
import { Modal } from './ui/Modal'
import { StatusBadge } from './ui/StatusBadge'
import { RegistrationForm } from './RegistrationForm'
import { useApp } from '../context/AppContext'

interface Props {
  tournament: Tournament
  onClose: () => void
  onResults: (resultId: string) => void
}

export function TournamentDetailsModal({ tournament, onClose, onResults }: Props) {
  const game = gameBySlug(tournament.game)!
  const result = resultByTournamentId(tournament.id)
  const [mode, setMode] = useState<'overview' | 'register'>('overview')
  const { isFavorite, toggleFavorite } = useApp()
  const saved = isFavorite(tournament.id)

  const boardPlayers = leaderboardByGame(tournament.game).slice(0, 4)
  const liveMatches = [
    { a: boardPlayers[0], b: boardPlayers[1], score: '2–1', table: 'Table 1 · Round 5' },
    { a: boardPlayers[2], b: boardPlayers[3], score: '1–1', table: 'Table 2 · Round 5' },
    { a: boardPlayers[1], b: boardPlayers[2], score: '2–0', table: 'Table 3 · Round 4' },
  ]

  return (
    <Modal
      open
      onClose={onClose}
      eyebrow={`${game.name} · ${statusLabel[tournament.status]} EVENT`}
      title={tournament.title}
      size="wide"
    >
      {mode === 'register' ? (
        <RegistrationForm tournament={tournament} onClose={onClose} />
      ) : (
        <div className={`details game--${tournament.game}`}>
          <div className="details__status">
            <StatusBadge status={tournament.status} />
            <span>{tournament.format}</span>
            <span className="details__sample">SAMPLE EVENT DATA</span>
          </div>

          <p className="details__description">{tournament.description}</p>

          <dl className="details__grid">
            <div>
              <dt>Date & time</dt>
              <dd>{formatDateTime(tournament.start)}</dd>
            </div>
            <div>
              <dt>Location</dt>
              <dd>{tournament.location}</dd>
            </div>
            <div>
              <dt>Field</dt>
              <dd>
                {formatNumber(tournament.entrants)} / {formatNumber(tournament.capacity)} players
              </dd>
            </div>
            <div>
              <dt>Prize pool</dt>
              <dd>
                {formatCurrency(tournament.prize)} <em>sample</em>
              </dd>
            </div>
            <div>
              <dt>Entry fee</dt>
              <dd>{formatCurrency(tournament.entryFee)}</dd>
            </div>
            <div>
              <dt>Registration closes</dt>
              <dd>
                {tournament.registrationCloses
                  ? formatDateTime(tournament.registrationCloses)
                  : tournament.status === 'ended'
                    ? 'Closed'
                    : 'Open until field is full'}
              </dd>
            </div>
            <div>
              <dt>Circuit</dt>
              <dd>
                {game.name} · {game.seasonLabel}
              </dd>
            </div>
          </dl>

          {tournament.status === 'live' && (
            <div className="live-board">
              <div className="live-board__head">
                <span className="live-board__title">
                  <span className="live-board__dot" aria-hidden="true" />
                  LIVE DEMO BOARD
                </span>
                <span>ROUND 5 OF 6</span>
              </div>
              {liveMatches.map((match) => (
                <div className="live-board__row" key={match.table}>
                  <span className="live-board__table">{match.table}</span>
                  <span className="live-board__player">
                    {match.a?.player ?? 'TBD'}
                    <em>{match.a?.country}</em>
                  </span>
                  <strong>{match.score}</strong>
                  <span className="live-board__player live-board__player--right">
                    {match.b?.player ?? 'TBD'}
                    <em>{match.b?.country}</em>
                  </span>
                </div>
              ))}
              <p className="live-board__note">
                Simulated scores for demonstration. This is not a connected live feed.
              </p>
            </div>
          )}

          {tournament.status === 'ended' && result && (
            <div className="details__result">
              <div>
                <span>Champion</span>
                <strong>{result.champion}</strong>
              </div>
              <div>
                <span>Runner-up</span>
                <strong>{result.runnerUp}</strong>
              </div>
              <button
                type="button"
                className="btn btn--ghost btn--small"
                onClick={() => onResults(result.tournamentId)}
              >
                Open full results
              </button>
            </div>
          )}

          <div className="details__note">
            <strong>{registrationStatusMessage(tournament)}</strong>
            <span>
              Deckout Cafe is an independent frontend concept. This event, its prize pool and
              participants are fictional sample data. The entry flow is a demo and takes no payment.
            </span>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className={`btn btn--ghost ${saved ? 'is-saved' : ''}`}
              onClick={() => toggleFavorite(tournament.id)}
              aria-pressed={saved}
            >
              {saved ? 'Saved to your events' : 'Save event'}
            </button>
            <div className="modal-actions__right">
              <button type="button" className="btn btn--ghost" onClick={onClose}>
                Close
              </button>
              {isRegistrationOpen(tournament) && (
                <button
                  type="button"
                  className="btn btn--primary"
                  onClick={() => setMode('register')}
                >
                  Register · {formatCurrency(tournament.entryFee)}
                </button>
              )}
              {tournament.status === 'upcoming' && !isRegistrationOpen(tournament) && (
                <span className="details__closed">
                  {registrationStatusMessage(tournament)}
                </span>
              )}
              {tournament.status === 'live' && (
                <Link to="/tournaments?status=live" className="btn btn--primary" onClick={onClose}>
                  Browse live events
                </Link>
              )}
              {tournament.status === 'ended' && (
                <span className="details__closed">Event concluded {formatDate(tournament.start)}</span>
              )}
              {tournament.status === 'cancelled' && (
                <span className="details__closed">Event cancelled</span>
              )}
            </div>
          </div>
        </div>
      )}
    </Modal>
  )
}
