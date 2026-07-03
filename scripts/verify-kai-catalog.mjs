#!/usr/bin/env node
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import ts from 'typescript'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')
const catalogPath = resolve(root, 'src/data/roomingkosCatalog.ts')

function extractCatalog(path) {
  const sourceText = readFileSync(path, 'utf8')
  const sourceFile = ts.createSourceFile(path, sourceText, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS)
  let initializer = null

  function visit(node) {
    if (
      ts.isVariableDeclaration(node) &&
      node.name.getText(sourceFile) === 'roomingKosCatalog' &&
      node.initializer
    ) {
      initializer = node.initializer
    }
    ts.forEachChild(node, visit)
  }

  visit(sourceFile)
  assert.ok(initializer, 'roomingKosCatalog export was not found')
  return JSON.parse(initializer.getText(sourceFile))
}

function optionPrices(option) {
  return [option.weeklyFrom, ...option.roomTypes.map((room) => room.weeklyPrice)].filter(
    (price) => typeof price === 'number',
  )
}

const catalog = extractCatalog(catalogPath)
const ids = new Set(catalog.map((option) => option.id))
const stats = catalog.reduce(
  (memo, option) => {
    memo.total += 1
    memo.groups[option.group] = (memo.groups[option.group] ?? 0) + 1
    memo.statuses[option.status] = (memo.statuses[option.status] ?? 0) + 1
    memo.roomTypes += option.roomTypes.length
    if (option.sourceUrl) memo.sourceUrls += 1
    if (option.applyUrl) memo.applyUrls += 1
    for (const price of optionPrices(option)) memo.prices.push(price)
    return memo
  },
  {
    total: 0,
    groups: {},
    statuses: {},
    roomTypes: 0,
    sourceUrls: 0,
    applyUrls: 0,
    prices: [],
  },
)

assert.equal(stats.total, 43, 'catalog must contain the verified 43 public listings')
assert.equal(ids.size, stats.total, 'catalog IDs must be unique')
assert.equal(stats.groups.building, 8, 'catalog must contain 8 named building rows')
assert.equal(stats.groups.rooming_house, 35, 'catalog must contain 35 rooming-house rows')
assert.equal(stats.statuses.Available, 12, 'available count drifted')
assert.equal(stats.statuses.Waitlist, 25, 'waitlist count drifted')
assert.equal(stats.statuses['Coming Soon'], 6, 'coming soon count drifted')
assert.equal(stats.sourceUrls, 43, 'every catalog option must retain a public source URL')
assert.equal(stats.applyUrls, 37, 'public apply-link count drifted')
assert.equal(stats.roomTypes, 108, 'cleaned app room-type count drifted')
assert.equal(Math.min(...stats.prices), 230, 'minimum weekly price drifted')
assert.equal(Math.max(...stats.prices), 750, 'maximum weekly price drifted')

const swanston = catalog.find((option) => option.id === 'roomingkos-swanston')
assert.ok(swanston, 'Swanston source listing must remain in the catalog')
assert.equal(swanston.status, 'Available', 'Swanston should be available in the verified public extract')
assert.equal(swanston.weeklyFrom, 299.18, 'Swanston public weekly-from price drifted')
assert.ok(
  swanston.roomTypes.some((room) => room.name === 'Studio Single'),
  'Swanston should retain Studio Single room evidence',
)

const lowBudgetAvailable = catalog.filter(
  (option) => option.status === 'Available' && optionPrices(option).some((price) => price <= 300),
)
assert.ok(lowBudgetAvailable.length >= 3, 'low-budget available lead path has too few options')

const sourcedHttpRows = catalog.filter((option) => {
  try {
    const url = new URL(option.sourceUrl)
    return url.protocol === 'https:'
  } catch {
    return false
  }
})
assert.equal(sourcedHttpRows.length, 43, 'source URLs must remain valid HTTPS links')

console.log(
  JSON.stringify(
    {
      result: 'PASSED',
      total: stats.total,
      buildings: stats.groups.building,
      roomingHouses: stats.groups.rooming_house,
      statuses: stats.statuses,
      roomTypes: stats.roomTypes,
      sourceUrls: stats.sourceUrls,
      applyUrls: stats.applyUrls,
      priceRange: [Math.min(...stats.prices), Math.max(...stats.prices)],
      sample: {
        id: swanston.id,
        status: swanston.status,
        weeklyFrom: swanston.weeklyFrom,
      },
    },
    null,
    2,
  ),
)
