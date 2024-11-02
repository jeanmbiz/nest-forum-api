import { FakeEncrypter } from 'test/cryptography/fake-encrypter'
import { InMemoryStudentsRepository } from '../../../../../test/repositories/in-memory-students-repository'
import { AuthenticateStudentUseCase } from './authenticate-student'
import { FakeHasher } from 'test/cryptography/fake-hasher'
import { makeStudent } from 'test/factories/make-student'

let inMemoryStudentsRepository: InMemoryStudentsRepository
let fakeHasher: FakeHasher
let fakeEncrypter: FakeEncrypter

// sut = system under test
let sut: AuthenticateStudentUseCase

describe('Authenticate Student', () => {
  beforeEach(() => {
    // automatiza a criação do DB em memória e use case
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    fakeHasher = new FakeHasher()
    fakeEncrypter = new FakeEncrypter()

    sut = new AuthenticateStudentUseCase(
      inMemoryStudentsRepository,
      fakeHasher,
      fakeEncrypter,
    )
  })
  it('should be able to authenticate a student', async () => {
    // criar estudente com a senha hasheada
    const student = makeStudent({
      email: 'johndoe@example.com',
      password: await fakeHasher.hash('123456'),
    })

    // salvar estudante no repositório
    inMemoryStudentsRepository.create(student)

    // faz login
    const result = await sut.execute({
      email: 'johndoe@example.com',
      password: '123456',
    })

    // espero que seja sucesso
    expect(result.isRight()).toBe(true)
    // espero que o objeto seja quaquer string de accessToken
    expect(result.value).toEqual({
      accessToken: expect.any(String),
    })
  })
})
