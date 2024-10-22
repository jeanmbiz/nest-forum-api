import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { AnswerComment } from '../../enterprise/entities/answer-comment'
import { AnswerCommentsRepository } from '../repositories/answer-comments-repository'
import { AnswersRepository } from '../repositories/answers-repository'
import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

interface CommentOnAnswerUseCaseRequest {
  authorId: string
  answerId: string
  content: string
}

// type Either: retorna ou sucesso ou erro
type CommentOnAnswerUseCaseResponse = Either<
  // caso de erro
  ResourceNotFoundError,
  // caso de sucesso
  {
    answerComment: AnswerComment
  }
>

export class CommentOnAnswerUseCase {
  // inversão de dependência - contrato/interface
  constructor(
    private answersRepository: AnswersRepository,
    private answerCommentsRepository: AnswerCommentsRepository,
  ) {}

  async execute({
    authorId,
    answerId,
    content,
  }: CommentOnAnswerUseCaseRequest): Promise<CommentOnAnswerUseCaseResponse> {
    // verificar se a pergunta que será comentada existe
    const answer = await this.answersRepository.findById(answerId)

    if (!answer) {
      // left = retorno de erro
      return left(new ResourceNotFoundError())
    }

    const answerComment = AnswerComment.create({
      authorId: new UniqueEntityID(authorId),
      answerId: new UniqueEntityID(answerId),
      content,
    })

    await this.answerCommentsRepository.create(answerComment)

    // right = retorno sucesso
    return right({ answerComment })
  }
}
