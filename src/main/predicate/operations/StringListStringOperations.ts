import { PredicateOperation } from './PredicateOperation'

export class StringListStringOperations implements PredicateOperation<string, Array<any>> {
  public leftOperandType(): string {
    return String.name
  }

  public rightOperandType(): string {
    return Array.name
  }

  public evaluations(): Map<string, (a: string, b: any[]) => boolean> {
    return new Map([
      ['IN', (a, b) => b.includes(a)],
      ['!IN', (a, b) => !b.includes(a)],
    ])
  }

  getOperation(operationName: string): (a: string, b: any[]) => boolean {
    return (left, right) => this.evaluations().get(operationName)?.(left, right) || false
  }
}
