import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import { parse } from 'hwp.js';

const LINE_BREAK_CHAR = '13';

@Injectable()
export class HwpService {
  parse(data: Buffer | ArrayBuffer | Express.Multer.File): string {
    try {
      let buffer: Buffer;
      if (Buffer.isBuffer(data)) {
        buffer = data;
      } else if (data instanceof ArrayBuffer) {
        buffer = Buffer.from(data);
      } else if (data.buffer) {
        buffer = data.buffer;
      } else if (data.path) {
        buffer = readFileSync(data.path);
      }

      const uint8Array = new Uint8Array(buffer);
      const hwpDocument = parse(uint8Array, { type: 'buffer' });
      const sections = hwpDocument.sections;
      const paragraphs = sections.flatMap((section) => section.content);
      const contents = paragraphs.map((p) => p.content);
      const content = contents
        .map((c) => c.map((char) => char.value).join(''))
        .join('\n');

      return content.replace(new RegExp(LINE_BREAK_CHAR, 'g'), '\n');
    } catch (error) {
      console.error(error);
      throw new Error(`Failed to parse HWP file: ${error}`);
    }
  }
}
