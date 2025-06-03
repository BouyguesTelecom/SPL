// SPDX-License-Identifier: Apache-2.0

import { EvaluateFunctionOperand } from './EvaluateFunctionOperand.js'

export class Split implements EvaluateFunctionOperand {
  functionName = 'SPLIT'

  evaluateFunction(operandParameterSupplier: (a: number) => object): any[] {
    return Array.from(
      operandParameterSupplier(0).toString().split(operandParameterSupplier(1).toString()),
    )
  }
}
