export class HttpCommentPresenter {
  // recebe Comment do domínio
  static toHTTP(comment: any) {
    // retorna formado desejado para o front
    return {
      id: comment.id.toString(),
      content: comment.content,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    }
  }
}
