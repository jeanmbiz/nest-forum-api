import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  Param,
} from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { DeleteAnswerUseCase } from '@/domain/forum/application/use-cases/delete-answer'

// /answers é o prefixo das rotas + id da pergunta
@Controller('/answers/:id')
export class DeleteAnswerController {
  // inversão de dependencia chamando o banco de dados
  constructor(
    // injeta dependencia do caso de uso
    private deleteAnswer: DeleteAnswerUseCase,
  ) {}

  @Delete()
  @HttpCode(204)
  // @CurrentUser(): para pegar os dados do usuário no token
  async handle(
    @CurrentUser() user: UserPayload,
    // id é parametro, sendo renomeado para answerId
    @Param('id') answerId: string,
  ) {
    const userId = user.sub

    const result = await this.deleteAnswer.execute({
      answerId,
      authorId: userId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
