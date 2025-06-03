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

type ArrayMapDataset = Map<string, Object>[]

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

// DATASETS
const dataSet1: ArrayMapDataset = [
  new Map([
    ['firstName', 'Martin'],
    ['lastName', 'Dupont'],
    ['age', 21 as Object],
    ['isStudent', true as Object],
  ]),
  new Map([
    ['firstName', 'Bertrand'],
    ['lastName', 'Dupont'],
    ['age', 23 as Object],
    ['isStudent', false as Object],
  ]),
  new Map([
    ['firstName', 'Michel'],
    ['lastName', 'Dupond'],
    ['age', 19 as Object],
    ['isStudent', false as Object],
  ]),
]
const dataSet2: ArrayMapDataset = [
  new Map([
    ['firstName', 'Martin'],
    ['lastName', 'Dupont'],
    ['age', 21 as Object],
  ]),
  new Map([
    ['firstName', 'Bertrand'],
    ['lastName', 'Dupont'],
    ['age', 17 as Object],
  ]),
  new Map([
    ['firstName', 'Michel'],
    ['lastName', 'Dupond'],
    ['age', 19 as Object],
  ]),
]
const dataSet3: ArrayMapDataset = [
  new Map([
    ['firstName', 'Martin'],
    ['secondName', 'Benoit'],
    ['lastName', 'Dupont'],
    ['givenName', 'Adrien'],
    ['age', 21 as Object],
  ]),
  new Map([
    ['firstName', 'Bertrand'],
    ['secondName', 'Jean'],
    ['lastName', 'Dupont'],
    ['givenName', 'Jean'],
    ['age', 17 as Object],
  ]),
]
const dataSet4: ArrayMapDataset = [
  new Map([
    [
      'names',
      new Map([
        ['firstName', 'Martin'],
        ['secondName', 'Benoit'],
        ['lastName', 'Dupont'],
      ]),
    ],
    ['givenName', 'Adrien'],
    ['age', 21 as Object],
  ]),
  new Map([
    [
      'names',
      new Map([
        ['firstName', 'Bertrand'],
        ['secondName', 'Jean'],
        ['lastName', 'Dupont'],
      ]),
    ],
    ['givenName', 'Jean'],
    ['age', 17 as Object],
  ]),
]
const dataSet5: ArrayMapDataset = [
  new Map([
    ['firstName', 'Martin'],
    ['lastName', 'Dupont'],
    ['age', 10 as Object],
  ]),
  new Map([
    ['firstName', 'Bertrand'],
    ['lastName', 'Dupont'],
    ['age', 2 as Object],
  ]),
  new Map([
    ['firstName', 'Michel'],
    ['lastName', 'Dupond'],
    ['age', 1 as Object],
  ]),
]
const dataSet6: ArrayMapDataset = [
  new Map([
    ['name', 'Apollo11'],
    ['date', '20-07-1969'],
  ]),
  new Map([
    ['name', 'BerlinWall'],
    ['date', '09-11-1989'],
  ]),
  new Map([
    ['name', 'Tchernobyl'],
    ['date', '26-04-1986'],
  ]),
]

const dataSet7 = [
  {
    idFacture: '11014099830124',
    dateFacturation: '2024-01-05T23:00:00.000Z',
    dateLimitePaieFacture: '2024-01-19T23:00:00.000Z',
    soldeApresFacture: 49.99,
    mntTotFacture: 49.99,
    typePaieFacture: 'PA',
    soldeFacturePrec: 0,
    versionFacture: '3',
    flagDF: false,
    etatBalance: 'D',
    edps: [],
  },
  {
    idFacture: '11013892741223',
    dateFacturation: '2023-12-05T23:00:00.000Z',
    dateLimitePaieFacture: '2023-12-19T23:00:00.000Z',
    soldeApresFacture: 49.99,
    mntTotFacture: 49.99,
    typePaieFacture: 'PA',
    soldeFacturePrec: 0,
    versionFacture: '3',
    flagDF: false,
    etatBalance: 'D',
    edps: [],
  },
  {
    idFacture: '11013681391123',
    dateFacturation: '2023-11-05T23:00:00.000Z',
    dateLimitePaieFacture: '2023-11-19T23:00:00.000Z',
    soldeApresFacture: 49.99,
    mntTotFacture: 49.99,
    typePaieFacture: 'PA',
    soldeFacturePrec: 0,
    versionFacture: '3',
    flagDF: false,
    etatBalance: 'D',
    edps: [],
  },
  {
    idFacture: '11013582411023',
    dateFacturation: '2023-10-05T22:00:00.000Z',
    dateLimitePaieFacture: '2023-11-05T23:00:00.000Z',
    mntTotFacture: 299.94,
    typePaieFacture: 'PA',
    soldeFacturePrec: 0,
    versionFacture: '3',
    flagDF: false,
    etatBalance: 'D',
    edps: [],
  },
  {
    idFacture: '11012003130423',
    dateFacturation: '2023-04-05T22:00:00.000Z',
    dateLimitePaieFacture: '2023-04-19T22:00:00.000Z',
    soldeApresFacture: 51.6,
    mntTotFacture: 51.6,
    typePaieFacture: 'PA',
    soldeFacturePrec: 0,
    versionFacture: '3',
    flagDF: false,
    etatBalance: 'D',
    edps: [],
  },
]

const dataSet8 = [
  {
    id: 'RESTITEQUIP_RL_202212_9082362800079400000000000100',
    codeMotif: 'RESTITEQUIP_RL',
    type: 'BON_RETOUR',
    libelle: 'bon de retour relais-colis',
    dateDemandeClient: '2022-12-28',
    dateDernierDelaiRetrait: '2023-04-07',
  },
  {
    id: 'RESTITEQUIP_RL_202212_9082362800079400000000000101',
    codeMotif: 'RESTITEQUIP_RL',
    type: 'BON_RETOUR',
    libelle: 'bon de retour relais-colis',
    dateDemandeClient: '2022-12-28',
    dateDernierDelaiRetrait: '2023-04-07',
  },
  {
    id: 'RESTITEQUIP_RL_202212_9082362800079400000000000102',
    codeMotif: 'RESTITEQUIP_RL',
    type: 'BON_RETOUR',
    libelle: 'bon de retour relais-colis',
    dateDemandeClient: '2022-12-28',
    dateDernierDelaiRetrait: '2023-04-07',
  },
]
// TESTS
test('Simple Dataset [string check]', () => {
  const filteredDataset: ArrayMapDataset = splListFilterer.filter("lastName = 'Dupont'", dataSet1)
  expect(filteredDataset.length).toBe(2)
})
test('Simple Dataset [number check]', () => {
  const filteredDataset: ArrayMapDataset = splListFilterer.filter('age = 23', dataSet1)
  expect(filteredDataset.length).toBe(1)
})
test('Simple Dataset [boolean check]', () => {
  const filteredDataset: ArrayMapDataset = splListFilterer.filter('isStudent = false', dataSet1)
  expect(filteredDataset.length).toBe(2)
})
test('Simple Dataset [OR]', () => {
  const filteredDataset: ArrayMapDataset = splListFilterer.filter(
    "(lastName = 'Dupont') OR (lastName = 'Dupond')",
    dataSet1,
  )
  expect(filteredDataset.length).toBe(3)
})
test('Simple Dataset [XOR]', () => {
  const filteredDataset: ArrayMapDataset = splListFilterer.filter(
    "(lastName = 'Dupont') XOR (lastName = 'Dupond')",
    dataSet1,
  )
  expect(filteredDataset.length).toBe(3)
})
test('Simple Dataset [Two Conditions]', () => {
  const filteredDataset18plus: ArrayMapDataset = splListFilterer.filter(
    "(lastName = 'Dupont') AND (age >= 18)",
    dataSet2,
  )
  const filteredDataset: ArrayMapDataset = splListFilterer.filter(
    "(lastName = 'Dupont') AND (age >= 0)",
    dataSet2,
  )

  expect(filteredDataset18plus.length).toBe(1)
  expect(filteredDataset.length).toBe(2)
})
test('Simple Dataset [Filter List on List]', () => {
  const filteredDataset18plus: ArrayMapDataset = splListFilterer.filter(
    "(lastName = 'Dupont') AND (age >= 18)",
    dataSet2,
  )
  const filteredDataset20plus: ArrayMapDataset = splListFilterer.filter(
    'age >= 20',
    filteredDataset18plus,
  )

  expect(filteredDataset20plus.length).toBe(1)
})
test('Simple Dataset [With List Conditions [AND]]', () => {
  const filteredDataset: ArrayMapDataset = splListFilterer.filter(
    "(lastName IN ['Dupont', 'Dupond']) AND (age >= 18)",
    dataSet2,
  )
  expect(filteredDataset.length).toBe(2)
})
test('Simple Dataset [With List Conditions [AND] [none]]', () => {
  const filteredDataset: ArrayMapDataset = splListFilterer.filter(
    "(lastName IN ['Duponx']) AND (age >= 18)",
    dataSet2,
  )
  expect(filteredDataset.length).toBe(0)
})
test('Simple Dataset [With List Conditions [OR]]', () => {
  const filteredDataset: ArrayMapDataset = splListFilterer.filter(
    "(lastName IN ['Duponx']) OR (age >= 18)",
    dataSet2,
  )
  expect(filteredDataset.length).toBe(2)
})
test('Simple Dataset [With List Conditions [Itself]]', () => {
  const filteredDataset: ArrayMapDataset = splListFilterer.filter(
    'lastName IN [lastName]',
    dataSet2,
  )
  expect(filteredDataset.length).toBe(3)
})
test('Simple Dataset [With List Conditions [Itself] [none]]', () => {
  const filteredDataset: ArrayMapDataset = splListFilterer.filter(
    'lastName IN [firstName]',
    dataSet2,
  )
  expect(filteredDataset.length).toBe(0)
})
test('Simple Dataset [With List Conditions [Itself] [2nd example]]', () => {
  const filteredDataset: ArrayMapDataset = splListFilterer.filter(
    'givenName IN [firstName, secondName]',
    dataSet3,
  )
  expect(filteredDataset.length).toBe(1)
})
test('Simple Dataset [Comparison String In Value]', () => {
  const filteredDataset: ArrayMapDataset = splListFilterer.filter("'M' IN firstName", dataSet2)
  expect(filteredDataset.length).toBe(2)
})
test('Simple Dataset [Comparison String In Value [parenthesis]]', () => {
  const filteredDataset: ArrayMapDataset = splListFilterer.filter(
    "(('a' IN firstName) OR ('i' IN firstName)) AND ('M' IN firstName)",
    dataSet2,
  )
  expect(filteredDataset.length).toBe(2)
})
test('Simple Dataset [Comparison String In Value [none]]', () => {
  const filteredDataset: ArrayMapDataset = splListFilterer.filter("'m' IN firstName", dataSet2)
  expect(filteredDataset.length).toBe(0)
})
test('Simple Dataset [With Deep Comparision]', () => {
  const filteredDataset: ArrayMapDataset = splListFilterer.filter(
    'givenName IN [names.firstName, names.secondName]',
    dataSet4,
  )
  expect(filteredDataset.length).toBe(1)
})
test('Simple Dataset [Limit 0]', () => {
  const filteredDataset: ArrayMapDataset = splListFilterer.filter('LIMIT 0', dataSet2)
  expect(filteredDataset.length).toBe(0)
})
test('Simple Dataset [Limit 4]', () => {
  const filteredDataset: ArrayMapDataset = splListFilterer.filter('LIMIT 4', dataSet2)
  expect(filteredDataset.length).toBe(3)
})
test('Simple Dataset [Negative Limit [ko]]', () => {
  expect(() => splListFilterer.filter('LIMIT -1', dataSet2)).toThrow(Error)
})
test('Simple Dataset [String as Limit [ko]]', () => {
  expect(() => splListFilterer.filter('LIMIT TEN', dataSet2)).toThrow(Error)
})
test('Simple Dataset [Limit Offset]', () => {
  const ss_test_1: number = splListFilterer.filter('LIMIT 1, 0', dataSet2)[0].get('age') as number
  const ss_test_2: number = splListFilterer.filter('LIMIT 1, 1', dataSet2)[0].get('age') as number
  const ss_test_3: number = splListFilterer.filter('LIMIT 1, 2', dataSet2)[0].get('age') as number
  expect(ss_test_1).toBe(21)
  expect(ss_test_2).toBe(17)
  expect(ss_test_3).toBe(19)
})
test('Simple Dataset [Limit [multiplication]]', () => {
  const filteredDataset: ArrayMapDataset = splListFilterer.filter('LIMIT (20 * 1)', dataSet2)
  expect(filteredDataset.length).toBe(3)
})
test('Simple Dataset [Limit [multiplication] [no parenthesis]]', () => {
  const filteredDataset: ArrayMapDataset = splListFilterer.filter('LIMIT 1 * 2', dataSet2)
  expect(filteredDataset.length).toBe(2)
})
test('Simple Dataset [Limit Offset [multiplication]]', () => {
  const filteredDataset: ArrayMapDataset = splListFilterer.filter('LIMIT (1*1), (1*2)', dataSet2)
  expect(filteredDataset[0].get('age')).toBe(19)
})
test('Simple Dataset [Limit Offset [multiplication] [no parenthesis]]', () => {
  const filteredDataset: ArrayMapDataset = splListFilterer.filter('LIMIT 1*1, 1*2', dataSet2)
  expect(filteredDataset[0].get('age')).toBe(19)
})
test('Simple Dataset [Sort by First Name [asc]]', () => {
  const filteredDataset: ArrayMapDataset = splListFilterer.filter('SORT BY firstName', dataSet2)
  expect(filteredDataset[0].get('firstName')).toBe('Bertrand')
  expect(filteredDataset[1].get('firstName')).toBe('Martin')
  expect(filteredDataset[2].get('firstName')).toBe('Michel')
})
test('Simple Dataset [Sort by First Name [desc]]', () => {
  const filteredDataset: ArrayMapDataset = splListFilterer.filter(
    'SORT BY firstName DESC',
    dataSet2,
  )
  expect(filteredDataset[0].get('firstName')).toBe('Michel')
  expect(filteredDataset[1].get('firstName')).toBe('Martin')
  expect(filteredDataset[2].get('firstName')).toBe('Bertrand')
})
test('Simple Dataset [Sort by Last Name [asc] and First Name [desc]]', () => {
  const filteredDataset: ArrayMapDataset = splListFilterer.filter(
    'SORT BY lastName ASC, firstName ASC',
    dataSet2,
  )
  expect(filteredDataset[0].get('firstName')).toBe('Michel')
  expect(filteredDataset[1].get('firstName')).toBe('Bertrand')
  expect(filteredDataset[2].get('firstName')).toBe('Martin')
})
test('Simple Dataset [Sort by First Name [asc] and First Name [desc]]', () => {
  const filteredDataset: ArrayMapDataset = splListFilterer.filter(
    'SORT BY firstName ASC, firstName DESC',
    dataSet2,
  )
  expect(filteredDataset[0].get('firstName')).toBe('Bertrand')
  expect(filteredDataset[1].get('firstName')).toBe('Martin')
  expect(filteredDataset[2].get('firstName')).toBe('Michel')
})
test('Simple Dataset [Sort by Last Name [asc] and Age [asc]]', () => {
  const filteredDataset: ArrayMapDataset = splListFilterer.filter(
    'SORT BY lastName ASC, age ASC',
    dataSet1,
  )
  expect(filteredDataset[0].get('firstName')).toBe('Michel')
  expect(filteredDataset[1].get('firstName')).toBe('Martin')
  expect(filteredDataset[2].get('firstName')).toBe('Bertrand')
})
test('Simple Dataset [Sort by Age [asc]]', () => {
  const filteredDataset: ArrayMapDataset = splListFilterer.filter('SORT BY age ASC', dataSet5)
  expect(filteredDataset[0].get('firstName')).toBe('Michel')
  expect(filteredDataset[1].get('firstName')).toBe('Bertrand')
  expect(filteredDataset[2].get('firstName')).toBe('Martin')
})
test('Simple Dataset [Sort by Age [desc]]', () => {
  const filteredDataset: ArrayMapDataset = splListFilterer.filter('SORT BY age DESC', dataSet5)
  expect(filteredDataset[0].get('firstName')).toBe('Martin')
  expect(filteredDataset[1].get('firstName')).toBe('Bertrand')
  expect(filteredDataset[2].get('firstName')).toBe('Michel')
})
test('Simple Dataset [Sort by Date [asc]]', () => {
  const filteredDataset: ArrayMapDataset = splListFilterer.filter('SORT BY date ASC', dataSet6)
  expect(filteredDataset[0].get('name')).toBe('Apollo11')
  expect(filteredDataset[1].get('name')).toBe('Tchernobyl')
  expect(filteredDataset[2].get('name')).toBe('BerlinWall')
})
test('Simple Dataset [Sort by Date [desc]]', () => {
  const filteredDataset: ArrayMapDataset = splListFilterer.filter('SORT BY date DESC', dataSet6)
  expect(filteredDataset[0].get('name')).toBe('BerlinWall')
  expect(filteredDataset[1].get('name')).toBe('Tchernobyl')
  expect(filteredDataset[2].get('name')).toBe('Apollo11')
})
test('Complex Request', () => {
  const jsonInput: string =
    '[ { "id": "10072860594", "statut": "ACTIF", "abonnement": { "offreDataMobile": false }, "contratsAppaireDataPartagee": [ { "id": "10073441930" } ] }, { "id": "610012126868", "statut": "ACTIF", "abonnement": {} }, { "id": "10073441930", "statut": "ACTIF", "abonnement": { "offreDataMobile": true }, "contratsAppaireDataPartagee": [ { "id": "10072860594" } ] }, { "id": "10074329629", "statut": "RESILIE", "abonnement": { "offreDataMobile": true } } ]'
  const parsedJsonInput = JSON.parse(jsonInput)

  const inputMap: ArrayMapDataset = []
  for (var i in parsedJsonInput) {
    for (var j in parsedJsonInput[i]) {
      if (JSON.stringify(parsedJsonInput[i][j]).substring(0, 1) === '{') {
        parsedJsonInput[i][j] = new Map(Object.entries(parsedJsonInput[i][j]))
      }
    }
    inputMap.push(new Map(Object.entries(parsedJsonInput[i])))
  }

  const splQuery: string =
    "(statut != 'RESILIE') AND ((abonnement.offreDataMobile = null) OR (abonnement.offreDataMobile = false) OR (contratsAppaireDataPartagee = null))"

  const output: ArrayMapDataset = splListFilterer.filter(splQuery, inputMap)

  expect(output.length).toBe(2)
})
test('Simple Dataset [With Deep Comparision] 2', () => {
  const filteredDataset: ArrayMapDataset = splListFilterer.filter(
    "idFacture IN ['11014099830124']",
    splListFilterer.formatInput(dataSet7),
  )
  expect(filteredDataset.length).toBe(1)
})

test('Simple Dataset [With variables] 2', () => {
  const filteredDataset: ArrayMapDataset = splListFilterer.filter(
    'id = :brId',
    splListFilterer.formatInput(dataSet8),
    splListFilterer.formatVariables({
      brId: 'RESTITEQUIP_RL_202212_9082362800079400000000000100',
    }),
  )
  expect(filteredDataset.length).toBe(1)
})
