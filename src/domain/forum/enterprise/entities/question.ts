import { AggregateRoot } from '@/core/entities/aggregate-root'
import { Slug } from './value-objects/slug'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import dayjs from 'dayjs'
import { QuestionAttachmentList } from './question-attachment-list'
import { QuestionBestAnswerChosenEvent } from '../events/question-best-answer-chosen-event'

export interface QuestionProps {
  authorId: UniqueEntityID
  bestAnswerId?: UniqueEntityID
  title: string
  content: string
  slug: Slug
  // para criar pergunta com anexo
  attachments: QuestionAttachmentList
  createdAt: Date
  updatedAt?: Date
}

// Entidade Question terá Attachment(anexos) como agregado
export class Question extends AggregateRoot<QuestionProps> {
  get authorId() {
    return this.props.authorId
  }

  get bestAnswerId() {
    return this.props.bestAnswerId
  }

  get title() {
    return this.props.title
  }

  get content() {
    return this.props.content
  }

  get slug() {
    return this.props.slug
  }

  get attachments() {
    return this.props.attachments
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  get isNew(): boolean {
    return dayjs().diff(this.createdAt, 'days') <= 3
  }

  get excerpt() {
    return this.content.substring(0, 120).trimEnd().concat('...')
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  set content(content: string) {
    this.props.content = content
    this.touch()
  }

  set title(title: string) {
    this.props.slug = Slug.createFromText(title)
    this.props.title = title
    this.touch()
  }

  // para adicionar anexo após a criação da pergunta
  set attachments(attachments: QuestionAttachmentList) {
    this.props.attachments = attachments
    this.touch()
  }

  // utilizado para escolher melhor resposta e remover/alterar melhor resposta
  set bestAnswerId(bestAnswerId: UniqueEntityID | undefined) {
    // se bestAnswerId for invalido, return
    if (bestAnswerId === undefined) {
      return
    }

    // se o id da melgor resposta for udentifned OU ele for diferente do recebido: dispara o evento
    if (
      this.props.bestAnswerId === undefined ||
      !bestAnswerId.equals(this.props.bestAnswerId)
    ) {
      // this é o tópico
      this.addDomainEvent(new QuestionBestAnswerChosenEvent(this, bestAnswerId))
    }

    this.props.bestAnswerId = bestAnswerId

    this.touch()
  }

  // abstrair a criação das entidades
  static create(
    // attachment é opcional pois nem toda pergunta pode ter anexo
    props: Optional<QuestionProps, 'createdAt' | 'slug' | 'attachments'>,
    id?: UniqueEntityID,
  ) {
    const question = new Question(
      {
        ...props,
        slug: props.slug ?? Slug.createFromText(props.title),
        attachments: props.attachments ?? new QuestionAttachmentList(),
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return question
  }
}
