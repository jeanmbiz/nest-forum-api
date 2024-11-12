import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Post,
} from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { CommentOnQuestionUseCase } from '@/domain/forum/application/use-cases/comment-on-question'

// cria Schema de validação com zod
const commentOnQuestionBodySchema = z.object({
  content: z.string(),
})

// Criar tipagem para o Schema zod
type CommentOnQuestionBodySchema = z.infer<typeof commentOnQuestionBodySchema>

// /questions é o prefixo das rotas
@Controller('/questions/:questionId/comments')
export class CommentOnQuestionController {
  // inversão de dependencia chamando o banco de dados
  constructor(
    // injeta dependencia do caso de uso
    private commentOnQuestion: CommentOnQuestionUseCase,
  ) {}

  @Post()
  // @CurrentUser(): para pegar os dados do usuário no token
  async handle(
    // utiliza ZodValidationPipe dentro do Body para validar os dados da requisição
    @Body(new ZodValidationPipe(commentOnQuestionBodySchema))
    body: CommentOnQuestionBodySchema,
    @CurrentUser() user: UserPayload,
    @Param('questionId') questionId: string,
  ) {
    const { content } = body
    const userId = user.sub

    const result = await this.commentOnQuestion.execute({
      content,
      questionId,
      authorId: userId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
