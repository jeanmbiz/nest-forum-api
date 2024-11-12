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
import { CommentOnAnswerUseCase } from '@/domain/forum/application/use-cases/comment-on-answer'

// cria Schema de validação com zod
const commentOnAnswerBodySchema = z.object({
  content: z.string(),
})

// Criar tipagem para o Schema zod
type CommentOnAnswerBodySchema = z.infer<typeof commentOnAnswerBodySchema>

// /answers é o prefixo das rotas
@Controller('/answers/:answerId/comments')
export class CommentOnAnswerController {
  // inversão de dependencia chamando o banco de dados
  constructor(
    // injeta dependencia do caso de uso
    private commentOnAnswer: CommentOnAnswerUseCase,
  ) {}

  @Post()
  // @CurrentUser(): para pegar os dados do usuário no token
  async handle(
    // utiliza ZodValidationPipe dentro do Body para validar os dados da requisição
    @Body(new ZodValidationPipe(commentOnAnswerBodySchema))
    body: CommentOnAnswerBodySchema,
    @CurrentUser() user: UserPayload,
    @Param('answerId') answerId: string,
  ) {
    const { content } = body
    const userId = user.sub

    const result = await this.commentOnAnswer.execute({
      content,
      answerId,
      authorId: userId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
