import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Put,
} from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { EditAnswerUseCase } from '@/domain/forum/application/use-cases/edit-answer'

// cria Schema de validação com zod
const editAnswerBodySchema = z.object({
  content: z.string(),
})

// Criar tipagem para o Schema zod
type EditAnswerBodySchema = z.infer<typeof editAnswerBodySchema>

// /answers é o prefixo das rotas + id da pergunta
@Controller('/answers/:id')
export class EditAnswerController {
  // inversão de dependencia chamando o banco de dados
  constructor(
    // injeta dependencia do caso de uso
    private editAnswer: EditAnswerUseCase,
  ) {}

  @Put()
  @HttpCode(204)
  // @CurrentUser(): para pegar os dados do usuário no token
  async handle(
    // utiliza ZodValidationPipe dentro do Body para validar os dados da requisição
    @Body(new ZodValidationPipe(editAnswerBodySchema))
    body: EditAnswerBodySchema,
    @CurrentUser() user: UserPayload,
    // id é parametro, sendo renomeado para answerId
    @Param('id') answerId: string,
  ) {
    const { content } = body
    const userId = user.sub

    const result = await this.editAnswer.execute({
      content,
      authorId: userId,
      attachmentsIds: [],
      answerId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
