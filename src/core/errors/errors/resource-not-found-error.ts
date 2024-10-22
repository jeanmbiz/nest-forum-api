import { UseCaseError } from '@/core/errors/use-case-error'

// extende Error do JS e implemento interface
export class ResourceNotFoundError extends Error implements UseCaseError {
  constructor() {
    // super chama construtor da classe que estou extendendo
    super('Resource not found.')
  }
}
