import { StudentsRepository } from '@/domain/forum/application/repositories/students-repository'
import { Student } from '@/domain/forum/enterprise/entities/student'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaStudentMapper } from '../mappers/prisma-student-mapper'

// Injectable: Este repositório será injetado nos casos de uso
@Injectable()
// implementar Repositório(contrato) da camada de domínio
export class PrismaStudentsRepository implements StudentsRepository {
  // injeta dependencia do Prisma
  constructor(private prisma: PrismaService) {}

  async create(student: Student): Promise<void> {
    const data = PrismaStudentMapper.toPrisma(student)

    await this.prisma.user.create({
      data,
    })
  }

  // na camada de domínio é student e na camada de persistencia é user
  async findByEmail(email: string): Promise<Student | null> {
    const student = await this.prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (!student) {
      return null
    }

    // mapper: faz conversão da Student (representação da tabela Student no DB) para entidade de Domínio
    return PrismaStudentMapper.toDomain(student)
  }
}
