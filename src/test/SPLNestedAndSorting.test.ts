// SPDX-License-Identifier: Apache-2.0

import { test, expect } from 'vitest'
import { OperandReader } from '../OperandReader'
import { PropertyWalker } from '../PropertyWalker'
import { SPLQueryToTreeConverter } from '../antlr/SPLQueryToTreeConverter'
import { SPLLimitExtractor } from '../limiter/SPLLimitExtractor'
import { SPLPredicateFilter } from '../predicate/SPLPredicateFilter'
import { SPLComparatorFactory } from '../sorter/SPLComparatorFactory'
import { SPLListFilterer } from '../sorter/SPLListFilterer'
import {
  StringOperations,
  StringListStringOperations,
  DateOperations,
  NumberOperations,
  BooleanOperations,
  BooleanListBooleansOperations,
  PredicateOperation,
} from '../predicate/operations'

const operations: PredicateOperation<any, any>[] = [
  new StringOperations(),
  new StringListStringOperations(),
  new NumberOperations(),
  new BooleanOperations(),
  new BooleanListBooleansOperations(),
  new DateOperations(),
]

const splListFilterer: SPLListFilterer = new SPLListFilterer(
  new SPLPredicateFilter(new OperandReader(new PropertyWalker()), operations),
  new SPLLimitExtractor(new OperandReader(new PropertyWalker())),
  new SPLComparatorFactory(new PropertyWalker()),
  new SPLQueryToTreeConverter(),
)

const run = (query: string, input: any[], variables: any = {}): any[] =>
  splListFilterer.formatOutput(
    splListFilterer.filter(
      query,
      splListFilterer.formatInput(input),
      splListFilterer.formatVariables(variables),
    ),
  )

// A list whose elements hold a nested sub-node, itself wrapping a list of objects.
const accounts = [
  { id: 'C1', category: 'PRO', invoices: { items: [{ status: '210' }, { status: '100' }] } },
  { id: 'C2', category: 'PRO', invoices: { items: [{ status: '100' }] } },
  { id: 'C3', category: 'PART', invoices: { items: [{ status: '210' }] } },
]

// MAP over a nested array ---------------------------------------------------

test('Nested Dataset [MAP over a sub-node array]', () => {
  expect(run("'210' IN MAP(invoices.items, status)", accounts).map((o) => o.id)).toEqual([
    'C1',
    'C3',
  ])
})

test('Nested Dataset [MAP over a sub-node array, no match]', () => {
  expect(run("'999' IN MAP(invoices.items, status)", accounts)).toEqual([])
})

test('Nested Dataset [formatOutput leaves no Map behind]', () => {
  const [account] = run("id = 'C1'", accounts)

  expect(account).toEqual(accounts[0])
  expect(account.invoices).toBeInstanceOf(Object)
  expect(account.invoices).not.toBeInstanceOf(Map)
  expect(Array.isArray(account.invoices.items)).toBe(true)
  expect(account.invoices.items[0]).not.toBeInstanceOf(Map)
})

test('Nested Dataset [a plain predicate still works on a nested dataset]', () => {
  expect(run("category = 'PRO'", accounts).map((o) => o.id)).toEqual(['C1', 'C2'])
})

test('Nested Dataset [variables are converted recursively]', () => {
  const filtered = run('id = :filter.id', accounts, { filter: { id: 'C3' } })
  expect(filtered.map((o) => o.id)).toEqual(['C3'])
})

// Null operands -------------------------------------------------------------

const accountsWithHoles = [
  { id: 'C1', invoices: { items: [{ status: '210' }] } },
  { id: 'C2', invoices: null },
  { id: 'C3' },
]

test('Null operand [a null sub-node discards the element instead of throwing]', () => {
  expect(() => run("'210' IN MAP(invoices.items, status)", accountsWithHoles)).not.toThrow()
  expect(run("'210' IN MAP(invoices.items, status)", accountsWithHoles).map((o) => o.id)).toEqual([
    'C1',
  ])
})

test('Null operand [null-aware operators keep working]', () => {
  expect(run('invoices = null', accountsWithHoles).map((o) => o.id)).toEqual(['C2', 'C3'])
  expect(run('invoices != null', accountsWithHoles).map((o) => o.id)).toEqual(['C1'])
})

// Sorting -------------------------------------------------------------------

const invoices = [
  { ref: 'F1', date: '2026-01-10', amount: 30 },
  { ref: 'F2', date: '2026-03-02', amount: 10 },
  { ref: 'F3', date: '2026-02-20', amount: 30 },
]

test('Sorting [ISO dates ascending]', () => {
  expect(run('SORT BY date ASC', invoices).map((o) => o.ref)).toEqual(['F1', 'F3', 'F2'])
})

test('Sorting [ISO dates descending]', () => {
  expect(run('SORT BY date DESC', invoices).map((o) => o.ref)).toEqual(['F2', 'F3', 'F1'])
})

test('Sorting [ISO date-times descending]', () => {
  const withTimes = [
    { ref: 'F1', date: '2026-01-10T08:00:00.000Z' },
    { ref: 'F2', date: '2026-01-10T22:00:00.000Z' },
    { ref: 'F3', date: '2026-01-09T23:00:00.000Z' },
  ]
  expect(run('SORT BY date DESC', withTimes).map((o) => o.ref)).toEqual(['F2', 'F1', 'F3'])
})

test('Sorting [a tie on the first rule falls through to the next one]', () => {
  expect(run('SORT BY amount ASC, date DESC', invoices).map((o) => o.ref)).toEqual([
    'F2',
    'F3',
    'F1',
  ])
})

test('Sorting [a missing field does not throw and keeps the other rules usable]', () => {
  const partial = [
    { ref: 'F1', amount: 2 },
    { ref: 'F2' },
    { ref: 'F3', amount: 1 },
  ]
  expect(() => run('SORT BY amount ASC', partial)).not.toThrow()
  expect(run('SORT BY amount ASC', partial)).toHaveLength(3)
})

test('Sorting [filter, then sort and limit]', () => {
  const filtered = run(
    "'210' IN MAP(changes.items, status) SORT BY date DESC LIMIT 2",
    [
      { date: '2026-01-10', changes: { items: [{ status: '210' }, { status: '100' }] } },
      { date: '2026-03-02', changes: { items: [{ status: '100' }] } },
      { date: '2026-02-20', changes: { items: [{ status: '210' }] } },
    ],
  )

  expect(filtered.map((o) => o.date)).toEqual(['2026-02-20', '2026-01-10'])
})
