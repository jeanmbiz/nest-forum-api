import { QuestionAttachmentsRepository } from './../repositories/question-attachments-repository'
import { Either, left, right } from '@/core/either'
import { Question } from '../../enterprise/entities/question'
import { QuestionsRepository } from '../repositories/questions-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { QuestionAttachmentList } from '../../enterprise/entities/question-attachment-list'
import { QuestionAttachment } from '../../enterprise/entities/question-attachment'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

interface EditQuestionUseCaseRequest {
  authorId: string
  questionId: string
  title: string
  content: string
  // recebe apenas os ids dos anexos previamente criados
  attachmentsIds: string[]
}

// type Either: retorna ou sucesso ou erro
type EditQuestionUseCaseResponse = Either<
  // caso de erro
  ResourceNotFoundError | NotAllowedError,
  // caso de sucesso
  {
    question: Question
  }
>

export class EditQuestionUseCase {
  // dependência do repositody - contrato/interface
  constructor(
    private questionsRepository: QuestionsRepository,
    private questionAttachmentsRepository: QuestionAttachmentsRepository,
  ) {}

  async execute({
    authorId,
    questionId,
    title,
    content,
    attachmentsIds,
  }: EditQuestionUseCaseRequest): Promise<EditQuestionUseCaseResponse> {
    const question = await this.questionsRepository.findById(questionId)

    if (!question) {
      // left = retorno de erro
      return left(new ResourceNotFoundError())
    }

    if (authorId !== question.authorId.toString()) {
      // left = retorno de erro
      return left(new NotAllowedError())
    }

    // busco todos os anexos que a pergunta ja tem no repositório
    const currentQuestionAttachments =
      await this.questionAttachmentsRepository.findManyByQuestionId(questionId)

    // crio uma lista com os anexos que temos atualmente
    const questionAttachmentList = new QuestionAttachmentList(
      currentQuestionAttachments,
    )

    // crio uma nova lista de anexos recebida pela rota
    const questionAttachments = attachmentsIds.map((attachmentId) => {
      return QuestionAttachment.create({
        attachmentId: new UniqueEntityID(attachmentId),
        questionId: question.id,
      })
    })

    // faço update da lista utilizando Watched-list
    questionAttachmentList.update(questionAttachments)

    // edita o titulo e conteudo da pergunta
    question.title = title
    question.content = content
    // salvo lista atualizada na question
    question.attachments = questionAttachmentList

    await this.questionsRepository.save(question)

    // right = retorno sucesso
    return right({ question })
  }
}
