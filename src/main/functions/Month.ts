import { EvaluateFunctionOperand } from './EvaluateFunctionOperand'

export class Month implements EvaluateFunctionOperand {
  functionName = 'MONTH'

  evaluateFunction(operandParameterSupplier: (a: number) => string | number | null): number | null {
    const operandParameterSupplierValue = operandParameterSupplier(0)
    if (typeof operandParameterSupplierValue === 'string') {
      try {
        const date: Date = new Date(operandParameterSupplierValue.toString())
        return date.getMonth() + 1
      } catch (e) {
        console.warn('Input cannot be parsed as a date.')
        return null
      }
    } else if (typeof operandParameterSupplierValue === 'number') {
      try {
        const date: Date = new Date(operandParameterSupplierValue)
        return date.getMonth() + 1
      } catch (e) {
        console.warn('Input cannot be parsed as a date.')
        return null
      }
    } else {
      return null
    }
  }
}
