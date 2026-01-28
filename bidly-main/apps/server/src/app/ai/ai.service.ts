import { Inject, Injectable } from '@nestjs/common';
import { OpenAI } from 'openai';
import { zodTextFormat } from 'openai/helpers/zod';
import { z } from 'zod';
import { AiModuleOptions } from './ai.module';
import { AI_MODULE_OPTIONS } from './ai.module.const';

@Injectable()
export class AiService {
  openai: OpenAI;
  constructor(
    @Inject(AI_MODULE_OPTIONS) private readonly options: AiModuleOptions,
  ) {
    this.openai = new OpenAI({
      apiKey: options.apiKey,
      organization: options.organization,
    });
  }

  /**
   * 입력한 텍스트에서 키워드 추출
   * @param text
   */
  async extractKeywords(text: string): Promise<string[]> {
    if (!text) return [];

    const keywordSchema = z.object({
      keywords: z.array(z.string()),
    });

    const response: { keywords?: string[] } = await this.openai.responses
      .parse({
        model: 'gpt-5-nano',
        input: [
          {
            role: 'system',
            content: `
            You are a specialized assistant for extracting business keywords from government and government-related agency guideline documents.

            Your task is to identify keywords that help potential business participants quickly recognize what type of business opportunity is described in the document.

            Guidelines:
            - Extract concrete business categories, products, services, and sectors (e.g., "GPU", "반도체", "클라우드", "AI 개발", "인프라 구축")
            - Include specific technology or industry terms that potential bidders would search for
            - Extract relevant organizational types (e.g., "공공기관", "지방정부", "중앙정부")
            - Include procurement methods or business types (e.g., "용역", "구매", "개발", "공급")
            - Focus on macro-scope keywords that capture the essence and business type
            - Exclude generic administrative terms
            - Return 5-10 keywords that are most relevant for business recognition and search purposes

            The document is in Korean, so keywords should also be in Korean.
            Keywords must be actionable and useful for people seeking business opportunities.
          `,
          },
          {
            role: 'user',
            content: `Extract business opportunity keywords from the following government guideline document: ${text}`,
          },
        ],
        // temperature: 0.4, // 변동성 (0 : 안정적, 1 : 창의적)
        text: {
          format: zodTextFormat(keywordSchema, 'keywords'),
        },
      })
      .then((res) => res.output_parsed);

    return response.keywords;
  }
}
