import { Either, right } from '@/core/either'
import { AnswerCommentsRepository } from '../repositories/answer-comments-repository'
import { Injectable } from '@nestjs/common'
import { CommentWithAuthor } from '../../enterprise/entities/value-objects/comment-with-author'

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
    comments: CommentWithAuthor[]
  }
>

@Injectable()
export class FetchAnswerCommentsUseCase {
  // dependência do repositody - contrato/interface
  constructor(private answerCommentsRepository: AnswerCommentsRepository) {}

  async execute({
    answerId,
    page,
  }: FetchAnswerCommentsUseCaseRequest): Promise<FetchAnswerCommentsUseCaseResponse> {
    const comments =
      await this.answerCommentsRepository.findManyByAnswerIdWithAuthor(
        answerId,
        // objeto abaixo é para metadados: paginação, filtro, ordenação etc
        {
          page,
        },
      )

    // right = retorno sucesso
    return right({ comments })
  }
}
