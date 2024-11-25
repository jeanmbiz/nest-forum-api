import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { FetchQuestionCommentsUseCase } from '@/domain/forum/application/use-cases/fetch-question-comments'
import { CommentWithAuthorPresenter } from '../presenters/comment-with-author-presenter'

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
@Controller('/questions/:questionId/comments')
export class FetchQuestionCommentsController {
  constructor(
    // inversão de dependência
    private fetchQuestionComments: FetchQuestionCommentsUseCase,
  ) {}

  @Get()
  async handle(
    // paginação recebido pela query (/questions?page=2)
    @Query('page', queryValidationPipe) page: PageQueryParamSchema,
    // questionId dos parâmetros
    @Param('questionId') questionId: string,
  ) {
    const result = await this.fetchQuestionComments.execute({
      page,
      questionId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const comments = result.value.comments

    // utiliza o presenter pra retornar os dados ao usuário
    return { comments: comments.map(CommentWithAuthorPresenter.toHTTP) }
  }
}
