import { useState } from 'react'
import type { Tournament } from '../types'
import { TournamentGrid } from './TournamentGrid'
import { TournamentDetailsModal } from './TournamentDetailsModal'
import { ResultsModal } from './ResultsModal'

interface TournamentCollectionProps {
  items: Tournament[]
  emptyTitle?: string
  emptyMessage?: string
  onReset?: () => void
}

export function TournamentCollection({
  items,
  emptyTitle,
  emptyMessage,
  onReset,
}: TournamentCollectionProps) {
  const [selected, setSelected] = useState<Tournament | null>(null)
  const [resultId, setResultId] = useState<string | null>(null)

  return (
    <>
      <TournamentGrid
        tournaments={items}
        onOpen={setSelected}
        onResults={(id) => {
          setSelected(null)
          setResultId(id)
        }}
        emptyTitle={emptyTitle}
        emptyMessage={emptyMessage}
        onReset={onReset}
      />

      {selected && (
        <TournamentDetailsModal
          tournament={selected}
          onClose={() => setSelected(null)}
          onResults={(id) => {
            setSelected(null)
            setResultId(id)
          }}
        />
      )}

      {resultId && <ResultsModal resultId={resultId} onClose={() => setResultId(null)} />}
    </>
  )
}
