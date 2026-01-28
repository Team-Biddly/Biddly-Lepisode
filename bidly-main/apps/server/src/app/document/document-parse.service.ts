import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { WordService } from './word/word.service';
import { HwpService } from './hwp/hwp.service';

@Injectable()
export class DocumentParseService {
  private readonly logger = new Logger(DocumentParseService.name);
  constructor(
    private readonly wordService: WordService,
    private readonly hwpService: HwpService,
  ) {}

  async parse(file: Buffer | ArrayBuffer): Promise<string | null> {
    const parsers = [
      { name: 'HWP', parse: () => this.hwpService.parse(file) },
      { name: 'Word', parse: () => this.wordService.parse(file) },
    ];

    for (const parser of parsers) {
      try {
        const content = await Promise.resolve(parser.parse());
        if (content) {
          return content;
        }
      } catch (error) {
        this.logger.debug(`Failed to parse as ${parser.name} format: ${error}`);
      }
    }

    return null;
  }

  private isWordFile(file: Express.Multer.File): boolean {
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'application/vnd.ms-word',
      'application/x-msword',
    ];
    return allowedTypes.includes(file.mimetype);
  }

  private isHwpFile(file: Express.Multer.File): boolean {
    const allowedTypes = [
      'application/vnd.hancom.hwp',
      'application/haansofthwp',
      'application/x-hwp',
      'application/vnd.hancom.hwpx',
      'application/haansofthwpx',
    ];
    return allowedTypes.includes(file.mimetype);
  }
}
