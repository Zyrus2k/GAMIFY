import { useState, type FormEvent } from 'react'
import type { PaymentMethod, Registration, Tournament } from '../types'
import { formatCurrency, formatDateTime } from '../lib/format'
import { useApp } from '../context/AppContext'

type FormState = {
  name: string
  email: string
  tag: string
  region: string
  method: PaymentMethod
  reference: string
  note: string
  consent: boolean
}

const initialForm: FormState = {
  name: '',
  email: '',
  tag: '',
  region: '',
  method: 'GCash',
  reference: '',
  note: '',
  consent: false,
}

const regions = [
  'Metro Manila',
  'Cebu',
  'Davao',
  'Pampanga',
  'Baguio',
  'Iloilo',
  'Cavite',
  'Laguna',
  'Other PH region',
]

const paymentMethods: PaymentMethod[] = ['GCash', 'Maya', 'Bank transfer', 'Cash at counter']

export function RegistrationForm({
  tournament,
  onClose,
}: {
  tournament: Tournament
  onClose: () => void
}) {
  const { registerForTournament } = useApp()
  const [form, setForm] = useState<FormState>(initialForm)
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})
  const [status, setStatus] = useState<'idle' | 'submitting'>('idle')
  const [submitError, setSubmitError] = useState('')
  const [registration, setRegistration] = useState<Registration | null>(null)

  const update = <Key extends keyof FormState>(key: Key, value: FormState[Key]) => {
    setForm((current) => ({ ...current, [key]: value }))
    setErrors((current) => ({ ...current, [key]: undefined }))
    setSubmitError('')
  }

  const validate = (): boolean => {
    const next: Partial<Record<keyof FormState, string>> = {}
    if (form.name.trim().length < 2) next.name = 'Enter your full name.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) {
      next.email = 'Enter a valid email address.'
    }
    if (form.tag.trim().length < 3) next.tag = 'Gamer tag must be at least 3 characters.'
    if (!form.region) next.region = 'Choose your region.'
    if (form.reference.trim().length < 5) {
      next.reference = 'Enter the reference number from your payment.'
    }
    if (!form.consent) next.consent = 'Confirm that you understand this is a demo entry.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (!validate()) return
    setStatus('submitting')
    const result = registerForTournament({
      tournamentId: tournament.id,
      name: form.name,
      email: form.email,
      tag: form.tag,
      region: form.region,
      method: form.method,
      reference: form.reference,
      note: form.note,
    })
    setStatus('idle')
    if (!result.ok || !result.registration) {
      setSubmitError(result.error ?? 'Unable to save this registration.')
      return
    }
    setRegistration(result.registration)
  }

  if (registration) {
    return (
      <div className="reg-success" role="status">
        <div className="reg-success__mark" aria-hidden="true">
          <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
            <path d="M5 13.5 10.5 19 21 7.5" stroke="currentColor" strokeWidth="2" />
          </svg>
        </div>
        <p className="eyebrow">Entry submitted · payment pending</p>
        <h3>Seat requested, {form.name.trim().split(' ')[0]}.</h3>
        <p className="reg-success__copy">
          Your demo entry for <strong>{tournament.title}</strong> is in the Admin review queue. A
          staff member would normally verify the reference before confirming your seat.
        </p>
        <div className="reg-success__code">
          <span>Registration reference</span>
          <strong>{registration.reference}</strong>
        </div>
        <dl className="reg-success__facts">
          <div>
            <dt>Event</dt>
            <dd>{tournament.title}</dd>
          </div>
          <div>
            <dt>Date</dt>
            <dd>{formatDateTime(tournament.start)}</dd>
          </div>
          <div>
            <dt>Entry fee</dt>
            <dd>{formatCurrency(registration.entryFee)}</dd>
          </div>
          <div>
            <dt>Payment</dt>
            <dd>
              {registration.payment.method} · pending review
            </dd>
          </div>
        </dl>
        <div className="reg-note">
          <strong>Demo only</strong>
          <span>No money was taken. This record is stored in your browser.</span>
        </div>
        <button type="button" className="btn btn--primary" onClick={onClose}>
          Back to events
        </button>
      </div>
    )
  }

  return (
    <form className="reg-form" onSubmit={submit} noValidate>
      <div className="reg-form__banner">
        <div>
          <span>Registering for</span>
          <strong>{tournament.title}</strong>
        </div>
        <div className="reg-form__banner-meta">
          <span>{formatDateTime(tournament.start)}</span>
          <span>
            {tournament.location} · {formatCurrency(tournament.entryFee)} entry
          </span>
        </div>
      </div>

      <div className="field-row">
        <label className="field">
          <span className="field__label">Full name</span>
          <input
            type="text"
            value={form.name}
            onChange={(event) => update('name', event.target.value)}
            aria-invalid={Boolean(errors.name)}
            autoComplete="name"
            placeholder="Mika Reyes"
          />
          {errors.name && <span className="field__error">{errors.name}</span>}
        </label>
        <label className="field">
          <span className="field__label">Email address</span>
          <input
            type="email"
            value={form.email}
            onChange={(event) => update('email', event.target.value)}
            aria-invalid={Boolean(errors.email)}
            autoComplete="email"
            placeholder="mika@example.com"
          />
          {errors.email && <span className="field__error">{errors.email}</span>}
        </label>
      </div>

      <div className="field-row">
        <label className="field">
          <span className="field__label">Gamer tag</span>
          <input
            type="text"
            value={form.tag}
            onChange={(event) => update('tag', event.target.value)}
            aria-invalid={Boolean(errors.tag)}
            placeholder="SPINSTAR"
          />
          {errors.tag && <span className="field__error">{errors.tag}</span>}
        </label>
        <label className="field">
          <span className="field__label">Region</span>
          <select
            value={form.region}
            onChange={(event) => update('region', event.target.value)}
            aria-invalid={Boolean(errors.region)}
          >
            <option value="">Select region</option>
            {regions.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
          {errors.region && <span className="field__error">{errors.region}</span>}
        </label>
      </div>

      <div className="reg-form__section">
        <div>
          <p className="eyebrow">Payment details</p>
          <p className="reg-form__section-copy">
            Submit a reference for the demo amount of {formatCurrency(tournament.entryFee)}. No
            payment is processed or validated by a real provider.
          </p>
        </div>
        <span className="reg-form__amount">{formatCurrency(tournament.entryFee)}</span>
      </div>

      <div className="field-row">
        <label className="field">
          <span className="field__label">Payment method</span>
          <select
            value={form.method}
            onChange={(event) => update('method', event.target.value as PaymentMethod)}
          >
            {paymentMethods.map((method) => (
              <option key={method} value={method}>
                {method}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          <span className="field__label">Reference number</span>
          <input
            type="text"
            value={form.reference}
            onChange={(event) => update('reference', event.target.value)}
            aria-invalid={Boolean(errors.reference)}
            placeholder="GC-8842190"
          />
          {errors.reference && <span className="field__error">{errors.reference}</span>}
        </label>
      </div>

      <label className="field">
        <span className="field__label">Payment note <em>optional</em></span>
        <textarea
          rows={3}
          value={form.note}
          onChange={(event) => update('note', event.target.value)}
          placeholder="Anything the counter team should know about this payment."
        />
      </label>

      <label className={`check-field ${errors.consent ? 'has-error' : ''}`}>
        <input
          type="checkbox"
          checked={form.consent}
          onChange={(event) => update('consent', event.target.checked)}
        />
        <span>
          I understand this is a frontend demo. No details are sent to a real organiser, no money is
          taken, and my entry will wait in the local Admin review queue.
        </span>
      </label>
      {errors.consent && <span className="field__error">{errors.consent}</span>}
      {submitError && (
        <p className="form-error" role="alert">
          {submitError}
        </p>
      )}

      <div className="reg-note">
        <strong>Demo flow</strong>
        <span>Submitting stores a local registration and payment record in this browser only.</span>
      </div>

      <div className="modal-actions">
        <button type="button" className="btn btn--ghost" onClick={onClose}>
          Cancel
        </button>
        <button type="submit" className="btn btn--primary" disabled={status === 'submitting'}>
          {status === 'submitting' ? 'Submitting entry…' : `Submit entry · ${formatCurrency(tournament.entryFee)}`}
        </button>
      </div>
    </form>
  )
}
