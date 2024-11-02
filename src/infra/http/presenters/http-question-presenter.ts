import { Question } from '@/domain/forum/enterprise/entities/question'

export class HttpQuestionPresenter {
  // recebe Question do domínio
  static toHTTP(question: Question) {
    // retorna formado desejado para o front
    return {
      id: question.id.toString(),
      title: question.title,
      slug: question.slug.value,
      bestAnswerId: question.bestAnswerId?.toString(),
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
    }
  }
}
