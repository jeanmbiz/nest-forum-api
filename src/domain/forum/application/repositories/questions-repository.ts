import { PaginationParams } from '@/core/repositories/pagination-params'
import { Question } from '../../enterprise/entities/question'
import { QuestionDetails } from '../../enterprise/entities/value-objects/question-details'

// nest: para fazer injeção de dependência, precisa ser classe abstrata ao invez de interface
export abstract class QuestionsRepository {
  // nest: adicionar abstract em cada método
  abstract create(question: Question): Promise<void>
  abstract save(question: Question): Promise<void>
  abstract findById(questionId: string): Promise<Question | null>
  abstract findBySlug(slug: string): Promise<Question | null>
  // método de detalhes da pergunta
  abstract findDetailsBySlug(slug: string): Promise<QuestionDetails | null>
  abstract findManyRecent(params: PaginationParams): Promise<Question[]>
  abstract delete(question: Question): Promise<void>
}
