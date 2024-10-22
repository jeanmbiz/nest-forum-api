import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { Comment, CommentProps } from './comment'

// extende CommentProps e customiza para respostas dos comentários
export interface AnswerCommentProps extends CommentProps {
  answerId: UniqueEntityID
}

// Extende a Classe comment
export class AnswerComment extends Comment<AnswerCommentProps> {
  // getter da interface customizada
  get answerId() {
    return this.props.answerId
  }

  // abstrair a criação das entidades
  static create(
    props: Optional<AnswerCommentProps, 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    const answerComment = new AnswerComment(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return answerComment
  }
}
