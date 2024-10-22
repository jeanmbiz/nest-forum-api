import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments-repository'
import { Question } from '@/domain/forum/enterprise/entities/question'
import { QuestionsRepository } from './../../src/domain/forum/application/repositories/questions-repository'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { DomainEvents } from '@/core/events/domain-events'
export class InMemoryQuestionsRepository implements QuestionsRepository {
  // inversão de dependencia do contrato de anexo de questões
  // um repositṕrio pode depender de outros repositórios
  constructor(
    private questionAttachmentsRepository: QuestionAttachmentsRepository,
  ) {}

  public items: Question[] = []

  async create(question: Question) {
    this.items.push(question)

    // dispara o evento ao criar no DB
    DomainEvents.dispatchEventsForAggregate(question.id)
  }

  async save(question: Question) {
    const itemIndex = this.items.findIndex((item) => item.id === question.id)

    this.items[itemIndex] = question

    // dispara o evento ao salvar/editar no DB
    DomainEvents.dispatchEventsForAggregate(question.id)
  }

  async findById(questionId: string) {
    const question = this.items.find(
      (item) => item.id.toString() === questionId,
    )

    if (!question) {
      return null
    }

    return question
  }

  async findBySlug(slug: string) {
    const question = this.items.find((item) => item.slug.value === slug)

    if (!question) {
      return null
    }

    return question
  }

  async findManyRecent({ page }: PaginationParams) {
    const questions = this.items
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20)

    return questions
  }

  async delete(question: Question) {
    const itemIndex = this.items.findIndex((item) => item.id === question.id)

    this.items.splice(itemIndex, 1)

    // ao deletar perguntas, deletar tb os anexos
    this.questionAttachmentsRepository.deleteManyByQuestionId(
      question.id.toString(),
    )
  }
}
