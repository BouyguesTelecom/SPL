export abstract class PredicateOperation<L, R> {
  abstract leftOperandType(): string
  abstract rightOperandType(): string

  abstract evaluations(): Map<string, (a: L, b: R) => boolean>

  /**
   * Define the operation to be applied
   * @param operationName The name of the operation to be applied
   * @return The function matching the operation
   */
  getOperation(operationName: string): (a: L, b: R) => boolean {
    return (left, right) => this.evaluations().get(operationName)?.(left as L, right as R) || false
  }
}
