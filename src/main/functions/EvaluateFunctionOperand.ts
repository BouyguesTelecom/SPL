export interface EvaluateFunctionOperand {
  functionName: string

  /**
   *
   * @param operandParameterSupplier Supplies the content of the argument of the function to be evaluated from its number.
   * @param operandParametersListSupplier Supplies the list of the arguments of the function to be evaluated.
   * @param input The input of SPL
   * @param variables The variables of SPL
   * @return The evaluation of the function
   */
  evaluateFunction(
    operandParameterSupplier: (a: number) => any, //@FIXME: any
    operandParametersListSupplier: () => object[],
    input: Map<String, Object>,
    variables: Map<String, Object>,
  ): any
}
