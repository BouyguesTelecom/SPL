// SPDX-License-Identifier: Apache-2.0

import { EvaluateFunctionOperand } from './EvaluateFunctionOperand.js'

export class Keys implements EvaluateFunctionOperand {
  functionName = 'KEYS'

  evaluateFunction(operandParameterSupplier: (a: number) => Map<any, any>): any[] | null {
    const inputMap: Map<any, any> = operandParameterSupplier(0)
    if (inputMap === null) {
      return null
    }
    return Array.from(inputMap.keys())
  }
}
