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
      const item1 = this.propertyWalker.walkToProperty(o1, operand)!
      const item2 = this.propertyWalker.walkToProperty(o2, operand)!

      let comparisonResult: number = item1.toString().localeCompare(item2.toString()) * order

      if (item1.toString().split('-').length === 3) {
        const item1Date = new Date(item1.toString()).toDateString()
        const item2Date = new Date(item2.toString()).toDateString()

        item1Date.localeCompare(item2Date) < 0
          ? (comparisonResult = -1 * order)
          : (comparisonResult = 1 * order)
      } else if (!isNaN(parseInt(item1.toString()))) {
        const item1Number: number = parseInt(item1.toString())
        const item2Number: number = parseInt(item2.toString())

        item1Number < item2Number ? (comparisonResult = -1 * order) : (comparisonResult = 1 * order)
      }

      if (comparisonResult === 0) {
        return this.sortBy(o1, o2, sortRules.slice(1, sortRules.length))
      }

      return comparisonResult
    }

    return 0
  }

  private calculateOrder(order?: OrderContext): string {
    if (order) {
      return order.text.toUpperCase()
    }
    return 'ASC'
  }
}
