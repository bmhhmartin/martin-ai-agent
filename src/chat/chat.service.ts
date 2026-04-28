import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { AiService } from '../ai/ai.service';
import { MemoryService } from '../memory/memory.service';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  constructor(
    private readonly aiService: AiService,
    private readonly memoryService: MemoryService,
  ) {}

  async handleChat(message: string): Promise<string> {
    try {
      const recentMessages = await this.memoryService.getRecentMessages(10);
      const reply = await this.aiService.generateReply(message, recentMessages);

      await this.memoryService.saveMessage(message, reply);
      return reply;
    } catch (error) {
      this.logger.error('Failed to handle chat request', error);
      throw new InternalServerErrorException('Unable to process chat request');
    }
  }
}
