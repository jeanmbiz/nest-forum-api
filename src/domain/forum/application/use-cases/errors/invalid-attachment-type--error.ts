import { UseCaseError } from '@/core/errors/use-case-error'

// UseCaseError: ionterface que centraliza todos os erros do caso de uso
export class InvalidAttachmentTypeError extends Error implements UseCaseError {
  constructor(type: string) {
    super(`File Type ${type} is not valid.`)
  }
}
