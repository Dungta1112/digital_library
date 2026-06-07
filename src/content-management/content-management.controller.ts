import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUser, RequestUser } from '../common/decorators/current-user.decorator';
import { ApiProtected } from '../common/decorators/api-docs.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RbacGuard } from '../common/guards/rbac.guard';
import { ok } from '../common/response/api-response';
import { ContentManagementService } from './content-management.service';
import { HandleReportDto, RejectDocumentDto } from './dto/content-management.dto';

@ApiTags('ContentManagement')
@ApiProtected()
@Roles('CONTENT_MANAGER', 'ADMIN')
@UseGuards(JwtAuthGuard, RbacGuard)
@Controller('content')
export class ContentManagementController {
  constructor(private readonly service: ContentManagementService) {}

  @Get('documents/pending')
  async pendingDocuments() {
    return ok(await this.service.pendingDocuments());
  }

  @Post('documents/:documentId/approve')
  async approve(@CurrentUser() user: RequestUser, @Param('documentId') documentId: string) {
    return ok(await this.service.approveDocument(user.id, documentId));
  }

  @Post('documents/:documentId/reject')
  async reject(@CurrentUser() user: RequestUser, @Param('documentId') documentId: string, @Body() dto: RejectDocumentDto) {
    return ok(await this.service.rejectDocument(user.id, documentId, dto));
  }

  @Delete('forum/posts/:postId')
  async deletePost(@CurrentUser() user: RequestUser, @Param('postId') postId: string) {
    await this.service.deleteForumPost(user.id, postId);
  }

  @Delete('forum/comments/:commentId')
  async deleteComment(@CurrentUser() user: RequestUser, @Param('commentId') commentId: string) {
    await this.service.deleteForumComment(user.id, commentId);
  }

  @Post('forum/posts/:postId/lock')
  async lock(@CurrentUser() user: RequestUser, @Param('postId') postId: string) {
    return ok(await this.service.lockTopic(user.id, postId));
  }

  @Get('reports')
  async reports() {
    return ok(await this.service.reports());
  }

  @Post('reports/:reportId/handle')
  async handle(@CurrentUser() user: RequestUser, @Param('reportId') reportId: string, @Body() dto: HandleReportDto) {
    return ok(await this.service.handleReport(user.id, reportId, dto));
  }
}
