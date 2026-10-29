import { Link } from 'react-router-dom'
import { games } from '../data/games'
import { BrandLogo } from './BrandLogo'

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link to="/" className="brand" aria-label="Deckout Cafe home">
              <BrandLogo footer />
            </Link>
            <p>
              A neighborhood gaming cafe and tournament club for players who take every turn
              seriously. Good tables, better coffee, and a front-row seat to the local meta.
            </p>
            <span className="footer-badge">Demo club · sample events</span>
          </div>

          <nav className="footer-col" aria-label="Explore">
            <h3>Explore</h3>
            <Link to="/">Home</Link>
            <Link to="/games">All Games</Link>
            <Link to="/tournaments">Tournaments</Link>
            <Link to="/rankings">Rankings</Link>
            <Link to="/results">Results</Link>
            <Link to="/admin/login">Staff access</Link>
          </nav>

          <nav className="footer-col" aria-label="Game categories">
            <h3>Circuits</h3>
            {games.map((game) => (
              <Link key={game.slug} to={`/games/${game.slug}`}>
                {game.shortName}
              </Link>
            ))}
          </nav>

          <div className="footer-col footer-col--community">
            <h3>Community</h3>
            <span className="footer-soon">Discord <em>Soon</em></span>
            <span className="footer-soon">Twitch <em>Soon</em></span>
            <span className="footer-soon">X / Twitter <em>Soon</em></span>
            <span className="footer-soon">YouTube <em>Soon</em></span>
            <p className="footer-col__note">
              Social channels are placeholders in this concept and are not connected.
            </p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 DECKOUT CAFE. A fictional club concept. All rights reserved.</p>
          <p>
            Not affiliated with or endorsed by any game publisher. All game names and trademarks
            belong to their respective owners. Event, prize and ranking data is invented for
            demonstration.
          </p>
        </div>
      </div>
    </footer>
  )
}

