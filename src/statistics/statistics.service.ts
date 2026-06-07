import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StatisticsService {
  constructor(private readonly prisma: PrismaService) {}

  async overview() {
    const [users, documents, forumPosts, studyGroups, reports, moderationLogs] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.document.count(),
      this.prisma.forumPost.count(),
      this.prisma.studyGroup.count(),
      this.prisma.documentReport.count().then(async (documentReports) => documentReports + (await this.prisma.forumReport.count())),
      this.prisma.contentModerationLog.count()
    ]);
    const documentCounters = await this.prisma.document.aggregate({ _sum: { viewCount: true, downloadCount: true } });
    return {
      users,
      documents,
      forumPosts,
      studyGroups,
      reports,
      moderationLogs,
      views: documentCounters._sum.viewCount ?? 0,
      downloads: documentCounters._sum.downloadCount ?? 0
    };
  }
}
