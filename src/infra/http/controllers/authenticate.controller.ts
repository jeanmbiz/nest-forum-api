import {
  Controller,
  HttpCode,
  Post,
  UsePipes,
  Body,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { AuthenticateStudentUseCase } from '@/domain/forum/application/use-cases/authenticate-student'
import { WrongCredentialsError } from '@/domain/forum/application/use-cases/errors/wrong-credentials-error'

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
    private authenticateStudentUseCase: AuthenticateStudentUseCase,
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

    // executar use case
    const result = await this.authenticateStudentUseCase.execute({
      email,
      password,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case WrongCredentialsError:
          throw new UnauthorizedException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    // buscar access token dentro do resultado da execução do usecase
    const { accessToken } = result.value

    return { access_token: accessToken }
  }
}
