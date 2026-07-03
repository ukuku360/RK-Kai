#!/usr/bin/env node
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import vm from 'node:vm'
import { roomingKosCatalog } from '../src/data/roomingkosCatalog.ts'
import {
  budgetRange,
  buildHandoffText,
  catalogStats,
  daysUntil,
  getSourceLabelFromSearch,
  isSitePreviewFromSearch,
  leadReadinessScore,
  locationTerms,
  optionPrices,
  parseAvailableDate,
  readinessLabel,
  recommendationsFor,
  requestedMoveInDays,
  requestedStayMonths,
  scoreOption,
} from '../src/kaiLogic.ts'

const fixedToday = new Date('2026-07-04T00:00:00+10:00')

function assertSortedByScore(recommendations) {
  for (let index = 1; index < recommendations.length; index += 1) {
    assert.ok(
      recommendations[index - 1].score >= recommendations[index].score,
      `recommendations are not score-sorted at index ${index}`,
    )
  }
}

function runParsingQa() {
  assert.deepEqual(budgetRange('Under $300/wk'), { min: 0, max: 300 })
  assert.deepEqual(budgetRange('$300-380/wk'), { min: 300, max: 380 })
  assert.deepEqual(budgetRange('around 350 per week'), { min: 310, max: 390 })
  assert.deepEqual(budgetRange('max 420'), { min: 0, max: 420 })
  assert.equal(budgetRange('not sure'), null)

  assert.equal(requestedMoveInDays('ASAP'), 7)
  assert.equal(requestedMoveInDays('3 weeks'), 21)
  assert.equal(requestedMoveInDays('2 months'), 62)
  assert.equal(requestedStayMonths('1 year'), 12)
  assert.equal(requestedStayMonths('9 months'), 9)

  const acaciaDate = parseAvailableDate('15 August 2026')
  assert.ok(acaciaDate instanceof Date)
  assert.equal(daysUntil(acaciaDate, fixedToday), 42)

  assert.deepEqual(locationTerms('Carlton'), ['carlton', 'swanston', 'dudley'])
  assert.equal(getSourceLabelFromSearch('?source=swanston-page'), 'Swanston property page')
  assert.equal(getSourceLabelFromSearch('?source=wechat_campaign'), 'wechat campaign')
  assert.equal(isSitePreviewFromSearch('?view=site'), true)
  assert.equal(isSitePreviewFromSearch('?source=homepage'), false)
}

function runCatalogAndScoringQa() {
  assert.equal(catalogStats.total, roomingKosCatalog.length)
  assert.equal(catalogStats.total, 43)
  assert.equal(catalogStats.groupCounts.building, 8)
  assert.equal(catalogStats.groupCounts.rooming_house, 35)
  assert.equal(catalogStats.statusCounts.Available, 12)
  assert.equal(catalogStats.statusCounts.Waitlist, 25)
  assert.equal(catalogStats.statusCounts['Coming Soon'], 6)
  assert.equal(catalogStats.sourceUrlCount, 43)
  assert.equal(catalogStats.applyUrlCount, 37)

  const emptyPrefs = recommendationsFor({}, roomingKosCatalog, fixedToday)
  assertSortedByScore(emptyPrefs)
  assert.equal(emptyPrefs[0].status, 'Available')
  assert.ok(emptyPrefs.slice(0, 12).every((option) => option.status === 'Available'))
  assert.ok(
    Math.min(...emptyPrefs.filter((option) => option.status === 'Available').map((option) => option.score)) >
      Math.max(...emptyPrefs.filter((option) => option.status === 'Coming Soon').map((option) => option.score)),
    'available stock should outrank coming-soon stock before lead preferences',
  )

  const lowBudgetCarltonPrefs = {
    budget: 'Under $300/wk',
    moveIn: 'This week',
    location: 'Carlton',
    stay: '6 months',
    lifestyle: 'Study-focused',
    facilities: 'Private bathroom',
  }
  const lowBudgetCarlton = recommendationsFor(lowBudgetCarltonPrefs, roomingKosCatalog, fixedToday)
  assertSortedByScore(lowBudgetCarlton)
  assert.equal(lowBudgetCarlton[0].id, 'roomingkos-dudley')
  assert.equal(lowBudgetCarlton[0].score, 98)
  assert.ok(lowBudgetCarlton[0].reasons.includes('fits the Under $300/wk budget band'))
  assert.ok(lowBudgetCarlton[0].reasons.includes('matches the Carlton location preference'))
  assert.ok(
    lowBudgetCarlton.findIndex((option) => option.id === 'roomingkos-dudley') <
      lowBudgetCarlton.findIndex((option) => option.id === '23-mountfield-ave-malvern-east-vic-3145'),
    'location-matched Carlton stock should beat unrelated low-price stock when scores tie',
  )

  const spire = roomingKosCatalog.find((option) => option.id === 'spire-by-roomingkos')
  const comingSoon = roomingKosCatalog.find((option) => option.status === 'Coming Soon')
  assert.ok(spire)
  assert.ok(comingSoon)
  assert.ok(optionPrices(spire).includes(523.56))
  assert.ok(
    scoreOption(spire, { facilities: 'Bills included', lifestyle: 'Work from home' }, fixedToday) >
      scoreOption(comingSoon, { facilities: 'Bills included', lifestyle: 'Work from home' }, fixedToday),
    'available bills-included stock should beat coming-soon stock for an actionable lead',
  )
}

function runHandoffQa() {
  const prefs = {
    budget: '$300-380/wk',
    moveIn: 'In 2 weeks',
    location: 'Near tram',
    stay: '6 months',
    lifestyle: 'Work from home',
    facilities: 'Bills included',
  }
  const topMatches = recommendationsFor(prefs, roomingKosCatalog, fixedToday).slice(0, 3)
  const readiness = leadReadinessScore({
    completedSteps: Object.keys(prefs).length,
    topMatch: topMatches[0],
    moveInCaptured: true,
  })

  assert.equal(readiness, 98)
  assert.equal(readinessLabel(readiness), 'Inspection-ready')

  const noInspection = buildHandoffText({
    sourceLabel: 'RoomingKos website',
    prefs,
    topMatches,
    conversionReadiness: readiness,
    requestedInspection: null,
  })
  assert.match(noInspection, /Requested inspection: Not selected yet/)
  assert.match(noInspection, /Top matches:/)

  const withInspection = buildHandoffText({
    sourceLabel: 'RoomingKos website',
    prefs,
    topMatches,
    conversionReadiness: readiness,
    requestedInspection: topMatches[1],
  })
  assert.match(withInspection, new RegExp(`Requested inspection: ${topMatches[1].displayName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`))
  assert.match(withInspection, /Readiness: 98% \(Inspection-ready\)/)
}

function createFakeDom() {
  const allElements = []
  const headChildren = []
  const bodyChildren = []

  function makeElement(tagName) {
    const listeners = {}
    const element = {
      tagName,
      attrs: {},
      children: [],
      innerHTML: '',
      textContent: '',
      type: '',
      setAttribute(name, value) {
        this.attrs[name] = value
      },
      addEventListener(name, handler) {
        listeners[name] = handler
      },
      click() {
        listeners.click?.()
      },
    }
    allElements.push(element)
    return element
  }

  const document = {
    currentScript: {
      dataset: {
        kaiUrl: 'https://kai.example/app',
      },
      src: 'https://kai.example/kai-toggle.js',
    },
    head: {
      appendChild(element) {
        headChildren.push(element)
      },
    },
    body: {
      appendChild(element) {
        bodyChildren.push(element)
      },
    },
    querySelector(selector) {
      if (selector === '[data-kai-toggle-root]') {
        return allElements.find((element) => Object.hasOwn(element.attrs, 'data-kai-toggle-root')) ?? null
      }
      return null
    },
    createElement: makeElement,
    addEventListener() {},
  }

  const window = {
    location: {
      href: 'https://roomingkos.example/student-accommodation-swanston/',
      pathname: '/student-accommodation-swanston/',
    },
  }

  return { allElements, bodyChildren, document, headChildren, window }
}

function runToggleQa() {
  const source = readFileSync(new URL('../public/kai-toggle.js', import.meta.url), 'utf8')
  const dom = createFakeDom()

  vm.runInNewContext(source, {
    document: dom.document,
    window: dom.window,
    URL,
  })

  assert.equal(dom.headChildren.length, 1)
  assert.equal(dom.bodyChildren.length, 1)
  assert.equal(dom.bodyChildren[0].attrs['aria-label'], 'Open Kai room matching assistant')
  dom.bodyChildren[0].click()
  assert.equal(
    dom.window.location.href,
    'https://kai.example/app?source=roomingkos-site&from=%2Fstudent-accommodation-swanston%2F',
  )

  vm.runInNewContext(source, {
    document: dom.document,
    window: dom.window,
    URL,
  })
  assert.equal(dom.headChildren.length, 1, 'toggle should not inject duplicate styles')
  assert.equal(dom.bodyChildren.length, 1, 'toggle should not inject duplicate buttons')
}

runParsingQa()
runCatalogAndScoringQa()
runHandoffQa()
runToggleQa()

console.log(
  JSON.stringify(
    {
      result: 'PASSED',
      suites: ['parsing', 'catalog-scoring', 'handoff', 'website-toggle'],
      catalogRows: catalogStats.total,
      sourceUrls: catalogStats.sourceUrlCount,
    },
    null,
    2,
  ),
)
