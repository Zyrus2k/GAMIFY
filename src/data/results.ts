import type { Standing, TournamentResult } from '../types'
import { toDemoPrize } from './pricing'

const standings = (
  rows: Array<[player: string, country: string, record: string, points: number]>,
): Standing[] =>
  rows.map(([player, country, record, points], index) => ({
    place: index + 1,
    player,
    country,
    record,
    points,
  }))

const seedResults: TournamentResult[] = [
  {
    id: 'res-bay-04',
    tournamentId: 'bay-04',
    name: 'STEEL STORM CHAMPIONSHIP',
    game: 'bayblade',
    date: '2026-10-11T11:00:00',
    location: 'Osaka, JP',
    format: 'Offline',
    champion: 'Kai Renjiro',
    championCountry: 'JP',
    runnerUp: 'Sena Aoki',
    runnerUpCountry: 'JP',
    prize: 24000,
    summary:
      'Kai Renjiro controlled the stamina matchup from the opening launch and closed the grand final 3â€“1. Sena Aoki forced a bracket reset before falling in the decider.',
    standings: standings([
      ['Kai Renjiro', 'JP', '9â€“1', 28],
      ['Sena Aoki', 'JP', '8â€“2', 24],
      ['Mara Voss', 'DE', '7â€“2', 21],
      ['Diego Sant', 'BR', '6â€“3', 18],
      ['Theo Brandt', 'SE', '6â€“3', 16],
      ['Jun Park', 'KR', '5â€“4', 13],
    ]),
  },
  {
    id: 'res-vg-03',
    tournamentId: 'vg-03',
    name: 'GRADE 3 GRAND PRIX',
    game: 'cardfight-vanguard',
    date: '2026-10-03T10:00:00',
    location: 'Los Angeles, US',
    format: 'Offline',
    champion: 'Mika Solberg',
    championCountry: 'NO',
    runnerUp: 'Lucia Ferrer',
    runnerUpCountry: 'ES',
    prize: 26000,
    summary:
      'Mika Solberg piloted a patient midrange list through an undefeated swiss run. The final turned on a single defensive trigger that flipped the damage race in game five.',
    standings: standings([
      ['Mika Solberg', 'NO', '8â€“1', 25],
      ['Lucia Ferrer', 'ES', '7â€“2', 22],
      ['Jun Okafor', 'NG', '7â€“2', 20],
      ['Ren Takeda', 'JP', '6â€“3', 17],
      ['Amara Diallo', 'FR', '5â€“4', 14],
      ['Cole Mercer', 'US', '5â€“4', 12],
    ]),
  },
  {
    id: 'res-cr-03',
    tournamentId: 'cr-03',
    name: 'CRUMB TRAIL SHOWDOWN',
    game: 'cookie-run',
    date: '2026-10-18T12:00:00',
    location: 'Bangkok, TH',
    format: 'Offline',
    champion: 'Nari Kwon',
    championCountry: 'KR',
    runnerUp: 'Poppy Lane',
    runnerUpCountry: 'UK',
    prize: 14000,
    summary:
      'Nari Kwon completed a reverse sweep after dropping the opening two games of the grand final. The Bangkok crowd carried the deciding round to a photo finish.',
    standings: standings([
      ['Nari Kwon', 'KR', '10â€“1', 30],
      ['Poppy Lane', 'UK', '9â€“2', 26],
      ['Miso Tanaka', 'JP', '8â€“3', 23],
      ['Bea Ortiz', 'MX', '7â€“4', 19],
      ['Sunny Park', 'KR', '6â€“5', 16],
      ['Remy Chai', 'SG', '6â€“5', 14],
    ]),
  },
  {
    id: 'res-cp-03',
    tournamentId: 'cp-03',
    name: 'NEON DISTRICT FINALS',
    game: 'cyberpunk',
    date: '2026-10-24T13:00:00',
    location: 'Chicago, US',
    format: 'Offline',
    champion: 'Vex Nakamura',
    championCountry: 'US',
    runnerUp: 'Kira Volkova',
    runnerUpCountry: 'PL',
    prize: 23000,
    summary:
      'Vex Nakamura went undefeated across the entire weekend, closing the final 3â€“0 with a chrome-tempo list that reshaped the district meta.',
    standings: standings([
      ['Vex Nakamura', 'US', '9â€“0', 27],
      ['Kira Volkova', 'PL', '7â€“2', 22],
      ['Neon Adeyemi', 'NG', '7â€“2', 20],
      ['Ash Delgado', 'US', '6â€“3', 17],
      ['Byte Moreau', 'CA', '5â€“4', 14],
      ['Rin Dax', 'DE', '5â€“4', 12],
    ]),
  },
  {
    id: 'res-rb-03',
    tournamentId: 'rb-03',
    name: 'EMBERFALL CHAMPIONSHIP',
    game: 'riftbound',
    date: '2026-10-17T11:00:00',
    location: 'Toronto, CA',
    format: 'Offline',
    champion: 'Sora Vane',
    championCountry: 'CA',
    runnerUp: 'Elowen Pryce',
    runnerUpCountry: 'UK',
    prize: 21000,
    summary:
      'Sora Vane survived a five-game final that swung on a last-turn leyline play. The championship is Vaneâ€™s second circuit title of the season.',
    standings: standings([
      ['Sora Vane', 'CA', '8â€“1', 25],
      ['Elowen Pryce', 'UK', '7â€“2', 22],
      ['Casimir Rook', 'DE', '7â€“2', 20],
      ['Nyx Adebayo', 'NG', '6â€“3', 17],
      ['Isolde Marek', 'CZ', '5â€“4', 14],
      ['Tomas Rehn', 'SE', '5â€“4', 12],
    ]),
  },
  {
    id: 'res-pk-03',
    tournamentId: 'pk-03',
    name: 'PALLET TOWN CLASSIC',
    game: 'pokemon',
    date: '2026-10-12T10:00:00',
    location: 'Tokyo, JP',
    format: 'Offline',
    champion: 'Aiko Tan',
    championCountry: 'JP',
    runnerUp: 'Leo Castillo',
    runnerUpCountry: 'US',
    prize: 30000,
    summary:
      'Aiko Tan became the youngest champion in the eventâ€™s history, finishing 11â€“1 across a record masters field and taking the final in straight games.',
    standings: standings([
      ['Aiko Tan', 'JP', '11â€“1', 34],
      ['Leo Castillo', 'US', '10â€“2', 30],
      ['Mina Rami', 'AE', '9â€“3', 27],
      ['Toby Hart', 'AU', '8â€“3', 23],
      ['Priya Nair', 'IN', '8â€“4', 20],
      ['Noah Kim', 'KR', '7â€“4', 17],
    ]),
  },
  {
    id: 'res-mtg-03',
    tournamentId: 'mtg-03',
    name: 'DOMINARIA LEGACY CUP',
    game: 'mtg',
    date: '2026-10-19T09:00:00',
    location: 'Montreal, CA',
    format: 'Offline',
    champion: 'Elias Ward',
    championCountry: 'US',
    runnerUp: 'Sofia Lindqvist',
    runnerUpCountry: 'SE',
    prize: 32000,
    summary:
      'Elias Ward dropped a single match all weekend and dismantled the final with surgical sideboard planning. Sofia Lindqvist settled for second after a mulligan-heavy game three.',
    standings: standings([
      ['Elias Ward', 'US', '12â€“1', 36],
      ['Sofia Lindqvist', 'SE', '11â€“2', 32],
      ['Marcus Vale', 'UK', '10â€“2', 29],
      ['Yuna Cho', 'KR', '9â€“3', 25],
      ['Ravi Menon', 'SG', '9â€“3', 22],
      ['Clara Voss', 'DE', '8â€“4', 19],
    ]),
  },
  {
    id: 'res-fab-03',
    tournamentId: 'fab-03',
    name: 'IRONCLAD CHAMPIONSHIP',
    game: 'flesh-and-blood',
    date: '2026-10-26T11:00:00',
    location: 'Portland, US',
    format: 'Offline',
    champion: 'Rhea Draven',
    championCountry: 'US',
    runnerUp: 'Fenrir Sol',
    runnerUpCountry: 'NO',
    prize: 28000,
    summary:
      'Rhea Draven took the title in a five-game final defined by precise defensive sequencing. The win secures the top seed heading into the Crimson Circuit finals.',
    standings: standings([
      ['Rhea Draven', 'US', '9â€“1', 28],
      ['Fenrir Sol', 'NO', '8â€“2', 24],
      ['Dahlia Cross', 'US', '8â€“2', 22],
      ['Kael Mercer', 'AU', '7â€“3', 19],
      ['Ilsa Varga', 'HU', '6â€“4', 16],
      ['Dario Fenn', 'IT', '6â€“4', 13],
    ]),
  },
]

export const results: TournamentResult[] = seedResults.map((result) => ({
  ...result,
  prize: toDemoPrize(result.prize),
}))

export const resultByTournamentId = (id: string): TournamentResult | undefined =>
  results.find((result) => result.tournamentId === id)

export const resultsByGame = (game: string): TournamentResult[] =>
  results.filter((result) => result.game === game)

