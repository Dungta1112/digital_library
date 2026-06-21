import { Module } from '@nestjs/common';
import { AppConfigModule } from './config/config.module';
import { PrismaModule } from './prisma/prisma.module';
import { StorageModule } from './storage/storage.module';
import { CacheModule } from './cache/cache.module';
import { AuditLogModule } from './common/audit/audit-log.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RolePermissionModule } from './role-permission/role-permission.module';
import { LibraryDocumentModule } from './library-document/library-document.module';
import { LecturerDocumentManagementModule } from './lecturer-document-management/lecturer-document-management.module';
import { ForumModule } from './forum/forum.module';
import { StudyGroupModule } from './study-group/study-group.module';
import { ContentManagementModule } from './content-management/content-management.module';
import { AdminManagementModule } from './admin-management/admin-management.module';
import { StatisticsModule } from './statistics/statistics.module';
import { SystemConfigModule } from './system-config/system-config.module';
import { CategoriesModule } from './categories/categories.module';
import { AiModule } from './ai/ai.module';

@Module({
  imports: [
    AppConfigModule,
    PrismaModule,
    StorageModule,
    CacheModule,
    AuditLogModule,
    AuthModule,
    UsersModule,
    RolePermissionModule,
    LibraryDocumentModule,
    LecturerDocumentManagementModule,
    ForumModule,
    StudyGroupModule,
    ContentManagementModule,
    AdminManagementModule,
    StatisticsModule,
    SystemConfigModule,
        CategoriesModule,
        AiModule
  ]
})
export class AppModule {}
