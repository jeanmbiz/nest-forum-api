import { Either, left, right } from '@/core/either'
import { QuestionCommentsRepository } from '../repositories/question-comments-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'

interface DeleteQuestionCommentUseCaseRequest {
  authorId: string
  questionCommentId: string
}

// type Either: retorna ou sucesso ou erro
type DeleteQuestionCommentUseCaseResponse = Either<
  // caso de erro
  ResourceNotFoundError | NotAllowedError,
  // caso de sucesso: objeto vazio
  Record<string, never>
>

export class DeleteQuestionCommentUseCase {
  // inversão de dependência - contrato/interface
  constructor(private questionCommentsRepository: QuestionCommentsRepository) {}

  async execute({
    authorId,
    questionCommentId,
  }: DeleteQuestionCommentUseCaseRequest): Promise<DeleteQuestionCommentUseCaseResponse> {
    const questionComment =
      await this.questionCommentsRepository.findById(questionCommentId)

    if (!questionComment) {
      // left = retorno de erro
      return left(new ResourceNotFoundError())
    }

    // verifica se o autor do comentário é o mesmo que está deletando
    if (questionComment.authorId.toString() !== authorId) {
      // left = retorno de erro
      return left(new NotAllowedError())
    }

    await this.questionCommentsRepository.delete(questionComment)

    // right = retorno sucesso
    return right({})
  }
}
