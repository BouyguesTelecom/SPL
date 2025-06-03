import { EvaluateFunctionOperand } from './EvaluateFunctionOperand'

export class Len implements EvaluateFunctionOperand {
  functionName = 'LEN'

  evaluateFunction(operandParameterSupplier: (a: number) => object): number | null {
    const listToWorkOn: object = operandParameterSupplier(0)
    try {
      const len: number = (listToWorkOn as Array<any>).length
      return len
    } catch (e) {
      console.warn('LEN function expects a list as parameter.')
      return null
    }
  }
}
