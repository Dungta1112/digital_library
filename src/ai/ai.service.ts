import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AiService {
  private readonly aiServiceUrl = process.env.AI_SERVICE_URL ?? 'http://localhost:8000';

  constructor(private readonly httpService: HttpService) {}

  async syncDocuments(documents: { id: string; title: string; description: string }[]) {
    const { data } = await firstValueFrom(
      this.httpService.post(`${this.aiServiceUrl}/api/ai/sync-books`, documents)
    );
    return data;
  }

  async searchDocuments(query: string, topK = 3) {
    const { data } = await firstValueFrom(
      this.httpService.post(`${this.aiServiceUrl}/api/ai/search-books`, { query, top_k: topK })
    );
    return data;
  }
}