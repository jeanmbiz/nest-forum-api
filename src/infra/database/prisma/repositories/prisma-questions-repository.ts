import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments-repository'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import { Question } from '@/domain/forum/enterprise/entities/question'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaQuestionMapper } from '../mappers/prisma-question-mapper'
import { QuestionDetails } from '@/domain/forum/enterprise/entities/value-objects/question-details'
import { PrismaQuestionDetailsMapper } from '../mappers/prisma-question-details-mapper'
import { DomainEvents } from '@/core/events/domain-events'
import { CacheRepository } from '@/infra/cache/cache-repository'

// Injectable: Este repositório será injetado nos casos de uso
@Injectable()
// implementar Repositório(contrato) da camada de domínio
export class PrismaQuestionsRepository implements QuestionsRepository {
  // injeta dependencia do Prisma
  constructor(
    private prisma: PrismaService,
    private cacheRepository: CacheRepository,
    private questionAttachmentsRepository: QuestionAttachmentsRepository,
  ) {}

  async create(question: Question): Promise<void> {
    const data = PrismaQuestionMapper.toPrisma(question)

    // cria a question no DB
    await this.prisma.question.create({
      data,
    })

    // cria anexos da pergunta no DB - usando id da pergunta criada
    await this.questionAttachmentsRepository.createMany(
      question.attachments.getItems(),
    )

    // disparar eventos
    DomainEvents.dispatchEventsForAggregate(question.id)
  }

  async save(question: Question): Promise<void> {
    const data = PrismaQuestionMapper.toPrisma(question)

    // Promise.all: ganho de performance, pois uma requisição nao depende da outra, todas podem ser executadas juntas
    await Promise.all([
      this.prisma.question.update({
        where: {
          id: question.id.toString(),
        },
        data,
      }),
      this.questionAttachmentsRepository.createMany(
        question.attachments.getNewItems(),
      ),
      this.questionAttachmentsRepository.deleteMany(
        question.attachments.getRemovedItems(),
      ),
      // deletar cache sempre que uma nova informaçãp for salva
      this.cacheRepository.delete(`question:${data.slug}:details`),
    ])

    // disparar eventos
    DomainEvents.dispatchEventsForAggregate(question.id)
  }

  async findById(questionId: string): Promise<Question | null> {
    const question = await this.prisma.question.findUnique({
      where: {
        id: questionId,
      },
    })

    if (!question) {
      return null
    }

    // mapper: faz conversão da Question (representação da tabela Question no DB) para entidade de Domínio
    return PrismaQuestionMapper.toDomain(question)
  }

  async findBySlug(slug: string): Promise<Question | null> {
    const question = await this.prisma.question.findUnique({
      where: {
        slug,
      },
    })

    if (!question) {
      return null
    }

    // mapper: faz conversão da Question (representação da tabela Question no DB) para entidade de Domínio
    return PrismaQuestionMapper.toDomain(question)
  }

  // método p/ retornar os dados da pergunta c/ autor e anexos.
  async findDetailsBySlug(slug: string): Promise<QuestionDetails | null> {
    // busca informação no cache
    const cacheHit = await this.cacheRepository.get(`question:${slug}:details`)

    // se houver cache, retorna os dados pro usuário sem bater no banco de dados pŕisma
    if (cacheHit) {
      const cachedData = JSON.parse(cacheHit)

      return cachedData
    }

    const question = await this.prisma.question.findUnique({
      where: {
        slug,
      },
      // para trazer dados do autor e dos anexos
      include: {
        author: true,
        attachments: true,
      },
    })

    if (!question) {
      return null
    }

    const questionDetails = PrismaQuestionDetailsMapper.toDomain(question)

    // salvar os dados em cache
    await this.cacheRepository.set(
      `question:${slug}:details`,
      JSON.stringify(questionDetails),
    )

    return questionDetails
  }

  async findManyRecent({ page }: PaginationParams): Promise<Question[]> {
    const questions = await this.prisma.question.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
      skip: (page - 1) * 20,
    })

    // mapper: faz conversão da Question (representação da tabela Question no DB) para entidade de Domínio
    return questions.map(PrismaQuestionMapper.toDomain)
  }

  async delete(question: Question): Promise<void> {
    const data = PrismaQuestionMapper.toPrisma(question)

    await this.prisma.question.delete({
      where: {
        id: data.id,
      },
    })
  }
}
