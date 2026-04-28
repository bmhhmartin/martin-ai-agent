import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { ChatHistoryRow } from '../memory/memory.service';
import { ToolService } from '../tools/tool.service';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private readonly openai: OpenAI;
  private readonly model: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly toolService: ToolService,
  ) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    const baseURL = this.configService.get<string>('OPENAI_BASE_URL');
    this.model = this.configService.get<string>('OPENAI_MODEL') ?? 'gpt-4o-mini';

    if (!apiKey) {
      throw new InternalServerErrorException('OPENAI_API_KEY is required');
    }

    this.openai = new OpenAI({
      apiKey,
      baseURL: baseURL || undefined,
    });
  }

  async generateReply(currentMessage: string, history: ChatHistoryRow[]): Promise<string> {
    const toolsContext = this.toolService.getToolInstructions();
    const historyContext = this.formatHistory(history);

    try {
      const completion = await this.openai.responses.create({
        model: this.model,
        input: [
          {
            role: 'system',
            content: [
              {
                type: 'input_text',
                text:
                  'You are a helpful AI assistant with memory of past conversations. ' +
                  'Use context when relevant, stay accurate, and be concise unless asked for detail.',
              },
            ],
          },
          {
            role: 'system',
            content: [{ type: 'input_text', text: toolsContext }],
          },
          {
            role: 'system',
            content: [{ type: 'input_text', text: historyContext }],
          },
          {
            role: 'user',
            content: [{ type: 'input_text', text: currentMessage }],
          },
        ],
      });

      const outputText = completion.output_text?.trim();
      if (!outputText) {
        this.logger.warn('Model returned empty output_text');
        throw new InternalServerErrorException('AI returned an empty response');
      }

      return outputText;
    } catch (error) {
      this.logger.error('Failed to generate AI response', error);
      throw new InternalServerErrorException('Failed to generate AI response');
    }
  }

  private formatHistory(history: ChatHistoryRow[]): string {
    if (history.length === 0) {
      return 'No previous conversation history is available.';
    }

    const lines = history.map(
      (item) =>
        `[${item.created_at}] User: ${item.user_message}\n[${item.created_at}] Assistant: ${item.ai_response}`,
    );
    return `Recent conversation history:\n${lines.join('\n')}`;
  }
}
