import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { usePageTitle } from '../../hooks/usePageTitle'
import {
  formatCurrency,
  formatDateTime,
  formatNumber,
  paymentStatusLabel,
  registrationStatusLabel,
  statusLabel,
} from '../../lib/format'
import {
  canTransition,
  registrationStatusMessage,
  statusTransitions,
  transitionLabel,
} from '../../lib/events'
import type { TournamentStatus } from '../../types'

export function AdminEventDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const {
    tournaments,
    registrations,
    setTournamentStatus,
    unpublishTournament,
    deleteTournament,
    setRegistrationStatus,
  } = useApp()
  const event = tournaments.find((tournament) => tournament.id === id)
  usePageTitle(event ? event.title : 'Event not found')
  const [feedback, setFeedback] = useState('')
  const [error, setError] = useState('')
  const [confirmCancel, setConfirmCancel] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  if (!event) {
    return (
      <div className="admin-page">
        <div className="admin-empty">
          <strong>Event not found.</strong>
          <span>It may have been deleted from this demo workspace.</span>
          <Link to="/admin/events" className="btn btn--ghost">
            Back to events
          </Link>
        </div>
      </div>
    )
  }

  const eventRegistrations = registrations.filter(
    (registration) => registration.tournamentId === event.id,
  )
  const confirmed = eventRegistrations.filter(
    (registration) => registration.registrationStatus === 'confirmed',
  ).length
  const pendingPayments = eventRegistrations.filter(
    (registration) => registration.payment.status === 'pending',
  ).length
  const verifiedRevenue = eventRegistrations
    .filter((registration) => registration.payment.status === 'verified')
    .reduce((total, registration) => total + registration.entryFee, 0)
  const occupancy =
    event.capacity > 0 ? Math.min(100, Math.round((event.entrants / event.capacity) * 100)) : 0
  const transitions = statusTransitions[event.status]

  const applyTransition = (status: TournamentStatus) => {
    setError('')
    setFeedback('')
    const result = setTournamentStatus(event.id, status)
    if (!result.ok) {
      setError(result.error ?? 'Unable to update status.')
      return
    }
    setConfirmCancel(false)
    setFeedback(`Event moved to ${statusLabel[status].toLowerCase()}.`)
  }

  const handleUnpublish = () => {
    setError('')
    setFeedback('')
    const result = unpublishTournament(event.id)
    if (!result.ok) {
      setError(result.error ?? 'Unable to unpublish event.')
      return
    }
    setFeedback('Event returned to draft and removed from the public calendar.')
  }

  const handleDelete = () => {
    const result = deleteTournament(event.id)
    if (!result.ok) {
      setError(result.error ?? 'Unable to delete event.')
      setConfirmDelete(false)
      return
    }
    navigate('/admin/events', { replace: true })
  }

  return (
    <div className="admin-page">
      <nav className="admin-breadcrumb" aria-label="Breadcrumb">
        <Link to="/admin/events">Events</Link>
        <span>/</span>
        <span>{event.title}</span>
      </nav>

      <header className="admin-page__head admin-page__head--event">
        <div>
          <p className="eyebrow">
            {event.game.replaceAll('-', ' ')} · {event.format}
          </p>
          <h1>{event.title}</h1>
          <div className="admin-page__meta">
            <span className={`status status--${event.status}`}>
              <span className="status__dot" aria-hidden="true" />
              {statusLabel[event.status]}
            </span>
            <span>{formatDateTime(event.start)}</span>
            <span>{event.location}</span>
            {!event.published && <span className="admin-page__unpublished">Unpublished</span>}
          </div>
        </div>
        <div className="admin-page__head-actions">
          {event.published && event.status !== 'draft' && (
            <Link
              to={`/tournaments?q=${encodeURIComponent(event.title)}`}
              className="btn btn--ghost btn--small"
            >
              View public listing
            </Link>
          )}
          <Link to={`/admin/events/${event.id}/edit`} className="btn btn--primary btn--small">
            Edit event
          </Link>
        </div>
      </header>

      {feedback && (
        <p className="admin-feedback" role="status">
          {feedback}
        </p>
      )}
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}

      <section className="admin-stats admin-stats--compact">
        <article className="admin-stat">
          <span className="admin-stat__label">Seats reserved</span>
          <strong>
            {formatNumber(event.entrants)}
            <em> / {formatNumber(event.capacity)}</em>
          </strong>
          <div className="admin-stat__bar">
            <span style={{ width: `${occupancy}%` }} />
          </div>
        </article>
        <article className="admin-stat">
          <span className="admin-stat__label">Confirmed players</span>
          <strong>{formatNumber(confirmed)}</strong>
          <span className="admin-stat__meta">{eventRegistrations.length} registrations total</span>
        </article>
        <article className={`admin-stat ${pendingPayments > 0 ? 'admin-stat--alert' : ''}`}>
          <span className="admin-stat__label">Pending payments</span>
          <strong>{String(pendingPayments).padStart(2, '0')}</strong>
          <span className="admin-stat__meta">Review before closing registration</span>
        </article>
        <article className="admin-stat">
          <span className="admin-stat__label">Verified revenue</span>
          <strong>{formatCurrency(verifiedRevenue)}</strong>
          <span className="admin-stat__meta">Sample entry fees only</span>
        </article>
      </section>

      <div className="admin-grid">
        <section className="admin-panel admin-panel--wide">
          <div className="admin-panel__head">
            <div>
              <p className="eyebrow">Registration desk</p>
              <h2>Players</h2>
            </div>
            <span className="admin-panel__hint">{registrationStatusMessage(event)}</span>
          </div>

          {eventRegistrations.length === 0 ? (
            <div className="admin-empty">
              <strong>No registrations yet.</strong>
              <span>Demo entries from the public event page will land here.</span>
            </div>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Player</th>
                    <th>Payment</th>
                    <th>Seat</th>
                    <th>Submitted</th>
                    <th aria-label="Actions" />
                  </tr>
                </thead>
                <tbody>
                  {eventRegistrations.map((registration) => (
                    <tr key={registration.id}>
                      <td>
                        <strong>{registration.playerName}</strong>
                        <span className="admin-table__sub">
                          @{registration.tag} · {registration.region}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`admin-pill admin-pill--${registration.payment.status}`}
                        >
                          {paymentStatusLabel[registration.payment.status]}
                        </span>
                        <span className="admin-table__sub">
                          {registration.payment.method} · {registration.payment.reference}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`admin-pill admin-pill--reg-${registration.registrationStatus}`}
                        >
                          {registrationStatusLabel[registration.registrationStatus]}
                        </span>
                      </td>
                      <td>{formatDateTime(registration.createdAt)}</td>
                      <td className="admin-table__actions">
                        <Link
                          to={`/admin/payments?registration=${registration.id}`}
                          className="text-btn"
                        >
                          Review
                        </Link>
                        {registration.registrationStatus !== 'cancelled' &&
                          registration.registrationStatus !== 'waitlisted' && (
                            <button
                              type="button"
                              className="text-btn"
                              onClick={() => {
                                const result = setRegistrationStatus(
                                  registration.id,
                                  'waitlisted',
                                )
                                if (!result.ok) {
                                  setError(result.error ?? 'Unable to update player.')
                                  return
                                }
                                setFeedback(`${registration.playerName} moved to the waitlist.`)
                              }}
                            >
                              Waitlist
                            </button>
                          )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <aside className="admin-side-stack">
          <section className="admin-panel">
            <div className="admin-panel__head">
              <div>
                <p className="eyebrow">Lifecycle</p>
                <h2>Event actions</h2>
              </div>
            </div>

            {transitions.length === 0 ? (
              <div className="admin-empty admin-empty--small">
                <strong>{statusLabel[event.status]}</strong>
                <span>No further lifecycle changes are available.</span>
              </div>
            ) : (
              <div className="admin-actions">
                {transitions.map((status) => {
                  if (status === 'cancelled') {
                    return (
                      <div className="admin-confirm" key={status}>
                        {confirmCancel ? (
                          <>
                            <p>
                              Cancel this event? Registrations and payment history will be kept.
                            </p>
                            <div>
                              <button
                                type="button"
                                className="btn btn--danger btn--small"
                                onClick={() => applyTransition('cancelled')}
                              >
                                Confirm cancellation
                              </button>
                              <button
                                type="button"
                                className="btn btn--ghost btn--small"
                                onClick={() => setConfirmCancel(false)}
                              >
                                Keep event
                              </button>
                            </div>
                          </>
                        ) : (
                          <button
                            type="button"
                            className="btn btn--ghost btn--small"
                            onClick={() => setConfirmCancel(true)}
                          >
                            {transitionLabel('cancelled')}
                          </button>
                        )}
                      </div>
                    )
                  }
                  return (
                    <button
                      type="button"
                      className={`btn btn--small ${
                        status === 'live' ? 'btn--primary' : 'btn--ghost'
                      }`}
                      key={status}
                      onClick={() => applyTransition(status)}
                      disabled={!canTransition(event.status, status)}
                    >
                      {transitionLabel(status)}
                    </button>
                  )
                })}
                {event.published && event.status !== 'ended' && event.status !== 'cancelled' && (
                  <button
                    type="button"
                    className="btn btn--ghost btn--small"
                    onClick={handleUnpublish}
                  >
                    Return to draft
                  </button>
                )}
              </div>
            )}
          </section>

          <section className="admin-panel">
            <div className="admin-panel__head">
              <div>
                <p className="eyebrow">Event details</p>
                <h2>At a glance</h2>
              </div>
            </div>
            <dl className="admin-facts">
              <div>
                <dt>Entry fee</dt>
                <dd>{formatCurrency(event.entryFee)}</dd>
              </div>
              <div>
                <dt>Prize pool</dt>
                <dd>{formatCurrency(event.prize)}</dd>
              </div>
              <div>
                <dt>Registration opens</dt>
                <dd>
                  {event.registrationOpens
                    ? formatDateTime(event.registrationOpens)
                    : 'Not scheduled'}
                </dd>
              </div>
              <div>
                <dt>Registration closes</dt>
                <dd>
                  {event.registrationCloses
                    ? formatDateTime(event.registrationCloses)
                    : 'When full'}
                </dd>
              </div>
              <div>
                <dt>Visibility</dt>
                <dd>{event.published ? 'Public listing' : 'Hidden draft'}</dd>
              </div>
            </dl>
            <p className="admin-panel__copy">{event.description}</p>
          </section>

          <section className="admin-panel admin-panel--danger">
            <div className="admin-panel__head">
              <div>
                <p className="eyebrow">Danger zone</p>
                <h2>Remove event</h2>
              </div>
            </div>
            {confirmDelete ? (
              <div className="admin-confirm">
                <p>Permanently delete this event from the demo workspace?</p>
                <div>
                  <button
                    type="button"
                    className="btn btn--danger btn--small"
                    onClick={handleDelete}
                  >
                    Delete permanently
                  </button>
                  <button
                    type="button"
                    className="btn btn--ghost btn--small"
                    onClick={() => setConfirmDelete(false)}
                  >
                    Keep event
                  </button>
                </div>
              </div>
            ) : (
              <>
                <p className="admin-panel__copy">
                  Events with registration history cannot be deleted. Cancel them instead.
                </p>
                <button
                  type="button"
                  className="btn btn--ghost btn--small"
                  onClick={() => setConfirmDelete(true)}
                >
                  Delete event
                </button>
              </>
            )}
          </section>
        </aside>
      </div>
    </div>
  )
}
