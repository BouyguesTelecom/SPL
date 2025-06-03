// SPDX-License-Identifier: Apache-2.0

import { EvaluateFunctionOperand } from './EvaluateFunctionOperand.js'

export class Concat implements EvaluateFunctionOperand {
  functionName = 'CONCAT'

  evaluateFunction(
    _: (a: number) => object,
    operandParametersListSupplier: () => object[],
  ): string {
    return operandParametersListSupplier()
      .map((o) => o.toString())
      .join('')
  }
}
