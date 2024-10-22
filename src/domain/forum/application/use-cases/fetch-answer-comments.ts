import { Either, right } from '@/core/either'
import { AnswerComment } from '../../enterprise/entities/answer-comment'
import { AnswerCommentsRepository } from '../repositories/answer-comments-repository'

interface FetchAnswerCommentsUseCaseRequest {
  answerId: string
  page: number
}

// type Either: retorna ou sucesso ou erro
type FetchAnswerCommentsUseCaseResponse = Either<
  // caso de erro
  null,
  // caso de sucesso
  {
    answerComments: AnswerComment[]
  }
>

export class FetchAnswerCommentsUseCase {
  // dependência do repositody - contrato/interface
  constructor(private answerCommentsRepository: AnswerCommentsRepository) {}

  async execute({
    answerId,
    page,
  }: FetchAnswerCommentsUseCaseRequest): Promise<FetchAnswerCommentsUseCaseResponse> {
    const answerComments =
      await this.answerCommentsRepository.findManyByAnswerId(
        answerId,
        // objeto abaixo é para metadados: paginação, filtro, ordenação etc
        {
          page,
        },
      )

    // right = retorno sucesso
    return right({ answerComments })
  }
}
