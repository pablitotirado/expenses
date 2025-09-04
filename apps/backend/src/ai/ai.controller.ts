import { Controller, Post, Body } from '@nestjs/common';
import { AIService } from './ai.service';
import { AIRequestDto, AIResponseDto } from './dto';

@Controller('ia')
export class AIController {
  constructor(private readonly aiService: AIService) {}

  @Post()
  async getFinancialAnalysis(
    @Body() request: AIRequestDto,
  ): Promise<AIResponseDto> {
    const result = await this.aiService.getFinancialAnalysis(request);

    const response = {
      analysis: result.analysis,
      data: result.data,
    };

    return response;
  }
}
