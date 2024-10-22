import { AnswersRepository } from '../repositories/answers-repository'
import { Question } from '../../enterprise/entities/question'
import { QuestionsRepository } from '../repositories/questions-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { Either, left, right } from '@/core/either'

interface ChooseQuestionBestAnswerUseCaseRequest {
  authorId: string
  answerId: string
}

// type Either: retorna ou sucesso ou erro
type ChooseQuestionBestAnswerUseCaseResponse = Either<
  // caso de erro
  ResourceNotFoundError | NotAllowedError,
  // caso de sucesso
  {
    question: Question
  }
>

export class ChooseQuestionBestAnswerUseCase {
  // dependência do repositody - contrato/interface
  constructor(
    private questionsRepository: QuestionsRepository,
    private answersRepository: AnswersRepository,
  ) {}

  async execute({
    answerId,
    authorId,
  }: ChooseQuestionBestAnswerUseCaseRequest): Promise<ChooseQuestionBestAnswerUseCaseResponse> {
    const answer = await this.answersRepository.findById(answerId)

    if (!answer) {
      // left = retorno de erro
      return left(new ResourceNotFoundError())
    }

    const question = await this.questionsRepository.findById(
      answer.questionId.toString(),
    )

    if (!question) {
      return left(new ResourceNotFoundError())
    }

    if (authorId !== question.authorId.toString()) {
      return left(new NotAllowedError())
    }

    // adiciona no bestAnswerId o id da resposta
    question.bestAnswerId = answer.id

    // salva a pergunta no questionsRepository
    await this.questionsRepository.save(question)

    // right = retorno sucesso
    return right({ question })
  }
}
