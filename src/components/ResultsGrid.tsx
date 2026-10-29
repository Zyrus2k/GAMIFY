import { useState } from 'react'
import type { TournamentResult } from '../types'
import { ResultsCard } from './ResultsCard'
import { ResultsModal } from './ResultsModal'
import { EmptyState } from './ui/EmptyState'

export function ResultsGrid({ items }: { items: TournamentResult[] }) {
  const [resultId, setResultId] = useState<string | null>(null)

  return (
    <>
      {items.length === 0 ? (
        <EmptyState title="No results in this view">
          Completed events will appear here once a champion has been crowned.
        </EmptyState>
      ) : (
        <div className="results-grid">
          {items.map((result) => (
            <ResultsCard key={result.id} result={result} onOpen={setResultId} />
          ))}
        </div>
      )}

      {resultId && <ResultsModal resultId={resultId} onClose={() => setResultId(null)} />}
    </>
  )
}
