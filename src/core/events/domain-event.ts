import { UniqueEntityID } from '../entities/unique-entity-id'

export interface DomainEvent {
  // quando evento ocorreu
  ocurredAt: Date
  // id da entidade principal que disparou evento
  getAggregateId(): UniqueEntityID
}
