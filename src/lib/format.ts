import type {
  PaymentStatus,
  RegistrationStatus,
  Tournament,
  TournamentStatus,
} from '../types'

const dateFormatter = new Intl.DateTimeFormat('en-PH', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
})

const shortDateFormatter = new Intl.DateTimeFormat('en-PH', {
  month: 'short',
  day: 'numeric',
})

const timeFormatter = new Intl.DateTimeFormat('en-PH', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
})

const currencyFormatter = new Intl.NumberFormat('en-PH', {
  style: 'currency',
  currency: 'PHP',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const compactCurrencyFormatter = new Intl.NumberFormat('en-PH', {
  style: 'currency',
  currency: 'PHP',
  notation: 'compact',
  maximumFractionDigits: 1,
})

export const formatDate = (iso: string): string => dateFormatter.format(new Date(iso))

export const formatShortDate = (iso: string): string => shortDateFormatter.format(new Date(iso))

export const formatTime = (iso: string): string => timeFormatter.format(new Date(iso))

export const formatDateTime = (iso: string): string => `${formatShortDate(iso)} · ${formatTime(iso)}`

export const formatCurrency = (value: number): string => currencyFormatter.format(value)

export const formatCompactCurrency = (value: number): string =>
  compactCurrencyFormatter.format(value)

export const formatNumber = (value: number): string =>
  new Intl.NumberFormat('en-PH').format(value)

export const statusLabel: Record<TournamentStatus, string> = {
  draft: 'DRAFT',
  live: 'LIVE',
  upcoming: 'UPCOMING',
  ended: 'ENDED',
  cancelled: 'CANCELLED',
}

export const paymentStatusLabel: Record<PaymentStatus, string> = {
  pending: 'PENDING VERIFICATION',
  verified: 'VERIFIED',
  rejected: 'REJECTED',
  refunded: 'REFUNDED',
}

export const registrationStatusLabel: Record<RegistrationStatus, string> = {
  pending: 'PENDING',
  confirmed: 'CONFIRMED',
  waitlisted: 'WAITLISTED',
  cancelled: 'CANCELLED',
}

export const flagEmoji = (countryCode: string): string =>
  countryCode
    .toUpperCase()
    .replace(/[^A-Z]/g, '')
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)))

const statusOrder: Record<TournamentStatus, number> = {
  live: 0,
  upcoming: 1,
  ended: 2,
  cancelled: 3,
  draft: 4,
}

export const sortTournaments = (items: Tournament[]): Tournament[] =>
  [...items].sort((a, b) => {
    if (statusOrder[a.status] !== statusOrder[b.status]) {
      return statusOrder[a.status] - statusOrder[b.status]
    }
    if (a.status === 'ended') {
      return new Date(b.start).getTime() - new Date(a.start).getTime()
    }
    return new Date(a.start).getTime() - new Date(b.start).getTime()
  })

export const cx = (...values: Array<string | false | null | undefined>): string =>
  values.filter(Boolean).join(' ')

export const matchesQuery = (tournament: Tournament, query: string): boolean => {
  const needle = query.trim().toLowerCase()
  if (!needle) return true
  return [tournament.title, tournament.game, tournament.location, tournament.format]
    .join(' ')
    .toLowerCase()
    .includes(needle)
}
