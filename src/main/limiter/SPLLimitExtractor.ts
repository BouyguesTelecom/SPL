import { OperandReader } from '../OperandReader'
import { QueryContext } from '../antlr/SPLParser'
import { Limit } from './Limit'

export class SPLLimitExtractor {
  private operandReader: OperandReader

  constructor(operandReader: OperandReader) {
    this.operandReader = operandReader
  }

  public fetchLimit(queryContext: QueryContext, variables: Map<String, Object>): Limit {
    if (queryContext.limiter()) {
      const queryList = queryContext.text.split('LIMIT')
      const realLimit = parseInt(queryList[1])
      if (realLimit < 0) {
        console.error('Cannot compute a negative limit.')
        throw new Error()
      }

      const operandLimiters = queryContext.limiter()?.operand()
      const firstOperand = operandLimiters?.[0]
      const secondOperand = operandLimiters?.[1]

      let firstArgumentLimit = firstOperand
        ? this.operandReader.readOperand(firstOperand, new Map(), variables)
        : null
      let secondArgumentLimit = secondOperand
        ? this.operandReader.readOperand(secondOperand, new Map(), variables)
        : null

      const limit = firstArgumentLimit
      if (limit === null || Number(limit) < 0) {
        throw new Error()
      }

      const offset = secondArgumentLimit ? Number(secondArgumentLimit) : 0

      return new Limit(offset, Number(limit))
    }

    return new Limit(0, Number.MAX_SAFE_INTEGER)
  }
}
