import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Student } from '@/domain/forum/enterprise/entities/student'
import { Prisma, User as PrismaUser } from '@prisma/client'

export class PrismaStudentMapper {
  // toDomain: converte Student do Prisma para Student da Entidade/Dominio
  static toDomain(raw: PrismaUser): Student {
    return Student.create(
      {
        name: raw.name,
        email: raw.email,
        password: raw.password,
      },
      new UniqueEntityID(raw.id),
    )
  }

  // toPrisma: converte Student da Entidade/Dominio para Student do Prisma
  static toPrisma(student: Student): Prisma.UserUncheckedCreateInput {
    return {
      id: student.id.toString(),
      name: student.name,
      email: student.email,
      password: student.password,
    }
  }
}
