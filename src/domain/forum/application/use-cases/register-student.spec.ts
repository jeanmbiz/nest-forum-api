import { InMemoryStudentsRepository } from '../../../../../test/repositories/in-memory-students-repository'
import { RegisterStudentUseCase } from './register-student'
import { FakeHasher } from 'test/cryptography/fake-hasher'

let inMemoryStudentsRepository: InMemoryStudentsRepository
let fakeHasher: FakeHasher
// sut = system under test
let sut: RegisterStudentUseCase

describe('Register Student', () => {
  beforeEach(() => {
    // automatiza a criação do DB em memória e use case
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    fakeHasher = new FakeHasher()

    sut = new RegisterStudentUseCase(inMemoryStudentsRepository, fakeHasher)
  })
  it('should be able to register a new student', async () => {
    const result = await sut.execute({
      name: 'Joh Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    // espero que seja sucesso
    expect(result.isRight()).toBe(true)
    // espero que o objeto student seja igual ao salvo no repositório
    expect(result.value).toEqual({
      student: inMemoryStudentsRepository.items[0],
    })
  })

  it('should hash student password up on registration', async () => {
    const result = await sut.execute({
      name: 'Joh Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    const hashedPassword = await fakeHasher.hash('123456')

    // espero que seja sucesso
    expect(result.isRight()).toBe(true)
    // espero que a senha do student seja igual a hashedPassword
    expect(inMemoryStudentsRepository.items[0].password).toEqual(hashedPassword)
  })
})
