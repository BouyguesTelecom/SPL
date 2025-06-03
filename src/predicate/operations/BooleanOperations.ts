// SPDX-License-Identifier: Apache-2.0

import { PredicateOperation } from './PredicateOperation.js'

export class BooleanOperations implements PredicateOperation<boolean, boolean> {
  public leftOperandType(): string {
    return Boolean.name
  }

  public rightOperandType(): string {
    return Boolean.name
  }

  public evaluations(): Map<string, (a: boolean, b: boolean) => boolean> {
    return new Map([
      ['=', (a, b) => a === b],
      ['!=', (a, b) => a !== b],
    ])
  }

  getOperation(operationName: string): (a: boolean, b: boolean) => boolean {
    return (left, right) => this.evaluations().get(operationName)?.(left, right) || false
  }
}
