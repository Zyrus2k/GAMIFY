import { useMemo, useState } from 'react'
import type { GameSlug, LeaderboardEntry, LeaderboardSort } from '../types'
import { games, gameBySlug } from '../data/games'
import { leaderboard } from '../data/leaderboard'
import { flagEmoji } from '../lib/format'
import { EmptyState } from './ui/EmptyState'

interface LeaderboardProps {
  initialGame?: GameSlug | 'all'
  showGameFilter?: boolean
  showRegionFilter?: boolean
}

const sortLabels: Record<LeaderboardSort, string> = {
  points: 'Circuit points',
  wins: 'Total wins',
  firsts: 'First-place finishes',
}

export function Leaderboard({
  initialGame = 'all',
  showGameFilter = true,
  showRegionFilter = true,
}: LeaderboardProps) {
  const [game, setGame] = useState<GameSlug | 'all'>(initialGame)
  const [sort, setSort] = useState<LeaderboardSort>('points')
  const [region, setRegion] = useState('all')

  const regions = useMemo(
    () => Array.from(new Set(leaderboard.map((entry) => entry.region))).sort(),
    [],
  )

  const rows = useMemo(() => {
    const filtered = leaderboard.filter(
      (entry) =>
        (game === 'all' || entry.game === game) && (region === 'all' || entry.region === region),
    )
    return [...filtered].sort((a, b) => b[sort] - a[sort])
  }, [game, region, sort])

  const isFiltered = game !== 'all' || region !== 'all' || sort !== 'points'

  return (
    <div className="leaderboard">
      <div className="leaderboard__controls">
        <div className="leaderboard__controls-left">
          {showGameFilter && (
            <label className="select-field">
              <span>Game</span>
              <select
                value={game}
                onChange={(event) => setGame(event.target.value as GameSlug | 'all')}
              >
                <option value="all">All game systems</option>
                {games.map((item) => (
                  <option key={item.slug} value={item.slug}>
                    {item.shortName}
                  </option>
                ))}
              </select>
            </label>
          )}
          {showRegionFilter && (
            <label className="select-field">
              <span>Region</span>
              <select value={region} onChange={(event) => setRegion(event.target.value)}>
                <option value="all">All regions</option>
                {regions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
          )}
          <label className="select-field">
            <span>Sort by</span>
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value as LeaderboardSort)}
            >
              {(Object.keys(sortLabels) as LeaderboardSort[]).map((key) => (
                <option key={key} value={key}>
                  {sortLabels[key]}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="leaderboard__controls-right">
          <span className="leaderboard__count">{rows.length} players</span>
          {isFiltered && (
            <button
              type="button"
              className="text-btn"
              onClick={() => {
                setGame(initialGame)
                setRegion('all')
                setSort('points')
              }}
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {rows.length === 0 ? (
        <EmptyState title="No ranked players">
          No competitors match this region and game combination. Try resetting the filters.
        </EmptyState>
      ) : (
        <div className="lb" role="table" aria-label="Player leaderboard">
          <div className="lb__head" role="row">
            <span role="columnheader">Pos</span>
            <span role="columnheader">Player</span>
            <span role="columnheader">Circuit</span>
            <span role="columnheader">Region</span>
            <span role="columnheader">Wins</span>
            <span role="columnheader">Podiums</span>
            <span role="columnheader" className="lb__points-head">
              Points
            </span>
          </div>

          {rows.map((entry: LeaderboardEntry, index) => {
            const entryGame = gameBySlug(entry.game)!
            return (
              <div className="lb__row" role="row" key={entry.id}>
                <span className="lb__pos" role="cell">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="lb__player" role="cell">
                  <strong>{entry.player}</strong>
                  <span>
                    {entry.team} <em>· {entryGame.shortName}</em>
                  </span>
                </span>
                <span className="lb__game" role="cell">
                  <span className={`lb__swatch game--${entry.game}`} aria-hidden="true" />
                  {entryGame.shortName}
                </span>
                <span className="lb__region" role="cell">
                  <span className="lb__flag">{flagEmoji(entry.country)}</span> {entry.region}
                </span>
                <span className="lb__stat" role="cell">
                  {entry.wins}
                </span>
                <span className="lb__podiums" role="cell">
                  <em>1st</em> {entry.firsts}
                  <em>2nd</em> {entry.seconds}
                  <em>3rd</em> {entry.thirds}
                </span>
                <span className="lb__points" role="cell">
                  {entry.points}
                  <em>PTS</em>
                </span>
              </div>
            )
          })}
        </div>
      )}

      <p className="leaderboard__note">
        Sample standings for demonstration. Rank recalculates live based on the selected game, region
        and sort metric. Not an official ranking.
      </p>
    </div>
  )
}
