import { Attachment } from './../../enterprise/entities/attachment'
import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { InvalidAttachmentTypeError } from './errors/invalid-attachment-type--error'
import { AttachmentsRepository } from '../repositories/attachments-repository'
import { Uploader } from '../storage/uploader'

interface UploadAndCreateAttachmentUseCaseRequest {
  fileName: string
  fileType: string
  // body é o corpo do arquivo: estratégia Buffer para arquivos de até 10/15mb
  body: Buffer
}

// type Either: retorna ou sucesso ou erro
type UploadAndCreateAttachmentUseCaseResponse = Either<
  // caso de erro
  InvalidAttachmentTypeError,
  // caso de sucesso
  {
    attachment: Attachment
  }
>

// Injectable(nest): para injetar caso de uso no controller
@Injectable()
export class UploadAndCreateAttachmentUseCase {
  // dependência do repositody - contrato/interface
  constructor(
    private attachmentsRepository: AttachmentsRepository,
    private uploader: Uploader,
  ) {}

  async execute({
    fileName,
    fileType,
    body,
  }: UploadAndCreateAttachmentUseCaseRequest): Promise<UploadAndCreateAttachmentUseCaseResponse> {
    // validar fileType: regex para validar mimetype de jpeg, png, jpg e pdf.
    if (!/^(image\/(jpeg|png|jpg))$|^application\/pdf$/.test(fileType)) {
      return left(new InvalidAttachmentTypeError(fileType))
    }

    const { url } = await this.uploader.upload({
      fileName,
      fileType,
      body,
    })

    const attachment = Attachment.create({
      title: fileName,
      url,
    })

    // salva no repositório
    await this.attachmentsRepository.create(attachment)

    // right = retorno sucesso
    return right({ attachment })
  }
}
