import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { SendNotificationUseCase } from '../use-cases/send-notification'
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import { QuestionBestAnswerChosenEvent } from '@/domain/forum/enterprise/events/question-best-answer-chosen-event'

export class OnQuestionBestAnswerChosen implements EventHandler {
  constructor(
    private answersRepository: AnswersRepository,
    private sendNotificationUseCase: SendNotificationUseCase,
  ) {
    this.setupSubscriptions()
  }

  //  cria a subscription
  setupSubscriptions(): void {
    // cadastra um subscriber a partir de um evento QuestionBestAnswerChosenEvent.name
    DomainEvents.register(
      this.sendQuestionBestAnswerNotification.bind(this),
      QuestionBestAnswerChosenEvent.name,
    )
  }

  // função a ser disparada acima para cadastrar subscriber
  private async sendQuestionBestAnswerNotification({
    question,
    bestAnswerId,
  }: QuestionBestAnswerChosenEvent) {
    // biscar answer escolhida como a melhor
    const answer = await this.answersRepository.findById(
      bestAnswerId.toString(),
    )

    if (answer) {
      // envia notificação para o dono da melhor resposta avisando que a resposta dela foi escolhida
      await this.sendNotificationUseCase.execute({
        recipientId: answer.authorId.toString(),
        title: 'Sua resposta foi escolhida',
        content: `A resposta que você enviou em ${question.title.substring(0, 20).concat('...')} foi escolhida pelo autor.`,
      })
    }
  }
}
