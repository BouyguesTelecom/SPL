// SPDX-License-Identifier: Apache-2.0

import { PredicateOperation } from './PredicateOperation.js'

export class BooleanListBooleansOperations implements PredicateOperation<boolean, Array<any>> {
  public leftOperandType(): string {
    return Boolean.name
  }
  public rightOperandType(): string {
    return Array.name
  }

  public evaluations(): Map<string, (a: boolean, b: any[]) => boolean> {
    return new Map([
      ['IN', (a, b) => b.includes(a)],
      ['!IN', (a, b) => !b.includes(a)],
    ])
  }

  getOperation(operationName: string): (a: boolean, b: any[]) => boolean {
    return (left, right) => this.evaluations().get(operationName)?.(left, right) || false
  }
}
