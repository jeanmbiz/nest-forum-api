import { Answer } from './../entities/answer'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { DomainEvent } from '@/core/events/domain-event'

export class AnswerCreatedEvent implements DomainEvent {
  public answer: Answer
  public ocurredAt: Date

  constructor(answer: Answer) {
    this.answer = answer
    this.ocurredAt = new Date()
  }

  getAggregateId(): UniqueEntityID {
    return this.answer.id
  }
}
