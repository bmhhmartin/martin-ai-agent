import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AiService } from './ai/ai.service';
import { ChatController } from './chat/chat.controller';
import { ChatService } from './chat/chat.service';
import { MemoryService } from './memory/memory.service';
import { SupabaseClientService } from './supabase/supabase.client';
import { ToolService } from './tools/tool.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
  controllers: [ChatController],
  providers: [ChatService, AiService, MemoryService, SupabaseClientService, ToolService],
})
export class AppModule {}
