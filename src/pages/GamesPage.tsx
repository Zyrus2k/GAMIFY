import { Link } from 'react-router-dom'
import { GameCategoryCard } from '../components/GameCategoryCard'
import { games } from '../data/games'
import { isPublicTournament } from '../lib/events'
import { useApp } from '../context/AppContext'
import { usePageTitle } from '../hooks/usePageTitle'

export function GamesPage() {
  usePageTitle('All Games')
  const { tournaments } = useApp()
  const publicEvents = tournaments.filter(isPublicTournament)
  const liveCount = publicEvents.filter((tournament) => tournament.status === 'live').length

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span aria-hidden="true">/</span>
            <span>All games</span>
          </nav>
          <div className="page-hero__grid">
            <div>
              <p className="eyebrow">
                <span className="eyebrow__bar" aria-hidden="true" />
                Eight competitive circuits
              </p>
              <h1 className="page-hero__title">
                Eight arenas.
                <br />
                <span className="text-dim">One circuit.</span>
              </h1>
              <p className="page-hero__lede">
                Every game carries its own tempo, meta and community. Choose a circuit to explore its
                calendar, champions and season standings.
              </p>
            </div>
            <div className="page-hero__aside">
              <div className="page-hero__stat">
                <span>Circuits</span>
                <strong>08</strong>
              </div>
              <div className="page-hero__stat">
                <span>Events listed</span>
                <strong>{String(publicEvents.length).padStart(2, '0')}</strong>
              </div>
              <div className="page-hero__stat page-hero__stat--accent">
                <span>Happening now</span>
                <strong>{String(liveCount).padStart(2, '0')}</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="category-grid category-grid--detailed">
            {games.map((game, index) => (
              <GameCategoryCard key={game.slug} game={game} index={index} detailed />
            ))}
          </div>
          <p className="page-note">
            Deckout Cafe is an independent concept. All circuits, events and competitors shown are
            fictional sample data. No publisher affiliation is implied.
          </p>
        </div>
      </section>
    </>
  )
}
