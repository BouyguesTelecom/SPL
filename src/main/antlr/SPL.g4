grammar SPL;

query: predicate? sorter? limiter?;

predicate_member: operand comparator operand;

predicate:
	predicate operator predicate
	| predicate_member
	| '(' subPredicate = predicate ')';

sorter: ('SORT' | 'ORDER') 'BY' sort_rule (',' sort_rule)*;

limiter: 'LIMIT' operand (',' operand)?;

start_page: INTEGER;

number_per_page: INTEGER;

sort_rule: operand order?;

order: ORDER;

operand:
	operand (prioOperation) operand
	| operand (operation) operand
	| variable
	| fieldName
	| function_evaluation
	| value
	| '(' subOperand = operand ')';

comparator: COMPARATOR;

operator: OPERATOR;

operation: OPERATION;

prioOperation: PRIO_OPERATION;

fieldName: identifier ('.' identifier '?'?)*;

function_evaluation:
	FUNCTION_NAME '(' ((operand (',' operand)*) | operand*) ')';

identifier: IDENTIFIER;

value: primitiveValue | list;

list: '[' operand (',' operand)* ']';

integerValue: INTEGER;

variable: ':' identifier ('.' identifier '?'?)*;

ORDER: 'ASC' | 'DESC';

primitiveValue: DATE | INTEGER | FLOAT | STRING | BOOL | NULL;

OPERATOR: AND_OPERATOR | OR_OPERATOR | XOR_OPERATOR;

PRIO_OPERATION: '*' | '/' | '%';

OPERATION: '+' | '-';

XOR_OPERATOR: 'XOR';

OR_OPERATOR: '||' | 'OR';

AND_OPERATOR: '&&' | 'AND';

COMPARATOR:
	'='
	| '<'
	| '<='
	| '>='
	| '>'
	| '!='
	| 'CONTAINS'
	| 'IN'
	| 'ILIKE';

STRING: SINGLE_STRING | DOUBLE_STRING;

SINGLE_STRING: '\'' ~('\'')+ '\'';

DOUBLE_STRING: '"' ~('"')+ '"';

BOOL: 'true' | 'false';

NULL: 'null';

FUNCTION_NAME: [A-Z][A-Z]*;

IDENTIFIER: [A-Za-z][A-Za-z0-9_]*;

DATE: [0-9][0-9][0-9][0-9] '-' [0-9][0-9] '-' [0-9][0-9];

INTEGER: '0' | [1-9][0-9]*;

FLOAT: [0-9]* '.' [0-9]*;

WS: [ \t\r\n]+ -> skip;

COMMENT: '#' .*? ('\n' | EOF) -> skip;
