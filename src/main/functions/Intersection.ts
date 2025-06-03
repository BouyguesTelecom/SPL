import { EvaluateFunctionOperand } from './EvaluateFunctionOperand'

export class Intersection implements EvaluateFunctionOperand {
  functionName = 'INTERSECTION'

  evaluateFunction(operandParameterSupplier: (a: number) => object): object | null {
    const firstList = operandParameterSupplier(0)
    const secondList = operandParameterSupplier(1)
    try {
      const intersec = (firstList as Array<any>).filter((o) =>
        (secondList as Array<any>).includes(o),
      )
      return intersec
    } catch (e) {
      console.warn('The operands must be lists.')
      return null
    }
  }
}
