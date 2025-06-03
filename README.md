# Simple Predicate Langage (SPL)

![NPM Version](https://img.shields.io/npm/v/@bouygues-telecom/spl?style=flat-square)

## Introduction

SPL is a very small, lightweight, straightforward and non-evaluated expression language to sort, filter and paginate arrays of maps.

## Grammar

See [SPL.g4 file](./src/antlr/SPL.g4)

## Examples

Given this simple dataset:

```typescript
const dataset = [
  {
    firstName: "Martin",
    lastName: "Dupont",
    age: 21,
    address: {
      country: "France",
      town: "Paris",
    },
  },
  {
    firstName: "Bertrand",
    lastName: "Dupont",
    age: 17,
    address: {
      country: "South Korea",
      town: "Seoul",
    },
  },
  {
    firstName: "Michel",
    lastName: "Dupond",
    age: 19,
    address: {
      country: "France",
      town: "Toulouse",
    },
  },
]
```

The following expressions can be applied using SPL:

### Filters

#### Simple filtering

```sql
lastName = 'Dupont'
```

#### Binary operators

```sql
(firstName = 'Seb') AND (lastName = 'Dupont')
```

#### Array search

```sql
(firstName IN ['Seb', 'Paul', 'Jean']) OR (lastName = 'Dupont')
```

#### Inject fields anywhere

```sql
(givenName IN [firstName, lastName]) OR (lastName = 'Dupont')
```

#### Inject variables anywhere

```sql
(givenName IN [:variable1, :variable2]) OR (lastName = :variable3)
```

#### Deep search

```sql
address.country = 'France'
```

### Sort

```sql
SORT BY firstName ASC, lastName DESC
```

### Pagination

```sql
LIMIT 0, 100
```
