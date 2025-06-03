import { OperandContext } from './antlr/SPLParser'
import { RuleContext } from 'antlr4ts'

export class PropertyWalker {
  public walkToProperty(input: Map<String, Object>, operand: OperandContext): object | null {
    const fieldNames = operand.fieldName()
      ? operand
          .fieldName()
          ?.identifier()
          .map((context: RuleContext) => context.text)
      : operand
          .variable()
          ?.identifier()
          ?.map((context: RuleContext) => context.text)
    let currentCursor: object | undefined = input

    for (let fieldPointerName of fieldNames || []) {
      let fieldName: string
      let strictAccess: boolean

      if (fieldPointerName.endsWith('?')) {
        fieldName = fieldPointerName.substring(0, fieldPointerName.length - 1)
        strictAccess = true
      } else {
        fieldName = fieldPointerName
        strictAccess = false
      }

      if (
        currentCursor instanceof Map &&
        (currentCursor as Map<String, Object>).has(fieldPointerName)
      ) {
        currentCursor = (currentCursor as Map<String, Object>).get(fieldName)
      } else if (strictAccess) {
        throw new Error('Unable to find key.')
      } else {
        return null
      }
    }

    return currentCursor!
  }
}
