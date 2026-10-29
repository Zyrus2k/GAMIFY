import { useState, type FormEvent } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { BrandLogo } from '../../components/BrandLogo'
import { useApp } from '../../context/AppContext'
import { usePageTitle } from '../../hooks/usePageTitle'

export function AdminLoginPage() {
  usePageTitle('Staff access')
  const { isAdmin, login } = useApp()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  if (isAdmin) return <Navigate to="/admin" replace />

  const destination =
    (location.state as { from?: string } | null)?.from ?? '/admin'

  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (!login(email, password)) {
      setError('Those demo credentials do not match. Use the account shown below.')
      return
    }
    navigate(destination, { replace: true })
  }

  return (
    <main id="main" className="admin-login">
      <div className="admin-login__brand">
        <Link to="/" aria-label="Deckout Cafe home">
          <BrandLogo />
        </Link>
        <span>STAFF WORKSPACE · DEMO</span>
      </div>

      <div className="admin-login__grid">
        <section className="admin-login__panel">
          <p className="eyebrow">Front desk access</p>
          <h1>
            Run the room.
            <br />
            <span>Keep the meta moving.</span>
          </h1>
          <p className="admin-login__lede">
            Manage the event calendar, publish tournament nights and verify entry payments from one
            focused workspace.
          </p>

          <form className="admin-login__form" onSubmit={submit}>
            <label className="field">
              <span className="field__label">Email</span>
              <input
                type="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value)
                  setError('')
                }}
                autoComplete="username"
                placeholder="admin@deckout.cafe"
              />
            </label>
            <label className="field">
              <span className="field__label">Password</span>
              <input
                type="password"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value)
                  setError('')
                }}
                autoComplete="current-password"
                placeholder="Enter demo password"
              />
            </label>
            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}
            <button type="submit" className="btn btn--primary">
              Enter workspace
              <span className="btn__arrow" aria-hidden="true">
                →
              </span>
            </button>
          </form>

          <div className="admin-login__credentials">
            <span>Demo credentials</span>
            <code>admin@deckout.cafe</code>
            <code>deckout2026</code>
          </div>

          <Link to="/" className="admin-login__back">
            ← Return to the public site
          </Link>
        </section>

        <aside className="admin-login__visual">
          <div className="admin-login__visual-inner">
            <span className="admin-login__number">07</span>
            <p className="eyebrow">Tonight at the cafe</p>
            <h2>Doors open at six. The queue starts earlier.</h2>
            <div className="admin-login__board">
              <div>
                <span>EVENTS LIVE</span>
                <strong>01</strong>
              </div>
              <div>
                <span>PAYMENTS TO REVIEW</span>
                <strong>02</strong>
              </div>
              <div>
                <span>SEASON</span>
                <strong>2026</strong>
              </div>
            </div>
            <p className="admin-login__note">
              This workspace is a local demo. Credentials and operations are not connected to a
              real authentication or payment service.
            </p>
          </div>
        </aside>
      </div>
    </main>
  )
}
