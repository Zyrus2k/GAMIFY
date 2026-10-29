import { Link } from 'react-router-dom'
import { Leaderboard } from '../components/Leaderboard'
import { topOverall } from '../data/leaderboard'
import { gameBySlug } from '../data/games'
import { usePageTitle } from '../hooks/usePageTitle'

export function RankingsPage() {
  usePageTitle('Rankings')
  const podium = topOverall(3)

  return (
    <>
      <section className="page-hero page-hero--compact">
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span aria-hidden="true">/</span>
            <span>Rankings</span>
          </nav>
          <div className="page-hero__grid page-hero__grid--compact">
            <div>
              <p className="eyebrow">
                <span className="eyebrow__bar" aria-hidden="true" />
                2026 season standings
              </p>
              <h1 className="page-hero__title page-hero__title--lg">
                Rankings
                <br />
                <span className="text-dim">& leaders.</span>
              </h1>
              <p className="page-hero__lede">
                Circuit points across every game system. Filter by game, region or sort metric to see
                who is setting the pace. All standings are fictional sample data.
              </p>
            </div>
            <div className="page-hero__seal" aria-hidden="true">
              <span>SEASON</span>
              <strong>26</strong>
              <span>DEMO STANDINGS</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--tight">
        <div className="container">
          <div className="podium">
            {podium.map((entry, index) => {
              const game = gameBySlug(entry.game)!
              return (
                <article
                  key={entry.id}
                  className={`podium__card podium__card--${index + 1} game--${entry.game}`}
                >
                  <div className="podium__top">
                    <span className="podium__rank">{String(index + 1).padStart(2, '0')}</span>
                    <span className="podium__points">{entry.points} PTS</span>
                  </div>
                  <h2>{entry.player}</h2>
                  <p>{entry.team}</p>
                  <div className="podium__meta">
                    <span>{game.shortName}</span>
                    <span>{entry.region}</span>
                    <span>{entry.wins} wins</span>
                  </div>
                </article>
              )
            })}
          </div>

          <Leaderboard />

          <div className="rankings-note">
            <div>
              <p className="eyebrow">
                <span className="eyebrow__bar" aria-hidden="true" />
                How points work
              </p>
              <p>
                Sample circuit points are awarded for placements across the season. The leaderboard
                recalculates on the client whenever you change the game, region or sorting metric.
              </p>
            </div>
            <Link to="/tournaments?status=upcoming" className="btn btn--ghost">
              Find your next event
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
