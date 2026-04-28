import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { SupabaseClientService } from '../supabase/supabase.client';

export type ChatHistoryRow = {
  id: number;
  user_message: string;
  ai_response: string;
  created_at: string;
};

@Injectable()
export class MemoryService {
  private readonly logger = new Logger(MemoryService.name);
  private readonly tableName = 'chat_history';

  constructor(private readonly supabaseClientService: SupabaseClientService) {}

  async saveMessage(userMessage: string, aiResponse: string): Promise<void> {
    const client = this.supabaseClientService.getClient();
    const { error } = await client.from(this.tableName).insert({
      user_message: userMessage,
      ai_response: aiResponse,
    });

    if (error) {
      this.logger.error('Failed to insert chat history', error.message);
      throw new InternalServerErrorException('Failed to store conversation history');
    }
  }

  async getRecentMessages(limit = 10): Promise<ChatHistoryRow[]> {
    const client = this.supabaseClientService.getClient();
    const { data, error } = await client
      .from(this.tableName)
      .select('id,user_message,ai_response,created_at')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      this.logger.error('Failed to fetch chat history', error.message);
      throw new InternalServerErrorException('Failed to load conversation history');
    }

    const rows = (data ?? []) as ChatHistoryRow[];
    return [...rows].reverse();
  }
}
