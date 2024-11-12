import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  Param,
} from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { DeleteQuestionCommentUseCase } from '@/domain/forum/application/use-cases/delete-question-comment'

// /answers é o prefixo das rotas + id da pergunta
@Controller('/questions/comments/:id')
export class DeleteQuestionCommentController {
  // inversão de dependencia chamando o banco de dados
  constructor(
    // injeta dependencia do caso de uso
    private deleteQuestionComment: DeleteQuestionCommentUseCase,
  ) {}

  @Delete()
  @HttpCode(204)
  // @CurrentUser(): para pegar os dados do usuário no token
  async handle(
    @CurrentUser() user: UserPayload,
    // id é parametro, sendo renomeado para questionCommentId
    @Param('id') questionCommentId: string,
  ) {
    const userId = user.sub

    const result = await this.deleteQuestionComment.execute({
      questionCommentId,
      authorId: userId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
