import { useMemo, useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { games } from '../../data/games'
import { usePageTitle } from '../../hooks/usePageTitle'
import { formatCurrency, statusLabel } from '../../lib/format'
import type { GameSlug, TournamentFormat } from '../../types'

interface EventForm {
  title: string
  game: GameSlug
  status: 'draft' | 'upcoming'
  published: boolean
  start: string
  end: string
  location: string
  format: TournamentFormat
  entrants: string
  capacity: string
  entryFee: string
  prize: string
  featured: boolean
  registrationOpens: string
  registrationCloses: string
  description: string
}

const toLocalInput = (iso?: string): string => {
  if (!iso) return ''
  const date = new Date(iso)
  const pad = (value: number) => String(value).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
    date.getHours(),
  )}:${pad(date.getMinutes())}`
}

const toIso = (value: string): string => (value ? new Date(value).toISOString() : '')

const initialForm = (): EventForm => ({
  title: '',
  game: 'riftbound',
  status: 'draft',
  published: false,
  start: '',
  end: '',
  location: 'Deckout Cafe · Quezon City',
  format: 'Offline',
  entrants: '0',
  capacity: '32',
  entryFee: '350',
  prize: '15000',
  featured: false,
  registrationOpens: '',
  registrationCloses: '',
  description: '',
})

export function AdminEventEditorPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { tournaments, addTournament, updateTournament } = useApp()
  const existing = useMemo(
    () => tournaments.find((tournament) => tournament.id === id),
    [tournaments, id],
  )
  usePageTitle(existing ? `Edit ${existing.title}` : 'New event')

  const [form, setForm] = useState<EventForm>(() =>
    existing
      ? {
          title: existing.title,
          game: existing.game,
          status: existing.status === 'upcoming' ? 'upcoming' : 'draft',
          published: existing.published,
          start: toLocalInput(existing.start),
          end: toLocalInput(existing.end),
          location: existing.location,
          format: existing.format,
          entrants: String(existing.entrants),
          capacity: String(existing.capacity),
          entryFee: String(existing.entryFee),
          prize: String(existing.prize),
          featured: Boolean(existing.featured),
          registrationOpens: toLocalInput(existing.registrationOpens),
          registrationCloses: toLocalInput(existing.registrationCloses),
          description: existing.description,
        }
      : initialForm(),
  )
  const [errors, setErrors] = useState<Record<string, string>>({})

  const update = <Key extends keyof EventForm>(key: Key, value: EventForm[Key]) => {
    setForm((current) => ({ ...current, [key]: value }))
    setErrors((current) => ({ ...current, [key]: '' }))
  }

  const validate = (): boolean => {
    const next: Record<string, string> = {}
    if (form.title.trim().length < 4) next.title = 'Use at least 4 characters.'
    if (!form.start) next.start = 'Choose a start date and time.'
    if (!form.location.trim()) next.location = 'Add a venue or platform.'
    if (Number(form.capacity) < 2) next.capacity = 'Capacity must be at least 2.'
    if (Number(form.entrants) < 0) next.entrants = 'Entrants cannot be negative.'
    if (Number(form.entryFee) < 0) next.entryFee = 'Entry fee cannot be negative.'
    if (Number(form.prize) < 0) next.prize = 'Prize pool cannot be negative.'
    if (form.description.trim().length < 20) {
      next.description = 'Add at least 20 characters of event copy.'
    }
    if (form.end && new Date(form.end) <= new Date(form.start)) {
      next.end = 'End time must be after the start.'
    }
    if (
      form.registrationOpens &&
      form.registrationCloses &&
      new Date(form.registrationCloses) <= new Date(form.registrationOpens)
    ) {
      next.registrationCloses = 'Registration must close after it opens.'
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (!validate()) return

    const payload = {
      title: form.title.trim(),
      game: form.game,
      status: existing?.status ?? form.status,
      published: (existing?.status ?? form.status) === 'draft' ? false : form.published,
      start: toIso(form.start),
      end: toIso(form.end) || undefined,
      location: form.location.trim(),
      format: form.format,
      entrants: Number(form.entrants),
      capacity: Number(form.capacity),
      entryFee: Number(form.entryFee),
      prize: Number(form.prize),
      currency: 'PHP' as const,
      featured: form.featured,
      registrationOpens: toIso(form.registrationOpens) || undefined,
      registrationCloses: toIso(form.registrationCloses) || undefined,
      description: form.description.trim(),
    }

    if (existing) {
      updateTournament(existing.id, payload)
      navigate(`/admin/events/${existing.id}`)
      return
    }
    const nextId = addTournament(payload)
    navigate(`/admin/events/${nextId}`)
  }

  if (id && !existing) {
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

  const occupied = Number(form.entrants)
  const capacity = Number(form.capacity) || 0
  const occupancy = capacity > 0 ? Math.min(100, Math.round((occupied / capacity) * 100)) : 0

  return (
    <div className="admin-page">
      <nav className="admin-breadcrumb" aria-label="Breadcrumb">
        <Link to="/admin/events">Events</Link>
        <span>/</span>
        <span>{existing ? 'Edit event' : 'New event'}</span>
      </nav>

      <header className="admin-page__head">
        <div>
          <p className="eyebrow">{existing ? 'Event settings' : 'Create an event'}</p>
          <h1>{existing ? existing.title : 'New tournament night'}</h1>
          <p>
            {existing
              ? 'Update the schedule and listing details. Use the event detail page to move status.'
              : 'Set up the listing first. New events stay out of the public calendar until published.'}
          </p>
        </div>
        {existing && (
          <span className={`status status--${existing.status}`}>
            <span className="status__dot" aria-hidden="true" />
            {statusLabel[existing.status]}
          </span>
        )}
      </header>

      <form className="admin-form" onSubmit={submit} noValidate>
        <div className="admin-form__main">
          <section className="admin-panel">
            <div className="admin-panel__head">
              <div>
                <p className="eyebrow">01 · The event</p>
                <h2>Listing details</h2>
              </div>
            </div>

            <label className="field">
              <span className="field__label">Event title</span>
              <input
                type="text"
                value={form.title}
                onChange={(event) => update('title', event.target.value)}
                aria-invalid={Boolean(errors.title)}
                placeholder="Friday Night Rift Draft"
              />
              {errors.title && <span className="field__error">{errors.title}</span>}
            </label>

            <div className="field-row">
              <label className="field">
                <span className="field__label">Game</span>
                <select
                  value={form.game}
                  onChange={(event) => update('game', event.target.value as GameSlug)}
                >
                  {games.map((game) => (
                    <option key={game.slug} value={game.slug}>
                      {game.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="field">
                <span className="field__label">Format</span>
                <select
                  value={form.format}
                  onChange={(event) =>
                    update('format', event.target.value as TournamentFormat)
                  }
                >
                  <option value="Offline">Offline</option>
                  <option value="Online">Online</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </label>
            </div>

            <label className="field">
              <span className="field__label">Description</span>
              <textarea
                rows={5}
                value={form.description}
                onChange={(event) => update('description', event.target.value)}
                aria-invalid={Boolean(errors.description)}
                placeholder="What should players expect from the night?"
              />
              {errors.description && (
                <span className="field__error">{errors.description}</span>
              )}
            </label>

            <label className="field">
              <span className="field__label">Venue or platform</span>
              <input
                type="text"
                value={form.location}
                onChange={(event) => update('location', event.target.value)}
                aria-invalid={Boolean(errors.location)}
              />
              {errors.location && <span className="field__error">{errors.location}</span>}
            </label>

            <label className="admin-check">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(event) => update('featured', event.target.checked)}
              />
              <span>
                <strong>Feature on the home page</strong>
                <em>Only public events appear in the featured carousel.</em>
              </span>
            </label>
          </section>

          <section className="admin-panel">
            <div className="admin-panel__head">
              <div>
                <p className="eyebrow">02 · Schedule & capacity</p>
                <h2>When the doors open</h2>
              </div>
            </div>

            <div className="field-row">
              <label className="field">
                <span className="field__label">Starts</span>
                <input
                  type="datetime-local"
                  value={form.start}
                  onChange={(event) => update('start', event.target.value)}
                  aria-invalid={Boolean(errors.start)}
                />
                {errors.start && <span className="field__error">{errors.start}</span>}
              </label>
              <label className="field">
                <span className="field__label">Ends <em>optional</em></span>
                <input
                  type="datetime-local"
                  value={form.end}
                  onChange={(event) => update('end', event.target.value)}
                  aria-invalid={Boolean(errors.end)}
                />
                {errors.end && <span className="field__error">{errors.end}</span>}
              </label>
            </div>

            <div className="field-row">
              <label className="field">
                <span className="field__label">Registration opens</span>
                <input
                  type="datetime-local"
                  value={form.registrationOpens}
                  onChange={(event) => update('registrationOpens', event.target.value)}
                />
              </label>
              <label className="field">
                <span className="field__label">Registration closes</span>
                <input
                  type="datetime-local"
                  value={form.registrationCloses}
                  onChange={(event) => update('registrationCloses', event.target.value)}
                  aria-invalid={Boolean(errors.registrationCloses)}
                />
                {errors.registrationCloses && (
                  <span className="field__error">{errors.registrationCloses}</span>
                )}
              </label>
            </div>

            <div className="field-row field-row--three">
              <label className="field">
                <span className="field__label">Capacity</span>
                <input
                  type="number"
                  min="2"
                  value={form.capacity}
                  onChange={(event) => update('capacity', event.target.value)}
                  aria-invalid={Boolean(errors.capacity)}
                />
                {errors.capacity && <span className="field__error">{errors.capacity}</span>}
              </label>
              <label className="field">
                <span className="field__label">Current entrants</span>
                <input
                  type="number"
                  min="0"
                  value={form.entrants}
                  onChange={(event) => update('entrants', event.target.value)}
                  aria-invalid={Boolean(errors.entrants)}
                />
                {errors.entrants && <span className="field__error">{errors.entrants}</span>}
              </label>
              <div className="admin-occupancy">
                <span>Occupancy</span>
                <strong>{occupancy}%</strong>
                <div className="admin-occupancy__bar">
                  <span style={{ width: `${occupancy}%` }} />
                </div>
              </div>
            </div>
          </section>

          <section className="admin-panel">
            <div className="admin-panel__head">
              <div>
                <p className="eyebrow">03 · Money</p>
                <h2>Entry & prize</h2>
              </div>
              <span className="admin-panel__hint">PHP · sample values</span>
            </div>

            <div className="field-row">
              <label className="field">
                <span className="field__label">Entry fee (PHP)</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.entryFee}
                  onChange={(event) => update('entryFee', event.target.value)}
                  aria-invalid={Boolean(errors.entryFee)}
                />
                {errors.entryFee ? (
                  <span className="field__error">{errors.entryFee}</span>
                ) : (
                  <span className="field__hint">{formatCurrency(Number(form.entryFee) || 0)}</span>
                )}
              </label>
              <label className="field">
                <span className="field__label">Prize pool (PHP)</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.prize}
                  onChange={(event) => update('prize', event.target.value)}
                  aria-invalid={Boolean(errors.prize)}
                />
                {errors.prize ? (
                  <span className="field__error">{errors.prize}</span>
                ) : (
                  <span className="field__hint">{formatCurrency(Number(form.prize) || 0)}</span>
                )}
              </label>
            </div>
          </section>
        </div>

        <aside className="admin-form__aside">
          <section className="admin-panel">
            <div className="admin-panel__head">
              <div>
                <p className="eyebrow">Publishing</p>
                <h2>Visibility</h2>
              </div>
            </div>

            {existing ? (
              <>
                <div className="admin-status-note">
                  <span>Current status</span>
                  <strong>{statusLabel[existing.status]}</strong>
                  <p>Status changes live on the event detail page to keep the lifecycle valid.</p>
                </div>
                {existing.status !== 'draft' && existing.status !== 'cancelled' && (
                  <label className="admin-check">
                    <input
                      type="checkbox"
                      checked={form.published}
                      onChange={(event) => update('published', event.target.checked)}
                    />
                    <span>
                      <strong>Public listing</strong>
                      <em>Hide this event without deleting its records.</em>
                    </span>
                  </label>
                )}
              </>
            ) : (
              <>
                <label className="field">
                  <span className="field__label">Initial status</span>
                  <select
                    value={form.status}
                    onChange={(event) => {
                      const next = event.target.value as 'draft' | 'upcoming'
                      update('status', next)
                      update('published', next === 'upcoming')
                    }}
                  >
                    <option value="draft">Draft · hidden</option>
                    <option value="upcoming">Upcoming · published</option>
                  </select>
                </label>
                {form.status === 'upcoming' && (
                  <label className="admin-check">
                    <input
                      type="checkbox"
                      checked={form.published}
                      onChange={(event) => update('published', event.target.checked)}
                    />
                    <span>
                      <strong>Show on public calendar</strong>
                      <em>Players can find and register for this event.</em>
                    </span>
                  </label>
                )}
              </>
            )}

            <div className="admin-form__actions">
              <button type="submit" className="btn btn--primary">
                {existing ? 'Save changes' : 'Create event'}
              </button>
              <Link to={existing ? `/admin/events/${existing.id}` : '/admin/events'} className="btn btn--ghost">
                Cancel
              </Link>
            </div>
          </section>

          <section className="admin-panel admin-panel--muted">
            <p className="eyebrow">Demo note</p>
            <p>
              Changes save to this browser only. No event, payment or player data leaves this
              device.
            </p>
          </section>
        </aside>
      </form>
    </div>
  )
}
