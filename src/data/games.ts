import type { Game, GameSlug } from '../types'

export const games: Game[] = [
  {
    slug: 'bayblade',
    name: 'BAYBLADE',
    shortName: 'Bayblade',
    tagline: 'Spin-out arena circuit',
    description:
      'High-velocity top battles decided by launch precision, stamina and pure impact. The Deckout arena circuit runs open brackets through to the Steel Storm finals.',
    accent: '#ff5b1f',
    accentSoft: 'rgba(255, 91, 31, 0.14)',
    accentTwo: '#56e0ff',
    surface: '#141312',
    variant: 'bayblade',
    seasonLabel: 'ARENA SERIES 05',
  },
  {
    slug: 'cardfight-vanguard',
    name: 'CARD-FIGHT VANGUARD',
    shortName: 'Cardfight Vanguard',
    tagline: 'Tactical card-battle league',
    description:
      'Layered strategy, disciplined pacing and late-game reversals. A tactical circuit built for players who plan three turns ahead.',
    accent: '#8b7bff',
    accentSoft: 'rgba(139, 123, 255, 0.14)',
    accentTwo: '#c9d2ff',
    surface: '#111219',
    variant: 'cardfight',
    seasonLabel: 'SKYBOUND LEAGUE',
  },
  {
    slug: 'cookie-run',
    name: 'COOKIE RUN',
    shortName: 'Cookie Run',
    tagline: 'Sugar rush showdowns',
    description:
      'Fast, bright and wildly unpredictable. Cookie Run events mix quick rounds, playful drafting and a crowd that never sits still.',
    accent: '#ff7bac',
    accentSoft: 'rgba(255, 123, 172, 0.16)',
    accentTwo: '#8ef2cc',
    surface: '#191216',
    variant: 'cookie',
    seasonLabel: 'CANDY CUP TOUR',
  },
  {
    slug: 'cyberpunk',
    name: 'CYBERPUNK',
    shortName: 'Cyberpunk',
    tagline: 'Neon district protocol',
    description:
      'High-tech duels under neon pressure. Rigged decks, chrome tempo and sudden-death protocols define the Night City competitive scene.',
    accent: '#d8ff3e',
    accentSoft: 'rgba(216, 255, 62, 0.12)',
    accentTwo: '#ff3ea5',
    surface: '#0c0e0d',
    variant: 'cyberpunk',
    seasonLabel: 'NIGHT PROTOCOL',
  },
  {
    slug: 'riftbound',
    name: 'RIFTBOUND',
    shortName: 'Riftbound',
    tagline: 'Arcane arena trials',
    description:
      'Fantasy factions clash across contested ley lines. Riftbound rewards bold tempo plays, resource control and a little arcane intuition.',
    accent: '#3fe0b0',
    accentSoft: 'rgba(63, 224, 176, 0.13)',
    accentTwo: '#a78bfa',
    surface: '#0e1513',
    variant: 'riftbound',
    seasonLabel: 'LEYLINE SEASON',
  },
  {
    slug: 'pokemon',
    name: 'POKEMON',
    shortName: 'Pokemon',
    tagline: 'Collector circuit finals',
    description:
      'Bright frames, fast turns and a fiercely welcoming scene. Trainer battles scale from local league nights to the Volt League finals.',
    accent: '#ffd23f',
    accentSoft: 'rgba(255, 210, 63, 0.14)',
    accentTwo: '#ff5d5d',
    surface: '#17140d',
    variant: 'pokemon',
    seasonLabel: 'VOLT LEAGUE 26',
  },
  {
    slug: 'mtg',
    name: 'MAGIC THE GATHERING',
    shortName: 'Magic: The Gathering',
    tagline: 'The gold vault circuit',
    description:
      'A mature, precision-driven competitive scene. Deep card pools, elegant lines of play and a championship series built on consistency.',
    accent: '#d8b46a',
    accentSoft: 'rgba(216, 180, 106, 0.14)',
    accentTwo: '#9d8cff',
    surface: '#15120f',
    variant: 'mtg',
    seasonLabel: 'GOLD VAULT SERIES',
  },
  {
    slug: 'flesh-and-blood',
    name: 'FLESH AND BLOOD',
    shortName: 'Flesh and Blood',
    tagline: 'High-stakes combat league',
    description:
      'Every turn is a trade. Deep red accents, brutal tempo and a premier circuit where one read can decide the entire match.',
    accent: '#e02c3d',
    accentSoft: 'rgba(224, 44, 61, 0.15)',
    accentTwo: '#c7b7a3',
    surface: '#170e0f',
    variant: 'flesh',
    seasonLabel: 'CRIMSON CIRCUIT',
  },
]

export const gameBySlug = (slug: string): Game | undefined =>
  games.find((game) => game.slug === slug)

export const gameName = (slug: GameSlug): string =>
  gameBySlug(slug)?.shortName ?? slug
