import { Link } from 'react-router-dom'
import type { Game } from '../types'
import { isPublicTournament } from '../lib/events'
import { useApp } from '../context/AppContext'
import { GameMotif } from './GameMotif'

export function GameCategoryCard({
  game,
  index,
  detailed = false,
}: {
  game: Game
  index: number
  detailed?: boolean
}) {
  const { tournaments } = useApp()
  const gameEvents = tournaments.filter(
    (tournament) => tournament.game === game.slug && isPublicTournament(tournament),
  )
  const count = gameEvents.length
  const liveCount = gameEvents.filter((tournament) => tournament.status === 'live').length

  return (
    <Link
      to={`/games/${game.slug}`}
      className={`cat-card game--${game.slug} cat--${game.variant} ${
        detailed ? 'cat-card--detailed' : ''
      }`}
      aria-label={`Explore ${game.name} tournaments`}
    >
      <div className="cat-card__top">
        <span className="cat-card__index">{String(index + 1).padStart(2, '0')}</span>
        <span className="cat-card__count">
          {liveCount > 0 && <span className="cat-card__live" aria-hidden="true" />}
          {liveCount > 0 ? `${liveCount} LIVE` : `${count} EVENTS`}
        </span>
      </div>

      <GameMotif game={game.slug} className="cat-card__motif" />

      <div className="cat-card__body">
        <h3>{game.name}</h3>
        <p className="cat-card__tagline">{game.tagline}</p>
        {detailed && <p className="cat-card__desc">{game.description}</p>}
      </div>

      <div className="cat-card__foot">
        <span className="cat-card__foot-label">Explore tournaments</span>
        <span className="cat-card__foot-meta">{game.seasonLabel}</span>
        <span className="cat-card__arrow" aria-hidden="true">
          →
        </span>
      </div>
    </Link>
  )
}
