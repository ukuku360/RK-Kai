import { roomingKosCatalog, type RoomingKosOption, type RoomStatus } from './data/roomingkosCatalog.ts'

export type StepKey =
  | 'budget'
  | 'moveIn'
  | 'location'
  | 'stay'
  | 'lifestyle'
  | 'facilities'

export type LeadPrefs = Partial<Record<StepKey, string>>

export type Recommendation = RoomingKosOption & {
  score: number
  reasons: string[]
}

export const sourceLabels: Record<string, string> = {
  homepage: 'RoomingKos homepage',
  'roomingkos-site': 'RoomingKos website',
  'site-preview': 'RoomingKos site preview',
  'swanston-page': 'Swanston property page',
  'student-housing': 'Student housing campaign',
}

export const catalogAudit = {
  catalogGeneratedAt: '2026-07-04 00:08 AEST',
  publicScrapeVerifiedAt: '2026-07-03 23:55 AEST',
  verificationResult: 'PASSED',
  sourceRoomRows: 131,
  starRezRows: 39,
}

export const catalogStats = roomingKosCatalog.reduce(
  (stats, option) => {
    stats.total += 1
    stats.statusCounts[option.status] += 1
    stats.groupCounts[option.group] += 1
    stats.roomTypeCount += option.roomTypes.length
    if (option.sourceUrl) stats.sourceUrlCount += 1
    if (option.applyUrl) stats.applyUrlCount += 1
    if (option.roomTypes.length > 0) stats.withRoomTypes += 1
    for (const room of option.roomTypes) {
      if (room.weeklyPrice !== null) stats.pricePoints.push(room.weeklyPrice)
    }
    if (option.weeklyFrom !== null) stats.pricePoints.push(option.weeklyFrom)
    return stats
  },
  {
    total: 0,
    statusCounts: {
      Available: 0,
      Waitlist: 0,
      'Coming Soon': 0,
    } satisfies Record<RoomStatus, number>,
    groupCounts: {
      building: 0,
      rooming_house: 0,
    },
    roomTypeCount: 0,
    withRoomTypes: 0,
    sourceUrlCount: 0,
    applyUrlCount: 0,
    pricePoints: [] as number[],
  },
)

export function getSourceLabelFromSearch(search: string) {
  const params = new URLSearchParams(search)
  const source = params.get('source') ?? 'roomingkos-site'
  return sourceLabels[source] ?? source.replace(/[-_]/g, ' ')
}

export function isSitePreviewFromSearch(search: string) {
  return new URLSearchParams(search).get('view') === 'site'
}

export function budgetRange(answer?: string) {
  if (!answer) return null
  if (answer.includes('Under')) return { min: 0, max: 300 }
  if (answer.includes('300-380')) return { min: 300, max: 380 }
  if (answer.includes('380-480')) return { min: 380, max: 480 }
  if (answer === 'Flexible') return { min: 0, max: 800 }

  const lower = answer.toLowerCase()
  const numbers = (answer.match(/\d+(?:\.\d+)?/g) ?? []).map(Number)
  if (numbers.length >= 2) {
    return { min: Math.min(...numbers), max: Math.max(...numbers) }
  }
  if (numbers.length === 1) {
    const amount = numbers[0]
    if (/under|below|max|up to|less/.test(lower)) return { min: 0, max: amount }
    if (/over|above|from|more/.test(lower)) return { min: amount, max: 900 }
    return { min: Math.max(0, amount - 40), max: amount + 40 }
  }

  return null
}

export function requestedMoveInDays(answer?: string) {
  if (!answer) return null
  const lower = answer.toLowerCase()
  if (answer === 'This week' || /asap|today|tomorrow|now/.test(lower)) return 7
  if (answer === 'In 2 weeks') return 14
  if (answer === 'Next month') return 31

  const weekMatch = lower.match(/(\d+)\s*(week|wk)/)
  if (weekMatch) return Number(weekMatch[1]) * 7

  const monthMatch = lower.match(/(\d+)\s*(month|mo)/)
  if (monthMatch) return Number(monthMatch[1]) * 31

  return 45
}

export function requestedStayMonths(answer?: string) {
  if (!answer) return null
  const lower = answer.toLowerCase()
  if (answer === '3 months') return 3
  if (answer === '6 months') return 6
  if (answer === '12 months') return 12

  const monthMatch = lower.match(/(\d+)\s*(month|mo)/)
  if (monthMatch) return Number(monthMatch[1])

  const yearMatch = lower.match(/(\d+)\s*(year|yr)/)
  if (yearMatch) return Number(yearMatch[1]) * 12

  return 6
}

export function money(value: number) {
  return value.toLocaleString('en-AU', {
    maximumFractionDigits: Number.isInteger(value) ? 0 : 2,
  })
}

export function priceLabel(option: RoomingKosOption) {
  return option.weeklyFrom === null ? 'Price TBA' : `from $${money(option.weeklyFrom)}/wk`
}

export function roomTypeCountLabel(option: RoomingKosOption) {
  return `${option.roomTypes.length} room type${option.roomTypes.length === 1 ? '' : 's'}`
}

export function locationLabel(option: RoomingKosOption) {
  if (option.suburb && option.address) return `${option.suburb} · ${option.address}`
  if (option.suburb) return option.suburb
  if (option.address) return option.address
  return 'RoomingKos listing'
}

export function roomTypeSummary(option: RoomingKosOption) {
  if (option.roomTypes.length === 0) return 'Room types not published yet'
  return option.roomTypes
    .slice(0, 3)
    .map((room) => room.name)
    .join(', ')
}

export function statusAccent(option: RoomingKosOption) {
  if (option.status === 'Available') return '#0b7f69'
  if (option.status === 'Waitlist') return '#b17a0e'
  return '#315f7f'
}

export function statusPriority(option: RoomingKosOption) {
  if (option.status === 'Available') return 0
  if (option.status === 'Waitlist') return 1
  return 2
}

export function optionPrices(option: RoomingKosOption) {
  const prices = [
    option.weeklyFrom,
    ...option.roomTypes.map((room) => room.weeklyPrice),
  ].filter((price): price is number => price !== null)

  return [...new Set(prices)]
}

export function searchText(option: RoomingKosOption) {
  return [
    option.name,
    option.displayName,
    option.suburb,
    option.address,
    option.status,
    option.tags.join(' '),
    option.roomTypes.map((room) => `${room.name} ${room.leaseTo} ${room.description}`).join(' '),
  ]
    .join(' ')
    .toLowerCase()
}

export function locationTerms(answer?: string) {
  if (!answer || answer === 'Flexible') return []

  const presets: Record<string, string[]> = {
    'CBD / RMIT': ['cbd', 'rmit', 'swanston', 'dudley', 'spire', 'melbourne'],
    UniMelb: ['unimelb', 'uni melb', 'university of melbourne', 'carlton', 'fitzroy', 'swanston'],
    Carlton: ['carlton', 'swanston', 'dudley'],
    'Near tram': ['tram', 'swanston', 'dudley', 'fitzroy', 'clayton', 'chadstone', 'malvern'],
  }

  return presets[answer] ?? [answer.toLowerCase()]
}

const facilityTerms: Record<string, string[]> = {
  'Private bathroom': ['private bathroom', 'ensuite', 'bathroom'],
  Furnished: ['furnished'],
  'Bills included': ['bills included', 'all bills', 'utilities included'],
  'Gym nearby': ['gym'],
}

export function matchesBudget(option: RoomingKosOption, budgetAnswer?: string) {
  const budget = budgetRange(budgetAnswer)
  if (!budget) return false
  return optionPrices(option).some((price) => price >= budget.min && price <= budget.max)
}

export function matchesLocation(option: RoomingKosOption, locationAnswer?: string) {
  const terms = locationTerms(locationAnswer)
  if (terms.length === 0) return false
  const searchable = searchText(option)
  return terms.some((term) => searchable.includes(term))
}

export function matchesLifestyle(option: RoomingKosOption, lifestyleAnswer?: string) {
  if (!lifestyleAnswer) return false
  const searchable = searchText(option)
  const preference = lifestyleAnswer.toLowerCase()
  return (
    option.tags.includes(lifestyleAnswer) ||
    (preference === 'study-focused' && searchable.includes('study')) ||
    (preference === 'work from home' && (searchable.includes('wifi') || searchable.includes('desk')))
  )
}

export function matchesFacility(option: RoomingKosOption, facilityAnswer?: string) {
  if (!facilityAnswer || facilityAnswer === 'No strong preference') return false
  const searchable = searchText(option)
  return facilityTerms[facilityAnswer]?.some((term) => searchable.includes(term)) ?? false
}

export function preferenceTieBreak(option: RoomingKosOption, prefs: LeadPrefs) {
  let value = 0
  if (prefs.location) value += matchesLocation(option, prefs.location) ? 50 : -18
  if (prefs.budget) value += matchesBudget(option, prefs.budget) ? 24 : 0
  if (prefs.facilities && prefs.facilities !== 'No strong preference') {
    value += matchesFacility(option, prefs.facilities) ? 16 : -4
  }
  if (prefs.lifestyle) value += matchesLifestyle(option, prefs.lifestyle) ? 10 : 0
  if (option.status === 'Available') value += 6
  if (option.applyUrl) value += 3
  return value
}

export function parseAvailableDate(value: string) {
  const normalized = value.replace(/\b(\d{1,2})(st|nd|rd|th)\b/gi, '$1')
  const timestamp = Date.parse(normalized)
  return Number.isNaN(timestamp) ? null : new Date(timestamp)
}

export function daysUntil(date: Date, todayInput = new Date()) {
  const today = new Date(todayInput)
  today.setHours(0, 0, 0, 0)
  const target = new Date(date)
  target.setHours(0, 0, 0, 0)
  return Math.max(0, Math.ceil((target.getTime() - today.getTime()) / 86_400_000))
}

export function defaultCatalogSort(a: RoomingKosOption, b: RoomingKosOption) {
  return (
    statusPriority(a) - statusPriority(b) ||
    (a.weeklyFrom ?? Number.POSITIVE_INFINITY) - (b.weeklyFrom ?? Number.POSITIVE_INFINITY) ||
    a.displayName.localeCompare(b.displayName)
  )
}

export function scoreOption(option: RoomingKosOption, prefs: LeadPrefs, today = new Date()) {
  let score = 58

  if (option.status === 'Available') score += 24
  if (option.status === 'Waitlist') score += 5
  if (option.status === 'Coming Soon') score -= 20

  const budget = budgetRange(prefs.budget)
  if (budget) {
    const prices = optionPrices(option)
    const minPrice = Math.min(...prices)
    if (prices.some((price) => price >= budget.min && price <= budget.max)) {
      score += 18
    } else if (Number.isFinite(minPrice) && minPrice <= budget.max + 45) {
      score += 8
    } else if (prices.length === 0) {
      score -= 4
    } else {
      score -= 14
    }
  }

  const moveInDays = requestedMoveInDays(prefs.moveIn)
  if (moveInDays && option.status === 'Available' && option.availableFrom) {
    const availableDate = parseAvailableDate(option.availableFrom)
    if (availableDate) {
      score += daysUntil(availableDate, today) <= moveInDays ? 12 : -8
    }
  }

  const terms = locationTerms(prefs.location)
  if (terms.length > 0) {
    const searchable = searchText(option)
    score += terms.some((term) => searchable.includes(term)) ? 14 : -3
  }

  const stayMonths = requestedStayMonths(prefs.stay)
  if (stayMonths) {
    const searchable = searchText(option)
    if (stayMonths >= 12 && searchable.includes('30th june 2027')) score += 4
    if (stayMonths <= 6 && searchable.includes('31st january 2027')) score += 3
  }

  if (prefs.lifestyle) {
    if (matchesLifestyle(option, prefs.lifestyle)) {
      score += 7
    }
  }

  if (prefs.facilities && prefs.facilities !== 'No strong preference') {
    score += matchesFacility(option, prefs.facilities) ? 7 : -1
  }

  return Math.max(42, Math.min(98, score))
}

export function matchReasons(option: RoomingKosOption, prefs: LeadPrefs, today = new Date()) {
  const reasons: string[] = []

  if (option.status === 'Available') {
    reasons.push('currently marked Available')
  } else if (option.status === 'Waitlist') {
    reasons.push('useful waitlist backup for staff follow-up')
  } else {
    reasons.push('future option for interest registration')
  }

  const budget = budgetRange(prefs.budget)
  const prices = optionPrices(option)
  if (budget && prices.some((price) => price >= budget.min && price <= budget.max)) {
    reasons.push(`fits the ${prefs.budget} budget band`)
  }

  const moveInDays = requestedMoveInDays(prefs.moveIn)
  if (moveInDays && option.status === 'Available' && option.availableFrom) {
    const availableDate = parseAvailableDate(option.availableFrom)
    if (availableDate && daysUntil(availableDate, today) <= moveInDays) {
      reasons.push(`published availability fits ${prefs.moveIn?.toLowerCase()}`)
    }
  }

  const terms = locationTerms(prefs.location)
  if (terms.length > 0 && terms.some((term) => searchText(option).includes(term))) {
    reasons.push(`matches the ${prefs.location} location preference`)
  }

  if (prefs.lifestyle && matchesLifestyle(option, prefs.lifestyle)) {
    reasons.push(`supports a ${prefs.lifestyle.toLowerCase()} lifestyle`)
  }

  if (prefs.facilities && matchesFacility(option, prefs.facilities)) {
    reasons.push(`includes ${prefs.facilities.toLowerCase()}`)
  }

  if (option.group === 'rooming_house') {
    reasons.push('individual rooming house property')
  }

  if (reasons.length === 0) {
    return option.matchNotes.slice(0, 2)
  }

  return reasons.slice(0, 3)
}

export function recommendationsFor(
  prefs: LeadPrefs,
  catalog: RoomingKosOption[] = roomingKosCatalog,
  today = new Date(),
) {
  return catalog
    .map((option): Recommendation => ({
      ...option,
      score: scoreOption(option, prefs, today),
      reasons: matchReasons(option, prefs, today),
    }))
    .sort(
      (a, b) =>
        b.score - a.score ||
        preferenceTieBreak(b, prefs) - preferenceTieBreak(a, prefs) ||
        statusPriority(a) - statusPriority(b) ||
        (a.weeklyFrom ?? Number.POSITIVE_INFINITY) -
          (b.weeklyFrom ?? Number.POSITIVE_INFINITY) ||
        a.displayName.localeCompare(b.displayName),
    )
}

export function shortValue(value?: string) {
  return value ?? 'Not captured'
}

export function readinessLabel(value: number) {
  if (value >= 84) return 'Inspection-ready'
  if (value >= 68) return 'Strong lead'
  if (value >= 48) return 'Qualifying'
  return 'Early signal'
}

export function leadReadinessScore({
  completedSteps,
  topMatch,
  moveInCaptured,
}: {
  completedSteps: number
  topMatch: Pick<RoomingKosOption, 'status' | 'applyUrl'> | undefined
  moveInCaptured: boolean
}) {
  return Math.min(
    98,
    32 +
      completedSteps * 8 +
      (topMatch?.status === 'Available' ? 10 : 0) +
      (topMatch?.applyUrl ? 5 : 0) +
      (moveInCaptured ? 5 : 0),
  )
}

export function buildHandoffText({
  sourceLabel,
  prefs,
  topMatches,
  conversionReadiness,
  requestedInspection,
}: {
  sourceLabel: string
  prefs: LeadPrefs
  topMatches: Recommendation[]
  conversionReadiness: number
  requestedInspection?: Recommendation | null
}) {
  return [
    'Kai lead handoff',
    `Source: ${sourceLabel}`,
    `Budget: ${shortValue(prefs.budget)}`,
    `Move-in: ${shortValue(prefs.moveIn)}`,
    `Location: ${shortValue(prefs.location)}`,
    `Stay length: ${shortValue(prefs.stay)}`,
    `Lifestyle: ${shortValue(prefs.lifestyle)}`,
    `Facility priority: ${shortValue(prefs.facilities)}`,
    `Readiness: ${conversionReadiness}% (${readinessLabel(conversionReadiness)})`,
    requestedInspection
      ? `Requested inspection: ${requestedInspection.displayName}, ${priceLabel(requestedInspection)}, ${requestedInspection.status}`
      : 'Requested inspection: Not selected yet',
    '',
    'Top matches:',
    ...topMatches.map(
      (option, index) =>
        `${index + 1}. ${option.displayName} - ${priceLabel(option)} - ${option.score}% fit - ${option.status}`,
    ),
  ].join('\n')
}
