import { Either, left, right } from '@/core/either'
import { QuestionsRepository } from '../repositories/questions-repository'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

interface DeleteQuestionUseCaseRequest {
  authorId: string
  questionId: string
}

// type Either: retorna ou sucesso ou erro
type DeleteQuestionUseCaseResponse = Either<
  // caso de erro
  ResourceNotFoundError | NotAllowedError,
  // caso de sucesso: objeto vazio
  Record<string, never>
>

export class DeleteQuestionUseCase {
  // dependência do repositody - contrato/interface
  constructor(private questionsRepository: QuestionsRepository) {}

  async execute({
    authorId,
    questionId,
  }: DeleteQuestionUseCaseRequest): Promise<DeleteQuestionUseCaseResponse> {
    const question = await this.questionsRepository.findById(questionId)

    if (!question) {
      // left = retorno de erro
      return left(new ResourceNotFoundError())
    }

    if (authorId !== question.authorId.toString()) {
      // left = retorno de erro
      return left(new NotAllowedError())
    }

    await this.questionsRepository.delete(question)

    // right = retorno sucesso
    return right({})
  }
}
