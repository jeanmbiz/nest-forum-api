import { WatchedList } from '@/core/entities/watched-list'
import { AnswerAttachment } from './answer-attachment'

// extende WatchedList passando o tipo de informação que terá
export class AnswerAttachmentList extends WatchedList<AnswerAttachment> {
  compareItems(a: AnswerAttachment, b: AnswerAttachment): boolean {
    return a.attachmentId.equals(b.attachmentId)
  }
}
