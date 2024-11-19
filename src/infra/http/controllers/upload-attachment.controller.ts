import {
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'

// rota
@Controller('/attachments')
export class UploadAttachmentController {
  // constructor(private getQuestionBySlug: GetQuestionBySlugUseCase) {}

  @Post()
  // @UseInterceptors: para fazer upload de arquivo
  // 'file': é o fieldName do form http que contém o arquivo
  @UseInterceptors(FileInterceptor('file'))
  // @UploadedFile(): para pegar os dados do arquivo
  async handle(
    @UploadedFile(
      // ParseFilePipe: validação do arquivo
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 1024 * 1024 * 2, // 2mb
          }),
          new FileTypeValidator({ fileType: '.(png|jpg|jpeg|pdf)' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    console.log(file)
  }
}
