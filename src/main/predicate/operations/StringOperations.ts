import { PredicateOperation } from './PredicateOperation'

export class StringOperations implements PredicateOperation<string, string> {
  public leftOperandType(): string {
    return String.name
  }
  public rightOperandType(): string {
    return String.name
  }

  public evaluations(): Map<string, (a: string, b: string) => boolean> {
    return new Map([
      ['=', (a, b) => a === b],
      ['!=', (a, b) => a !== b],
      ['<', (a, b) => a.localeCompare(b) < 0],
      ['>', (a, b) => a.localeCompare(b) > 0],
      ['<=', (a, b) => a.localeCompare(b) <= 0],
      ['>=', (a, b) => a.localeCompare(b) >= 0],
      ['CONTAINS', (a, b) => a.includes(b)],
      ['IN', (a, b) => b.includes(a)],
      ['ILIKE', (a, b) => b.toLowerCase().includes(a.toLowerCase())],
    ])
  }

  getOperation(operationName: string): (a: string, b: string) => boolean {
    return (left, right) => this.evaluations().get(operationName)?.(left, right) || false
  }
}
