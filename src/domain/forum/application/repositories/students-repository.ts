import { Student } from '../../enterprise/entities/student'

// nest: para fazer injeção de dependência, precisa ser classe abstrata ao invez de interface
export abstract class StudentsRepository {
  // nest: adicionar abstract em cada método
  abstract create(student: Student): Promise<void>
  abstract findByEmail(email: string): Promise<Student | null>
}
