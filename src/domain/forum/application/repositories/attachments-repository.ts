import { Attachment } from '../../enterprise/entities/attachment'

export abstract class AttachmentsRepository {
  // método create que vai receber uma Anser(entidade) e vai retornar uma Promise de void
  abstract create(attachment: Attachment): Promise<void>
}
