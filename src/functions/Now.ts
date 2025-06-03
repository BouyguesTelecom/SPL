// SPDX-License-Identifier: Apache-2.0

import { EvaluateFunctionOperand } from './EvaluateFunctionOperand.js'

export class Now implements EvaluateFunctionOperand {
  functionName = 'NOW'

  evaluateFunction(): number {
    return Date.parse(new Date().toDateString())
  }
}
