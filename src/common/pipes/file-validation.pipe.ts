import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

export interface UploadedFileLike {
  mimetype: string;
  size: number;
  originalname: string;
}

@Injectable()
export class FileValidationPipe implements PipeTransform {
  transform(file: UploadedFileLike) {
    if (!file) {
      throw new BadRequestException('File is required');
    }
    const allowed = (process.env.UPLOAD_ALLOWED_TYPES ?? 'application/pdf').split(',');
    const maxBytes = Number(process.env.UPLOAD_MAX_FILE_SIZE_BYTES ?? 20 * 1024 * 1024);
    if (!allowed.includes(file.mimetype)) {
      throw new BadRequestException('Unsupported file type');
    }
    if (file.size > maxBytes) {
      throw new BadRequestException('File exceeds maximum size');
    }
    return file;
  }
}
