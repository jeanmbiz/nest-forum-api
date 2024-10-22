import { QuestionAttachment } from './../../enterprise/entities/question-attachment'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Question } from '../../enterprise/entities/question'
import { QuestionsRepository } from '../repositories/questions-repository'
import { Either, right } from '@/core/either'
import { QuestionAttachmentList } from '../../enterprise/entities/question-attachment-list'

interface CreateQuestionUseCaseRequest {
  authorId: string
  title: string
  content: string
  // recebe apenas os ids dos anexos previamente criados
  attachmentsIds: string[]
}

// type Either: retorna ou sucesso ou erro
type CreateQuestionUseCaseResponse = Either<
  // caso de erro
  null,
  // caso de sucesso
  {
    question: Question
  }
>

export class CreateQuestionUseCase {
  // dependência do repositody - contrato/interface
  constructor(private questionsRepository: QuestionsRepository) {}

  async execute({
    authorId,
    title,
    content,
    attachmentsIds,
  }: CreateQuestionUseCaseRequest): Promise<CreateQuestionUseCaseResponse> {
    // crio a pergunta
    const question = Question.create({
      content,
      authorId: new UniqueEntityID(authorId),
      title,
    })

    // crio anexos da pergunta
    const questionAttachments = attachmentsIds.map((attachmentId) => {
      return QuestionAttachment.create({
        attachmentId: new UniqueEntityID(attachmentId),
        questionId: question.id,
      })
    })

    question.attachments = new QuestionAttachmentList(questionAttachments)

    await this.questionsRepository.create(question)

    // right = retorno sucesso
    return right({ question })
  }
}
