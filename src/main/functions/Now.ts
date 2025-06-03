import { EvaluateFunctionOperand } from './EvaluateFunctionOperand'

export class Now implements EvaluateFunctionOperand {
  functionName = 'NOW'

  evaluateFunction(): number {
    return Date.parse(new Date().toDateString())
  }
}
