import { UseCaseError } from '@/core/errors/use-case-error'

// UseCaseError: ionterface que centraliza todos os erros do caso de uso
export class StudentAlreadyExistsError extends Error implements UseCaseError {
  // recebe e-mail de login ou qlqer outra informação como usuário/cpf
  constructor(identifier: string) {
    super(`Student ${identifier} already exists.`)
  }
}
