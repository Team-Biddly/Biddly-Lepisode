import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import { parseOfficeAsync } from 'officeparser';

@Injectable()
export class WordService {
  async parse(
    file: Buffer | ArrayBuffer | Express.Multer.File,
  ): Promise<string> {
    let buffer: Buffer;
    if (Buffer.isBuffer(file)) {
      buffer = file;
    } else if (file instanceof ArrayBuffer) {
      buffer = Buffer.from(file);
    } else if (file.buffer) {
      buffer = file.buffer;
    } else if (file.path) {
      buffer = readFileSync(file.path);
    } else {
      throw new Error(
        'Invalid file type. Must be Buffer or Express.Multer.File',
      );
    }

    return parseOfficeAsync(buffer);
  }
}
