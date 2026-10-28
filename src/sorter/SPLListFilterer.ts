// SPDX-License-Identifier: Apache-2.0

import { SPLPredicateFilter } from '../predicate/SPLPredicateFilter.js'
import { SPLLimitExtractor } from '../limiter/SPLLimitExtractor.js'
import { SPLQueryToTreeConverter } from '../antlr/SPLQueryToTreeConverter.js'
import { SPLComparatorFactory } from './SPLComparatorFactory.js'
import { QueryContext } from '../antlr/SPLParser.js'
import { Limit } from '../limiter/Limit.js'

export class SPLListFilterer {
  private splPredicateFilter: SPLPredicateFilter
  private splLimitExtractor: SPLLimitExtractor
  private splComparatorFactory: SPLComparatorFactory
  private splQueryToTreeConverter: SPLQueryToTreeConverter

  constructor(
    splPredicateFilter: SPLPredicateFilter,
    splLimitExtractor: SPLLimitExtractor,
    splComparatorFactory: SPLComparatorFactory,
    splQueryToTreeConverter: SPLQueryToTreeConverter,
  ) {
    this.splPredicateFilter = splPredicateFilter
    this.splLimitExtractor = splLimitExtractor
    this.splComparatorFactory = splComparatorFactory
    this.splQueryToTreeConverter = splQueryToTreeConverter
  }

  public filter(
    query: string,
    input: Map<string, Object>[],
    variables: Map<string, Object> = new Map(),
  ): Map<string, Object>[] {
    const queryContext: QueryContext = this.splQueryToTreeConverter.createTree(query)
    const limitObj: Limit = this.splLimitExtractor.fetchLimit(queryContext, variables)

    return input
      .filter((stringObjMap) =>
        this.splPredicateFilter.filter(queryContext, stringObjMap, variables),
      )
      .slice(limitObj.offset, limitObj.offset + limitObj.limit)
      .sort(this.splComparatorFactory.createComparator(queryContext))
  }

  public formatInput(input: any): Map<string, Object>[] {
    return (input as any[]).map((item) => SPLListFilterer.toMaps(item) as Map<string, Object>)
  }

  public formatVariables(variables: any): Map<string, Object> {
    if (Array.isArray(variables)) {
      return new Map()
    }
    return SPLListFilterer.toMaps(variables) as Map<string, Object>
  }

  public formatOutput(output: Map<string, Object>[]): any[] {
    return output.map((item) => SPLListFilterer.fromMaps(item))
  }

  /**
   * Recursively turns plain objects into `Map`s, walking through arrays as well.
   *
   * `PropertyWalker` only steps into a `Map`, so a path such as `MAP(invoices.items, status)` can
   * only be resolved if *every* level — including the objects nested inside arrays — is a `Map`.
   * Scalars are returned as-is. Keys holding `undefined` are skipped, matching the behaviour of the
   * previous `JSON.parse(JSON.stringify(...))` round-trip.
   */
  private static toMaps(value: any): any {
    if (Array.isArray(value)) {
      return value.map((item) => SPLListFilterer.toMaps(item))
    }

    if (value instanceof Map) {
      const converted: Map<string, Object> = new Map()
      value.forEach((item, key) => converted.set(key, SPLListFilterer.toMaps(item)))
      return converted
    }

    if (value !== null && typeof value === 'object' && !(value instanceof Date)) {
      const converted: Map<string, Object> = new Map()
      Object.entries(value).forEach(([key, item]) => {
        if (item !== undefined) {
          converted.set(key, SPLListFilterer.toMaps(item))
        }
      })
      return converted
    }

    return value
  }

  /**
   * Symmetric of {@link toMaps}: recursively turns `Map`s back into plain objects, walking through
   * arrays so that no `Map` leaks into the output.
   */
  private static fromMaps(value: any): any {
    if (Array.isArray(value)) {
      return value.map((item) => SPLListFilterer.fromMaps(item))
    }

    if (value instanceof Map) {
      const converted: any = {}
      value.forEach((item, key) => {
        converted[key] = SPLListFilterer.fromMaps(item)
      })
      return converted
    }

    return value
  }
}
