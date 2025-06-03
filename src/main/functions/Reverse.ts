import { EvaluateFunctionOperand } from './EvaluateFunctionOperand'

export class Reverse implements EvaluateFunctionOperand {
  functionName = 'REVERSE'

  evaluateFunction(operandParameterSupplier: (a: number) => object): string {
    const strIn: string = operandParameterSupplier(0).toString()
    const splitStr: string[] = strIn.split('')
    const reverseArr: string[] = splitStr.reverse()
    const reverseStr: string = reverseArr.join('')
    return reverseStr
  }
}
