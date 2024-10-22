import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { z } from 'zod'

// cria Schema de validação com zod da paginaçãp
const pageQueryParamsSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

// passa o schema pro Pipe do zod
const queryValidationPipe = new ZodValidationPipe(pageQueryParamsSchema)

// Criar tipagem para o Schema zod
type PageQueryParamSchema = z.infer<typeof pageQueryParamsSchema>

// /questions é o prefixo da rota
@Controller('/questions')
// UseGuards: protegendo rota com JwtAuthGuard
@UseGuards(JwtAuthGuard)
export class FetchRecentQuestionsController {
  constructor(
    // inversão de dependência do prisma
    private prisma: PrismaService,
  ) {}

  @Get()
  async handle(
    // paginação recebido pela query (/questions?page=2)
    @Query('page', queryValidationPipe) page: PageQueryParamSchema,
  ) {
    // registros por página
    const perPage = 20

    const questions = await this.prisma.question.findMany({
      // take: nº de itens retornados
      take: perPage,
      // skip: quantos registros quero pular
      skip: (page - 1) * perPage,
      orderBy: {
        createdAt: 'desc',
      },
    })

    return { questions }
  }
}
