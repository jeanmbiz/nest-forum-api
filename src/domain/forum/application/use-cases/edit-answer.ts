import { Either, left, right } from '@/core/either'
import { Answer } from '../../enterprise/entities/answer'
import { AnswersRepository } from '../repositories/answers-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { AnswerAttachmentsRepository } from '../repositories/answer-attachments-repository'
import { AnswerAttachmentList } from '../../enterprise/entities/answer-attachment-list'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { AnswerAttachment } from '../../enterprise/entities/answer-attachment'

interface EditAnswerUseCaseRequest {
  authorId: string
  answerId: string
  content: string
  attachmentsIds: string[]
}

// type Either: retorna ou sucesso ou erro
type EditAnswerUseCaseResponse = Either<
  // caso de erro
  ResourceNotFoundError | NotAllowedError,
  // caso de sucesso
  {
    answer: Answer
  }
>

export class EditAnswerUseCase {
  // dependência do repositody - contrato/interface
  constructor(
    private answersRepository: AnswersRepository,
    private answerAttachmentsRepository: AnswerAttachmentsRepository,
  ) {}

  async execute({
    authorId,
    answerId,
    content,
    attachmentsIds,
  }: EditAnswerUseCaseRequest): Promise<EditAnswerUseCaseResponse> {
    const answer = await this.answersRepository.findById(answerId)

    if (!answer) {
      // left = retorno de erro
      return left(new ResourceNotFoundError())
    }

    if (authorId !== answer.authorId.toString()) {
      // left = retorno de erro
      return left(new NotAllowedError())
    }

    // busco todos os anexos que a pergunta ja tem no repositório
    const currentAnswerAttachments =
      await this.answerAttachmentsRepository.findManyByAnswerId(answerId)

    // crio uma lista com os anexos que temos atualmente
    const answerAttachmentList = new AnswerAttachmentList(
      currentAnswerAttachments,
    )

    // crio uma nova lista de anexos recebida pela rota
    const answerAttachments = attachmentsIds.map((attachmentId) => {
      return AnswerAttachment.create({
        attachmentId: new UniqueEntityID(attachmentId),
        answerId: answer.id,
      })
    })

    // faço update da lista utilizando Watched-list
    answerAttachmentList.update(answerAttachments)

    // salvo lista atualizada na answer
    answer.attachments = answerAttachmentList

    // edita o conteudo
    answer.content = content

    await this.answersRepository.save(answer)

    // right = retorno sucesso
    return right({ answer })
  }
}
