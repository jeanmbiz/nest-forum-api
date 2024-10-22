import { QuestionsRepository } from './../../../forum/application/repositories/questions-repository'
import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { AnswerCreatedEvent } from '@/domain/forum/enterprise/events/answer-created-event'
import { SendNotificationUseCase } from '../use-cases/send-notification'

export class OnAnswerCreated implements EventHandler {
  constructor(
    private questionsRepository: QuestionsRepository,
    private sendNotificationUseCase: SendNotificationUseCase,
  ) {
    this.setupSubscriptions()
  }

  //  cria a subscription
  setupSubscriptions(): void {
    // cadastra um subscriber a partir de um evento AnswerCreatedEvent.name
    DomainEvents.register(
      this.sendNewAnswerNotification.bind(this),
      AnswerCreatedEvent.name,
    )
  }

  // função a ser disparada acima para cadastrar subscriber
  private async sendNewAnswerNotification({ answer }: AnswerCreatedEvent) {
    // envia a notificação para o autor do tópico
    const question = await this.questionsRepository.findById(
      answer.questionId.toString(),
    )

    if (question) {
      await this.sendNotificationUseCase.execute({
        recipientId: question.authorId.toString(),
        title: `Nova resposta em "${question.title
          .substring(0, 40)
          .concat('...')}"`,
        content: answer.excerpt,
      })
    }
  }
}
