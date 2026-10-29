import { Link } from 'react-router-dom'
import { usePageTitle } from '../hooks/usePageTitle'

export function NotFoundPage() {
  usePageTitle('Page not found')

  return (
    <section className="notfound">
      <div className="container notfound__inner">
        <p className="eyebrow">
          <span className="eyebrow__bar" aria-hidden="true" />
          Off the bracket
        </p>
        <h1>404</h1>
        <h2>This page has been eliminated.</h2>
        <p>The circuit you’re looking for doesn’t exist — or the link has already wrapped up.</p>
        <div className="notfound__actions">
          <Link to="/" className="btn btn--primary">
            Back to home
          </Link>
          <Link to="/games" className="btn btn--ghost">
            Browse games
          </Link>
        </div>
      </div>
    </section>
  )
}
