import {
  Uploader,
  UploadParams,
} from '@/domain/forum/application/storage/uploader'
// PutObjectAclCommand: comando para fazer upload de novo arquivo
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { EnvService } from '../env/env.service'
import { randomUUID } from 'node:crypto'
import { Injectable } from '@nestjs/common'

// @Injectable(): para nest.js injetar dependencia do EnvService
@Injectable()
export class R2Storage implements Uploader {
  private client: S3Client

  constructor(
    // inverasão de dependencia
    private envService: EnvService,
  ) {
    const accountId = envService.get('CLOUDFLARE_ACCOUNT_ID')

    // configuração cliente da Cloudflare
    this.client = new S3Client({
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      region: 'auto',
      credentials: {
        accessKeyId: envService.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: envService.get('AWS_SECRET_ACCESS_KEY'),
      },
    })
  }

  async upload({
    fileName,
    fileType,
    body,
  }: UploadParams): Promise<{ url: string }> {
    // nome do arquivo de upload deve ser ÚNICO
    const uploadId = randomUUID()
    const uniqueFileName = `${uploadId}-${fileName}`

    // faz upload do arquivo
    await this.client.send(
      new PutObjectCommand({
        Bucket: this.envService.get('AWS_BUCKET_NAME'),
        Key: uniqueFileName,
        ContentType: fileType,
        Body: body,
      }),
    )

    // salvar no banco de dados: sempre a referência/nome do arquivo pois se salvar a URL ela vai mudar se voce mudar e servoço de upload
    return {
      url: uniqueFileName,
    }
  }
}
