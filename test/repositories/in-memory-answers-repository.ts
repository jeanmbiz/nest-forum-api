import { DomainEvents } from '@/core/events/domain-events'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments-repository'
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import { Answer } from '@/domain/forum/enterprise/entities/answer'
export class InMemoryAnswersRepository implements AnswersRepository {
  // inversão de dependencia do contrato de anexo de questões
  // um repositṕrio pode depender de outros repositórios
  constructor(
    private answerAttachmentsRepository: AnswerAttachmentsRepository,
  ) {}

  public items: Answer[] = []
  async create(answer: Answer) {
    this.items.push(answer)

    // dispara o evento ao criar no DB
    DomainEvents.dispatchEventsForAggregate(answer.id)
  }

  async save(answer: Answer) {
    const itemIndex = this.items.findIndex((item) => item.id === answer.id)

    this.items[itemIndex] = answer

    // dispara o evento ao salvar/editar no DB
    DomainEvents.dispatchEventsForAggregate(answer.id)
  }

  async findById(answerId: string) {
    const answer = this.items.find((item) => item.id.toString() === answerId)

    if (!answer) {
      return null
    }

    return answer
  }

  async findManyByQuestionId(questionId: string, { page }: PaginationParams) {
    const answers = this.items
      .filter((item) => item.questionId.toString() === questionId)
      .slice((page - 1) * 20, page * 20)

    return answers
  }

  async delete(answer: Answer) {
    const itemIndex = this.items.findIndex((item) => item.id === answer.id)

    this.items.splice(itemIndex, 1)
    // ao deletar perguntas, deletar tb os anexos
    this.answerAttachmentsRepository.deleteManyByAnswerId(answer.id.toString())
  }
}
