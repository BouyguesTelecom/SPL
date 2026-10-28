// SPDX-License-Identifier: Apache-2.0

import { PredicateContext, Predicate_memberContext, QueryContext } from '../antlr/SPLParser.js'
import { OperandReader } from '../OperandReader.js'
import { PredicateOperation } from './operations/index.js'

export class SPLPredicateFilter {
  private operandReader: OperandReader
  private predicateOperation: PredicateOperation<any, any>[]

  private primitivePredicates: Map<String, (x: boolean, y: boolean) => boolean> = new Map([
    ['OR', (a, b) => a || b],
    ['||', (a, b) => a || b],
    ['AND', (a, b) => a && b],
    ['&&', (a, b) => a && b],
    ['XOR', (a, b) => (a || b) && !(a && b)],
    ['<=>', (a, b) => a === b],
  ])

  private nullOperations: Map<String, (x: object) => boolean> = new Map([
    ['=', (a) => a === null],
    ['IS', (a) => a === null],
    ['!=', (a) => a !== null],
  ])

  constructor(operandReader: OperandReader, predicateOperation: PredicateOperation<any, any>[]) {
    this.operandReader = operandReader
    this.predicateOperation = predicateOperation
  }

  public filter(
    queryContext: QueryContext,
    input: Map<String, Object>,
    variables: Map<String, Object>,
  ): boolean {
    const predicateContext = queryContext.predicate()

    if (predicateContext) {
      return this.checkPredicate(predicateContext, input, variables)
    }
    return true
  }

  private checkPredicate(
    predicateContext: PredicateContext,
    input: Map<String, Object>,
    variables: Map<String, Object>,
  ): boolean {
    if (predicateContext._subPredicate) {
      return this.checkPredicate(predicateContext._subPredicate, input, variables)
    }

    const predicateMemberContext = predicateContext.predicate_member()

    if (predicateMemberContext) {
      return this.evaluatePredicateMember(predicateMemberContext, input, variables)
    }

    if (predicateContext.operator()) {
      return this.checkPredicateBinaryOperatorContext(predicateContext, input, variables)
    }

    return false
  }

  private evaluatePredicateMember(
    predicateMemberContext: Predicate_memberContext,
    input: Map<String, Object>,
    variables: Map<String, Object>,
  ): boolean {
    const operator: string = predicateMemberContext.comparator().text

    // ANTLR recovers from syntax errors and still produces a tree, so a malformed query such as
    // `INVALID QUERY` reaches us as a comparison with no operator at all. That is a broken query,
    // not a predicate that evaluates to false: report it.
    if (!operator) {
      throw new Error(`Malformed predicate: no comparator in "${predicateMemberContext.text}".`)
    }

    let leftValue: Object = this.operandReader.readOperand(
      predicateMemberContext.operand(0),
      input,
      variables,
    )!
    let rightValue: Object = this.operandReader.readOperand(
      predicateMemberContext.operand(1),
      input,
      variables,
    )!

    // An operand resolving to null simply makes the predicate false when the operator has no null
    // semantics (only '=', 'IS' and '!=' have). This happens routinely on optional sub-nodes, e.g.
    // `'210' IN MAP(invoices.items, status)` where `invoices` is null for some elements: such an
    // element must be filtered out, not blow up the whole list.
    if (leftValue === null) {
      return this.nullOperations.get(operator)?.(rightValue) || false
    }

    if (rightValue === null) {
      return this.nullOperations.get(operator)?.(leftValue) || false
    }

    return (
      this.predicateOperation
        .find(
          (operation) =>
            operation.leftOperandType() === leftValue.constructor.name &&
            operation.rightOperandType() === rightValue.constructor.name,
        )
        ?.getOperation(operator)(leftValue, rightValue) || false
    )
  }

  private checkPredicateBinaryOperatorContext(
    predicateBinaryOperationContext: PredicateContext,
    input: Map<String, Object>,
    variables: Map<String, Object>,
  ): boolean {
    const leftOperand: PredicateContext = predicateBinaryOperationContext.predicate(0)
    const rightOperand: PredicateContext = predicateBinaryOperationContext.predicate(1)
    const operator = predicateBinaryOperationContext.operator()?.text

    const leftOperandValue: boolean = this.checkPredicate(leftOperand, input, variables)
    const rightOperandValue: boolean = this.checkPredicate(rightOperand, input, variables)

    if (operator) {
      return this.primitivePredicates.get(operator)?.(leftOperandValue, rightOperandValue) || false
    }
    return false
  }
}
