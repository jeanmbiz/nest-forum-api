import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UsePipes,
} from '@nestjs/common'
import { hash } from 'bcrypt'
import { ZodValidationPipe } from 'src/pipes/zod-validation-pipe'
import { PrismaService } from 'src/prisma/prisma.service'
import { z } from 'zod'

// cria Schema de validação com zod
const createAccountBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
})

// Criar tipagem para o Schema zod
type CreateAccountBodySchema = z.infer<typeof createAccountBodySchema>

// /accounts é o prefixo das rotas
@Controller('/accounts')
export class CreateAccountController {
  // inversão de dependencia chamando o banco de dados
  constructor(private prisma: PrismaService) {}
  @Post()
  // retorno código de sucesso seja 201
  @HttpCode(201)
  // @UsePipes: utiliza ZodValidationPipe para validar dados do body pelo zod
  @UsePipes(new ZodValidationPipe(createAccountBodySchema))
  // @Body() da requisição e salvo na variavel body tipada pelo Zod
  async handle(@Body() body: CreateAccountBodySchema) {
    const { name, email, password } = body

    const userWithSameEmail = await this.prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (userWithSameEmail) {
      // lança erro com msg de status code correto
      throw new ConflictException(
        'User with same e-mail address already exists.',
      )
    }

    const hashedPassowrd = await hash(password, 8)

    // criação do usuário
    await this.prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassowrd,
      },
    })
  }
}
