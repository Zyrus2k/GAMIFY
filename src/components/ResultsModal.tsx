import { flagEmoji, formatCurrency, formatDate } from '../lib/format'
import { gameBySlug } from '../data/games'
import { resultByTournamentId } from '../data/results'
import { Modal } from './ui/Modal'
import { StatusBadge } from './ui/StatusBadge'

export function ResultsModal({ resultId, onClose }: { resultId: string; onClose: () => void }) {
  const result = resultByTournamentId(resultId)
  if (!result) return null
  const game = gameBySlug(result.game)!

  return (
    <Modal
      open
      onClose={onClose}
      eyebrow={`${game.name} · FINAL STANDINGS`}
      title={result.name}
      size="wide"
    >
      <div className={`results-detail game--${result.game}`}>
        <div className="results-detail__top">
          <StatusBadge status="ended" />
          <span>
            {formatDate(result.date)} · {result.location} · {result.format}
          </span>
        </div>

        <div className="champion-banner">
          <div className="champion-banner__crest" aria-hidden="true">
            <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
              <path
                d="M8 6h18v9a9 9 0 0 1-18 0Z"
                stroke="currentColor"
                strokeWidth="1.4"
                fill="currentColor"
                fillOpacity="0.08"
              />
              <path d="M8 9H4v3a5 5 0 0 0 4 5M26 9h4v3a5 5 0 0 1-4 5" stroke="currentColor" strokeWidth="1.4" />
              <path d="M17 24v5M12 29h10" stroke="currentColor" strokeWidth="1.4" />
            </svg>
          </div>
          <div className="champion-banner__copy">
            <span>Champion</span>
            <strong>
              <span className="champion-banner__flag">{flagEmoji(result.championCountry)}</span>
              {result.champion}
              <em>{result.championCountry}</em>
            </strong>
            <p>{result.summary}</p>
          </div>
          <div className="champion-banner__prize">
            <span>Prize awarded</span>
            <strong>{formatCurrency(result.prize)}</strong>
            <em>SAMPLE FIGURE</em>
          </div>
        </div>

        <div className="standings">
          <div className="standings__head">
            <span>Place</span>
            <span>Player</span>
            <span>Country</span>
            <span>Record</span>
            <span>Points</span>
          </div>
          {result.standings.map((standing) => (
            <div
              className={`standings__row ${standing.place <= 3 ? 'is-podium' : ''}`}
              key={standing.player}
            >
              <span className="standings__place">
                {standing.place <= 3 ? (
                  <span className={`medal medal--${standing.place}`}>{standing.place}</span>
                ) : (
                  String(standing.place).padStart(2, '0')
                )}
              </span>
              <span className="standings__player">
                {standing.player}
                {standing.place === 1 && <em>CHAMPION</em>}
              </span>
              <span className="standings__country">
                {flagEmoji(standing.country)} {standing.country}
              </span>
              <span className="standings__record">{standing.record}</span>
              <span className="standings__points">{standing.points}</span>
            </div>
          ))}
        </div>

        <div className="details__note">
          <strong>Demo results</strong>
          <span>
            These standings are fictional sample data created for this frontend concept. They do not
            represent official tournament results.
          </span>
        </div>

        <div className="modal-actions">
          <span className="details__closed">
            Runner-up: {result.runnerUp} · {flagEmoji(result.runnerUpCountry)}
          </span>
          <button type="button" className="btn btn--primary" onClick={onClose}>
            Close results
          </button>
        </div>
      </div>
    </Modal>
  )
}
