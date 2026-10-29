import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import type {
  PaymentMethod,
  PaymentStatus,
  Registration,
  RegistrationStatus,
  Tournament,
  TournamentStatus,
} from '../types'
import { tournaments as seedTournaments } from '../data/tournaments'
import { seedRegistrations } from '../data/registrations'
import { canTransition, isRegistrationOpen, makeId, makeReference } from '../lib/events'

const STORAGE_KEY = 'deckout-demo-store-v1'
const LEGACY_FAVORITES_KEY = 'zyrus-saved-tournaments-v1'
const ADMIN_SESSION_KEY = 'deckout-admin-session-v1'
const ADMIN_EMAIL = 'admin@deckout.cafe'
const ADMIN_PASSWORD = 'deckout2026'

interface DemoStore {
  version: 1
  tournaments: Tournament[]
  registrations: Registration[]
  favorites: string[]
}

export interface RegistrationInput {
  tournamentId: string
  name: string
  email: string
  tag: string
  region: string
  method: PaymentMethod
  reference: string
  note?: string
}

export interface ActionResult {
  ok: boolean
  error?: string
  registration?: Registration
}

interface AppContextValue {
  tournaments: Tournament[]
  registrations: Registration[]
  favorites: string[]
  isAdmin: boolean
  isFavorite: (id: string) => boolean
  toggleFavorite: (id: string) => void
  registerForTournament: (input: RegistrationInput) => ActionResult
  addTournament: (tournament: Omit<Tournament, 'id' | 'createdAt'>) => string
  updateTournament: (id: string, patch: Partial<Tournament>) => void
  setTournamentStatus: (id: string, status: TournamentStatus) => ActionResult
  unpublishTournament: (id: string) => ActionResult
  deleteTournament: (id: string) => ActionResult
  reviewPayment: (registrationId: string, status: PaymentStatus, note: string) => ActionResult
  setRegistrationStatus: (
    registrationId: string,
    status: RegistrationStatus,
  ) => ActionResult
  login: (email: string, password: string) => boolean
  logout: () => void
  resetDemoData: () => void
}

const AppContext = createContext<AppContextValue | null>(null)

const copySeedTournaments = (): Tournament[] =>
  seedTournaments.map((tournament) => ({ ...tournament }))

const copySeedRegistrations = (): Registration[] =>
  seedRegistrations.map((registration) => ({
    ...registration,
    payment: {
      ...registration.payment,
      history: registration.payment.history.map((entry) => ({ ...entry })),
    },
  }))

const readLegacyFavorites = (): string[] => {
  try {
    const raw = window.localStorage.getItem(LEGACY_FAVORITES_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === 'string')
      : []
  } catch {
    return []
  }
}

const initialStore = (): DemoStore => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed: unknown = JSON.parse(raw)
      if (
        parsed &&
        typeof parsed === 'object' &&
        'tournaments' in parsed &&
        'registrations' in parsed &&
        'favorites' in parsed
      ) {
        const store = parsed as DemoStore
        if (Array.isArray(store.tournaments) && Array.isArray(store.registrations)) {
          return {
            version: 1,
            tournaments: store.tournaments,
            registrations: store.registrations,
            favorites: Array.isArray(store.favorites) ? store.favorites : [],
          }
        }
      }
    }
  } catch {
    // Fall back to seed data if storage is malformed or unavailable.
  }
  return {
    version: 1,
    tournaments: copySeedTournaments(),
    registrations: copySeedRegistrations(),
    favorites: readLegacyFavorites(),
  }
}

const readAdminSession = (): boolean => {
  try {
    return window.sessionStorage.getItem(ADMIN_SESSION_KEY) === 'active'
  } catch {
    return false
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [store, setStore] = useState<DemoStore>(initialStore)
  const storeRef = useRef(store)
  const [isAdmin, setIsAdmin] = useState(readAdminSession)

  const commit = useCallback((next: DemoStore) => {
    storeRef.current = next
    setStore(next)
  }, [])

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
    } catch {
      // Demo data stays in memory when storage is unavailable.
    }
  }, [store])

  const toggleFavorite = useCallback(
    (id: string) => {
      const current = storeRef.current
      commit({
        ...current,
        favorites: current.favorites.includes(id)
          ? current.favorites.filter((item) => item !== id)
          : [...current.favorites, id],
      })
    },
    [commit],
  )

  const registerForTournament = useCallback(
    (input: RegistrationInput): ActionResult => {
      const current = storeRef.current
      const tournament = current.tournaments.find((item) => item.id === input.tournamentId)
      if (!tournament) return { ok: false, error: 'This event no longer exists.' }
      if (!isRegistrationOpen(tournament)) {
        return { ok: false, error: 'Registration is not open for this event.' }
      }
      const duplicate = current.registrations.some(
        (registration) =>
          registration.tournamentId === tournament.id &&
          registration.email.toLowerCase() === input.email.trim().toLowerCase() &&
          registration.registrationStatus !== 'cancelled',
      )
      if (duplicate) {
        return { ok: false, error: 'This email is already registered for the event.' }
      }
      const now = new Date().toISOString()
      const registration: Registration = {
        id: makeId('reg'),
        reference: makeReference(),
        tournamentId: tournament.id,
        playerName: input.name.trim(),
        email: input.email.trim(),
        tag: input.tag.trim().toUpperCase(),
        region: input.region,
        entryFee: tournament.entryFee,
        registrationStatus: 'pending',
        payment: {
          method: input.method,
          reference: input.reference.trim(),
          note: input.note?.trim() || undefined,
          submittedAt: now,
          status: 'pending',
          history: [
            {
              at: now,
              action: 'pending',
              actor: 'Player',
              note: 'Payment reference submitted through the demo checkout.',
            },
          ],
        },
        createdAt: now,
      }
      commit({
        ...current,
        registrations: [registration, ...current.registrations],
        tournaments: current.tournaments.map((item) =>
          item.id === tournament.id ? { ...item, entrants: item.entrants + 1 } : item,
        ),
      })
      return { ok: true, registration }
    },
    [commit],
  )

  const addTournament = useCallback(
    (tournament: Omit<Tournament, 'id' | 'createdAt'>): string => {
      const current = storeRef.current
      const id = makeId('evt')
      commit({
        ...current,
        tournaments: [
          {
            ...tournament,
            id,
            createdAt: new Date().toISOString(),
          },
          ...current.tournaments,
        ],
      })
      return id
    },
    [commit],
  )

  const updateTournament = useCallback(
    (id: string, patch: Partial<Tournament>) => {
      const current = storeRef.current
      commit({
        ...current,
        tournaments: current.tournaments.map((tournament) =>
          tournament.id === id ? { ...tournament, ...patch, id } : tournament,
        ),
      })
    },
    [commit],
  )

  const setTournamentStatus = useCallback(
    (id: string, status: TournamentStatus): ActionResult => {
      const current = storeRef.current
      const tournament = current.tournaments.find((item) => item.id === id)
      if (!tournament) return { ok: false, error: 'This event no longer exists.' }
      if (!canTransition(tournament.status, status)) {
        return { ok: false, error: 'That status change is not allowed.' }
      }
      commit({
        ...current,
        tournaments: current.tournaments.map((item) =>
          item.id === id
            ? {
                ...item,
                status,
                published: status === 'draft' ? false : true,
              }
            : item,
        ),
      })
      return { ok: true }
    },
    [commit],
  )

  const unpublishTournament = useCallback(
    (id: string): ActionResult => {
      const current = storeRef.current
      const tournament = current.tournaments.find((item) => item.id === id)
      if (!tournament || tournament.status === 'ended' || tournament.status === 'cancelled') {
        return { ok: false, error: 'Unable to unpublish this event.' }
      }
      const registrations = current.registrations.filter(
        (registration) =>
          registration.tournamentId === id && registration.registrationStatus !== 'cancelled',
      )
      if (registrations.length > 0) {
        return {
          ok: false,
          error: 'Cancel or remove active registrations before returning this event to draft.',
        }
      }
      commit({
        ...current,
        tournaments: current.tournaments.map((item) =>
          item.id === id ? { ...item, status: 'draft', published: false } : item,
        ),
      })
      return { ok: true }
    },
    [commit],
  )

  const deleteTournament = useCallback(
    (id: string): ActionResult => {
      const current = storeRef.current
      const hasRegistrations = current.registrations.some(
        (registration) => registration.tournamentId === id,
      )
      if (hasRegistrations) {
        return {
          ok: false,
          error: 'This event has registration history and cannot be deleted.',
        }
      }
      commit({
        ...current,
        tournaments: current.tournaments.filter((tournament) => tournament.id !== id),
        favorites: current.favorites.filter((favorite) => favorite !== id),
      })
      return { ok: true }
    },
    [commit],
  )

  const reviewPayment = useCallback(
    (registrationId: string, status: PaymentStatus, note: string): ActionResult => {
      const current = storeRef.current
      const registration = current.registrations.find((item) => item.id === registrationId)
      if (!registration) return { ok: false, error: 'Registration not found.' }
      const tournament = current.tournaments.find(
        (item) => item.id === registration.tournamentId,
      )
      if (!tournament) return { ok: false, error: 'This event no longer exists.' }
      const allowed: Record<PaymentStatus, PaymentStatus[]> = {
        pending: ['verified', 'rejected'],
        verified: ['refunded'],
        rejected: [],
        refunded: [],
      }
      if (!allowed[registration.payment.status].includes(status)) {
        return { ok: false, error: 'That payment action is not allowed.' }
      }

      const now = new Date().toISOString()
      let registrationStatus = registration.registrationStatus
      let entrants = tournament.entrants

      if (status === 'verified') {
        const eventEligible = tournament.status === 'upcoming' || tournament.status === 'live'
        registrationStatus =
          eventEligible && tournament.entrants <= tournament.capacity ? 'confirmed' : 'waitlisted'
      }
      if (status === 'refunded') {
        if (registration.registrationStatus !== 'cancelled') {
          entrants = Math.max(0, entrants - 1)
        }
        registrationStatus = 'cancelled'
      }

      const payload = note.trim()
      commit({
        ...current,
        registrations: current.registrations.map((item) =>
          item.id === registrationId
            ? {
                ...item,
                registrationStatus,
                confirmedAt: registrationStatus === 'confirmed' ? now : item.confirmedAt,
                payment: {
                  ...item.payment,
                  status,
                  reviewedAt: now,
                  reviewedBy: 'Deckout Admin',
                  reviewNote: payload || undefined,
                  history: [
                    ...item.payment.history,
                    {
                      at: now,
                      action: status,
                      note: payload || undefined,
                      actor: 'Deckout Admin',
                    },
                  ],
                },
              }
            : item,
        ),
        tournaments: current.tournaments.map((item) =>
          item.id === tournament.id ? { ...item, entrants } : item,
        ),
      })
      return { ok: true }
    },
    [commit],
  )

  const setRegistrationStatus = useCallback(
    (registrationId: string, status: RegistrationStatus): ActionResult => {
      const current = storeRef.current
      const registration = current.registrations.find((item) => item.id === registrationId)
      if (!registration) return { ok: false, error: 'Registration not found.' }
      const tournament = current.tournaments.find(
        (item) => item.id === registration.tournamentId,
      )
      if (!tournament) return { ok: false, error: 'This event no longer exists.' }
      if (status === 'confirmed' && registration.payment.status !== 'verified') {
        return { ok: false, error: 'Verify the payment before confirming this player.' }
      }
      if (
        status === 'confirmed' &&
        registration.registrationStatus !== 'confirmed' &&
        tournament.entrants > tournament.capacity
      ) {
        return { ok: false, error: 'The field is full. Use the waitlist instead.' }
      }
      let entrants = tournament.entrants
      if (status === 'cancelled' && registration.registrationStatus !== 'cancelled') {
        entrants = Math.max(0, entrants - 1)
      }
      if (
        registration.registrationStatus === 'cancelled' &&
        status !== 'cancelled' &&
        tournament.entrants < tournament.capacity
      ) {
        entrants += 1
      }
      const now = new Date().toISOString()
      commit({
        ...current,
        registrations: current.registrations.map((item) =>
          item.id === registrationId
            ? {
                ...item,
                registrationStatus: status,
                confirmedAt: status === 'confirmed' ? now : item.confirmedAt,
              }
            : item,
        ),
        tournaments: current.tournaments.map((item) =>
          item.id === tournament.id ? { ...item, entrants } : item,
        ),
      })
      return { ok: true }
    },
    [commit],
  )

  const login = useCallback((email: string, password: string): boolean => {
    const valid =
      email.trim().toLowerCase() === ADMIN_EMAIL && password === ADMIN_PASSWORD
    if (valid) {
      setIsAdmin(true)
      try {
        window.sessionStorage.setItem(ADMIN_SESSION_KEY, 'active')
      } catch {
        // Session remains in memory when session storage is unavailable.
      }
    }
    return valid
  }, [])

  const logout = useCallback(() => {
    setIsAdmin(false)
    try {
      window.sessionStorage.removeItem(ADMIN_SESSION_KEY)
    } catch {
      // Nothing else to clear.
    }
  }, [])

  const resetDemoData = useCallback(() => {
    storeRef.current = {
      version: 1,
      tournaments: copySeedTournaments(),
      registrations: copySeedRegistrations(),
      favorites: [],
    }
    setStore(storeRef.current)
  }, [])

  const value = useMemo<AppContextValue>(
    () => ({
      tournaments: store.tournaments,
      registrations: store.registrations,
      favorites: store.favorites,
      isAdmin,
      isFavorite: (id: string) => store.favorites.includes(id),
      toggleFavorite,
      registerForTournament,
      addTournament,
      updateTournament,
      setTournamentStatus,
      unpublishTournament,
      deleteTournament,
      reviewPayment,
      setRegistrationStatus,
      login,
      logout,
      resetDemoData,
    }),
    [
      store,
      isAdmin,
      toggleFavorite,
      registerForTournament,
      addTournament,
      updateTournament,
      setTournamentStatus,
      unpublishTournament,
      deleteTournament,
      reviewPayment,
      setRegistrationStatus,
      login,
      logout,
      resetDemoData,
    ],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppContextValue {
  const context = useContext(AppContext)
  if (!context) throw new Error('useApp must be used inside AppProvider')
  return context
}
