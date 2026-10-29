export type GameSlug =
  | 'bayblade'
  | 'cardfight-vanguard'
  | 'cookie-run'
  | 'cyberpunk'
  | 'riftbound'
  | 'pokemon'
  | 'mtg'
  | 'flesh-and-blood'

export type TournamentStatus = 'draft' | 'upcoming' | 'live' | 'ended' | 'cancelled'

export type PublicTournamentStatus = Exclude<TournamentStatus, 'draft'>

export type TournamentFormat = 'Online' | 'Offline' | 'Hybrid'

export type PaymentMethod = 'GCash' | 'Maya' | 'Bank transfer' | 'Cash at counter'

export type PaymentStatus = 'pending' | 'verified' | 'rejected' | 'refunded'

export type RegistrationStatus = 'pending' | 'confirmed' | 'waitlisted' | 'cancelled'

export interface Game {
  slug: GameSlug
  name: string
  shortName: string
  tagline: string
  description: string
  accent: string
  accentSoft: string
  accentTwo: string
  surface: string
  variant: string
  seasonLabel: string
}

export interface Tournament {
  id: string
  title: string
  game: GameSlug
  status: TournamentStatus
  published: boolean
  start: string
  end?: string
  location: string
  format: TournamentFormat
  entrants: number
  capacity: number
  entryFee: number
  prize: number
  currency: 'PHP'
  featured?: boolean
  registrationOpens?: string
  registrationCloses?: string
  description: string
  createdAt: string
}

export interface Standing {
  place: number
  player: string
  country: string
  record: string
  points: number
}

export interface TournamentResult {
  id: string
  tournamentId: string
  name: string
  game: GameSlug
  date: string
  location: string
  format: TournamentFormat
  champion: string
  championCountry: string
  runnerUp: string
  runnerUpCountry: string
  prize: number
  summary: string
  standings: Standing[]
}

export interface LeaderboardEntry {
  id: string
  rank: number
  player: string
  team: string
  game: GameSlug
  points: number
  wins: number
  firsts: number
  seconds: number
  thirds: number
  region: string
  country: string
}

export type LeaderboardSort = 'points' | 'wins' | 'firsts'

export interface PaymentReviewEvent {
  at: string
  action: PaymentStatus
  note?: string
  actor: string
}

export interface PaymentRecord {
  method: PaymentMethod
  reference: string
  note?: string
  submittedAt: string
  status: PaymentStatus
  reviewedAt?: string
  reviewedBy?: string
  reviewNote?: string
  history: PaymentReviewEvent[]
}

export interface Registration {
  id: string
  reference: string
  tournamentId: string
  playerName: string
  email: string
  tag: string
  region: string
  entryFee: number
  registrationStatus: RegistrationStatus
  payment: PaymentRecord
  createdAt: string
  confirmedAt?: string
}
