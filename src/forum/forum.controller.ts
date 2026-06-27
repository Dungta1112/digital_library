import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUser, RequestUser } from '../common/decorators/current-user.decorator';
import { ApiProtected } from '../common/decorators/api-docs.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { created, ok } from '../common/response/api-response';
import { CreateCommentDto, CreateForumPostDto, CreateForumReportDto, UpdateForumPostDto } from './dto/forum.dto';
import { ForumService } from './forum.service';

@ApiTags('Forum')
@Controller('forum')
export class ForumController {
  constructor(private readonly service: ForumService) {}

  @Get('posts')
  async list() {
    return ok(await this.service.list());
  }

  @ApiProtected()
  @UseGuards(JwtAuthGuard)
  @Post('posts')
  async create(@CurrentUser() user: RequestUser, @Body() dto: CreateForumPostDto) {
    return created(await this.service.createPost(user.id, dto));
  }

  @Get('posts/:postId')
  async detail(@Param('postId') postId: string) {
    return ok(await this.service.detail(postId));
  }

  @ApiProtected()
  @UseGuards(JwtAuthGuard)
  @Patch('posts/:postId')
  async update(@CurrentUser() user: RequestUser, @Param('postId') postId: string, @Body() dto: UpdateForumPostDto) {
    return ok(await this.service.updatePost(user.id, postId, dto));
  }

  @ApiProtected()
  @UseGuards(JwtAuthGuard)
  @Delete('posts/:postId')
  async delete(@CurrentUser() user: RequestUser, @Param('postId') postId: string) {
    return ok(await this.service.deletePost(user.id, postId));
  }

  @ApiProtected()
  @UseGuards(JwtAuthGuard)
  @Post('posts/:postId/comments')
  async comment(@CurrentUser() user: RequestUser, @Param('postId') postId: string, @Body() dto: CreateCommentDto) {
    return created(await this.service.comment(user.id, postId, dto));
  }

  @ApiProtected()
  @UseGuards(JwtAuthGuard)
  @Post('reports')
  async report(@CurrentUser() user: RequestUser, @Body() dto: CreateForumReportDto) {
    return created(await this.service.report(user.id, dto));
  }
    @ApiProtected()
    @UseGuards(JwtAuthGuard)
    @Patch('posts/:postId/comments/:commentId')
    async updateComment(@CurrentUser() user: RequestUser, @Param('commentId') commentId: string, @Body() dto: { content: string }) {
        return ok(await this.service.updateComment(user.id, commentId, dto.content));
    }

    @ApiProtected()
    @UseGuards(JwtAuthGuard)
    @Delete('posts/:postId/comments/:commentId')
    async deleteComment(@CurrentUser() user: RequestUser, @Param('commentId') commentId: string) {
        return ok(await this.service.deleteComment(user.id, commentId));
    }

    @ApiProtected()
    @UseGuards(JwtAuthGuard)
    @Patch('posts/:postId/comments/:commentId/accept')
    async acceptAnswer(@CurrentUser() user: RequestUser, @Param('postId') postId: string, @Param('commentId') commentId: string) {
        return ok(await this.service.acceptAnswer(user.id, postId, commentId));
    }
}
