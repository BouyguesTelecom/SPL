// SPDX-License-Identifier: Apache-2.0

import { PropertyWalker } from '../PropertyWalker.js'
import { OrderContext, QueryContext, Sort_ruleContext } from '../antlr/SPLParser.js'

export class SPLComparatorFactory {
  private propertyWalker: PropertyWalker

  constructor(propertyWalker: PropertyWalker) {
    this.propertyWalker = propertyWalker
  }

  public createComparator(queryContext: QueryContext) {
    const sorter = queryContext.sorter()
    if (sorter) {
      return (o1: Map<String, Object>, o2: Map<String, Object>) =>
        this.sortBy(o1, o2, sorter.sort_rule())
    }
    return () => 0
  }

  private sortBy(
    o1: Map<String, Object>,
    o2: Map<String, Object>,
    sortRules: Sort_ruleContext[],
  ): number {
    if (sortRules.length) {
      const prioritySortRule = sortRules[0]
      const order = this.calculateOrder(prioritySortRule.order()) === 'ASC' ? 1 : -1

      const operand = prioritySortRule.operand()
      const item1 = this.propertyWalker.walkToProperty(o1, operand)
      const item2 = this.propertyWalker.walkToProperty(o2, operand)

      const comparisonResult = SPLComparatorFactory.compare(item1, item2) * order

      if (comparisonResult === 0) {
        return this.sortBy(o1, o2, sortRules.slice(1, sortRules.length))
      }

      return comparisonResult
    }

    return 0
  }

  /**
   * Natural ordering of two values, mirroring `Comparable.compareTo`.
   *
   * Returns `0` whenever the two values are equivalent — or when one of them is missing — so that
   * the next sort rule gets a chance to break the tie.
   */
  private static compare(item1: object | null, item2: object | null): number {
    if (item1 === null || item1 === undefined || item2 === null || item2 === undefined) {
      return 0
    }

    if (typeof item1 === 'number' && typeof item2 === 'number') {
      return Math.sign(item1 - item2)
    }

    if (typeof item1 === 'boolean' && typeof item2 === 'boolean') {
      return Math.sign(Number(item1) - Number(item2))
    }

    const text1 = item1.toString()
    const text2 = item2.toString()

    // Dates must be ordered chronologically, not by their textual representation: 'DD-MM-YYYY'
    // sorts wrong lexicographically, and so does any locale-formatted rendering of a date.
    const time1 = SPLComparatorFactory.toTimestamp(text1)
    const time2 = SPLComparatorFactory.toTimestamp(text2)

    if (time1 !== null && time2 !== null) {
      return Math.sign(time1 - time2)
    }

    if (text1 === text2) {
      return 0
    }

    return text1 < text2 ? -1 : 1
  }

  /**
   * Parses the date formats SPL accepts — ISO (`YYYY-MM-DD`, optionally followed by a time) and
   * `DD-MM-YYYY` — into a timestamp. Returns `null` for anything that is not a date, so the caller
   * falls back to a plain textual comparison.
   */
  private static toTimestamp(value: string): number | null {
    if (/^\d{4}-\d{2}-\d{2}([T ].*)?$/.test(value)) {
      const parsed = Date.parse(value)
      return isNaN(parsed) ? null : parsed
    }

    const dayFirst = /^(\d{2})-(\d{2})-(\d{4})$/.exec(value)
    if (dayFirst) {
      const [, day, month, year] = dayFirst
      return Date.UTC(Number(year), Number(month) - 1, Number(day))
    }

    return null
  }

  private calculateOrder(order?: OrderContext): string {
    if (order) {
      return order.text.toUpperCase()
    }
    return 'ASC'
  }
}
