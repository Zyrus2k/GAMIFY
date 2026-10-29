import { Link } from 'react-router-dom'
import { GameMotif } from './GameMotif'
import { games, gameBySlug } from '../data/games'
import { results } from '../data/results'
import { flagEmoji, formatCompactCurrency, formatDateTime } from '../lib/format'
import { isPublicTournament } from '../lib/events'
import { useApp } from '../context/AppContext'

export function HeroSection() {
  const { tournaments } = useApp()
  const publicTournaments = tournaments.filter(isPublicTournament)
  const featuredLive =
    publicTournaments.find((tournament) => tournament.status === 'live' && tournament.featured) ??
    publicTournaments.find((tournament) => tournament.status === 'live') ??
    publicTournaments.find((tournament) => tournament.status === 'upcoming')
  const samplePrizePool = publicTournaments
    .filter((tournament) => tournament.status !== 'cancelled')
    .reduce((total, tournament) => total + tournament.prize, 0)
  if (!featuredLive) return null
  const liveGame = gameBySlug(featuredLive.game)!
  const tickerItems = [
    ...results.slice(0, 4).map((result) => ({
      key: result.id,
      text: `FINAL · ${result.name} · ${result.champion} WINS`,
      flag: result.championCountry,
    })),
    ...publicTournaments
      .filter((tournament) => tournament.status === 'upcoming')
      .slice(0, 4)
      .map((tournament) => ({
        key: tournament.id,
        text: `NEXT · ${tournament.title.toUpperCase()} · ${formatDateTime(tournament.start)}`,
        flag: null,
      })),
  ]

  return (
    <section className="hero">
      <div className="hero__texture" aria-hidden="true" />
      <div className="container hero__inner">
        <div className="hero__copy">
          <p className="eyebrow">
            <span className="eyebrow__bar" aria-hidden="true" />
            2026 Club Season · Quezon City
          </p>
          <h1 className="hero__title">
            Your table
            <br />
            <span className="hero__outline">is waiting.</span>
            <br />
            Deal in.
          </h1>
          <p className="hero__lede">
            Eight game communities, one neighborhood club. Pull up a chair for weekly pods,
            high-stakes finals and the kind of rivalries that keep the lights on late.
          </p>
          <div className="hero__actions">
            <Link to="/tournaments" className="btn btn--primary">
              Explore Tournaments
              <span className="btn__arrow" aria-hidden="true">→</span>
            </Link>
            <Link to="/games" className="btn btn--ghost">
              Browse Games
            </Link>
          </div>
          <dl className="hero__stats">
            <div>
              <dt>Game systems</dt>
              <dd>{games.length}</dd>
            </div>
            <div>
              <dt>Season events</dt>
              <dd>{publicTournaments.length}</dd>
            </div>
            <div>
              <dt>Sample prize pool</dt>
              <dd>{formatCompactCurrency(samplePrizePool)}</dd>
            </div>
          </dl>
        </div>

        <div className="hero__visual">
          <div className={`stage-panel game--${featuredLive.game} cat--${liveGame.variant}`}>
            <div className="stage-panel__ring" aria-hidden="true" />
            <div className="stage-panel__head">
              <span className="status status--live">
                <span className="status__dot" aria-hidden="true" />
                LIVE NOW
              </span>
              <span className="stage-panel__tag">FEATURED EVENT</span>
            </div>
            <GameMotif game={featuredLive.game} className="stage-panel__motif" />
            <div className="stage-panel__body">
              <p className="stage-panel__game">
                {liveGame?.name} <span>·</span> {liveGame?.seasonLabel}
              </p>
              <h2>{featuredLive.title}</h2>
              <div className="stage-panel__meta">
                <div>
                  <span>DATE</span>
                  <strong>{formatDateTime(featuredLive.start)}</strong>
                </div>
                <div>
                  <span>VENUE</span>
                  <strong>{featuredLive.location}</strong>
                </div>
                <div>
                  <span>FIELD</span>
                  <strong>{featuredLive.entrants} players</strong>
                </div>
              </div>
              <Link
                to={`/tournaments?q=${encodeURIComponent(featuredLive.title)}`}
                className="stage-panel__action"
              >
                <span>View live event</span>
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
          <p className="hero__disclaimer">
            Deckout Cafe is a fictional club concept. Event data, prizes and rankings are sample content.
          </p>
        </div>
      </div>

      <div className="ticker" aria-label="Latest circuit updates">
        <div className="ticker__track">
          {[0, 1].map((copy) => (
            <div className="ticker__group" key={copy} aria-hidden={copy === 1}>
              {tickerItems.map((item) => (
                <span className="ticker__item" key={`${copy}-${item.key}`}>
                  <span className="ticker__mark" aria-hidden="true" />
                  {item.text}
                  {item.flag && <span className="ticker__flag">{flagEmoji(item.flag)}</span>}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
