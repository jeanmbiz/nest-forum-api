import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { AnswerQuestionUseCase } from './answer-question'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'

let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let inMemoryAnswersRepository: InMemoryAnswersRepository
// sut = system under test
let sut: AnswerQuestionUseCase

describe('Create Answer', () => {
  beforeEach(() => {
    // automatiza a criação do DB em memória e use case
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
    )

    sut = new AnswerQuestionUseCase(inMemoryAnswersRepository)
  })
  it('should be able to create an answer', async () => {
    const result = await sut.execute({
      instructorId: '1',
      questionId: '1',
      content: 'Conteúdo da Resposta',
      attachmentsIds: ['1', '2'],
    })

    // espero que seja sucesso
    expect(result.isRight()).toBe(true)
    // certificar que o answer foi salvo no repositório
    expect(inMemoryAnswersRepository.items[0]).toEqual(result.value?.answer)
    // certificar que tem 2 anexos no repositório
    expect(
      inMemoryAnswersRepository.items[0].attachments.currentItems,
    ).toHaveLength(2)
    // certificar que no repositório tem 1 array com 2 objetos dos attachmentsIds criados
    expect(inMemoryAnswersRepository.items[0].attachments.currentItems).toEqual(
      [
        expect.objectContaining({ attachmentId: new UniqueEntityID('1') }),
        expect.objectContaining({ attachmentId: new UniqueEntityID('2') }),
      ],
    )
  })
})
