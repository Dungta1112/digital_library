import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FollowService {
    constructor(private readonly prisma: PrismaService) { }

    async follow(followerId: string, followingId: string) {
        return this.prisma.userFollow.upsert({
            where: { followerId_followingId: { followerId, followingId } },
            update: {},
            create: { followerId, followingId }
        });
    }

    async unfollow(followerId: string, followingId: string) {
        return this.prisma.userFollow.deleteMany({ where: { followerId, followingId } });
    }

    async getFollowing(userId: string) {
        return this.prisma.userFollow.findMany({
            where: { followerId: userId },
            include: { following: true }
        });
    }

    async getFollowers(userId: string) {
        return this.prisma.userFollow.findMany({
            where: { followingId: userId },
            include: { follower: true }
        });
    }
}