import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter } from './helpers/fileFilter.helper';
import { diskStorage } from 'multer';
import { VALID_IMAGE_EXTENSIONS } from './helpers/image.constants';
import { fileNamer } from './helpers';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Files')
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('product')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter,
      // limits: {fileSize: 1000},
      storage: diskStorage({
        // destination: './static/uploads',
        filename: fileNamer,
      }),
    }),
  )
  async uploadProductImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException(
        `Make sure the file is an image or has the ${VALID_IMAGE_EXTENSIONS.join(', ')} formats`,
      );
    }

    // const res = await this.filesService.uploadFileAWS(file);
    // return res;
    return file;
  }

  @Post('product/:folder')
  createFolder(@Param('folder') folder: string) {
    return this.filesService.createFolder(folder);
  }

  @Delete('product/:file')
  deleteFile(@Param('file') file: string) {
    return this.filesService.deleteObject(file);
  }

  @Get('product')
  getAllImages() {
    return this.filesService.getAllFileAWS();
  }

  @Get('product/:imageName')
  findProductImage(@Param('imageName') imageName: string) {
    return this.filesService.getSingleFile(imageName);
  }

  // @Get('product/:imageName')
  // findProductImage(
  //   @Res() res: Response,
  //   @Param('imageName') imageName: string,
  // ) {
  //   const path = this.filesService.getStaticProductImage(imageName);

  //   res.sendFile(path);
  //   return imageName;
  // }
}
