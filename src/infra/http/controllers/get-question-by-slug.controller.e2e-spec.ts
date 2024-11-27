import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AttachmentFactory } from 'test/factories/make-attachment'
import { QuestionFactory } from 'test/factories/make-question'
import { QuestionAttachmentFactory } from 'test/factories/make-question-attachments'
import { StudentFactory } from 'test/factories/make-student'

describe('Get question by slug (E2E)', () => {
  let app: INestApplication
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory
  let attachmentFactory: AttachmentFactory
  let questionAttachmentFactory: QuestionAttachmentFactory
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
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[GET] /questions/:slug', async () => {
    // cria usuário utilizando a factory
    const user = await studentFactory.makePrismaStudent({ name: 'John Doe' })

    // cria token do usuário passando user.id
    const accessToken = jwt.sign({ sub: user.id.toString() })

    // criar perguntar pela factoy
    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
      slug: Slug.create('slug-01'),
    })

    // cria um anexo
    const attachment = await attachmentFactory.makePrismaAttachment({
      title: 'Some attachment',
    })

    // cria relacionamento do anexo com a pergunta: pergunta com autor e anexo associado a ela
    await questionAttachmentFactory.makePrismaQuestionAttachment({
      attachmentId: attachment.id,
      questionId: question.id,
    })

    // faz requisição para a rota
    const response = await request(app.getHttpServer())
      .get('/questions/slug-01')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      question: expect.objectContaining({
        slug: 'slug-01',
        author: 'John Doe',
        attachments: [
          expect.objectContaining({
            title: 'Some attachment',
          }),
        ],
      }),
    })
  })
})
