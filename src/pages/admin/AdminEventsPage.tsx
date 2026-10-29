import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { usePageTitle } from '../../hooks/usePageTitle'
import {
  formatCurrency,
  formatDateTime,
  formatNumber,
  sortTournaments,
  statusLabel,
} from '../../lib/format'
import type { TournamentStatus } from '../../types'

const statusOptions: Array<TournamentStatus | 'all'> = [
  'all',
  'live',
  'upcoming',
  'draft',
  'ended',
  'cancelled',
]

export function AdminEventsPage() {
  usePageTitle('Admin events')
  const { tournaments } = useApp()
  const [params, setParams] = useSearchParams()
  const query = params.get('q') ?? ''
  const rawStatus = params.get('status')
  const status: TournamentStatus | 'all' = statusOptions.includes(
    rawStatus as TournamentStatus | 'all',
  )
    ? (rawStatus as TournamentStatus | 'all')
    : 'all'

  const update = (key: string, value: string, fallback = '') => {
    const next = new URLSearchParams(params)
    if (!value || value === fallback) next.delete(key)
    else next.set(key, value)
    setParams(next, { replace: true })
  }

  const events = useMemo(() => {
    const needle = query.trim().toLowerCase()
    const filtered = tournaments.filter((event) => {
      if (status !== 'all' && event.status !== status) return false
      if (!needle) return true
      return [event.title, event.game, event.location].join(' ').toLowerCase().includes(needle)
    })
    return sortTournaments(filtered)
  }, [tournaments, status, query])

  return (
    <div className="admin-page">
      <header className="admin-page__head">
        <div>
          <p className="eyebrow">Calendar management</p>
          <h1>Events</h1>
          <p>{tournaments.length} events in the demo workspace, including drafts and cancellations.</p>
        </div>
        <Link to="/admin/events/new" className="btn btn--primary">
          New event
          <span className="btn__arrow" aria-hidden="true">
            +
          </span>
        </Link>
      </header>

      <div className="admin-toolbar">
        <label className="admin-search">
          <svg width="15" height="15" viewBox="0 0 16 16" aria-hidden="true">
            <circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" strokeWidth="1.3" fill="none" />
            <path d="M10 10l4 4" stroke="currentColor" strokeWidth="1.3" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(event) => update('q', event.target.value)}
            placeholder="Search title, game or venue"
            aria-label="Search events"
          />
        </label>
        <label className="select-field">
          <span>Status</span>
          <select
            value={status}
            onChange={(event) => update('status', event.target.value, 'all')}
          >
            {statusOptions.map((option) => (
              <option key={option} value={option}>
                {option === 'all' ? 'All statuses' : statusLabel[option]}
              </option>
            ))}
          </select>
        </label>
        <span className="admin-toolbar__count">
          {events.length} {events.length === 1 ? 'event' : 'events'}
        </span>
      </div>

      <section className="admin-panel">
        {events.length === 0 ? (
          <div className="admin-empty">
            <strong>No events found.</strong>
            <span>Try a different status or clear the search.</span>
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table admin-table--events">
              <thead>
                <tr>
                  <th>Event</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Venue</th>
                  <th>Field</th>
                  <th>Entry / prize</th>
                  <th aria-label="Actions" />
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event.id}>
                    <td>
                      <strong>{event.title}</strong>
                      <span className="admin-table__sub">
                        {event.game.replaceAll('-', ' ')}
                        {!event.published && ' · unpublished'}
                      </span>
                    </td>
                    <td>
                      <span className={`status status--${event.status}`}>
                        <span className="status__dot" aria-hidden="true" />
                        {statusLabel[event.status]}
                      </span>
                    </td>
                    <td>{formatDateTime(event.start)}</td>
                    <td>{event.location}</td>
                    <td>
                      {formatNumber(event.entrants)} / {formatNumber(event.capacity)}
                    </td>
                    <td>
                      <strong>{formatCurrency(event.entryFee)}</strong>
                      <span className="admin-table__sub">
                        {formatCurrency(event.prize)} pool
                      </span>
                    </td>
                    <td className="admin-table__actions">
                      <Link to={`/admin/events/${event.id}`} className="text-btn">
                        Manage
                      </Link>
                      <Link to={`/admin/events/${event.id}/edit`} className="text-btn">
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}
