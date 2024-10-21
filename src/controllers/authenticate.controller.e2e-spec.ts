import { AppModule } from '@/app.module'
import { Test } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { PrismaService } from '@/prisma/prisma.service'
import { hash } from 'bcrypt'

describe('Authenticate (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)

    await app.init()
  })

  test('[POST] /sessions', async () => {
    // cria usuário utilizando o prisma
    await prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'johndoe@example.com',
        // cria usuário com o o hash de senha utlizando bcrypt
        password: await hash('123456', 8),
      },
    })

    // authentica usuário
    const response = await request(app.getHttpServer()).post('/sessions').send({
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(response.statusCode).toBe(201)
    expect(response.body).toEqual({
      access_token: expect.any(String),
    })
  })
})
