import { Controller, Delete, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUser, RequestUser } from '../common/decorators/current-user.decorator';
import { ApiProtected } from '../common/decorators/api-docs.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { ok } from '../common/response/api-response';
import { NotificationService } from './notification.service';

@ApiTags('Notifications')
@Controller('notifications')
export class NotificationController {
    constructor(private readonly service: NotificationService) { }

    @ApiProtected()
    @UseGuards(JwtAuthGuard)
    @Get()
    async getMyNotifications(@CurrentUser() user: RequestUser) {
        return ok(await this.service.getMyNotifications(user.id));
    }

    @ApiProtected()
    @UseGuards(JwtAuthGuard)
    @Patch(':id/read')
    async markAsRead(@CurrentUser() user: RequestUser, @Param('id') id: string) {
        return ok(await this.service.markAsRead(user.id, id));
    }

    @ApiProtected()
    @UseGuards(JwtAuthGuard)
    @Patch('read-all')
    async markAllAsRead(@CurrentUser() user: RequestUser) {
        return ok(await this.service.markAllAsRead(user.id));
    }

    @ApiProtected()
    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async deleteNotification(@CurrentUser() user: RequestUser, @Param('id') id: string) {
        return ok(await this.service.deleteNotification(user.id, id));
    }
}