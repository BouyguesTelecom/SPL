// SPDX-License-Identifier: Apache-2.0

import { PropertyWalker } from './PropertyWalker.js'
import { Function_evaluationContext, OperandContext } from './antlr/SPLParser.js'
import { EvaluateFunctionOperand } from './functions/EvaluateFunctionOperand.js'
import { Concat } from './functions/Concat.js'
import { EvaluateDate } from './functions/EvaluateDate.js'
import { Day } from './functions/Day.js'
import { Month } from './functions/Month.js'
import { Year } from './functions/Year.js'
import { Now } from './functions/Now.js'
import { Len } from './functions/Len.js'
import { Intersection } from './functions/Intersection.js'
import { Keys } from './functions/Keys.js'
import { Reverse } from './functions/Reverse.js'
import { Split } from './functions/Split.js'

export class OperandReader {
  private propertyWalker: PropertyWalker
  private operationFunctions: Map<String, (a: number, b: number) => number> = new Map([
    ['*', (a, b) => a * b],
    ['+', (a, b) => a + b],
    ['-', (a, b) => a - b],
    ['/', (a, b) => a / b],
    ['%', (a, b) => a % b],
  ])

  private evaluateFunctionOperands: EvaluateFunctionOperand[] = [
    new Concat(),
    new EvaluateDate(),
    new Day(),
    new Month(),
    new Year(),
    new Now(),
    new Len(),
    new Intersection(),
    new Keys(),
    new Reverse(),
    new Split(),
  ]

  constructor(propertyWalker: PropertyWalker) {
    this.propertyWalker = propertyWalker
  }

  public readOperand(
    operand: OperandContext,
    input: Map<String, Object>,
    variables: Map<String, Object>,
  ): object | null {
    if (operand._subOperand) {
      return this.readOperand(operand._subOperand, input, variables)
    }

    if (operand.fieldName()) {
      return this.propertyWalker.walkToProperty(input, operand)!
    }

    if (operand.variable()) {
      return this.propertyWalker.walkToProperty(variables, operand)!
    }

    const functionEvaluation = operand.function_evaluation()
    if (functionEvaluation) {
      return this.readFunctionEvaluation(functionEvaluation, input, variables)
    }

    if (operand.operation() || operand.prioOperation()) {
      return this.readBinaryOperand(operand, input, variables)
    }

    if (operand.value()) {
      return this.readValueOperand(operand, input, variables)
    }

    return null
  }

  public readFunctionEvaluation(
    functionEvaluation: Function_evaluationContext,
    input: Map<String, Object>,
    variables: Map<String, Object>,
  ): object | null {
    if (functionEvaluation.FUNCTION_NAME().text === 'MAP') {
      const mapInput: object = this.readOperand(functionEvaluation.operand(0), input, variables)!
      const propertyPath: OperandContext = functionEvaluation.operand(1)

      if (mapInput instanceof Array) {
        return (mapInput as Map<String, Object>[]).map((o) =>
          this.propertyWalker.walkToProperty(o, propertyPath),
        )
      }
    }

    for (var i = 0; i < this.evaluateFunctionOperands.length; i++) {
      if (
        this.evaluateFunctionOperands[i].functionName === functionEvaluation.FUNCTION_NAME().text
      ) {
        return this.evaluateFunctionOperands[i].evaluateFunction(
          (argumentNumber) =>
            this.readOperand(functionEvaluation.operand(argumentNumber), input, variables)!,
          () =>
            functionEvaluation
              .operand()
              .map((operandContext) => this.readOperand(operandContext, input, variables)!),
          input,
          variables,
        )
      }
    }

    return null
  }

  public readBinaryOperand(
    binary_operand: OperandContext,
    input: Map<String, Object>,
    variables: Map<String, Object>,
  ): Object | null {
    const operationText = binary_operand.operation()
    const prioOperationText = binary_operand.prioOperation()
    const actualOperationText = prioOperationText ? prioOperationText.text : operationText?.text

    let leftOperand = this.readOperand(binary_operand.operand(0), input, variables)
    let rightOperand = this.readOperand(binary_operand.operand(1), input, variables)

    if (leftOperand !== null && rightOperand !== null && actualOperationText) {
      const evaluateFunctionOperand = this.operationFunctions.get(actualOperationText)
      if (evaluateFunctionOperand) {
        return evaluateFunctionOperand(Number(leftOperand), Number(rightOperand))
      }
    }

    return null
  }

  public readValueOperand(
    operand: OperandContext,
    input: Map<String, Object>,
    variables: Map<String, Object>,
  ): Object | null {
    const operandValues = operand.value()?.list()?.operand()
    if (operandValues) {
      return operandValues.map((valueContext) => this.readOperand(valueContext, input, variables))
    }

    const text = operand?.text

    if (operand.value()?.primitiveValue()?.NULL()) {
      return null
    }

    if (operand.value()?.primitiveValue()?.FLOAT() && text) {
      return parseFloat(text)
    }

    if (operand.value()?.primitiveValue()?.INTEGER() && text) {
      return parseInt(text)
    }

    if (operand.value()?.primitiveValue()?.DATE() && text) {
      try {
        return Date.parse(text)
      } catch (e) {
        console.warn('Input cannot be parsed as a date.')
        return null
      }
    }

    if (operand.value()?.primitiveValue()?.STRING() && text) {
      return this.unTokenize(text)
    }

    if (operand.value()?.primitiveValue()?.BOOL()) {
      return text === 'true'
    }

    return null
  }

  private unTokenize(input: string): string {
    return input.substring(1, input.length - 1)
  }
}
