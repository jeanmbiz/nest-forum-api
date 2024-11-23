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
import { QuestionAttachmentFactory } from 'test/factories/make-question-attachments'

describe('Edit Question (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let studentFactory: StudentFactory
  let attachmentFactory: AttachmentFactory
  let questionAttachmentFactory: QuestionAttachmentFactory
  let questionFactory: QuestionFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        StudentFactory,
        QuestionFactory,
        AttachmentFactory,
        QuestionAttachmentFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()

    // injeção de dependência
    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    attachmentFactory = moduleRef.get(AttachmentFactory)
    questionAttachmentFactory = moduleRef.get(QuestionAttachmentFactory)
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[PUT] /questions/:id', async () => {
    // cria usuário utilizando a factory
    const user = await studentFactory.makePrismaStudent()

    // cria token do usuário passando user.id
    const accessToken = jwt.sign({ sub: user.id.toString() })

    // criar pergunta usando factory
    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    })

    // criar e salva anexos da pergunta no DB
    const attachment1 = await attachmentFactory.makePrismaAttachment()
    const attachment2 = await attachmentFactory.makePrismaAttachment()

    // cria relacionamento da pergunta com o anexo 1
    await questionAttachmentFactory.makePrismaQuestionAttachment({
      attachmentId: attachment1.id,
      questionId: question.id,
    })

    // cria relacionamento da pergunta com o anexo 2
    await questionAttachmentFactory.makePrismaQuestionAttachment({
      attachmentId: attachment2.id,
      questionId: question.id,
    })

    // crio 3º anexo
    const attachment3 = await attachmentFactory.makePrismaAttachment()

    // pego id da pergunta criada
    const questionId = question.id.toString()

    // faz requisição para a rota
    const response = await request(app.getHttpServer())
      .put(`/questions/${questionId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'New Title',
        content: 'New content',
        // envio anexo 1 e 3
        attachments: [attachment1.id.toString(), attachment3.id.toString()],
      })

    // retorno 204, igual HttpCode do controller
    expect(response.statusCode).toBe(204)

    // busca pergunta no banco de dados
    const questionOnDatabase = await prisma.question.findFirst({
      where: {
        title: 'New Title',
        content: 'New content',
      },
    })

    expect(questionOnDatabase).toBeTruthy()

    // associar anexos criados anteriormente com pergunta criada
    const attachmentsOnDatabase = await prisma.attachment.findMany({
      where: {
        questionId: questionOnDatabase?.id,
      },
    })

    expect(attachmentsOnDatabase).toHaveLength(2)
    // confirma que editou o array de anexos 1 e 3
    expect(attachmentsOnDatabase).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: attachment1.id.toString(),
        }),
        expect.objectContaining({
          id: attachment3.id.toString(),
        }),
      ]),
    )
  })
})
