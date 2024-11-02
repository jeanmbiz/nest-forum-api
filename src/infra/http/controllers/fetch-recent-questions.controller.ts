import { FetchRecentQuestionsUseCase } from './../../../domain/forum/application/use-cases/fetch-recent-questions'
import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
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
    // inversão de dependência
    private fetchRecentQuestions: FetchRecentQuestionsUseCase,
  ) {}

  @Get()
  async handle(
    // paginação recebido pela query (/questions?page=2)
    @Query('page', queryValidationPipe) page: PageQueryParamSchema,
  ) {
    const questions = await this.fetchRecentQuestions.execute({
      page,
    })

    return { questions }
  }
}
