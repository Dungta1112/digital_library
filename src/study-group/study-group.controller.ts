import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUser, RequestUser } from '../common/decorators/current-user.decorator';
import { ApiProtected } from '../common/decorators/api-docs.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { created, ok } from '../common/response/api-response';
import { CreateGroupCommentDto, CreateGroupPostDto, CreateStudyGroupDto, ShareGroupDocumentDto } from './dto/study-group.dto';
import { StudyGroupService } from './study-group.service';

@ApiTags('StudyGroups')
@Controller('study-groups')
export class StudyGroupController {
  constructor(private readonly service: StudyGroupService) {}

  @Get()
  async list(@CurrentUser() user: RequestUser) {
    return ok(await this.service.list(user?.id));
  }

  @ApiProtected()
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@CurrentUser() user: RequestUser, @Body() dto: CreateStudyGroupDto) {
    return created(await this.service.create(user.id, dto));
  }

  @ApiProtected()
  @UseGuards(JwtAuthGuard)
  @Post(':groupId/join')
  async join(@CurrentUser() user: RequestUser, @Param('groupId') groupId: string) {
    return created(await this.service.join(user.id, groupId));
  }

  @ApiProtected()
  @UseGuards(JwtAuthGuard)
  @Post(':groupId/members/:userId/approve')
  async approve(@CurrentUser() user: RequestUser, @Param('groupId') groupId: string, @Param('userId') userId: string) {
    return ok(await this.service.approveMember(user.id, groupId, userId));
  }

  @ApiProtected()
  @UseGuards(JwtAuthGuard)
  @Get(':groupId/documents')
  async documents(@CurrentUser() user: RequestUser, @Param('groupId') groupId: string) {
    return ok(await this.service.documents(user.id, groupId));
  }

  @ApiProtected()
  @UseGuards(JwtAuthGuard)
  @Post(':groupId/documents')
  async shareDocument(@CurrentUser() user: RequestUser, @Param('groupId') groupId: string, @Body() dto: ShareGroupDocumentDto) {
    return created(await this.service.shareDocument(user.id, groupId, dto));
  }

  @ApiProtected()
  @UseGuards(JwtAuthGuard)
  @Post(':groupId/posts')
  async createPost(@CurrentUser() user: RequestUser, @Param('groupId') groupId: string, @Body() dto: CreateGroupPostDto) {
    return created(await this.service.createPost(user.id, groupId, dto));
  }

  @ApiProtected()
  @UseGuards(JwtAuthGuard)
  @Post('posts/:groupPostId/comments')
  async comment(@CurrentUser() user: RequestUser, @Param('groupPostId') groupPostId: string, @Body() dto: CreateGroupCommentDto) {
    return created(await this.service.comment(user.id, groupPostId, dto));
  }
}
