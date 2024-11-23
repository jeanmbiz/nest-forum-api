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
import { EditQuestionUseCase } from '@/domain/forum/application/use-cases/edit-question'

// cria Schema de validação com zod
const editQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
  attachments: z.array(z.string().uuid()),
})

// Criar tipagem para o Schema zod
type EditQuestionBodySchema = z.infer<typeof editQuestionBodySchema>

// /questions é o prefixo das rotas + id da pergunta
@Controller('/questions/:id')
export class EditQuestionController {
  // inversão de dependencia chamando o banco de dados
  constructor(
    // injeta dependencia do caso de uso
    private editQuestion: EditQuestionUseCase,
  ) {}

  @Put()
  @HttpCode(204)
  // @CurrentUser(): para pegar os dados do usuário no token
  async handle(
    // utiliza ZodValidationPipe dentro do Body para validar os dados da requisição
    @Body(new ZodValidationPipe(editQuestionBodySchema))
    body: EditQuestionBodySchema,
    @CurrentUser() user: UserPayload,
    // id é parametro, sendo renomeado para questionId
    @Param('id') questionId: string,
  ) {
    const { title, content, attachments } = body
    const userId = user.sub

    const result = await this.editQuestion.execute({
      title,
      content,
      authorId: userId,
      attachmentsIds: attachments,
      questionId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
