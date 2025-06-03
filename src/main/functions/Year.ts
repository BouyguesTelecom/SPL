import { EvaluateFunctionOperand } from './EvaluateFunctionOperand'

export class Year implements EvaluateFunctionOperand {
  functionName = 'YEAR'

  evaluateFunction(operandParameterSupplier: (a: number) => string | number | null): number | null {
    const operandParameterSupplierValue = operandParameterSupplier(0)
    if (typeof operandParameterSupplierValue === 'string') {
      try {
        const date: Date = new Date(operandParameterSupplierValue.toString())
        return date.getFullYear()
      } catch (e) {
        console.warn('Input cannot be parsed as a date.')
        return null
      }
    } else if (typeof operandParameterSupplierValue === 'number') {
      try {
        const date: Date = new Date(operandParameterSupplierValue)
        return date.getFullYear()
      } catch (e) {
        console.warn('Input cannot be parsed as a date.')
        return null
      }
    } else {
      return null
    }
  }
}
