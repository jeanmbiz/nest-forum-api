import { Either, left, right } from '@/core/either'
import { Notification } from '../../enterprise/entities/notification'
import { NotificationsRepository } from '../repositories/notifications-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'

interface ReadNotificationUseCaseRequest {
  recipientId: string
  notificationId: string
}

// type Either: retorna ou sucesso ou erro
type ReadNotificationUseCaseResponse = Either<
  // caso de erro
  ResourceNotFoundError | NotAllowedError,
  // caso de sucesso
  {
    notification: Notification
  }
>

export class ReadNotificationUseCase {
  // dependência do repositody - contrato/interface
  constructor(private notificationsRepository: NotificationsRepository) {}

  async execute({
    recipientId,
    notificationId,
  }: ReadNotificationUseCaseRequest): Promise<ReadNotificationUseCaseResponse> {
    // busca a notificação
    const notification =
      await this.notificationsRepository.findById(notificationId)

    if (!recipientId) {
      // left = retorno de erro
      return left(new ResourceNotFoundError())
    }

    if (recipientId !== notification?.recipientId.toString()) {
      // left = retorno de erro
      return left(new NotAllowedError())
    }

    // marco notificação como lida
    notification.read()

    // crio notificação dentro do repositorio
    await this.notificationsRepository.create(notification)

    // right = retorno sucesso
    return right({ notification })
  }
}
