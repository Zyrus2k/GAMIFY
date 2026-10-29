import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Modal } from '../../components/ui/Modal'
import { useApp } from '../../context/AppContext'
import { usePageTitle } from '../../hooks/usePageTitle'
import {
  formatCurrency,
  formatDateTime,
  paymentStatusLabel,
  registrationStatusLabel,
  statusLabel,
} from '../../lib/format'
import type { PaymentStatus } from '../../types'

const paymentFilters: Array<PaymentStatus | 'all'> = [
  'all',
  'pending',
  'verified',
  'rejected',
  'refunded',
]

export function AdminPaymentsPage() {
  usePageTitle('Admin payments')
  const { registrations, tournaments, reviewPayment, setRegistrationStatus } = useApp()
  const [params, setParams] = useSearchParams()
  const query = params.get('q') ?? ''
  const rawStatus = params.get('status')
  const status: PaymentStatus | 'all' = paymentFilters.includes(
    rawStatus as PaymentStatus | 'all',
  )
    ? (rawStatus as PaymentStatus | 'all')
    : 'all'
  const selectedId = params.get('registration')
  const [note, setNote] = useState('')
  const [actionError, setActionError] = useState('')
  const [actionFeedback, setActionFeedback] = useState('')

  const selected = registrations.find((registration) => registration.id === selectedId)
  const selectedEvent = selected
    ? tournaments.find((event) => event.id === selected.tournamentId)
    : undefined

  const update = (key: string, value: string, fallback = '') => {
    const next = new URLSearchParams(params)
    if (!value || value === fallback) next.delete(key)
    else next.set(key, value)
    setParams(next, { replace: true })
  }

  const openReview = (id: string) => {
    setNote('')
    setActionError('')
    setActionFeedback('')
    const next = new URLSearchParams(params)
    next.set('registration', id)
    setParams(next, { replace: true })
  }

  const closeReview = () => {
    const next = new URLSearchParams(params)
    next.delete('registration')
    setParams(next, { replace: true })
  }

  const rows = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return [...registrations]
      .filter((registration) => {
        if (status !== 'all' && registration.payment.status !== status) return false
        if (!needle) return true
        const event = tournaments.find((item) => item.id === registration.tournamentId)
        return [
          registration.playerName,
          registration.email,
          registration.tag,
          registration.payment.reference,
          event?.title ?? '',
        ]
          .join(' ')
          .toLowerCase()
          .includes(needle)
      })
      .sort(
        (a, b) =>
          new Date(b.payment.submittedAt).getTime() -
          new Date(a.payment.submittedAt).getTime(),
      )
  }, [registrations, tournaments, status, query])

  const pendingCount = registrations.filter(
    (registration) => registration.payment.status === 'pending',
  ).length
  const verifiedTotal = registrations
    .filter((registration) => registration.payment.status === 'verified')
    .reduce((total, registration) => total + registration.entryFee, 0)
  const rejectedCount = registrations.filter(
    (registration) => registration.payment.status === 'rejected',
  ).length

  const applyPaymentAction = (nextStatus: PaymentStatus) => {
    if (!selected) return
    if ((nextStatus === 'rejected' || nextStatus === 'refunded') && note.trim().length < 4) {
      setActionError('Add a short review note before rejecting or refunding.')
      return
    }
    const result = reviewPayment(selected.id, nextStatus, note)
    if (!result.ok) {
      setActionError(result.error ?? 'Unable to update payment.')
      return
    }
    setActionError('')
    setActionFeedback(`Payment marked ${paymentStatusLabel[nextStatus].toLowerCase()}.`)
    setNote('')
  }

  const applySeatAction = (nextStatus: 'confirmed' | 'waitlisted' | 'cancelled') => {
    if (!selected) return
    const result = setRegistrationStatus(selected.id, nextStatus)
    if (!result.ok) {
      setActionError(result.error ?? 'Unable to update seat.')
      return
    }
    setActionError('')
    setActionFeedback(`Seat updated to ${nextStatus}.`)
  }

  return (
    <div className="admin-page">
      <header className="admin-page__head">
        <div>
          <p className="eyebrow">Front desk ledger</p>
          <h1>Payments</h1>
          <p>Match entry references, confirm seats and keep the demo ledger tidy.</p>
        </div>
        <span className="admin-page__head-stat">
          <em>Pending review</em>
          <strong>{String(pendingCount).padStart(2, '0')}</strong>
        </span>
      </header>

      <section className="admin-stats admin-stats--compact">
        <article className="admin-stat admin-stat--alert">
          <span className="admin-stat__label">Pending</span>
          <strong>{String(pendingCount).padStart(2, '0')}</strong>
          <span className="admin-stat__meta">Needs a reference check</span>
        </article>
        <article className="admin-stat">
          <span className="admin-stat__label">Verified total</span>
          <strong>{formatCurrency(verifiedTotal)}</strong>
          <span className="admin-stat__meta">Sample entry fees</span>
        </article>
        <article className="admin-stat">
          <span className="admin-stat__label">Rejected</span>
          <strong>{String(rejectedCount).padStart(2, '0')}</strong>
          <span className="admin-stat__meta">Reference could not be matched</span>
        </article>
        <article className="admin-stat">
          <span className="admin-stat__label">All records</span>
          <strong>{String(registrations.length).padStart(2, '0')}</strong>
          <span className="admin-stat__meta">Local demo registrations</span>
        </article>
      </section>

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
            placeholder="Search player, event or reference"
            aria-label="Search payments"
          />
        </label>
        <label className="select-field">
          <span>Payment</span>
          <select
            value={status}
            onChange={(event) => update('status', event.target.value, 'all')}
          >
            {paymentFilters.map((option) => (
              <option key={option} value={option}>
                {option === 'all' ? 'All statuses' : paymentStatusLabel[option]}
              </option>
            ))}
          </select>
        </label>
        <span className="admin-toolbar__count">
          {rows.length} {rows.length === 1 ? 'record' : 'records'}
        </span>
      </div>

      <section className="admin-panel">
        {rows.length === 0 ? (
          <div className="admin-empty">
            <strong>No payment records match.</strong>
            <span>Try a different status or clear the search.</span>
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table admin-table--payments">
              <thead>
                <tr>
                  <th>Player</th>
                  <th>Event</th>
                  <th>Method / reference</th>
                  <th>Amount</th>
                  <th>Submitted</th>
                  <th>Payment</th>
                  <th>Seat</th>
                  <th aria-label="Actions" />
                </tr>
              </thead>
              <tbody>
                {rows.map((registration) => {
                  const event = tournaments.find(
                    (item) => item.id === registration.tournamentId,
                  )
                  return (
                    <tr key={registration.id}>
                      <td>
                        <strong>{registration.playerName}</strong>
                        <span className="admin-table__sub">{registration.email}</span>
                      </td>
                      <td>
                        {event?.title ?? 'Event removed'}
                        <span className="admin-table__sub">
                          {event ? statusLabel[event.status] : 'Archived'}
                        </span>
                      </td>
                      <td>
                        {registration.payment.method}
                        <span className="admin-table__sub">
                          {registration.payment.reference}
                        </span>
                      </td>
                      <td>{formatCurrency(registration.entryFee)}</td>
                      <td>{formatDateTime(registration.payment.submittedAt)}</td>
                      <td>
                        <span
                          className={`admin-pill admin-pill--${registration.payment.status}`}
                        >
                          {paymentStatusLabel[registration.payment.status]}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`admin-pill admin-pill--reg-${registration.registrationStatus}`}
                        >
                          {registrationStatusLabel[registration.registrationStatus]}
                        </span>
                      </td>
                      <td className="admin-table__actions">
                        <button
                          type="button"
                          className="text-btn"
                          onClick={() => openReview(registration.id)}
                        >
                          Review
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <Modal
        open={Boolean(selected)}
        onClose={closeReview}
        eyebrow="Payment review"
        title={selected ? selected.playerName : 'Payment'}
        size="wide"
      >
        {selected && (
          <div className="payment-review">
            <div className="payment-review__top">
              <div>
                <span className="payment-review__label">Reference</span>
                <strong>{selected.payment.reference}</strong>
              </div>
              <span className={`admin-pill admin-pill--${selected.payment.status}`}>
                {paymentStatusLabel[selected.payment.status]}
              </span>
            </div>

            <dl className="payment-review__grid">
              <div>
                <dt>Event</dt>
                <dd>
                  {selectedEvent?.title ?? 'Event removed'}
                  {selectedEvent && (
                    <span className={`status status--${selectedEvent.status}`}>
                      <span className="status__dot" aria-hidden="true" />
                      {statusLabel[selectedEvent.status]}
                    </span>
                  )}
                </dd>
              </div>
              <div>
                <dt>Amount due</dt>
                <dd>{formatCurrency(selected.entryFee)}</dd>
              </div>
              <div>
                <dt>Method</dt>
                <dd>{selected.payment.method}</dd>
              </div>
              <div>
                <dt>Player</dt>
                <dd>
                  @{selected.tag}
                  <span>{selected.email}</span>
                </dd>
              </div>
              <div>
                <dt>Seat status</dt>
                <dd>{registrationStatusLabel[selected.registrationStatus]}</dd>
              </div>
              <div>
                <dt>Submitted</dt>
                <dd>{formatDateTime(selected.payment.submittedAt)}</dd>
              </div>
            </dl>

            {selected.payment.note && (
              <div className="payment-review__note">
                <span>Player note</span>
                <p>{selected.payment.note}</p>
              </div>
            )}

            {selectedEvent?.status === 'cancelled' && (
              <p className="admin-feedback admin-feedback--warning">
                This event is cancelled. Verified payments should normally be refunded.
              </p>
            )}

            <div className="payment-review__history">
              <h3>Review trail</h3>
              {selected.payment.history.map((entry, index) => (
                <div className="payment-review__event" key={`${entry.at}-${index}`}>
                  <span className={`payment-review__dot payment-review__dot--${entry.action}`} />
                  <div>
                    <strong>{paymentStatusLabel[entry.action]}</strong>
                    <span>
                      {entry.actor} · {formatDateTime(entry.at)}
                    </span>
                    {entry.note && <p>{entry.note}</p>}
                  </div>
                </div>
              ))}
            </div>

            <div className="payment-review__actions">
              {selected.payment.status === 'pending' && (
                <>
                  <label className="field">
                    <span className="field__label">Review note</span>
                    <textarea
                      rows={3}
                      value={note}
                      onChange={(event) => {
                        setNote(event.target.value)
                        setActionError('')
                      }}
                      placeholder="Matched GCash reference and amount."
                    />
                  </label>
                  {actionError && (
                    <p className="form-error" role="alert">
                      {actionError}
                    </p>
                  )}
                  {actionFeedback && (
                    <p className="admin-feedback" role="status">
                      {actionFeedback}
                    </p>
                  )}
                  <div className="modal-actions">
                    <button
                      type="button"
                      className="btn btn--ghost"
                      onClick={() => applyPaymentAction('rejected')}
                    >
                      Reject payment
                    </button>
                    <button
                      type="button"
                      className="btn btn--primary"
                      onClick={() => applyPaymentAction('verified')}
                    >
                      Verify & confirm seat
                    </button>
                  </div>
                </>
              )}

              {selected.payment.status === 'verified' && (
                <>
                  <div className="payment-review__verified">
                    <span>Verified by {selected.payment.reviewedBy}</span>
                    <strong>{formatDateTime(selected.payment.reviewedAt ?? selected.payment.submittedAt)}</strong>
                  </div>
                  {actionError && (
                    <p className="form-error" role="alert">
                      {actionError}
                    </p>
                  )}
                  {actionFeedback && (
                    <p className="admin-feedback" role="status">
                      {actionFeedback}
                    </p>
                  )}
                  <div className="payment-review__seat-actions">
                    <button
                      type="button"
                      className="btn btn--ghost btn--small"
                      onClick={() => applySeatAction('waitlisted')}
                    >
                      Move to waitlist
                    </button>
                    <button
                      type="button"
                      className="btn btn--ghost btn--small"
                      onClick={() => applySeatAction('cancelled')}
                    >
                      Cancel seat
                    </button>
                    <button
                      type="button"
                      className="btn btn--ghost btn--small"
                      onClick={() => applySeatAction('confirmed')}
                    >
                      Confirm seat
                    </button>
                  </div>
                  <label className="field">
                    <span className="field__label">Refund note</span>
                    <textarea
                      rows={2}
                      value={note}
                      onChange={(event) => {
                        setNote(event.target.value)
                        setActionError('')
                      }}
                      placeholder="Add a note before refunding."
                    />
                  </label>
                  <button
                    type="button"
                    className="btn btn--danger"
                    onClick={() => applyPaymentAction('refunded')}
                  >
                    Record refund
                  </button>
                </>
              )}

              {(selected.payment.status === 'rejected' ||
                selected.payment.status === 'refunded') && (
                <p className="payment-review__closed">
                  This payment is closed. {selected.payment.reviewNote}
                </p>
              )}
            </div>

            <div className="modal-actions">
              <button type="button" className="btn btn--ghost" onClick={closeReview}>
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
