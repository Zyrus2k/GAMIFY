import type { GameSlug, LeaderboardEntry } from '../types'

type Row = [
  player: string,
  team: string,
  country: string,
  region: string,
  points: number,
  wins: number,
  firsts: number,
  seconds: number,
  thirds: number,
]

const build = (game: GameSlug, rows: Row[]): LeaderboardEntry[] =>
  rows.map((row, index) => ({
    id: `${game}-${index + 1}`,
    rank: index + 1,
    player: row[0],
    team: row[1],
    game,
    points: row[4],
    wins: row[5],
    firsts: row[6],
    seconds: row[7],
    thirds: row[8],
    region: row[3],
    country: row[2],
  }))

export const leaderboard: LeaderboardEntry[] = [
  ...build('bayblade', [
    ['Kai Renjiro', 'Team Eclipse', 'JP', 'APAC', 980, 34, 8, 3, 1],
    ['Mara Voss', 'Team Ironveil', 'DE', 'EMEA', 910, 31, 7, 2, 2],
    ['Sena Aoki', 'Team Eclipse', 'JP', 'APAC', 884, 30, 6, 4, 1],
    ['Diego Sant', 'Team Solflare', 'BR', 'LATAM', 802, 27, 5, 2, 3],
    ['Theo Brandt', 'Team Ironveil', 'SE', 'EMEA', 760, 25, 4, 3, 2],
  ]),
  ...build('cardfight-vanguard', [
    ['Mika Solberg', 'Team Aurora', 'NO', 'EMEA', 950, 33, 7, 3, 2],
    ['Lucia Ferrer', 'Team Aurora', 'ES', 'EMEA', 905, 31, 6, 4, 1],
    ['Jun Okafor', 'Team Static', 'NG', 'MEA', 870, 30, 6, 2, 3],
    ['Ren Takeda', 'Team Static', 'JP', 'APAC', 836, 28, 5, 3, 2],
    ['Amara Diallo', 'Team Aurora', 'FR', 'EMEA', 784, 26, 4, 3, 4],
  ]),
  ...build('cookie-run', [
    ['Nari Kwon', 'Team Sugarhigh', 'KR', 'APAC', 930, 32, 7, 2, 2],
    ['Poppy Lane', 'Team Sugarhigh', 'UK', 'EMEA', 890, 30, 6, 3, 2],
    ['Miso Tanaka', 'Team Bonbon', 'JP', 'APAC', 850, 29, 5, 4, 1],
    ['Bea Ortiz', 'Team Bonbon', 'MX', 'LATAM', 810, 27, 5, 2, 3],
    ['Sunny Park', 'Team Sugarhigh', 'KR', 'APAC', 770, 25, 4, 2, 4],
  ]),
  ...build('cyberpunk', [
    ['Vex Nakamura', 'Team Null', 'US', 'NA', 990, 35, 9, 1, 1],
    ['Kira Volkova', 'Team Null', 'PL', 'EMEA', 940, 32, 7, 2, 2],
    ['Neon Adeyemi', 'Team Ghostline', 'NG', 'MEA', 900, 31, 6, 3, 2],
    ['Ash Delgado', 'Team Ghostline', 'US', 'NA', 860, 28, 5, 3, 3],
    ['Byte Moreau', 'Team Null', 'CA', 'NA', 820, 26, 4, 4, 2],
  ]),
  ...build('riftbound', [
    ['Sora Vane', 'Team Leyline', 'CA', 'NA', 960, 33, 8, 2, 1],
    ['Elowen Pryce', 'Team Leyline', 'UK', 'EMEA', 915, 31, 6, 4, 1],
    ['Casimir Rook', 'Team Emberfall', 'DE', 'EMEA', 880, 30, 5, 3, 3],
    ['Nyx Adebayo', 'Team Emberfall', 'NG', 'MEA', 840, 28, 5, 2, 2],
    ['Isolde Marek', 'Team Leyline', 'CZ', 'EMEA', 800, 26, 4, 3, 3],
  ]),
  ...build('pokemon', [
    ['Aiko Tan', 'Team Volt', 'JP', 'APAC', 975, 34, 8, 2, 1],
    ['Leo Castillo', 'Team Volt', 'US', 'NA', 935, 32, 7, 3, 1],
    ['Mina Rami', 'Team Spark', 'AE', 'MEA', 895, 30, 6, 3, 2],
    ['Toby Hart', 'Team Spark', 'AU', 'APAC', 855, 28, 5, 4, 1],
    ['Priya Nair', 'Team Volt', 'IN', 'APAC', 815, 26, 4, 3, 4],
  ]),
  ...build('mtg', [
    ['Elias Ward', 'Team Vault', 'US', 'NA', 985, 34, 8, 3, 0],
    ['Sofia Lindqvist', 'Team Vault', 'SE', 'EMEA', 945, 32, 7, 2, 3],
    ['Marcus Vale', 'Team Obsidian', 'UK', 'EMEA', 905, 30, 6, 3, 2],
    ['Yuna Cho', 'Team Obsidian', 'KR', 'APAC', 865, 28, 5, 3, 3],
    ['Ravi Menon', 'Team Vault', 'SG', 'APAC', 825, 26, 4, 4, 2],
  ]),
  ...build('flesh-and-blood', [
    ['Rhea Draven', 'Team Crimson', 'US', 'NA', 970, 33, 8, 2, 2],
    ['Fenrir Sol', 'Team Crimson', 'NO', 'EMEA', 925, 31, 6, 4, 1],
    ['Dahlia Cross', 'Team Ironclad', 'US', 'NA', 885, 29, 5, 4, 2],
    ['Kael Mercer', 'Team Ironclad', 'AU', 'APAC', 845, 27, 5, 2, 3],
    ['Ilsa Varga', 'Team Crimson', 'HU', 'EMEA', 805, 25, 4, 3, 3],
  ]),
]

export const leaderboardByGame = (game: string): LeaderboardEntry[] =>
  leaderboard.filter((entry) => entry.game === game)

export const topOverall = (count: number): LeaderboardEntry[] =>
  [...leaderboard].sort((a, b) => b.points - a.points).slice(0, count)
