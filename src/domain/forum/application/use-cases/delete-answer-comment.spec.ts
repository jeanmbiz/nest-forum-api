import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository'
import { DeleteAnswerCommentUseCase } from './delete-answer-comment'
import { makeAnswerComment } from 'test/factories/make-answer-commet'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
// sut = system under test
let sut: DeleteAnswerCommentUseCase

describe('Delete Answer Comment', () => {
  beforeEach(() => {
    // automatiza a criação do DB em memória e use case
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository()
    sut = new DeleteAnswerCommentUseCase(inMemoryAnswerCommentsRepository)
  })
  it('should be able to delete a answer comment', async () => {
    // criar answer comment pelo Factory
    const answerComment = makeAnswerComment()

    // salva no repositório
    await inMemoryAnswerCommentsRepository.create(answerComment)

    // executa o caso de uso
    await sut.execute({
      answerCommentId: answerComment.id.toString(),
      authorId: answerComment.authorId.toString(),
    })

    // espero que o repositório nao tenha itens
    expect(inMemoryAnswerCommentsRepository.items).toHaveLength(0)
  })

  it('should not be able to delete another user answer comment', async () => {
    // criar answer comment pelo Factory com id de autor
    const answerComment = makeAnswerComment({
      authorId: new UniqueEntityID('author-1'),
    })

    // salva no repositório
    await inMemoryAnswerCommentsRepository.create(answerComment)

    const result = await sut.execute({
      answerCommentId: answerComment.id.toString(),
      // executa o caso de uso com id de outro author
      authorId: 'author-2',
    })

    // espero que seja erro
    expect(result.isLeft()).toBe(true)
    // espero que o erro seja do tipo NotAllowedError
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
