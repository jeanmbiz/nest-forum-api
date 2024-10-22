import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface StudentProps {
  name: string
}
export class Student extends Entity<StudentProps> {
  // abstrair a criação das entidades
  static create(props: StudentProps, id?: UniqueEntityID) {
    const student = new Student(props, id)

    return student
  }
}
