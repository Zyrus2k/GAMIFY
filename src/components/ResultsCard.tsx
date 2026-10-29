import type { TournamentResult } from '../types'
import { gameBySlug } from '../data/games'
import { flagEmoji, formatDate } from '../lib/format'
import { StatusBadge } from './ui/StatusBadge'

export function ResultsCard({
  result,
  onOpen,
}: {
  result: TournamentResult
  onOpen: (resultId: string) => void
}) {
  const game = gameBySlug(result.game)!
  const second = result.standings[1]
  const third = result.standings[2]

  return (
    <article className={`result-card game--${result.game}`}>
      <div className="result-card__top">
        <StatusBadge status="ended" />
        <span className="result-card__date">{formatDate(result.date)}</span>
      </div>

      <p className="result-card__game">{game.name}</p>
      <h3 className="result-card__title">{result.name}</h3>

      <div className="result-card__champion">
        <span className="result-card__label">Champion</span>
        <strong>
          <span className="result-card__flag">{flagEmoji(result.championCountry)}</span>
          {result.champion}
          <em>{result.championCountry}</em>
        </strong>
      </div>

      <div className="result-card__podium">
        {second && (
          <span>
            <em>2ND</em> {second.player}
          </span>
        )}
        {third && (
          <span>
            <em>3RD</em> {third.player}
          </span>
        )}
      </div>

      <button
        type="button"
        className="result-card__action"
        onClick={() => onOpen(result.tournamentId)}
      >
        <span>See results</span>
        <span aria-hidden="true">→</span>
      </button>
    </article>
  )
}
