import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
} from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'

// /accounts é o prefixo das rotas
@Controller('/accounts')
export class CreateAccountController {
  // inversão de dependencia chamando o banco de dados
  constructor(private prisma: PrismaService) {}
  @Post()
  // código de sucesso seja 201
  @HttpCode(201)
  // @Body() da requisição e salvo na variavel body
  async handle(@Body() body: any) {
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

    // criação do usuário
    await this.prisma.user.create({
      data: {
        name,
        email,
        password,
      },
    })
  }
}
