import { Either, left, right } from '@/core/either'
import { Question } from '../../enterprise/entities/question'
import { QuestionsRepository } from '../repositories/questions-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

interface GetQuestionBySlugUseCaseRequest {
  slug: string
}

// type Either: retorna ou sucesso ou erro
type GetQuestionBySlugUseCaseResponse = Either<
  // caso de erro
  ResourceNotFoundError,
  // caso de sucesso
  {
    question: Question
  }
>

export class GetQuestionBySlugUseCase {
  // dependência do repositody - contrato/interface
  constructor(private questionsRepository: QuestionsRepository) {}

  async execute({
    slug,
  }: GetQuestionBySlugUseCaseRequest): Promise<GetQuestionBySlugUseCaseResponse> {
    const question = await this.questionsRepository.findBySlug(slug)

    if (!question) {
      // left = retorno de erro
      return left(new ResourceNotFoundError())
    }

    return right({ question })
  }
}
