// SPDX-License-Identifier: Apache-2.0

import { PredicateOperation } from './PredicateOperation.js'

export class DateOperations implements PredicateOperation<Date, Date> {
  public leftOperandType(): string {
    return Date.name
  }

  public rightOperandType(): string {
    return Date.name
  }

  public evaluations(): Map<string, (a: Date, b: Date) => boolean> {
    return new Map([
      ['=', (a, b) => a === b],
      ['!=', (a, b) => a !== b],
      ['<', (a, b) => a.toDateString().localeCompare(b.toDateString()) < 0],
      ['>', (a, b) => a.toDateString().localeCompare(b.toDateString()) > 0],
      ['<=', (a, b) => a.toDateString().localeCompare(b.toDateString()) <= 0],
      ['>=', (a, b) => a.toDateString().localeCompare(b.toDateString()) >= 0],
    ])
  }

  getOperation(operationName: string): (a: Date, b: Date) => boolean {
    return (left, right) => this.evaluations().get(operationName)?.(left, right) || false
  }
}
