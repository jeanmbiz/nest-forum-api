import { Either, left, right } from '@/core/either'
import { AnswerCommentsRepository } from '../repositories/answer-comments-repository'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

interface DeleteAnswerCommentUseCaseRequest {
  authorId: string
  answerCommentId: string
}

// type Either: retorna ou sucesso ou erro
type DeleteAnswerCommentUseCaseResponse = Either<
  // caso de erro
  ResourceNotFoundError | NotAllowedError,
  // caso de sucesso: objeto vazio
  Record<string, never>
>

export class DeleteAnswerCommentUseCase {
  // inversão de dependência - contrato/interface
  constructor(private answerCommentsRepository: AnswerCommentsRepository) {}

  async execute({
    authorId,
    answerCommentId,
  }: DeleteAnswerCommentUseCaseRequest): Promise<DeleteAnswerCommentUseCaseResponse> {
    const answerComment =
      await this.answerCommentsRepository.findById(answerCommentId)

    if (!answerComment) {
      // left = retorno de erro
      return left(new ResourceNotFoundError())
    }

    // verifica se o autor do comentário é o mesmo que está deletando
    if (answerComment.authorId.toString() !== authorId) {
      // left = retorno de erro
      return left(new NotAllowedError())
    }

    await this.answerCommentsRepository.delete(answerComment)

    // right = retorno sucesso
    return right({})
  }
}
