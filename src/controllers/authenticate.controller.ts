import {
  Controller,
  HttpCode,
  Post,
  UsePipes,
  Body,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { compare } from 'bcrypt'
import { ZodValidationPipe } from 'src/pipes/zod-validation-pipe'
import { PrismaService } from 'src/prisma/prisma.service'
import { z } from 'zod'

// cria Schema de validação com zod
const authenticateBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

// Criar tipagem para o Schema zod
type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>

// /accounts é o prefixo das rotas
@Controller('/sessions')
export class AuthenticateController {
  // inversão de dependencia chamando o banco de dados
  constructor(
    // inversão de dependência do prisma
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  @Post()
  // retorno código de sucesso seja 201
  @HttpCode(201)
  // @UsePipes: utiliza ZodValidationPipe para validar dados do body pelo zod
  @UsePipes(new ZodValidationPipe(authenticateBodySchema))
  // @Body() da requisição e salvo na variavel body tipada pelo Zod
  async handle(@Body() body: AuthenticateBodySchema) {
    const { email, password } = body

    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (!user) {
      // UnauthorizedException erro do Nest com msg e status code 401
      throw new UnauthorizedException('User credentials do not match.')
    }

    const isPasswordValid = await compare(password, user.password)

    if (!isPasswordValid) {
      // UnauthorizedException erro do Nest com msg e status code 401
      throw new UnauthorizedException('User credentials do not match.')
    }

    const accessToken = this.jwt.sign({
      // payload do token
      sub: user.id,
    })

    return { access_token: accessToken }
  }
}
