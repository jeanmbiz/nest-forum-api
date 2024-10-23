import { PaginationParams } from '@/core/repositories/pagination-params'
import { Question } from '../../enterprise/entities/question'

// nest: para fazer injeção de dependência, precisa ser classe abstrata ao invez de interface
export abstract class QuestionsRepository {
  // nest: adicionar abstract em cada método
  abstract create(question: Question): Promise<void>
  abstract save(question: Question): Promise<void>
  abstract findById(questionId: string): Promise<Question | null>
  abstract findBySlug(slug: string): Promise<Question | null>
  abstract findManyRecent(params: PaginationParams): Promise<Question[]>
  abstract delete(question: Question): Promise<void>
}
