import { Link } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { usePageTitle } from '../../hooks/usePageTitle'
import {
  formatCurrency,
  formatDateTime,
  formatNumber,
  paymentStatusLabel,
  sortTournaments,
  statusLabel,
} from '../../lib/format'
import type { Registration } from '../../types'

export function AdminDashboardPage() {
  usePageTitle('Admin dashboard')
  const { tournaments, registrations } = useApp()

  const liveEvents = tournaments.filter((event) => event.status === 'live').length
  const upcomingEvents = tournaments.filter((event) => event.status === 'upcoming').length
  const pendingPayments = registrations.filter(
    (registration) => registration.payment.status === 'pending',
  )
  const confirmedPlayers = registrations.filter(
    (registration) => registration.registrationStatus === 'confirmed',
  ).length
  const verifiedRevenue = registrations
    .filter((registration) => registration.payment.status === 'verified')
    .reduce((total, registration) => total + registration.entryFee, 0)
  const nextEvents = sortTournaments(
    tournaments.filter((event) => event.status === 'live' || event.status === 'upcoming'),
  ).slice(0, 5)
  const recentRegistrations = [...registrations]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)

  return (
    <div className="admin-page">
      <header className="admin-page__head">
        <div>
          <p className="eyebrow">Dashboard · 2026 season</p>
          <h1>Good evening, front desk.</h1>
          <p>Here is what needs attention before the next table call.</p>
        </div>
        <Link to="/admin/events/new" className="btn btn--primary">
          New event
          <span className="btn__arrow" aria-hidden="true">
            +
          </span>
        </Link>
      </header>

      <section className="admin-stats" aria-label="Event and payment summary">
        <article className="admin-stat">
          <span className="admin-stat__label">Live events</span>
          <strong>{String(liveEvents).padStart(2, '0')}</strong>
          <span className="admin-stat__meta">{upcomingEvents} upcoming on the calendar</span>
        </article>
        <article className={`admin-stat ${pendingPayments.length > 0 ? 'admin-stat--alert' : ''}`}>
          <span className="admin-stat__label">Payments to review</span>
          <strong>{String(pendingPayments.length).padStart(2, '0')}</strong>
          <span className="admin-stat__meta">Awaiting a reference check</span>
        </article>
        <article className="admin-stat">
          <span className="admin-stat__label">Verified entry revenue</span>
          <strong>{formatCurrency(verifiedRevenue)}</strong>
          <span className="admin-stat__meta">Sample total · verified only</span>
        </article>
        <article className="admin-stat">
          <span className="admin-stat__label">Confirmed players</span>
          <strong>{formatNumber(confirmedPlayers)}</strong>
          <span className="admin-stat__meta">{registrations.length} total registrations</span>
        </article>
      </section>

      <div className="admin-grid">
        <section className="admin-panel admin-panel--wide">
          <div className="admin-panel__head">
            <div>
              <p className="eyebrow">Payment queue</p>
              <h2>Waiting for verification</h2>
            </div>
            <Link to="/admin/payments" className="text-btn">
              Open payment desk →
            </Link>
          </div>

          {pendingPayments.length === 0 ? (
            <div className="admin-empty">
              <strong>Queue clear.</strong>
              <span>New demo registrations will appear here for review.</span>
            </div>
          ) : (
            <div className="admin-list">
              {pendingPayments.slice(0, 5).map((registration) => {
                const event = tournaments.find(
                  (tournament) => tournament.id === registration.tournamentId,
                )
                return (
                  <Link
                    to={`/admin/payments?registration=${registration.id}`}
                    className="admin-list__row"
                    key={registration.id}
                  >
                    <span className="admin-list__main">
                      <strong>{registration.playerName}</strong>
                      <em>
                        {event?.title ?? 'Event removed'} · {registration.payment.method}
                      </em>
                    </span>
                    <span className="admin-list__ref">{registration.payment.reference}</span>
                    <span className="admin-list__amount">
                      {formatCurrency(registration.entryFee)}
                    </span>
                    <span className="admin-list__arrow" aria-hidden="true">
                      →
                    </span>
                  </Link>
                )
              })}
            </div>
          )}
        </section>

        <section className="admin-panel">
          <div className="admin-panel__head">
            <div>
              <p className="eyebrow">Next up</p>
              <h2>Event watch</h2>
            </div>
            <Link to="/admin/events" className="text-btn">
              All events →
            </Link>
          </div>
          <div className="admin-watch">
            {nextEvents.map((event) => (
              <Link to={`/admin/events/${event.id}`} className="admin-watch__item" key={event.id}>
                <span className={`admin-watch__status admin-watch__status--${event.status}`}>
                  {statusLabel[event.status]}
                </span>
                <strong>{event.title}</strong>
                <span>{formatDateTime(event.start)}</span>
                <span>
                  {formatNumber(event.entrants)} / {formatNumber(event.capacity)} seats
                </span>
              </Link>
            ))}
          </div>
        </section>
      </div>

      <section className="admin-panel">
        <div className="admin-panel__head">
          <div>
            <p className="eyebrow">Latest activity</p>
            <h2>Recent registrations</h2>
          </div>
          <Link to="/admin/payments" className="text-btn">
            Review all →
          </Link>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Player</th>
                <th>Event</th>
                <th>Entry</th>
                <th>Registered</th>
                <th>Payment</th>
                <th>Seat</th>
              </tr>
            </thead>
            <tbody>
              {recentRegistrations.map((registration) => (
                <RecentRow
                  key={registration.id}
                  registration={registration}
                  eventTitle={
                    tournaments.find((event) => event.id === registration.tournamentId)?.title ??
                    'Event removed'
                  }
                />
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

function RecentRow({
  registration,
  eventTitle,
}: {
  registration: Registration
  eventTitle: string
}) {
  return (
    <tr>
      <td>
        <strong>{registration.playerName}</strong>
        <span className="admin-table__sub">@{registration.tag}</span>
      </td>
      <td>{eventTitle}</td>
      <td>{formatCurrency(registration.entryFee)}</td>
      <td>{formatDateTime(registration.createdAt)}</td>
      <td>
        <span className={`admin-pill admin-pill--${registration.payment.status}`}>
          {paymentStatusLabel[registration.payment.status]}
        </span>
      </td>
      <td>
        <span className={`admin-pill admin-pill--reg-${registration.registrationStatus}`}>
          {registration.registrationStatus}
        </span>
      </td>
    </tr>
  )
}
