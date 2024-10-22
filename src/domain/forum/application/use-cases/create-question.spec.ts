import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryQuestionsRepository } from './../../../../../test/repositories/in-memory-questions-repository'
import { CreateQuestionUseCase } from './create-question'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
// sut = system under test
let sut: CreateQuestionUseCase

describe('Create Question', () => {
  beforeEach(() => {
    // automatiza a criação do DB em memória e use case
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository()
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
    )

    sut = new CreateQuestionUseCase(inMemoryQuestionsRepository)
  })
  it('should be able to create a question', async () => {
    const result = await sut.execute({
      authorId: '1',
      title: 'Nova Pergunta',
      content: 'Conteúdo da Pergunta',
      attachmentsIds: ['1', '2'],
    })

    // espero que seja sucesso
    expect(result.isRight()).toBe(true)
    // certificar que foi salvo no repositório
    expect(inMemoryQuestionsRepository.items[0]).toEqual(result.value?.question)
    // certificar que tem 2 anexos no repositório
    expect(
      inMemoryQuestionsRepository.items[0].attachments.currentItems,
    ).toHaveLength(2)
    // certificar que no repositório tem 1 array com 2 objetos dos attachmentsIds criados
    expect(
      inMemoryQuestionsRepository.items[0].attachments.currentItems,
    ).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityID('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityID('2') }),
    ])
  })
})
