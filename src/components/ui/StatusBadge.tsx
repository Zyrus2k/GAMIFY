import type { TournamentStatus } from '../../types'
import { statusLabel } from '../../lib/format'

export function StatusBadge({ status }: { status: TournamentStatus }) {
  return (
    <span className={`status status--${status}`}>
      <span className="status__dot" aria-hidden="true" />
      {statusLabel[status]}
    </span>
  )
}
