// SPDX-License-Identifier: Apache-2.0

import { PredicateOperation } from './PredicateOperation.js'

export class NumberOperations implements PredicateOperation<number, number> {
  public leftOperandType(): string {
    return Number.name
  }

  public rightOperandType(): string {
    return Number.name
  }

  public evaluations(): Map<string, (a: number, b: number) => boolean> {
    return new Map([
      ['>=', (a, b) => a >= b],
      ['<=', (a, b) => a <= b],
      ['>', (a, b) => a > b],
      ['<', (a, b) => a < b],
      ['=', (a, b) => a === b],
      ['!=', (a, b) => a !== b],
    ])
  }

  getOperation(operationName: string): (a: number, b: number) => boolean {
    return (left, right) => this.evaluations().get(operationName)?.(left, right) || false
  }
}
