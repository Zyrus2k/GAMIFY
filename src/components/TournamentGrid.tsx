import type { Tournament } from '../types'
import { EmptyState } from './ui/EmptyState'
import { TournamentCard } from './TournamentCard'

interface TournamentGridProps {
  tournaments: Tournament[]
  onOpen: (tournament: Tournament) => void
  onResults: (resultId: string) => void
  emptyTitle?: string
  emptyMessage?: string
  onReset?: () => void
}

export function TournamentGrid({
  tournaments,
  onOpen,
  onResults,
  emptyTitle = 'No events match this search',
  emptyMessage = 'Try a different game, status or city — or reset the filters to see the full calendar.',
  onReset,
}: TournamentGridProps) {
  if (tournaments.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        action={onReset ? { label: 'Reset filters', onClick: onReset } : undefined}
      >
        {emptyMessage}
      </EmptyState>
    )
  }

  return (
    <div className="tournament-grid">
      {tournaments.map((tournament) => (
        <TournamentCard
          key={tournament.id}
          tournament={tournament}
          onOpen={onOpen}
          onResults={onResults}
        />
      ))}
    </div>
  )
}
