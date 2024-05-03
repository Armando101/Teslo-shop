import {
  GetObjectCommand,
  ListObjectsCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createReadStream, existsSync } from 'fs';
import { join } from 'path';

@Injectable()
export class FilesService {
  clientS3: S3Client;
  constructor(private readonly configService: ConfigService) {
    this.s3Connection();
  }

  getStaticProductImage(imageName: string) {
    const path = join(__dirname, '../../static/uploads', imageName);
    if (!existsSync(path)) {
      throw new BadRequestException(`No product found with image ${imageName}`);
    }

    return path;
  }

  private s3Connection() {
    this.clientS3 = new S3Client({
      region: this.configService.get('AWS_BUCKET_REGION'),
      credentials: {
        accessKeyId: this.configService.get('AWS_PUBLIC_KEY'),
        secretAccessKey: this.configService.get('AWS_SECRET_KEY'),
      },
    });
  }

  async uploadFileAWS(file: Express.Multer.File) {
    const stream = createReadStream(file.path);
    const uploadParams = {
      Bucket: this.configService.get('AWS_BUCKET_NAME'),
      Key: file.filename,
      Body: stream,
    };
    const command = new PutObjectCommand(uploadParams);
    const result = await this.clientS3.send(command);
    return result;
  }

  async getAllFileAWS() {
    const command = new ListObjectsCommand({
      Bucket: this.configService.get('AWS_BUCKET_NAME'),
    });

    const result = (await this.clientS3.send(command)).Contents;
    console.log(result);
    return result;
  }

  async getSingleFile(fileName: string) {
    const command = new GetObjectCommand({
      Bucket: this.configService.get('AWS_BUCKET_NAME'),
      Key: fileName,
    });

    const result = await getSignedUrl(this.clientS3, command, {
      expiresIn: 3600,
    });
    return result;
  }
}
