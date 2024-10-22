import { Either, right } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Notification } from '../../enterprise/entities/notification'
import { NotificationsRepository } from '../repositories/notifications-repository'

export interface SendNotificationUseCaseRequest {
  recipientId: string
  title: string
  content: string
}

// type Either: retorna ou sucesso ou erro
export type SendNotificationUseCaseResponse = Either<
  // caso de erro
  null,
  // caso de sucesso
  {
    notification: Notification
  }
>

export class SendNotificationUseCase {
  // dependência do repositody - contrato/interface
  constructor(private notificationsRepository: NotificationsRepository) {}

  async execute({
    recipientId,
    title,
    content,
  }: SendNotificationUseCaseRequest): Promise<SendNotificationUseCaseResponse> {
    // crio a notificação
    const notification = Notification.create({
      content,
      recipientId: new UniqueEntityID(recipientId),
      title,
    })

    await this.notificationsRepository.create(notification)

    // right = retorno sucesso
    return right({ notification })
  }
}
