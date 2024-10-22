import { AnswerProps } from '../../src/domain/forum/enterprise/entities/answer'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Answer } from '@/domain/forum/enterprise/entities/answer'
import { faker } from '@faker-js/faker'

export function makeAnswer(
  // para criar answers fakes
  override: Partial<AnswerProps> = {},
  // para poder criar uma answer com ID específica
  id?: UniqueEntityID,
) {
  const answer = Answer.create(
    {
      authorId: new UniqueEntityID(),
      questionId: new UniqueEntityID(),
      content: faker.lorem.text(),
      // sobrescrever propriedades acima
      ...override,
    },
    id,
  )

  return answer
}
