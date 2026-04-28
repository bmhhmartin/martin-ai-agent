import { Injectable } from '@nestjs/common';

@Injectable()
export class ToolService {
  getToolInstructions(): string {
    return [
      'Available tools (placeholder for future agentic expansion):',
      '- weather(city): not implemented yet.',
      '- search(query): not implemented yet.',
      'If a request needs these tools, clearly explain the tool is unavailable and provide best-effort reasoning.',
    ].join('\n');
  }
}
