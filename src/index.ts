// SPDX-License-Identifier: Apache-2.0

import { defaultFieldResolver, GraphQLSchema } from 'graphql'
import { MeshTransform } from '@graphql-mesh/types'
import { MapperKind, mapSchema } from '@graphql-tools/utils'
import { splListFilterer } from './main'

export default class SplDirectiveTransform implements MeshTransform {
  noWrap = true

  transformSchema(schema: GraphQLSchema) {
    return mapSchema(schema, {
      [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
        const originalResolver = fieldConfig.resolve ?? defaultFieldResolver

        const resolver = async (next: any , _source: any, _args: any, context: any, info: any) => {
          const { directives } = info.fieldNodes[0]
          const splDirective = directives.find((directive: { name: { value: string } }) => directive.name.value === 'SPL')
          const result = await next(context)

          if (splDirective) {
            const { value } = splDirective.arguments[0]

            const data = splListFilterer.filter(
              value.value,
              splListFilterer.formatInput(result),
              splListFilterer.formatVariables(context.params.variables || {})
            )
            return splListFilterer.formatOutput(data)
          }

          return result
        }

        fieldConfig.resolve = (source, originalArgs, context, info) => {
          return resolver(
            (context: unknown) =>
              new Promise((resolve, reject) => {
                const result = originalResolver(source, originalArgs, context, info)
                if (result instanceof Error) {
                  reject(result)
                }
                resolve(result)
              }),
            source,
            originalArgs,
            context,
            info
          )
        }
        return fieldConfig
      }
    })
  }
}

export const splDirectiveTypeDef: string = /* GraphQL */ `
  """
  This is a very small, lightweight, straightforward and non-evaluated expression language to sort, filter and paginate arrays of maps.
  """
  directive @SPL(
    """
    SPL query

    > [Usage examples](https://github.com/BouyguesTelecom/SPL#examples)
    """
    query: String
  ) on FIELD
`
