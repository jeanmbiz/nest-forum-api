import { UseCaseError } from '@/core/errors/use-case-error'

// UseCaseError: ionterface que centraliza todos os erros do caso de uso
export class WrongCredentialsError extends Error implements UseCaseError {
  constructor() {
    super(`Credentials are not valid.`)
  }
}
