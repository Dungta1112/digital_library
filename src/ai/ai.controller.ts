import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AiService } from './ai.service';

@ApiTags('AI')
@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('sync')
  @UseGuards(JwtAuthGuard)
  async syncDocuments(@Body() documents: { id: string; title: string; description: string }[]) {
    return this.aiService.syncDocuments(documents);
  }

  @Post('search')
  async searchDocuments(@Body() body: { query: string; top_k?: number }) {
    return this.aiService.searchDocuments(body.query, body.top_k);
  }
}