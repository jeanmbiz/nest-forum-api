import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository'
import { ReadNotificationUseCase } from './read-notification'
import { makeNotification } from 'test/factories/make-notification'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'

let inMemoryNotificationsRepository: InMemoryNotificationsRepository
// sut = system under test
let sut: ReadNotificationUseCase

describe('Read Notification', () => {
  beforeEach(() => {
    // automatiza a criação do DB em memória e use case
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()

    sut = new ReadNotificationUseCase(inMemoryNotificationsRepository)
  })
  it('should be able to read a notification', async () => {
    // crio a notificação utilizando o factory
    const notification = makeNotification()

    // crio no repositório
    inMemoryNotificationsRepository.create(notification)

    const result = await sut.execute({
      recipientId: notification.recipientId.toString(),
      notificationId: notification.id.toString(),
    })

    // espero que seja sucesso
    expect(result.isRight()).toBe(true)
    // espero que o readAt da noticication seja qlqer data
    expect(inMemoryNotificationsRepository.items[0].readAt).toEqual(
      expect.any(Date),
    )
  })

  it('should not be able to read a notification from another user', async () => {
    // criar pergunta c/ id pelo Factory
    const newNotification = makeNotification({
      recipientId: new UniqueEntityID('recipient-1'),
    })

    // crio no repositório
    await inMemoryNotificationsRepository.create(newNotification)

    const result = await sut.execute({
      notificationId: newNotification.id.toString(),
      recipientId: 'recipient-2',
    })

    // espero que seja erro
    expect(result.isLeft()).toBe(true)
    // espero que o erro seja do tipo NotAllowedError
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
