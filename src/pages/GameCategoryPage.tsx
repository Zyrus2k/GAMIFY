import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { games, gameBySlug } from '../data/games'
import { resultsByGame } from '../data/results'
import { isPublicTournament } from '../lib/events'
import { useApp } from '../context/AppContext'
import { GameMotif } from '../components/GameMotif'
import { TournamentCollection } from '../components/TournamentCollection'
import { ResultsGrid } from '../components/ResultsGrid'
import { Leaderboard } from '../components/Leaderboard'
import { formatCurrency, sortTournaments } from '../lib/format'
import { usePageTitle } from '../hooks/usePageTitle'
import { NotFoundPage } from './NotFoundPage'

type Tab = 'tournaments' | 'results' | 'standings'

export function GameCategoryPage() {
  const { slug } = useParams()
  const game = gameBySlug(slug ?? '')
  const { tournaments } = useApp()
  const [tab, setTab] = useState<Tab>('tournaments')

  usePageTitle(game ? game.shortName : 'Circuit not found')

  useEffect(() => {
    setTab('tournaments')
  }, [slug])

  if (!game) {
    return <NotFoundPage />
  }

  const events = sortTournaments(
    tournaments.filter(
      (tournament) => tournament.game === game.slug && isPublicTournament(tournament),
    ),
  )
  const gameResults = resultsByGame(game.slug)
  const liveCount = events.filter((event) => event.status === 'live').length
  const prizeTotal = events
    .filter((event) => event.status !== 'cancelled')
    .reduce((total, event) => total + event.prize, 0)

  const tabs: Array<{ value: Tab; label: string; count: number }> = [
    { value: 'tournaments', label: 'Tournaments', count: events.length },
    { value: 'results', label: 'Results', count: gameResults.length },
    { value: 'standings', label: 'Standings', count: 5 },
  ]

  return (
    <>
      <section className={`game-banner game--${game.slug} cat--${game.variant}`}>
        <div className="game-banner__texture" aria-hidden="true" />
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span aria-hidden="true">/</span>
            <Link to="/games">All games</Link>
            <span aria-hidden="true">/</span>
            <span>{game.shortName}</span>
          </nav>

          <div className="game-banner__inner">
            <div className="game-banner__copy">
              <p className="eyebrow">
                <span className="eyebrow__bar" aria-hidden="true" />
                {game.seasonLabel} · 2026
              </p>
              <h1>{game.name}</h1>
              <p className="game-banner__tagline">{game.tagline}</p>
              <p className="game-banner__desc">{game.description}</p>

              <div className="game-banner__actions">
                <button
                  type="button"
                  className="btn btn--primary"
                  onClick={() => setTab('tournaments')}
                >
                  View tournaments
                  <span className="btn__arrow" aria-hidden="true">→</span>
                </button>
                <button
                  type="button"
                  className="btn btn--ghost"
                  onClick={() => setTab('standings')}
                >
                  Season standings
                </button>
              </div>

              <dl className="game-banner__stats">
                <div>
                  <dt>Events</dt>
                  <dd>{String(events.length).padStart(2, '0')}</dd>
                </div>
                <div>
                  <dt>Live now</dt>
                  <dd>{String(liveCount).padStart(2, '0')}</dd>
                </div>
                <div>
                  <dt>Sample prize pool</dt>
                  <dd>{formatCurrency(prizeTotal)}</dd>
                </div>
              </dl>
            </div>

            <div className="game-banner__visual" aria-hidden="true">
              <div className="game-banner__ring" />
              <GameMotif game={game.slug} className="game-banner__motif" />
              <span className="game-banner__season">{game.seasonLabel}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--tight">
        <div className="container">
          <div className="tabs" role="tablist" aria-label={`${game.shortName} views`}>
            {tabs.map((item) => (
              <button
                key={item.value}
                type="button"
                role="tab"
                aria-selected={tab === item.value}
                className={`tab ${tab === item.value ? 'is-active' : ''}`}
                onClick={() => setTab(item.value)}
              >
                {item.label}
                <span>{item.count}</span>
              </button>
            ))}
            <Link to="/games" className="tabs__back">
              All games <span aria-hidden="true">→</span>
            </Link>
          </div>

          {tab === 'tournaments' && (
            <div role="tabpanel" aria-label="Tournaments">
              <TournamentCollection
                items={events}
                emptyTitle="No events scheduled"
                emptyMessage="This circuit has no events in the current window. Check back after the next calendar update."
              />
              <p className="page-note">
                All {game.shortName} events, prize pools and participants shown are fictional sample
                data for this frontend concept.
              </p>
            </div>
          )}

          {tab === 'results' && (
            <div role="tabpanel" aria-label="Results">
              <ResultsGrid items={gameResults} />
              <p className="page-note">
                Results are invented for demonstration and do not represent official tournament
                outcomes.
              </p>
            </div>
          )}

          {tab === 'standings' && (
            <div role="tabpanel" aria-label="Standings">
              <Leaderboard
                initialGame={game.slug}
                showGameFilter={false}
                showRegionFilter={false}
              />
            </div>
          )}

          <div className="circuit-switcher">
            <p className="eyebrow">
              <span className="eyebrow__bar" aria-hidden="true" />
              Switch circuit
            </p>
            <div className="circuit-switcher__list">
              {games
                .filter((item) => item.slug !== game.slug)
                .map((item) => (
                  <Link key={item.slug} to={`/games/${item.slug}`} className={`circuit-chip game--${item.slug}`}>
                    <span className="circuit-chip__dot" aria-hidden="true" />
                    {item.shortName}
                    <span aria-hidden="true">→</span>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
