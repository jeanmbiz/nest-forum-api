import { Either, right } from '@/core/either'
import { QuestionCommentsRepository } from '../repositories/question-comments-repository'
import { Injectable } from '@nestjs/common'
import { CommentWithAuthor } from '../../enterprise/entities/value-objects/comment-with-author'

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
    comments: CommentWithAuthor[]
  }
>

@Injectable()
export class FetchQuestionCommentsUseCase {
  // dependência do repositody - contrato/interface
  constructor(private questionCommentsRepository: QuestionCommentsRepository) {}

  async execute({
    questionId,
    page,
  }: FetchQuestionCommentsUseCaseRequest): Promise<FetchQuestionCommentsUseCaseResponse> {
    const comments =
      await this.questionCommentsRepository.findManyByQuestionIdWithAuthor(
        questionId,
        // objeto abaixo é para metadados: paginação, filtro, ordenação etc
        {
          page,
        },
      )

    // right = retorno sucesso
    return right({ comments })
  }
}
