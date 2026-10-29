import { games } from '../data/games'
import { GameCategoryCard } from './GameCategoryCard'
import { SectionHeader } from './ui/SectionHeader'
import { ArrowLink } from './ui/EmptyState'

export function GameCategorySection({ compact = false }: { compact?: boolean }) {
  return (
    <section className="section section--categories" id="games">
      <div className="container">
        <SectionHeader
          kicker="The circuit"
          title="Choose your arena"
          description="Eight game systems, each with its own rules, rhythm and competitive culture. Pick a circuit to see its events, champions and standings."
          action={<ArrowLink to="/games" label="Browse all games" />}
        />

        <div className="category-grid">
          {games.map((game, index) => (
            <GameCategoryCard key={game.slug} game={game} index={index} detailed={!compact} />
          ))}
        </div>
      </div>
    </section>
  )
}
