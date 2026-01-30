import { PartialType } from '@nestjs/swagger';
import { FileCreateDTO } from './file.create.dto ';

export class FileUpdateDTO extends PartialType(FileCreateDTO) {}
