import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUser, RequestUser } from '../common/decorators/current-user.decorator';
import { ApiProtected } from '../common/decorators/api-docs.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { created, ok } from '../common/response/api-response';
import { CreateDocumentReportDto, RateDocumentDto } from './dto/document-action.dto';
import { DocumentQueryDto } from './dto/document-query.dto';
import { LibraryDocumentService } from './library-document.service';

@ApiTags('LibraryDocuments')
@Controller('documents')
export class LibraryDocumentController {
  constructor(private readonly service: LibraryDocumentService) {}

  @Get()
  async search(@Query() query: DocumentQueryDto) {
    return ok(await this.service.search(query));
  }

  @Get(':documentId')
  async detail(@Param('documentId') documentId: string) {
    return ok(await this.service.detail(documentId));
  }

  @ApiProtected()
  @UseGuards(JwtAuthGuard)
  @Get(':documentId/read')
  async read(@Param('documentId') documentId: string) {
    return ok(await this.service.read(documentId));
  }

  @ApiProtected()
  @UseGuards(JwtAuthGuard)
  @Get(':documentId/download')
  async download(@CurrentUser() user: RequestUser, @Param('documentId') documentId: string) {
    return ok(await this.service.download(user.id, documentId));
  }

  @ApiProtected()
  @UseGuards(JwtAuthGuard)
  @Post(':documentId/favorite')
  async favorite(@CurrentUser() user: RequestUser, @Param('documentId') documentId: string) {
    return created(await this.service.favorite(user.id, documentId));
  }

  @ApiProtected()
  @UseGuards(JwtAuthGuard)
  @Delete(':documentId/favorite')
  async unfavorite(@CurrentUser() user: RequestUser, @Param('documentId') documentId: string) {
    await this.service.unfavorite(user.id, documentId);
  }

  @ApiProtected()
  @UseGuards(JwtAuthGuard)
  @Post(':documentId/ratings')
  async rate(@CurrentUser() user: RequestUser, @Param('documentId') documentId: string, @Body() dto: RateDocumentDto) {
    return created(await this.service.rate(user.id, documentId, dto));
  }

  @ApiProtected()
  @UseGuards(JwtAuthGuard)
  @Post(':documentId/reports')
  async report(@CurrentUser() user: RequestUser, @Param('documentId') documentId: string, @Body() dto: CreateDocumentReportDto) {
    return created(await this.service.report(user.id, documentId, dto));
  }
    @ApiProtected()
    @UseGuards(JwtAuthGuard)
    @Post(':documentId/notes')
    async addNote(@CurrentUser() user: RequestUser, @Param('documentId') documentId: string, @Body() dto: { content: string }) {
        return created(await this.service.addNote(user.id, documentId, dto.content));
    }

    @ApiProtected()
    @UseGuards(JwtAuthGuard)
    @Get(':documentId/notes')
    async getNotes(@CurrentUser() user: RequestUser, @Param('documentId') documentId: string) {
        return ok(await this.service.getNotes(user.id, documentId));
    }

    @ApiProtected()
    @UseGuards(JwtAuthGuard)
    @Delete('notes/:noteId')
    async deleteNote(@CurrentUser() user: RequestUser, @Param('noteId') noteId: string) {
        return ok(await this.service.deleteNote(user.id, noteId));
    }

    @ApiProtected()
    @UseGuards(JwtAuthGuard)
    @Get('me/history')
    async getHistory(@CurrentUser() user: RequestUser) {
        return ok(await this.service.getHistory(user.id));
    }
}
