import { Either, right } from '@/core/either'
import { QuestionComment } from '../../enterprise/entities/question-comment'
import { QuestionCommentsRepository } from '../repositories/question-comments-repository'

interface FetchQuestionCommentsUseCaseRequest {
  questionId: string
  page: number
}

// type Either: retorna ou sucesso ou erro
type FetchQuestionCommentsUseCaseResponse = Either<
  // caso de erro
  null,
  // caso de sucesso
  {
    questionComments: QuestionComment[]
  }
>

export class FetchQuestionCommentsUseCase {
  // dependência do repositody - contrato/interface
  constructor(private questionCommentsRepository: QuestionCommentsRepository) {}

  async execute({
    questionId,
    page,
  }: FetchQuestionCommentsUseCaseRequest): Promise<FetchQuestionCommentsUseCaseResponse> {
    const questionComments =
      await this.questionCommentsRepository.findManyByQuestionId(
        questionId,
        // objeto abaixo é para metadados: paginação, filtro, ordenação etc
        {
          page,
        },
      )

    // right = retorno sucesso
    return right({ questionComments })
  }
}
