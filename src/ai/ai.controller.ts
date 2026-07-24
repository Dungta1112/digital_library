import { Body, Controller, Get, HttpCode, Param, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUser, RequestUser } from '../common/decorators/current-user.decorator';
import { ApiProtected } from '../common/decorators/api-docs.decorator';
import { Permissions } from '../common/decorators/permissions.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RbacGuard } from '../common/guards/rbac.guard';
import { AiService } from './ai.service';

@ApiTags('AI')
@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('sync')
  @UseGuards(JwtAuthGuard)
  async syncDocuments(@Body() documents: { id: string; title: string; description: string }[]) {
    return this.aiService.syncDocuments(documents);
  }

  @Post('search')
  async searchDocuments(@Body() body: { query: string; top_k?: number }) {
    return this.aiService.searchDocuments(body.query, body.top_k);
  }

  @Post('ingest/:documentId')
  @ApiProtected()
  @UseGuards(JwtAuthGuard, RbacGuard)
  @Permissions('documents.manage_own', 'documents.approve')
  @HttpCode(202)
  async ingestDocument(@CurrentUser() user: RequestUser, @Param('documentId') documentId: string) {
    return this.aiService.ingestDocument(user, documentId);
  }

  @Get('ingest/:documentId/status')
  @ApiProtected()
  @UseGuards(JwtAuthGuard)
  async ingestStatus(@Param('documentId') documentId: string) {
    return this.aiService.getIngestStatus(documentId);
  }

  @Post('ask')
  @ApiProtected()
  @UseGuards(JwtAuthGuard, RbacGuard)
  @Permissions('documents.read')
  async askDocument(
    @CurrentUser() user: RequestUser,
    @Body() body: { query: string; documentId?: string; topK?: number }
  ) {
    return this.aiService.askDocument(user, body.query, body.documentId, body.topK);
  }
}
