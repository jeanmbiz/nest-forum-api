import { Answer } from '@/domain/forum/enterprise/entities/answer'

export class HttpAnswerPresenter {
  // recebe Answer do domínio
  static toHTTP(answer: Answer) {
    // retorna formado desejado para o front
    return {
      id: answer.id.toString(),
      content: answer.content,
      createdAt: answer.createdAt,
      updatedAt: answer.updatedAt,
    }
  }
}
