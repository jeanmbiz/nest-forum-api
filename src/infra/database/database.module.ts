import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { PrismaQuestionsRepository } from './prisma/repositories/prisma-questions-repository'
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'

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
  ],
  // exports: para PrismaService ser utilizado em todos os módulos que importarem DatabaseModule
  exports: [
    PrismaService,
    // exporta classe abstrata
    QuestionsRepository,
  ],
})
export class DatabaseModule {}
