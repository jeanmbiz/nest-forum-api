// Lidar com Error
export class Left<L, R> {
  readonly value: L

  constructor(value: L) {
    this.value = value
  }

  isRight(): this is Right<L, R> {
    return false
  }

  isLeft(): this is Left<L, R> {
    return true
  }
}

// Lidar com Success
export class Right<L, R> {
  readonly value: R

  constructor(value: R) {
    this.value = value
  }

  isRight(): this is Right<L, R> {
    return true
  }

  isLeft(): this is Left<L, R> {
    return false
  }
}

// tipagem de Left ou Right
export type Either<L, R> = Left<L, R> | Right<L, R>

// Será utilizado nos use cases para retornar msg de erro
export const left = <L, R>(value: L): Either<L, R> => {
  return new Left(value)
}

// Será utilizado nos use cases nos casos de sucesso
export const right = <L, R>(value: R): Either<L, R> => {
  return new Right(value)
}
