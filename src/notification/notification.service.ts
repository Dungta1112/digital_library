import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationService {
    constructor(private readonly prisma: PrismaService) { }

    async getMyNotifications(userId: string) {
        return this.prisma.notification.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });
    }

    async markAsRead(userId: string, id: string) {
        return this.prisma.notification.update({
            where: { id, userId },
            data: { isRead: true }
        });
    }

    async markAllAsRead(userId: string) {
        return this.prisma.notification.updateMany({
            where: { userId, isRead: false },
            data: { isRead: true }
        });
    }

    async deleteNotification(userId: string, id: string) {
        return this.prisma.notification.delete({ where: { id, userId } });
    }
}