import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'

export function EmptyState({
  title,
  children,
  action,
}: {
  title: string
  children: ReactNode
  action?: { label: string; onClick: () => void }
}) {
  return (
    <div className="empty-state">
      <div className="empty-state__mark" aria-hidden="true">
        <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
          <rect x="6" y="6" width="22" height="22" rx="2" stroke="currentColor" strokeWidth="1.2" />
          <path d="M12 17h10M17 12v10" stroke="currentColor" strokeWidth="1.2" />
        </svg>
      </div>
      <h3>{title}</h3>
      <p>{children}</p>
      {action && (
        <button type="button" className="btn btn--ghost btn--small" onClick={action.onClick}>
          {action.label}
        </button>
      )}
    </div>
  )
}

export function ArrowLink({ to, label }: { to: string; label: string }) {
  return (
    <Link to={to} className="arrow-link">
      <span>{label}</span>
      <span className="arrow-link__arrow" aria-hidden="true">
        →
      </span>
    </Link>
  )
}
