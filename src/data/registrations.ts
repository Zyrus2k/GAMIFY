import type { PaymentMethod, PaymentStatus, Registration, RegistrationStatus } from '../types'

const payment = (
  method: PaymentMethod,
  reference: string,
  status: PaymentStatus,
  submittedAt: string,
  note?: string,
): Registration['payment'] => {
  const history = [
    {
      at: submittedAt,
      action: 'pending' as PaymentStatus,
      note: 'Payment proof submitted through the demo checkout.',
      actor: 'Player',
    },
  ]
  if (status !== 'pending') {
    history.push({
      at: submittedAt,
      action: status,
      note:
        status === 'verified'
          ? 'Reference and amount matched.'
          : status === 'rejected'
            ? 'Reference could not be matched.'
            : 'Refund recorded by counter staff.',
      actor: 'Deckout Admin',
    })
  }
  return {
    method,
    reference,
    note,
    submittedAt,
    status,
    reviewedAt: status === 'pending' ? undefined : submittedAt,
    reviewedBy: status === 'pending' ? undefined : 'Deckout Admin',
    reviewNote:
      status === 'verified'
        ? 'Reference and amount matched.'
        : status === 'rejected'
          ? 'Reference could not be matched.'
          : status === 'refunded'
            ? 'Refund recorded by counter staff.'
            : undefined,
    history,
  }
}

const registration = (
  id: string,
  tournamentId: string,
  playerName: string,
  email: string,
  tag: string,
  region: string,
  entryFee: number,
  registrationStatus: RegistrationStatus,
  paymentRecord: Registration['payment'],
  createdAt: string,
): Registration => ({
  id,
  reference: `DKO-${id.toUpperCase()}`,
  tournamentId,
  playerName,
  email,
  tag,
  region,
  entryFee,
  registrationStatus,
  payment: paymentRecord,
  createdAt,
  confirmedAt: registrationStatus === 'confirmed' ? paymentRecord.submittedAt : undefined,
})

export const seedRegistrations: Registration[] = [
  registration(
    'demo01',
    'bay-02',
    'Mika Reyes',
    'mika.reyes@example.com',
    'SPINSTAR',
    'Metro Manila',
    500,
    'confirmed',
    payment('GCash', 'GC-8842190', 'verified', '2026-10-24T14:32:00'),
    '2026-10-24T14:28:00',
  ),
  registration(
    'demo02',
    'bay-02',
    'Tomas Villanueva',
    'tomas.v@example.com',
    'VOLTEDGE',
    'Cebu',
    500,
    'pending',
    payment('Maya', 'MY-130955', 'pending', '2026-10-27T09:12:00'),
    '2026-10-27T09:08:00',
  ),
  registration(
    'demo03',
    'mtg-02',
    'Aria Santos',
    'aria.santos@example.com',
    'VAULTKEEPER',
    'Davao',
    1500,
    'confirmed',
    payment('Bank transfer', 'BPI-20261025-041', 'verified', '2026-10-25T16:40:00'),
    '2026-10-25T16:35:00',
  ),
  registration(
    'demo04',
    'cr-02',
    'Noel Garcia',
    'noel.garcia@example.com',
    'CRUMBLED',
    'Pampanga',
    350,
    'pending',
    payment('GCash', 'GC-7721048', 'pending', '2026-10-28T11:20:00'),
    '2026-10-28T11:16:00',
  ),
  registration(
    'demo05',
    'rb-01',
    'Lena Mercado',
    'lena.mercado@example.com',
    'RIFTSEER',
    'Iloilo',
    350,
    'waitlisted',
    payment('Maya', 'MY-466201', 'rejected', '2026-10-23T18:02:00'),
    '2026-10-23T17:58:00',
  ),
  registration(
    'demo06',
    'fab-04',
    'Marco Dizon',
    'marco.dizon@example.com',
    'IRONPACT',
    'Baguio',
    500,
    'cancelled',
    payment('GCash', 'GC-5517230', 'refunded', '2026-10-20T10:10:00'),
    '2026-10-20T10:04:00',
  ),
  registration(
    'demo07',
    'cp-02',
    'Sam Navarro',
    'sam.navarro@example.com',
    'CHROMEJACK',
    'Makati',
    500,
    'confirmed',
    payment('Cash at counter', 'CASH-1026-014', 'verified', '2026-10-26T15:25:00'),
    '2026-10-26T15:22:00',
  ),
  registration(
    'demo08',
    'demo-cancelled-01',
    'Joanna Lim',
    'joanna.lim@example.com',
    'SKYBOUND',
    'Cebu',
    350,
    'cancelled',
    payment('GCash', 'GC-1048821', 'refunded', '2026-10-18T13:45:00'),
    '2026-10-18T13:41:00',
  ),
]
