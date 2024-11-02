import { FetchRecentQuestionsUseCase } from './../../../domain/forum/application/use-cases/fetch-recent-questions'
import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { HttpQuestionPresenter } from '../presenters/http-question-presenter'

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
    const result = await this.fetchRecentQuestions.execute({
      page,
    })

    if (result.isLeft()) {
      throw new Error()
    }

    const questions = result.value.questions

    // utiliza o presenter pra retornar os dados ao usuário
    return { questions: questions.map(HttpQuestionPresenter.toHTTP) }
  }
}
