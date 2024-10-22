import { DomainEvents } from '@/core/events/domain-events'
import { DomainEvent } from '../events/domain-event'
import { Entity } from './entity'

export abstract class AggregateRoot<Props> extends Entity<Props> {
  // para agregado poder anotar eventos que disparou
  private _domainEvents: DomainEvent[] = []

  get domainEvents(): DomainEvent[] {
    return this._domainEvents
  }

  // método para disparar eventos com ready = false
  protected addDomainEvent(domainEvent: DomainEvent): void {
    this._domainEvents.push(domainEvent)
    DomainEvents.markAggregateForDispatch(this)
  }

  // limpa eventos de domínio após disparar eventos com chave true
  public clearEvents() {
    this._domainEvents = []
  }
}
