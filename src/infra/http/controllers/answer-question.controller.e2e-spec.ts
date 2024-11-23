import { AppModule } from '@/infra/app.module'
import { Test } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { JwtService } from '@nestjs/jwt'
import { DatabaseModule } from '@/infra/database/database.module'
import { StudentFactory } from 'test/factories/make-student'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { QuestionFactory } from 'test/factories/make-question'
import { AttachmentFactory } from 'test/factories/make-attachment'

describe('Answer Question (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory
  let attachmentFactory: AttachmentFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, AttachmentFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    // injeção de dependência
    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    attachmentFactory = moduleRef.get(AttachmentFactory)
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[POST] /questions/:questionId/answers', async () => {
    // cria usuário utilizando a factory
    const user = await studentFactory.makePrismaStudent()

    // cria token do usuário passando user.id
    const accessToken = jwt.sign({ sub: user.id.toString() })

    // criar pergunta usando factory
    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    })

    // pego id da pergunta criada
    const questionId = question.id.toString()

    // criar e salva anexos da pergunta no DB
    const attachment1 = await attachmentFactory.makePrismaAttachment()
    const attachment2 = await attachmentFactory.makePrismaAttachment()

    // faz requisição para a rota
    const response = await request(app.getHttpServer())
      .post(`/questions/${questionId}/answers`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        content: 'New answer',
        attachments: [attachment1.id.toString(), attachment2.id.toString()],
      })

    // igual HttpCode do controller
    expect(response.statusCode).toBe(201)

    // busca pergunta no banco de dados
    const answerOnDatabase = await prisma.answer.findFirst({
      where: {
        content: 'New answer',
      },
    })

    expect(answerOnDatabase).toBeTruthy()

    // associar anexos criados anteriormente com resposta criada
    const attachmentsOnDatabase = await prisma.attachment.findMany({
      where: {
        answerId: answerOnDatabase?.id,
      },
    })

    expect(attachmentsOnDatabase).toHaveLength(2)
  })
})
