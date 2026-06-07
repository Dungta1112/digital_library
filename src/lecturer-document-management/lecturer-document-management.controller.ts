import { Body, Controller, Delete, Get, Param, Patch, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUser, RequestUser } from '../common/decorators/current-user.decorator';
import { ApiProtected } from '../common/decorators/api-docs.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RbacGuard } from '../common/guards/rbac.guard';
import { created, ok } from '../common/response/api-response';
import { CreateLecturerDocumentDto, UpdateLecturerDocumentDto } from './dto/lecturer-document.dto';
import { LecturerDocumentManagementService } from './lecturer-document-management.service';

@ApiTags('LecturerDocuments')
@ApiProtected()
@UseGuards(JwtAuthGuard, RbacGuard)
@Controller('lecturer/documents')
export class LecturerDocumentManagementController {
  constructor(private readonly service: LecturerDocumentManagementService) {}

  @Get()
  @Roles('LECTURER', 'ADMIN')
  async list(@CurrentUser() user: RequestUser) {
    return ok(await this.service.list(user.id));
  }

  @Post()
  @Roles('LECTURER', 'ADMIN')
  @UseInterceptors(FileInterceptor('file'))
  async upload(@CurrentUser() user: RequestUser, @Body() dto: CreateLecturerDocumentDto, @UploadedFile() file?: Express.Multer.File) {
    return created(await this.service.upload(user.id, dto, file ? { buffer: file.buffer, originalName: file.originalname, mimeType: file.mimetype, sizeBytes: file.size } : undefined));
  }

  @Patch(':documentId')
  @Roles('LECTURER', 'ADMIN')
  async update(@CurrentUser() user: RequestUser, @Param('documentId') documentId: string, @Body() dto: UpdateLecturerDocumentDto) {
    return ok(await this.service.update(user.id, documentId, dto));
  }

  @Post(':documentId/hide')
  @Roles('LECTURER', 'ADMIN')
  async hide(@CurrentUser() user: RequestUser, @Param('documentId') documentId: string) {
    return ok(await this.service.hide(user.id, documentId));
  }

  @Delete(':documentId')
  @Roles('LECTURER', 'ADMIN')
  async delete(@CurrentUser() user: RequestUser, @Param('documentId') documentId: string) {
    return ok(await this.service.delete(user.id, documentId));
  }
}
