import { PartialType } from '@nestjs/swagger';
import { CreateNoticeDTO } from './create-notice.dto';

export class UpdateNoticeDTO extends PartialType(CreateNoticeDTO) {}
