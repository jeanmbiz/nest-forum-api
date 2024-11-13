import { HttpCommentPresenter } from '../presenters/http-comment-presenter'
import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { FetchAnswerCommentsUseCase } from '@/domain/forum/application/use-cases/fetch-answer-comments'

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

// /answers é o prefixo da rota
@Controller('/answers/:answerId/comments')
export class FetchAnswerCommentsController {
  constructor(
    // inversão de dependência
    private fetchAnswerComments: FetchAnswerCommentsUseCase,
  ) {}

  @Get()
  async handle(
    // paginação recebido pela query (/answers?page=2)
    @Query('page', queryValidationPipe) page: PageQueryParamSchema,
    // answerId dos parâmetros
    @Param('answerId') answerId: string,
  ) {
    const result = await this.fetchAnswerComments.execute({
      page,
      answerId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const answerComments = result.value.answerComments

    // utiliza o presenter pra retornar os dados ao usuário
    return { comments: answerComments.map(HttpCommentPresenter.toHTTP) }
  }
}
