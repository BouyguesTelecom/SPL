import { SPLLexer } from './SPLLexer'
import { SPLParser, QueryContext } from './SPLParser'
import { CharStream, CharStreams, CommonTokenStream } from 'antlr4ts'

export class SPLQueryToTreeConverter {
  public createTree(query: string): QueryContext {
    let charStream: CharStream = CharStreams.fromString(query)
    let lexer: SPLLexer = new SPLLexer(charStream)
    let token: CommonTokenStream = new CommonTokenStream(lexer)
    let parser: SPLParser = new SPLParser(token)
    let tree: QueryContext = parser.query()

    return tree
  }
}
