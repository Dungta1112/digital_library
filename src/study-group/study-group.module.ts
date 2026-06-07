import { Module } from '@nestjs/common';
import { StudyGroupController } from './study-group.controller';
import { StudyGroupService } from './study-group.service';

@Module({
  controllers: [StudyGroupController],
  providers: [StudyGroupService],
  exports: [StudyGroupService]
})
export class StudyGroupModule {}
