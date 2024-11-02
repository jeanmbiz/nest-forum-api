import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { StudentsRepository } from '../repositories/students-repository'
import { HashComparer } from '../cryptography/hash-comparer'
import { Encrypter } from '../cryptography/encrypter'
import { WrongCredentialsError } from './errors/wrong-credentials-error'

interface AuthenticateStudentUseCaseRequest {
  email: string
  password: string
}

// type Either: retorna ou sucesso ou erro
type AuthenticateStudentUseCaseResponse = Either<
  // caso de erro
  WrongCredentialsError,
  // caso de sucesso
  {
    accessToken: string
  }
>

// Injectable(nest): para injetar caso de uso no controller
@Injectable()
export class AuthenticateStudentUseCase {
  // dependência do repositody - contrato/interface
  constructor(
    private studentsRepository: StudentsRepository,
    // contrato para comparar o rash da senha
    private hashCompare: HashComparer,
    // contrato para gerar o token
    private encrypter: Encrypter,
  ) {}

  async execute({
    email,
    password,
  }: AuthenticateStudentUseCaseRequest): Promise<AuthenticateStudentUseCaseResponse> {
    const student = await this.studentsRepository.findByEmail(email)

    if (!student) {
      return left(new WrongCredentialsError())
    }

    // comparo as senhas
    const isPasswordValid = await this.hashCompare.compare(
      password,
      student.password,
    )

    if (!isPasswordValid) {
      // UnauthorizedException erro do Nest com msg e status code 401
      throw new WrongCredentialsError()
    }

    // criar token
    const accessToken = await this.encrypter.encrypt({
      // payload do token
      sub: student.id.toString(),
    })

    // right = retorno sucesso
    return right({ accessToken })
  }
}
