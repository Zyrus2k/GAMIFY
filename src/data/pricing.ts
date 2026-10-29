const prizeMap = new Map<number, number>([
  [10000, 15000],
  [12000, 18000],
  [13000, 20000],
  [14000, 22000],
  [15000, 25000],
  [16000, 28000],
  [17000, 30000],
  [18000, 35000],
  [19000, 38000],
  [20000, 40000],
  [21000, 45000],
  [22000, 48000],
  [23000, 50000],
  [24000, 55000],
  [25000, 60000],
  [26000, 65000],
  [28000, 75000],
  [30000, 85000],
  [32000, 90000],
  [35000, 100000],
  [40000, 120000],
])

export const toDemoPrize = (legacyAmount: number): number =>
  prizeMap.get(legacyAmount) ?? Math.round(legacyAmount * 1.25)

export const entryFeeForPrize = (prize: number): number => {
  if (prize >= 100000) return 1500
  if (prize >= 75000) return 1000
  if (prize >= 50000) return 750
  if (prize >= 35000) return 500
  return 350
}
