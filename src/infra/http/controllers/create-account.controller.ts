import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UsePipes,
} from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { RegisterStudentUseCase } from '@/domain/forum/application/use-cases/register-student'
import { StudentAlreadyExistsError } from '@/domain/forum/application/use-cases/errors/student--already-exists-error'
import { Public } from '@/infra/auth/public'

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
@Public()
export class CreateAccountController {
  // inversão de dependencia chamando o banco de dados
  constructor(private registerStudentUseCase: RegisterStudentUseCase) {}
  @Post()
  // retorno código de sucesso seja 201
  @HttpCode(201)
  // @UsePipes: utiliza ZodValidationPipe para validar dados do body pelo zod
  @UsePipes(new ZodValidationPipe(createAccountBodySchema))
  // @Body() da requisição e salvo na variavel body tipada pelo Zod
  async handle(@Body() body: CreateAccountBodySchema) {
    const { name, email, password } = body

    // executa usecase
    const result = await this.registerStudentUseCase.execute({
      name,
      email,
      password,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case StudentAlreadyExistsError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
