import { PrismaAnswerMapper } from './../../src/infra/database/prisma/mappers/prisma-answer-mapper'
import { AnswerProps } from '../../src/domain/forum/enterprise/entities/answer'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Answer } from '@/domain/forum/enterprise/entities/answer'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

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

@Injectable()
export class AnswerFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaAnswer(data: Partial<AnswerProps> = {}): Promise<Answer> {
    const answer = makeAnswer(data)

    await this.prisma.answer.create({
      data: PrismaAnswerMapper.toPrisma(answer),
    })

    return answer
  }
}
