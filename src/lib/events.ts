import type { PublicTournamentStatus, Tournament, TournamentStatus } from '../types'

export const isPublicTournament = (tournament: Tournament): boolean =>
  tournament.published && tournament.status !== 'draft'

export const isRegistrationOpen = (tournament: Tournament, now = new Date()): boolean => {
  if (!tournament.published || tournament.status !== 'upcoming') return false
  if (tournament.entrants >= tournament.capacity) return false
  if (tournament.registrationOpens && now < new Date(tournament.registrationOpens)) return false
  if (tournament.registrationCloses && now > new Date(tournament.registrationCloses)) return false
  return now < new Date(tournament.start)
}

export const registrationStatusMessage = (tournament: Tournament): string => {
  if (tournament.status === 'cancelled') return 'Event cancelled'
  if (tournament.status === 'ended') return 'Event concluded'
  if (tournament.status === 'live') return 'Event in progress'
  if (tournament.entrants >= tournament.capacity) return 'Field full'
  if (isRegistrationOpen(tournament)) return 'Registration open'
  return 'Registration closed'
}

export const publicStatusValues: PublicTournamentStatus[] = [
  'live',
  'upcoming',
  'ended',
  'cancelled',
]

export const statusTransitions: Record<TournamentStatus, TournamentStatus[]> = {
  draft: ['upcoming'],
  upcoming: ['live', 'cancelled'],
  live: ['ended', 'cancelled'],
  ended: [],
  cancelled: [],
}

export const canTransition = (from: TournamentStatus, to: TournamentStatus): boolean =>
  statusTransitions[from].includes(to)

export const transitionLabel = (to: TournamentStatus): string => {
  if (to === 'upcoming') return 'Publish event'
  if (to === 'live') return 'Start event'
  if (to === 'ended') return 'Mark completed'
  if (to === 'cancelled') return 'Cancel event'
  return 'Move to draft'
}

export const tournamentAction = (
  tournament: Tournament,
  hasResult: boolean,
): { label: string; kind: 'details' | 'register' | 'results' } => {
  if (tournament.status === 'ended' && hasResult) return { label: 'SEE RESULTS', kind: 'results' }
  if (isRegistrationOpen(tournament)) return { label: 'REGISTER', kind: 'register' }
  if (tournament.status === 'live') return { label: 'VIEW EVENT', kind: 'details' }
  return { label: 'VIEW DETAILS', kind: 'details' }
}

export const makeId = (prefix: string): string =>
  `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`

export const makeReference = (): string =>
  `DKO-${Math.random().toString(36).slice(2, 8).toUpperCase()}`
