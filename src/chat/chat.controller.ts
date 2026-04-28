import { Body, Controller, Logger, Post } from '@nestjs/common';
import { ChatRequestDto } from './dto/chat-request.dto';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  private readonly logger = new Logger(ChatController.name);

  constructor(private readonly chatService: ChatService) {}

  @Post()
  async chat(@Body() body: ChatRequestDto): Promise<{ reply: string }> {
    this.logger.log('Incoming chat request');
    const reply = await this.chatService.handleChat(body.message);
    return { reply };
  }
}
