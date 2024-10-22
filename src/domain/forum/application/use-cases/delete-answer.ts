import { Either, left, right } from '@/core/either'
import { AnswersRepository } from '../repositories/answers-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'

interface DeleteAnswerUseCaseRequest {
  authorId: string
  answerId: string
}

// type Either: retorna ou sucesso ou erro
type DeleteAnswerUseCaseResponse = Either<
  // caso de erro
  ResourceNotFoundError | NotAllowedError,
  // caso de sucesso: objeto vazio
  Record<string, never>
>

export class DeleteAnswerUseCase {
  // dependência do repositody - contrato/interface
  constructor(private answersRepository: AnswersRepository) {}

  async execute({
    authorId,
    answerId,
  }: DeleteAnswerUseCaseRequest): Promise<DeleteAnswerUseCaseResponse> {
    const answer = await this.answersRepository.findById(answerId)

    if (!answer) {
      // left = retorno de erro
      return left(new ResourceNotFoundError())
    }

    if (authorId !== answer.authorId.toString()) {
      // left = retorno de erro
      return left(new NotAllowedError())
    }

    await this.answersRepository.delete(answer)

    // right = retorno sucesso
    return right({})
  }
}
