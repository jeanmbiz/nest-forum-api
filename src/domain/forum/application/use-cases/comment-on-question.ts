import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { QuestionComment } from '../../enterprise/entities/question-comment'
import { QuestionCommentsRepository } from '../repositories/question-comments-repository'
import { QuestionsRepository } from '../repositories/questions-repository'
import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

interface CommentOnQuestionUseCaseRequest {
  authorId: string
  questionId: string
  content: string
}

// type Either: retorna ou sucesso ou erro
type CommentOnQuestionUseCaseResponse = Either<
  // caso de erro
  ResourceNotFoundError,
  // caso de sucesso
  {
    questionComment: QuestionComment
  }
>

export class CommentOnQuestionUseCase {
  // inversão de dependência - contrato/interface
  constructor(
    private questionsRepository: QuestionsRepository,
    private questionCommentsRepository: QuestionCommentsRepository,
  ) {}

  async execute({
    authorId,
    questionId,
    content,
  }: CommentOnQuestionUseCaseRequest): Promise<CommentOnQuestionUseCaseResponse> {
    // verificar se a pergunta que será comentada existe
    const question = await this.questionsRepository.findById(questionId)

    if (!question) {
      // left = retorno de erro
      return left(new ResourceNotFoundError())
    }

    const questionComment = QuestionComment.create({
      authorId: new UniqueEntityID(authorId),
      questionId: new UniqueEntityID(questionId),
      content,
    })

    await this.questionCommentsRepository.create(questionComment)

    // right = retorno sucesso
    return right({ questionComment })
  }
}
