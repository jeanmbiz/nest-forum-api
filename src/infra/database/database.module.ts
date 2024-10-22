import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'

@Module({
  // provider: para PrismaService ficar disponível dentro deste módulo
  providers: [PrismaService],
  // exports: para PrismaService ser utilizado em todos os módulos que importarem DatabaseModule
  exports: [PrismaService],
})
export class DatabaseModule {}
