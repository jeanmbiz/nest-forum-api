import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { CurrentUser } from 'src/auth/current-user-decorator'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { UserPayload } from 'src/auth/jwt.strategy'
import { ZodValidationPipe } from 'src/pipes/zod-validation-pipe'
import { PrismaService } from 'src/prisma/prisma.service'
import { z } from 'zod'

// cria Schema de validação com zod
const createQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
})

// Criar tipagem para o Schema zod
type CreateQuestionBodySchema = z.infer<typeof createQuestionBodySchema>

// /questions é o prefixo das rotas
@Controller('/questions')
// UseGuards: protegendo rota com JwtAuthGuard
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {
  // inversão de dependencia chamando o banco de dados
  constructor(
    // inversão de dependência do prisma
    private prisma: PrismaService,
  ) {}

  @Post()
  // @CurrentUser(): para pegar os dados do usuário no token
  async handle(
    // utiliza ZodValidationPipe dentro do Body para validar os dados da requisição
    @Body(new ZodValidationPipe(createQuestionBodySchema))
    body: CreateQuestionBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const { title, content } = body
    const userId = user.sub

    // criar pergunta
    await this.prisma.question.create({
      data: {
        authorId: userId,
        title,
        content,
        slug: Math.random().toString(36).substring(2, 7),
      },
    })
  }
}
