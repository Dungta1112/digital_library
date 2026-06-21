import { Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUser, RequestUser } from '../common/decorators/current-user.decorator';
import { ApiProtected } from '../common/decorators/api-docs.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { created, ok } from '../common/response/api-response';
import { FollowService } from './follow.service';

@ApiTags('Follow')
@Controller('users')
export class FollowController {
    constructor(private readonly service: FollowService) { }

    @ApiProtected()
    @UseGuards(JwtAuthGuard)
    @Post(':userId/follow')
    async follow(@CurrentUser() user: RequestUser, @Param('userId') userId: string) {
        return created(await this.service.follow(user.id, userId));
    }

    @ApiProtected()
    @UseGuards(JwtAuthGuard)
    @Delete(':userId/follow')
    async unfollow(@CurrentUser() user: RequestUser, @Param('userId') userId: string) {
        return ok(await this.service.unfollow(user.id, userId));
    }

    @ApiProtected()
    @UseGuards(JwtAuthGuard)
    @Get('me/following')
    async getFollowing(@CurrentUser() user: RequestUser) {
        return ok(await this.service.getFollowing(user.id));
    }

    @ApiProtected()
    @UseGuards(JwtAuthGuard)