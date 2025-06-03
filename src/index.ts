// SPDX-License-Identifier: Apache-2.0

import { SPLQueryToTreeConverter } from './antlr/SPLQueryToTreeConverter.js'
import { SPLLimitExtractor } from './limiter/SPLLimitExtractor.js'
import { OperandReader } from './OperandReader.js'
import {
  BooleanListBooleansOperations,
  BooleanOperations,
  DateOperations,
  NumberOperations,
  StringListStringOperations,
  StringOperations,
  PredicateOperation,
} from './predicate/operations/index.js'
import { SPLPredicateFilter } from './predicate/SPLPredicateFilter.js'
import { PropertyWalker } from './PropertyWalker.js'
import { SPLComparatorFactory } from './sorter/SPLComparatorFactory.js'
import { SPLListFilterer } from './sorter/SPLListFilterer.js'

const operations: PredicateOperation<any, any>[] = [
  new StringOperations(),
  new StringListStringOperations(),
  new NumberOperations(),
  new BooleanOperations(),
  new BooleanListBooleansOperations(),
  new DateOperations(),
]

export { SPLListFilterer }

export const splListFilterer: SPLListFilterer = new SPLListFilterer(
  new SPLPredicateFilter(new OperandReader(new PropertyWalker()), operations),
  new SPLLimitExtractor(new OperandReader(new PropertyWalker())),
  new SPLComparatorFactory(new PropertyWalker()),
  new SPLQueryToTreeConverter(),
)

export default splListFilterer
