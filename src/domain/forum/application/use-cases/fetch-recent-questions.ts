import { Either, right } from '@/core/either'
import { Question } from '../../enterprise/entities/question'
import { QuestionsRepository } from '../repositories/questions-repository'

interface FetchRecentQuestionsUseCaseRequest {
  page: number
}

// type Either: retorna ou sucesso ou erro
type FetchRecentQuestionsUseCaseResponse = Either<
  // caso de erro
  null,
  // caso de sucesso
  {
    questions: Question[]
  }
>

export class FetchRecentQuestionsUseCase {
  // dependência do repositody - contrato/interface
  constructor(private questionsRepository: QuestionsRepository) {}

  async execute({
    page,
  }: FetchRecentQuestionsUseCaseRequest): Promise<FetchRecentQuestionsUseCaseResponse> {
    const questions = await this.questionsRepository.findManyRecent({ page })

    return right({ questions })
  }
}
