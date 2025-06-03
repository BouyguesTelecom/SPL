// SPDX-License-Identifier: Apache-2.0

export class Limit {
  public offset: number
  public limit: number

  constructor(offset: number, limit: number) {
    this.offset = offset
    this.limit = limit
  }
}
