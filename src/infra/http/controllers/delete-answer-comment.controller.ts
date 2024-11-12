import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  Param,
} from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { DeleteAnswerCommentUseCase } from '@/domain/forum/application/use-cases/delete-answer-comment'

// /answers é o prefixo das rotas + id da pergunta
@Controller('/answers/comments/:id')
export class DeleteAnswerCommentController {
  // inversão de dependencia chamando o banco de dados
  constructor(
    // injeta dependencia do caso de uso
    private deleteAnswerComment: DeleteAnswerCommentUseCase,
  ) {}

  @Delete()
  @HttpCode(204)
  // @CurrentUser(): para pegar os dados do usuário no token
  async handle(
    @CurrentUser() user: UserPayload,
    // id é parametro, sendo renomeado para answerCommentId
    @Param('id') answerCommentId: string,
  ) {
    const userId = user.sub

    const result = await this.deleteAnswerComment.execute({
      answerCommentId,
      authorId: userId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
