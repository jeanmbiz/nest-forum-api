import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { PrismaQuestionsRepository } from './prisma/repositories/prisma-questions-repository'
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import { StudentsRepository } from '@/domain/forum/application/repositories/students-repository'
import { PrismaStudentsRepository } from './prisma/repositories/prisma-students-repository'

@Module({
  // provider: para PrismaService ficar disponível dentro deste módulo
  providers: [
    PrismaService,
    {
      // provide: nome classe abstrata QuestionsRepository
      provide: QuestionsRepository,
      // utilize PrismaQuestionsRepository
      useClass: PrismaQuestionsRepository,
    },
    {
      // provide: nome classe abstrata
      provide: StudentsRepository,
      useClass: PrismaStudentsRepository,
    },
  ],
  // exports: para PrismaService ser utilizado em todos os módulos que importarem DatabaseModule
  exports: [
    PrismaService,
    // exporta classe abstrata
    QuestionsRepository,
    StudentsRepository,
  ],
})
export class DatabaseModule {}
