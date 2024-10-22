import { PaginationParams } from '@/core/repositories/pagination-params'
import { Question } from '../../enterprise/entities/question'

export interface QuestionsRepository {
  // método create que vai receber uma Anser(entidade) e vai retornar uma Promise de void
  create(question: Question): Promise<void>
  save(question: Question): Promise<void>
  findById(questionId: string): Promise<Question | null>
  findBySlug(slug: string): Promise<Question | null>
  findManyRecent(params: PaginationParams): Promise<Question[]>
  delete(question: Question): Promise<void>
}
