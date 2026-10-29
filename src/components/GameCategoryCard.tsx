import { Link } from 'react-router-dom'
import type { Game } from '../types'
import { isPublicTournament } from '../lib/events'
import { useApp } from '../context/AppContext'

const categoryArtwork: Record<Game['slug'], { src: string; position: string }> = {
  bayblade: { src: '/images/categories/backgrounds/beyblade-x.webp', position: '50% 48%' },
  'cardfight-vanguard': {
    src: '/images/categories/backgrounds/cardfight-vanguard.jpg',
    position: '50% 56%',
  },
  'cookie-run': {
    src: '/images/categories/backgrounds/cookie-run-kingdom.jpg',
    position: '52% 48%',
  },
  cyberpunk: { src: '/images/categories/backgrounds/cyberpunk-2077.jpg', position: '50% 52%' },
  riftbound: {
    src: '/images/categories/backgrounds/riftbound-jinx-art.jpg',
    position: '42% 48%',
  },
  pokemon: { src: '/images/categories/backgrounds/pokemon-pikachu.png', position: '50% 45%' },
  mtg: { src: '/images/categories/backgrounds/magic-planeswalker.jpg', position: '50% 48%' },
  'flesh-and-blood': {
    src: '/images/categories/backgrounds/flesh-and-blood-kassai.webp',
    position: '50% 38%',
  },
}

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

      <img
        className="cat-card__art"
        src={categoryArtwork[game.slug].src}
        alt=""
        style={{ objectPosition: categoryArtwork[game.slug].position }}
        loading={index < 4 ? 'eager' : 'lazy'}
        onError={(event) => {
          event.currentTarget.style.display = 'none'
          console.error(`Could not load category artwork: ${categoryArtwork[game.slug].src}`)
        }}
      />

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
