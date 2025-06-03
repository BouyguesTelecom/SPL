// SPDX-License-Identifier: Apache-2.0

import { EvaluateFunctionOperand } from './EvaluateFunctionOperand.js'

export class EvaluateDate implements EvaluateFunctionOperand {
  functionName = 'DATE'

  evaluateFunction(operandParameterSupplier: (a: number) => object): number | null {
    try {
      return Date.parse(operandParameterSupplier(0).toString())
    } catch (e) {
      console.warn('Input cannot be parsed as a date.')
      return null
    }
  }
}
