import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter } from './helpers/fileFilter.helper';
import { diskStorage } from 'multer';
import { VALID_IMAGE_EXTENSIONS } from './helpers/image.constants';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('product')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter,
      // limits: {fileSize: 1000},
      storage: diskStorage({
        destination: './static/uploads',
      }),
    }),
  )
  async uploadProductImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException(
        `Make sure the file is an image or has the ${VALID_IMAGE_EXTENSIONS.join(', ')}formats`,
      );
    }

    return { fileName: file.originalname };
  }
}
