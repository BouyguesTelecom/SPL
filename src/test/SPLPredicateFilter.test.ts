// SPDX-License-Identifier: Apache-2.0

import { test, expect } from 'vitest'
import { OperandReader } from '../OperandReader'
import { PropertyWalker } from '../PropertyWalker'
import { SPLPredicateFilter } from '../predicate/SPLPredicateFilter'
import { SPLQueryToTreeConverter } from '../antlr/SPLQueryToTreeConverter'
import { QueryContext } from '../antlr/SPLParser'
import {
  StringOperations,
  StringListStringOperations,
  DateOperations,
  NumberOperations,
  BooleanOperations,
  BooleanListBooleansOperations,
} from '../predicate/operations'

type MapDataset = Map<string, Object>

let splpredicatefilter: SPLPredicateFilter = new SPLPredicateFilter(
  new OperandReader(new PropertyWalker()),
  [
    new StringOperations(),
    new StringListStringOperations(),
    new NumberOperations(),
    new BooleanOperations(),
    new BooleanListBooleansOperations(),
    new DateOperations(),
  ],
)

function ctx(query: string): QueryContext {
  return new SPLQueryToTreeConverter().createTree(query)
}

// DATASETS
const dataSet1: MapDataset = new Map([
  ['key', 'value'],
  ['key2', 'value2'],
  ['f', 'h'],
])
const dataSet2: MapDataset = new Map([
  ['key', 'value'],
  ['key2', '1223'],
  ['id', '1234512'],
  ['realNumber', 123 as Object],
  ['floatNumber', 123.4 as Object],
])
const dataSet3: MapDataset = new Map([
  ['id', 'item1'],
  ['lines', [new Map([['number', '0600000000']]), new Map([['number', '0600000001']])] as Object],
])
const dataSet3_with_booleans: MapDataset = new Map([
  ['id', 'item1'],
  [
    'set1',
    [
      new Map([['number', true]]),
      new Map([['number', false]]),
      new Map([['number', true]]),
      new Map([['number', false]]),
    ] as Object,
  ],
  [
    'set2',
    [
      new Map([['number', true]]),
      new Map([['number', true]]),
      new Map([['number', true]]),
      new Map([['number', true]]),
    ] as Object,
  ],
  [
    'set3',
    [
      new Map([['number', false]]),
      new Map([['number', false]]),
      new Map([['number', false]]),
      new Map([['number', false]]),
    ] as Object,
  ],
])
const dataSet3_underscore: MapDataset = new Map([
  ['id', 'item1'],
  [
    'lines',
    [new Map([['number_id', '0600000000']]), new Map([['number_id', '0600000001']])] as Object,
  ],
])
const dataSet4: MapDataset = new Map([
  ['id', 'item1'],
  [
    'lines',
    [
      new Map([['number', new Map([['msisdn', '0600000000']])]]),
      new Map([['number', new Map([['msisdn', '0600000001']])]]),
    ] as Object,
  ],
])
const dataSet5: MapDataset = new Map([
  ['firstDate', '1950-01-01'],
  ['secondDate', 'DATE(2000-01-01)'],
  ['thirdDate', "DATE('3000-01-01')"],
])
const dataSet6: MapDataset = new Map([['city_name', 'paris']])
const datasSet8: MapDataset = new Map([
  ['key', ['value1', 'value2', 'value3'] as Object],
  ['key2', ['value4', 'value5', 'value6'] as Object],
  ['key3', ['value1', 'value3', 'value9'] as Object],
])
const cookies: MapDataset = new Map([
  [
    'cookies',
    new Map([
      ['cookie1', 'a,b,c,d,e'],
      ['cookie2', 'a,b,c,d,e'],
      ['cookie3', 'a,b,c,d,e'],
    ]) as Object,
  ],
  ['foo', 'bar'],
])

// TESTS
test('Empty List and Empty Predicate [ok]', () => {
  expect(splpredicatefilter.filter(ctx(''), dataSet1, new Map())).toBe(true)
})
test('Invalid Query [ko]', () => {
  expect(() => splpredicatefilter.filter(ctx('INVALID QUERY'), dataSet1, new Map())).toThrow(Error)
})
test('Key Equals Value [ok]', () => {
  expect(splpredicatefilter.filter(ctx('key = "value"'), dataSet1, new Map())).toBe(true)
})
test('Key not Equals Value [ok]', () => {
  expect(splpredicatefilter.filter(ctx('key != "value2"'), dataSet1, new Map())).toBe(true)
})
test('Key Equals Value [snake case]', () => {
  expect(splpredicatefilter.filter(ctx('city_name = "paris"'), dataSet6, new Map())).toBe(true)
  expect(splpredicatefilter.filter(ctx('city_name = "lyon"'), dataSet6, new Map())).toBe(false)
})
test('Value not in Dataset', () => {
  expect(splpredicatefilter.filter(ctx('key3 = 1'), dataSet1, new Map())).toBe(false)
})
test('Key Contains Value [ok]', () => {
  expect(splpredicatefilter.filter(ctx('key CONTAINS "val"'), dataSet1, new Map())).toBe(true)
})
test('Value ILike Value [ok]', () => {
  expect(splpredicatefilter.filter(ctx('"VALUE" ILIKE "value"'), dataSet1, new Map())).toBe(true)
})
test('Simple Arithmetic Test [ok]', () => {
  expect(splpredicatefilter.filter(ctx('1 = 1'), dataSet1, new Map())).toBe(true)
})
test('Simple Arithmetic Test [nok]', () => {
  expect(splpredicatefilter.filter(ctx('1 != 1'), dataSet1, new Map())).toBe(false)
})
test('Simple Arithmetic Test 2 [ok]', () => {
  expect(splpredicatefilter.filter(ctx('1 != -1'), dataSet1, new Map())).toBe(true)
})
test('Simple Addition Test [ok]', () => {
  expect(splpredicatefilter.filter(ctx('(1 + 0) = 1'), dataSet1, new Map())).toBe(true)
})
test('Simple Multiplication Test [ok]', () => {
  expect(splpredicatefilter.filter(ctx('(1 * 0) = 0'), dataSet1, new Map())).toBe(true)
})
test('Simple Division Test [ok]', () => {
  expect(splpredicatefilter.filter(ctx('(1 / 1) = 1'), dataSet1, new Map())).toBe(true)
})
test('Simple Modulo Test [ok]', () => {
  expect(splpredicatefilter.filter(ctx('(1 % 1) = 0'), dataSet1, new Map())).toBe(true)
})
test('Complex Operation Test [ok]', () => {
  expect(
    splpredicatefilter.filter(ctx('(1+2+3*4-4/2)*23+12*(2*3+4)-23 = 396'), dataSet1, new Map()),
  ).toBe(true)
})
test('Simple Date Comparison [ok]', () => {
  expect(splpredicatefilter.filter(ctx('2020-07-03 = 2020-07-03'), dataSet1, new Map())).toBe(true)
})
test('Simple Date Comparison [nok]', () => {
  expect(splpredicatefilter.filter(ctx('2020-07-04 = 2020-07-03'), dataSet1, new Map())).toBe(false)
})
test('Deep Find', () => {
  expect(splpredicatefilter.filter(ctx("cookies.cookie1 = 'a,b,c,d,e'"), cookies, cookies)).toBe(
    true,
  )
  expect(splpredicatefilter.filter(ctx(":cookies.cookie1 = 'a,b,c,d,e'"), cookies, cookies)).toBe(
    true,
  )
})
test('Simple Date Wrong Format Comparison [nok]', () => {
  expect(splpredicatefilter.filter(ctx('2020-07-04 = 2020-7-03'), dataSet1, new Map())).toBe(false)
})
test('Simple Date Comparison Now vs 1900', () => {
  expect(splpredicatefilter.filter(ctx('1900-07-04 < NOW()'), dataSet1, new Map())).toBe(true)
  expect(splpredicatefilter.filter(ctx('1900-07-04 > NOW()'), dataSet1, new Map())).toBe(false)
})
test('Date String not Equals', () => {
  expect(splpredicatefilter.filter(ctx("1900-07-04 = '1900-07-04'"), dataSet1, new Map())).toBe(
    false,
  )
})
test('Date Arithmetic [nok]', () => {
  expect(
    splpredicatefilter.filter(ctx('1900-07-04 + 1900-07-04 = 3801-02-08'), dataSet1, new Map()),
  ).toBe(false)
})
test('Date Day Arithmetic [ok]', () => {
  expect(
    splpredicatefilter.filter(ctx('DAY(2000-01-10) - DAY(1900-01-01) = 9'), dataSet1, new Map()),
  ).toBe(true)
})
test('Date Month Arithmetic [ok]', () => {
  expect(
    splpredicatefilter.filter(
      ctx('MONTH(2000-02-01) - MONTH(1900-01-01) = 1'),
      dataSet1,
      new Map(),
    ),
  ).toBe(true)
})
test('Date Year Arithmetic [ok]', () => {
  expect(
    splpredicatefilter.filter(
      ctx('YEAR(2000-01-01) - YEAR(1900-01-01) = 100'),
      dataSet1,
      new Map(),
    ),
  ).toBe(true)
})
test('Date Variable Equals [nok]', () => {
  expect(splpredicatefilter.filter(ctx('firstDate = 1950-01-01'), dataSet5, new Map())).toBe(false)
})
test('Date Variable Equals String [ok]', () => {
  expect(splpredicatefilter.filter(ctx("firstDate = '1950-01-01'"), dataSet5, new Map())).toBe(true)
})
test('Date Variable Equals Date [nok]', () => {
  expect(splpredicatefilter.filter(ctx('firstDate = DATE(1950-01-01)'), dataSet5, new Map())).toBe(
    false,
  )
})
test('Date Variable Equals Date as String [nok]', () => {
  expect(
    splpredicatefilter.filter(ctx("firstDate = DATE('1950-01-01')"), dataSet5, new Map()),
  ).toBe(false)
})
test('Date Variable [typed date] Equals [nok]', () => {
  expect(splpredicatefilter.filter(ctx('secondDate = 2000-01-01'), dataSet5, new Map())).toBe(false)
})
test('Date Variable [typed date] Equals String [ok]', () => {
  expect(
    splpredicatefilter.filter(ctx("secondDate = 'DATE(2000-01-01)'"), dataSet5, new Map()),
  ).toBe(true)
})
test('Date Variable [typed date] Equals Date [nok]', () => {
  expect(splpredicatefilter.filter(ctx('secondDate = DATE(2000-01-01)'), dataSet5, new Map())).toBe(
    false,
  )
})
test('Date Variable [typed date] Equals Date as String [nok]', () => {
  expect(
    splpredicatefilter.filter(ctx("secondDate = DATE('2000-01-01')"), dataSet5, new Map()),
  ).toBe(false)
})
test('Date Variable [typed date as string] Equals Date as String [nok]', () => {
  expect(
    splpredicatefilter.filter(ctx("thirdDate = DATE('3000-01-01')"), dataSet5, new Map()),
  ).toBe(false)
})
test('Extract Day Month Year', () => {
  expect(splpredicatefilter.filter(ctx('4 = DAY(1900-07-04)'), dataSet1, new Map())).toBe(true)
  expect(splpredicatefilter.filter(ctx('7 = MONTH(1900-07-04)'), dataSet1, new Map())).toBe(true)
  expect(splpredicatefilter.filter(ctx('1900 = YEAR(1900-07-04)'), dataSet1, new Map())).toBe(true)
})
test('Year Comparaison', () => {
  expect(splpredicatefilter.filter(ctx('YEAR(NOW()) >= 2021'), dataSet1, new Map())).toBe(true)
})
test('Date not Typed to Date Equals to Date', () => {
  expect(
    splpredicatefilter.filter(ctx("1900-07-04 = DATE('1900-07-04')"), dataSet1, new Map()),
  ).toBe(true)
})
test('Date as String Converted to Date Equals to Date', () => {
  expect(
    splpredicatefilter.filter(ctx("'1900-07-04' = DATE('1900-07-04')"), dataSet1, new Map()),
  ).toBe(false)
})
test('Simple Concatenation', () => {
  expect(
    splpredicatefilter.filter(ctx("'abcd' = CONCAT('a', 'b', 'c','d')"), dataSet1, new Map()),
  ).toBe(true)
})
test('Simple Concatenation of Concatenation', () => {
  expect(
    splpredicatefilter.filter(
      ctx("'abcdefgh' = CONCAT('a', 'b', 'c','d', CONCAT('e', 'f', :v, f))"),
      dataSet1,
      new Map([['v', 'g']]),
    ),
  ).toBe(true)
})
test('Simple Concatenation of Numbers [nok]', () => {
  expect(splpredicatefilter.filter(ctx('1011 = CONCAT(1, 0, 2, 1))'), dataSet1, new Map())).toBe(
    false,
  )
})
test('Null Equals Null', () => {
  expect(splpredicatefilter.filter(ctx('null = null'), dataSet1, new Map())).toBe(true)
})
test('Null not Equals Null', () => {
  expect(splpredicatefilter.filter(ctx('null != null'), dataSet1, new Map())).toBe(false)
})
test('Key in Value [ok]', () => {
  expect(splpredicatefilter.filter(ctx('"val" IN "value"'), dataSet1, new Map())).toBe(true)
})
test('Concat Key in Value [ok]', () => {
  expect(
    splpredicatefilter.filter(ctx("CONCAT('v', 'a', 'l') IN \"value\""), dataSet1, new Map()),
  ).toBe(true)
})
test('Key in Value [AND] [ok]', () => {
  expect(
    splpredicatefilter.filter(
      ctx('(\'v\' IN "value") AND (\'a\' IN "value")'),
      dataSet1,
      new Map(),
    ),
  ).toBe(true)
})
test('Key in Value [OR] [ok]', () => {
  expect(
    splpredicatefilter.filter(ctx('(\'v\' IN "value") OR (\'a\' IN "value")'), dataSet1, new Map()),
  ).toBe(true)
})
test('Key in Value [XOR] [nok]', () => {
  expect(
    splpredicatefilter.filter(
      ctx('(\'v\' IN "value") XOR (\'a\' IN "value")'),
      dataSet1,
      new Map(),
    ),
  ).toBe(false)
})
test('Key in Value [XOR] [ok]', () => {
  expect(
    splpredicatefilter.filter(
      ctx('(\'v\' IN "value") XOR (\'b\' IN "value")'),
      dataSet1,
      new Map(),
    ),
  ).toBe(true)
})
test('Key in Value Reverse [nok]', () => {
  expect(splpredicatefilter.filter(ctx('"value" IN "val"'), dataSet1, new Map())).toBe(false)
})
test('Key Equals Value [AND] [nok]', () => {
  expect(
    splpredicatefilter.filter(ctx('(key = "value") AND (key = "value2")'), dataSet1, new Map()),
  ).toBe(false)
})
test('Key Equals Value [&&] [nok]', () => {
  expect(
    splpredicatefilter.filter(ctx('(key = "value") && (key = "value2")'), dataSet1, new Map()),
  ).toBe(false)
})
test('Key Equals Value [OR] [ok]', () => {
  expect(
    splpredicatefilter.filter(ctx('(key = "value") OR (key = "value2")'), dataSet1, new Map()),
  ).toBe(true)
})
test('Key Equals Value [XOR] [ok]', () => {
  expect(
    splpredicatefilter.filter(ctx('(key = "value") XOR (key = "value2")'), dataSet1, new Map()),
  ).toBe(true)
})
test('Key Equals Value [XOR] [nok]', () => {
  expect(
    splpredicatefilter.filter(ctx('(key = "value") XOR (key2 = "value2")'), dataSet1, new Map()),
  ).toBe(false)
})
test('Key Equals Variable [ok]', () => {
  expect(
    splpredicatefilter.filter(ctx('key = :variable1'), dataSet1, new Map([['variable1', 'value']])),
  ).toBe(true)
})
test('Deep Expression [ok]', () => {
  expect(
    splpredicatefilter.filter(
      ctx('((key = "value") OR ((key = "value2") AND (key = "value"))) OR (key = "value2")'),
      dataSet1,
      new Map(),
    ),
  ).toBe(true)
})
test('Key Addition [ok]', () => {
  expect(splpredicatefilter.filter(ctx('realNumber + realNumber = 246'), dataSet2, new Map())).toBe(
    true,
  )
})
test('Key Addition [nok]', () => {
  expect(
    splpredicatefilter.filter(ctx('floatNumber + realNumber = 246'), dataSet2, new Map()),
  ).toBe(false)
})
test('Parenthesis Check [ok]', () => {
  expect(
    splpredicatefilter.filter(ctx('((1 = 1) OR (1 = 1)) XOR (1 = 0)'), dataSet2, new Map()),
  ).toBe(true)
})
test('Comparison Float Variable Equals [ok]', () => {
  expect(
    splpredicatefilter.filter(
      ctx('floatNumber > :variable'),
      dataSet2,
      new Map([['variable', 1.0]]),
    ),
  ).toBe(true)
})
test('Comparison Float Variable Greater or Equals [ok]', () => {
  expect(
    splpredicatefilter.filter(
      ctx('floatNumber >= :variable'),
      dataSet2,
      new Map([['variable', 1.0]]),
    ),
  ).toBe(true)
})
test('Comparison Float Variable Greater or Equals Same Value [ok]', () => {
  expect(
    splpredicatefilter.filter(
      ctx('floatNumber >= :variable'),
      dataSet2,
      new Map([['variable', 123.4]]),
    ),
  ).toBe(true)
})
test('Comparison Real Number Greater or Equals Float [ok]', () => {
  expect(
    splpredicatefilter.filter(
      ctx('realNumber >= :variable'),
      dataSet2,
      new Map([['variable', 123.0]]),
    ),
  ).toBe(true)
})
test('Reverse String', () => {
  expect(
    splpredicatefilter.filter(
      ctx("REVERSE('ABCD') = 'ABCD'"),
      dataSet2,
      new Map([['variable', 123.0]]),
    ),
  ).toBe(false)
  expect(
    splpredicatefilter.filter(
      ctx("REVERSE('ABCD') = 'DBCA'"),
      dataSet2,
      new Map([['variable', 123.0]]),
    ),
  ).toBe(false)
  expect(
    splpredicatefilter.filter(
      ctx("REVERSE('ABCD') = 'DCBA'"),
      dataSet2,
      new Map([['variable', 123.0]]),
    ),
  ).toBe(true)
})
test('Reverse String Variables', () => {
  expect(
    splpredicatefilter.filter(
      ctx('REVERSE(:stringOne) = :stringOne'),
      dataSet2,
      new Map([
        ['stringOne', 'ABCD'],
        ['stringTwo', 'DCBA'],
      ]),
    ),
  ).toBe(false)
  expect(
    splpredicatefilter.filter(
      ctx('REVERSE(:stringOne) = :stringTwo'),
      dataSet2,
      new Map([
        ['stringOne', 'ABCD'],
        ['stringTwo', 'DCBA'],
      ]),
    ),
  ).toBe(true)
})
test('Item Exists in Map', () => {
  expect(
    splpredicatefilter.filter(ctx("'0600000001' IN MAP(lines, number)"), dataSet3, new Map()),
  ).toBe(true)
})
test('Item Exists in Map [boolean]', () => {
  expect(
    splpredicatefilter.filter(ctx('true IN MAP(set1, number)'), dataSet3_with_booleans, new Map()),
  ).toBe(true)
  expect(
    splpredicatefilter.filter(ctx('true IN MAP(set2, number)'), dataSet3_with_booleans, new Map()),
  ).toBe(true)
})
test('Item not Exists in Map [boolean]', () => {
  expect(
    splpredicatefilter.filter(ctx('true IN MAP(set3, number)'), dataSet3_with_booleans, new Map()),
  ).toBe(false)
})
test('Item Exists in Map [underscore]', () => {
  expect(
    splpredicatefilter.filter(
      ctx("'0600000001' IN MAP(lines, number_id)"),
      dataSet3_underscore,
      new Map(),
    ),
  ).toBe(true)
})
test('Item Exists in Map [deep search]', () => {
  expect(
    splpredicatefilter.filter(
      ctx("'0600000001' IN MAP(lines, number.msisdn)"),
      dataSet4,
      new Map(),
    ),
  ).toBe(true)
})
test('Item not Exists in Map [deep search]', () => {
  expect(
    splpredicatefilter.filter(
      ctx("'0600000002' IN MAP(lines, number.msisdn)"),
      dataSet4,
      new Map(),
    ),
  ).toBe(false)
})
test('Item Exists in Array', () => {
  expect(
    splpredicatefilter.filter(ctx('true IN [true, true]'), dataSet3_with_booleans, new Map()),
  ).toBe(true)
  expect(
    splpredicatefilter.filter(ctx('true IN [true, false]'), dataSet3_with_booleans, new Map()),
  ).toBe(true)
  expect(
    splpredicatefilter.filter(ctx('true IN [false, false]'), dataSet3_with_booleans, new Map()),
  ).toBe(false)
})
test('Split Operator', () => {
  expect(
    splpredicatefilter.filter(ctx("'a' IN SPLIT('b,a,c', ',')"), dataSet3_with_booleans, new Map()),
  ).toBe(true)
  expect(
    splpredicatefilter.filter(ctx("'d' IN SPLIT('b,a,c', ',')"), dataSet3_with_booleans, new Map()),
  ).toBe(false)
})
test('Len Operator', () => {
  expect(splpredicatefilter.filter(ctx('LEN(key) = 3'), datasSet8, new Map())).toBe(true)
  expect(splpredicatefilter.filter(ctx('LEN(key) = 4'), datasSet8, new Map())).toBe(false)
})
test('Intersection Operator', () => {
  expect(
    splpredicatefilter.filter(ctx('LEN(INTERSECTION(key, key3)) = 2'), datasSet8, new Map()),
  ).toBe(true)
  expect(
    splpredicatefilter.filter(ctx('LEN(INTERSECTION(key, key2)) = 0'), datasSet8, new Map()),
  ).toBe(true)
  expect(
    splpredicatefilter.filter(ctx('LEN(INTERSECTION(key, key2)) = 2'), datasSet8, new Map()),
  ).toBe(false)
})
test('Keys Operator', () => {
  expect(splpredicatefilter.filter(ctx("'cookie1' IN KEYS(:cookies)"), datasSet8, cookies)).toBe(
    true,
  )
  expect(splpredicatefilter.filter(ctx("'cookie4' IN KEYS(:cookies)"), datasSet8, cookies)).toBe(
    false,
  )
})
test('Non-Existant Object should be Null', () => {
  expect(splpredicatefilter.filter(ctx('city_name = null'), dataSet6, new Map())).toBe(false)
  expect(splpredicatefilter.filter(ctx('city_country = null'), dataSet6, new Map())).toBe(true)

  expect(splpredicatefilter.filter(ctx('city_name != null'), dataSet6, new Map())).toBe(true)
  expect(splpredicatefilter.filter(ctx('city_country != null'), dataSet6, new Map())).toBe(false)
})
