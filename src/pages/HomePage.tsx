import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { HeroSection } from '../components/HeroSection'
import { GameCategorySection } from '../components/GameCategorySection'
import { TournamentCollection } from '../components/TournamentCollection'
import { ResultsGrid } from '../components/ResultsGrid'
import { SectionHeader } from '../components/ui/SectionHeader'
import { ArrowLink } from '../components/ui/EmptyState'
import { results } from '../data/results'
import { topOverall } from '../data/leaderboard'
import { gameBySlug } from '../data/games'
import { sortTournaments } from '../lib/format'
import { isPublicTournament } from '../lib/events'
import { useApp } from '../context/AppContext'
import { usePageTitle } from '../hooks/usePageTitle'
import type { PublicTournamentStatus } from '../types'

const tabs: Array<{ value: 'all' | PublicTournamentStatus; label: string }> = [
  { value: 'all', label: 'All featured' },
  { value: 'live', label: 'Live now' },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'ended', label: 'Recently ended' },
]

export function HomePage() {
  usePageTitle()
  const [tab, setTab] = useState<'all' | PublicTournamentStatus>('all')
  const { tournaments } = useApp()

  const featured = useMemo(() => {
    const list = tournaments.filter(
      (event) =>
        isPublicTournament(event) && event.featured && event.status !== 'cancelled',
    )
    const filtered = tab === 'all' ? list : list.filter((event) => event.status === tab)
    return sortTournaments(filtered).slice(0, 6)
  }, [tab, tournaments])

  const topPlayers = topOverall(6)

  return (
    <>
      <HeroSection />

      <GameCategorySection />

      <section className="section">
        <div className="container">
          <SectionHeader
            kicker="On the calendar"
            title="Featured tournaments"
            description="Live brackets, open registrations and championship nights across every circuit. All events are sample data."
            action={<ArrowLink to="/tournaments" label="View all events" />}
          />
          <div className="home-tabs" role="tablist" aria-label="Featured tournament status">
            {tabs.map((item) => (
              <button
                key={item.value}
                type="button"
                role="tab"
                aria-selected={tab === item.value}
                className={`home-tab ${tab === item.value ? 'is-active' : ''}`}
                onClick={() => setTab(item.value)}
              >
                {item.label}
              </button>
            ))}
          </div>
          <TournamentCollection
            items={featured}
            emptyTitle="Nothing in this window"
            emptyMessage="No featured events match this status right now. Try another tab or browse the full calendar."
          />
        </div>
      </section>

      <section className="section section--alt">
        <div className="container">
          <SectionHeader
            kicker="Final standings"
            title="Latest results"
            description="Recent championship nights, champions and final tables. Invented sample results for this concept."
            action={<ArrowLink to="/results" label="All results" />}
          />
          <ResultsGrid items={results.slice(0, 3)} />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeader
            kicker="Season standings"
            title="Circuit leaders"
            description="The top point earners across the 2026 season. Filter the full leaderboard by game, region and metric."
            action={<ArrowLink to="/rankings" label="Full rankings" />}
          />

          <div className="rank-preview">
            {topPlayers.map((entry, index) => {
              const game = gameBySlug(entry.game)!
              return (
                <Link to="/rankings" className={`rank-preview__row game--${entry.game}`} key={entry.id}>
                  <span className="rank-preview__pos">{String(index + 1).padStart(2, '0')}</span>
                  <span className="rank-preview__player">
                    <strong>{entry.player}</strong>
                    <em>{entry.team}</em>
                  </span>
                  <span className="rank-preview__game">
                    <span className="rank-preview__swatch" aria-hidden="true" />
                    {game.shortName}
                  </span>
                  <span className="rank-preview__wins">{entry.wins} W</span>
                  <span className="rank-preview__points">
                    {entry.points}
                    <em>PTS</em>
                  </span>
                  <span className="rank-preview__arrow" aria-hidden="true">
                    →
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      <section className="cta-band">
        <div className="container cta-band__inner">
          <div>
            <p className="eyebrow">
              <span className="eyebrow__bar" aria-hidden="true" />
              Enter the circuit
            </p>
            <h2>
              Your next match
              <br />
              is already waiting.
            </h2>
          </div>
          <div className="cta-band__actions">
            <Link to="/tournaments?status=upcoming" className="btn btn--primary">
              Find an upcoming event
              <span className="btn__arrow" aria-hidden="true">→</span>
            </Link>
            <Link to="/games" className="btn btn--ghost">
              Explore the circuits
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
