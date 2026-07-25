import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PrismaModule } from '../prisma/prisma.module';
import { StorageModule } from '../storage/storage.module';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';

@Module({
	imports: [HttpModule, PrismaModule, StorageModule],
	controllers: [AiController],
	providers: [AiService],
	exports: [AiService],
})
export class AiModule { }