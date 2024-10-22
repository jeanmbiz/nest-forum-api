import { Either, right } from '@/core/either'
import { Answer } from '../../enterprise/entities/answer'
import { AnswersRepository } from '../repositories/answers-repository'

interface FetchQuestionAnswersUseCaseRequest {
  questionId: string
  page: number
}

// type Either: retorna ou sucesso ou erro
type FetchQuestionAnswersUseCaseResponse = Either<
  // caso de erro
  null,
  // caso de sucesso
  {
    answers: Answer[]
  }
>

export class FetchQuestionAnswersUseCase {
  // dependência do repositody - contrato/interface
  constructor(private answersRepository: AnswersRepository) {}

  async execute({
    page,
    questionId,
  }: FetchQuestionAnswersUseCaseRequest): Promise<FetchQuestionAnswersUseCaseResponse> {
    const answers = await this.answersRepository.findManyByQuestionId(
      questionId,
      // objeto abaixo é para metadados: paginação, filtro, ordenação etc
      {
        page,
      },
    )

    // right = retorno sucesso
    return right({ answers })
  }
}
